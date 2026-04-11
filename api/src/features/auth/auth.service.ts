import prisma from '@/lib/prisma/prisma.ts';
import { signAccessToken } from '@/lib/auth/access-jwt.ts';
import {
  getRefreshSession,
  issueRefreshToken,
  revokeRefreshSession,
  rotateRefreshSession,
  saveRefreshSession,
} from '@/lib/auth/refresh-store.ts';
import { sha256Hex, randomToken } from '@/lib/auth/token-utils.ts';
import { redisClient } from '@/lib/redis/redis-client.ts';

import { randomPKCECodeVerifier, calculatePKCECodeChallenge, buildAuthorizationUrl, authorizationCodeGrant } from 'openid-client';

import { User } from './auth.schema.ts';

import { getGoogleOAuthConfig, getGoogleOIDCConfig } from './utils/google-oauth.config.ts';
import { saveGoogleOAuthState, consumeGoogleOAuthState } from './utils/google-oauth.store.ts';

export async function upsertGoogleUser(profile: {
  email: string;
  sub: string;
  name?: string | null;
  pictureUrl?: string | null;
}) {
  const userModel = (prisma as any).user;
  const existingBySub = await userModel.findUnique({ where: { googleSub: profile.sub } });
  if (existingBySub) {
    return await userModel.update({
      where: { id: existingBySub.id },
      data: {
        email: profile.email,
        name: profile.name ?? existingBySub.name,
        pictureUrl: profile.pictureUrl ?? existingBySub.pictureUrl,
        lastLoginAt: new Date(),
      },
    });
  }

  const existingByEmail = await userModel.findUnique({ where: { email: profile.email } });
  if (existingByEmail) {
    return await userModel.update({
      where: { id: existingByEmail.id },
      data: {
        googleSub: profile.sub,
        name: profile.name ?? existingByEmail.name,
        pictureUrl: profile.pictureUrl ?? existingByEmail.pictureUrl,
        lastLoginAt: new Date(),
      },
    });
  }

  return await userModel.create({
    data: {
      email: profile.email,
      googleSub: profile.sub,
      name: profile.name ?? null,
      pictureUrl: profile.pictureUrl ?? null,
      lastLoginAt: new Date(),
    },
  });
}

export async function issueAppTokensForUser(user: User) {
  const accessToken = signAccessToken({ sub: user.id, email: user.email, role: user.role });

  const { token: refreshToken, tokenHash, sessionId } = issueRefreshToken();
  await saveRefreshSession(redisClient, tokenHash, { userId: user.id, sessionId });

  return { accessToken, refreshToken };
}

export async function rotateRefreshToken(refreshToken: string) {
  const tokenHash = sha256Hex(refreshToken);
  const session = await getRefreshSession(redisClient, tokenHash);
  if (!session) return null;

  const { token: newRefreshToken, tokenHash: newTokenHash } = issueRefreshToken();
  await rotateRefreshSession(redisClient, tokenHash, newTokenHash, session);

  const userModel = (prisma as any).user;
  const user = await userModel.findUnique({ where: { id: session.userId } });
  if (!user) return null;

  await userModel.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });

  const accessToken = signAccessToken({ sub: user.id, email: user.email, role: user.role });

  return { accessToken, refreshToken: newRefreshToken };
}

export async function revokeRefreshToken(refreshToken: string): Promise<void> {
  const tokenHash = sha256Hex(refreshToken);
  await revokeRefreshSession(redisClient, tokenHash);
}

export async function handleGoogleOAuthStart(returnTo: string): Promise<string> {
  const state = randomToken(24);
  const codeVerifier = randomPKCECodeVerifier();
  const codeChallenge = await calculatePKCECodeChallenge(codeVerifier);

  await saveGoogleOAuthState(redisClient, state, { codeVerifier, returnTo });

  const config = await getGoogleOIDCConfig();
  const cfg = getGoogleOAuthConfig();
  
  return buildAuthorizationUrl(config, {
    scope: 'openid email profile',
    state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
    redirect_uri: cfg.redirectUri,
    response_type: 'code',
    access_type: 'offline',
    prompt: 'consent',
  }).href;
}

export async function handleGoogleCallback(code: string, state: string): Promise<{
  user: any;
  tokens: { accessToken: string; refreshToken: string };
  redirectTo: string;
} | null> {
  const cfg = getGoogleOAuthConfig();
  const stored = await consumeGoogleOAuthState(redisClient, state);
  if (!stored) {
    return null;
  }

  const config = await getGoogleOIDCConfig();
  
  // Exchange authorization code for tokens
  const result = await authorizationCodeGrant(config, new URL(cfg.redirectUri), {
    pkceCodeVerifier: stored.codeVerifier,
  }, {
    code,
    state,
  });

  if (!result.access_token) {
    throw new Error('Missing access_token from Google');
  }

  // Get user info from ID token claims (more secure and efficient)
  const claims = result.claims();
  
  const email = claims?.email as string;
  const sub = claims?.sub as string;
  if (!email || !sub) {
    throw new Error('Google profile missing email/sub');
  }

  const user = await upsertGoogleUser({
    email,
    sub,
    name: claims?.name as string ?? undefined,
    pictureUrl: claims?.picture as string ?? undefined,
  });

  const tokens = await issueAppTokensForUser(user);
  const redirectTo = new URL(stored.returnTo, cfg.webAppUrl).toString();

  return { user, tokens, redirectTo };
}

export async function handleTokenRefresh(refreshToken: string) {
  return await rotateRefreshToken(refreshToken);
}

export async function handleLogout(refreshToken?: string): Promise<void> {
  if (refreshToken) {
    await revokeRefreshToken(refreshToken);
  }
}
