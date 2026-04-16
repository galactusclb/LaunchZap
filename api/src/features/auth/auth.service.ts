
import { randomPKCECodeVerifier, calculatePKCECodeChallenge, buildAuthorizationUrl, authorizationCodeGrant } from 'openid-client';

import { createUser, findUserByEmail, findUserByGoogleSub, updateUserByEmail, updateUserById } from './auth.repository.ts';
import { User } from './auth.schema.ts';
import { getGoogleOAuthConfig, getGoogleOIDCConfig } from './utils/google-oauth.config.ts';
import { saveGoogleOAuthState, consumeGoogleOAuthState } from './utils/google-oauth.store.ts';

import { signAccessToken } from '@/lib/auth/access-jwt.ts';
import {
  getRefreshSession,
  issueRefreshToken,
  revokeRefreshSession,
  rotateRefreshSession,
  saveRefreshSession,
} from '@/lib/auth/refresh-store.ts';
import { sha256Hex, randomToken } from '@/lib/auth/token-utils.ts';
import prisma from '@/lib/prisma/prisma.ts';
import { redisClient } from '@/lib/redis/redis-client.ts';

export async function upsertGoogleUser(profile: Pick<User, "email" | "googleSub" | "name" | "pictureUrl">) {
  const existingBySub = await findUserByGoogleSub(profile.googleSub);

  if (existingBySub) {
    return updateUserById(existingBySub, profile);
  }

  const existingByEmail = await findUserByEmail(profile.email);

  if (existingByEmail) {
    return await updateUserByEmail(existingByEmail, profile)
  }

  return await createUser(profile);
}

export async function issueAppTokensForUser(user: Pick<User, "email" | "role" | "id">) {
  const accessToken = signAccessToken({ id: user.id, email: user.email, role: user.role });

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

  const userModel = prisma.user;
  const user = await userModel.findUnique({ where: { id: session.userId } });
  if (!user) return null;

  await userModel.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });

  const accessToken = signAccessToken({ id: user.id, email: user.email, role: user.role });

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

export async function handleGoogleCallback(originalUrl: string, state: string): Promise<{
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

  const callbackUrl = new URL(originalUrl, new URL(cfg.redirectUri).origin);

  const result = await authorizationCodeGrant(config, callbackUrl, {
    pkceCodeVerifier: stored.codeVerifier,
    expectedState: state,
  });
  
  if (!result.access_token) {
    throw new Error('Missing access_token from Google');
  }

  const claims = result.claims();
  
  const email = claims?.email as string;
  const sub = claims?.sub as string;
  if (!email || !sub) {
    throw new Error('Google profile missing email/sub');
  }

  const user = await upsertGoogleUser({
    email,
    googleSub: sub,
    name: claims?.name as string,
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
