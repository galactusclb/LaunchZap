import { verifyAccessToken } from '@/lib/auth/access-jwt.ts';

import { NextFunction, Request, Response } from 'express';

export type Permission = string;

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  console.log('cookies', req.cookies)

  const authToken = req.cookies?.access_token
  if (!authToken) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }

  try {
    const payload = verifyAccessToken(authToken);
    req.user = { id: payload.id, role: payload.role, email: payload.email };
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export const permit = (...required: Permission[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    const userPerms: string[] = (req as any).user.perms || [];
    const ok = required.every(p => userPerms.includes(p));
    if (!ok) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }
    next();
  };