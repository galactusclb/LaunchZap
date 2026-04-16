import { NextFunction, Request, Response } from 'express';

import { verifyAccessToken } from '@/lib/auth/access-jwt.ts';
import { Role } from '@/utils/constant/role';

export type Permission = Role;

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
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const ok = required.includes(req.user.role);
    if (!ok) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }
    next();
  };