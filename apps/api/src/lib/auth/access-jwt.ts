import jwt from 'jsonwebtoken';

import { User } from '@/schemas/user.schema';
import { constants } from '@/utils/constant';

const { ACCESS_SECRET } = constants.auth;

export type AccessPayload = Pick<User, 'id' | 'email' | 'role'>;

export function signAccessToken(
    payload: AccessPayload,
    expiresIn: jwt.SignOptions['expiresIn'] = '15m'
): string {
    const secret = ACCESS_SECRET;
    if (!secret) throw new Error('ACCESS_SECRET is not set');
    return jwt.sign(payload, secret, { expiresIn });
}

export function verifyAccessToken(token: string): AccessPayload {
    const secret = ACCESS_SECRET;
    if (!secret) throw new Error('ACCESS_SECRET is not set');
    return jwt.verify(token, secret) as AccessPayload;
}
