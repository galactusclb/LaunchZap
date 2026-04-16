import { Request, Response } from 'express';

import { 
  handleGoogleOAuthStart, 
  handleGoogleCallback, 
  handleTokenRefresh, 
  handleLogout 
} from './auth.service.ts';
import { clearAuthCookies, setAuthCookies } from './utils/auth.cookies.ts';

function safeReturnTo(input: unknown): string {
  if (typeof input !== 'string') return '/';
  if (!input.startsWith('/')) return '/';
  if (input.startsWith('//')) return '/';
  return input;
}

const googleStart = async (req: Request, res: Response) => {
  const returnTo = safeReturnTo(req.query.returnTo);
  const authUrl = await handleGoogleOAuthStart(returnTo);
  res.redirect(authUrl);
};

const googleCallback = async (req: Request, res: Response) => {
  const state = typeof req.query.state === 'string' ? req.query.state : null;

  if (!state) {
    res.status(400).json({ error: 'Missing state' });
    return;
  }

  const result = await handleGoogleCallback(req.originalUrl, state);
  if (!result) {
    res.status(400).json({ error: 'Invalid state' });
    return;
  }

  setAuthCookies(res, result.tokens);
  res.redirect(result.redirectTo);
};

const refresh = async (req: Request, res: Response) => {
  const token = req.cookies?.refresh_token as string | undefined;
  if (!token) {
    res.status(401).json({ ok: false });
    return;
  }

  const rotated = await handleTokenRefresh(token);
  if (!rotated) {
    clearAuthCookies(res);
    res.status(401).json({ ok: false });
    return;
  }

  setAuthCookies(res, rotated);
  res.status(200).json({ ok: true });
};

const me = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }
  res.json(user);
};

const logout = async (req: Request, res: Response) => {
  const token = req.cookies?.refresh_token as string | undefined;
  await handleLogout(token);
  clearAuthCookies(res);
  res.json({ ok: true });
};

export default { googleStart, googleCallback, me, refresh, logout };