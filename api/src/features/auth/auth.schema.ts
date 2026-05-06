import z from 'zod';

import { trimmedString, normalizedEmail } from '@/lib/zod/extras';
import { Roles } from '@/prisma/client';


export const baseSchema = z.object({
    name:       trimmedString.min(3).max(30).regex(/^[a-zA-Z0-9_]+$/, {
        message: 'Name can only contain letters, numbers, and underscores',
    }),
    email:      normalizedEmail,
    pictureUrl: z.string().url().nullable(),
});

export const userSchema = baseSchema.extend({
    id:            z.string().cuid(),
    emailVerified: z.boolean(),
    googleSub:     z.string().nullable(),
    role:          z.nativeEnum(Roles),
    lastLoginAt:   z.date().nullable(),
    createdAt:     z.date(),
    updatedAt:     z.date(),
});


export const createUserSchema = {
    body: baseSchema,
};

export const updateUserSchema = {
    params: z.object({ id: z.string().cuid() }),
    body:   baseSchema.partial(),
};

export const getUserSchema = {
    params: z.object({ id: z.string().cuid() }),
};

export type User       = z.infer<typeof userSchema>;
export type CreateUser = z.infer<typeof createUserSchema.body>;
export type UpdateUser = z.infer<typeof updateUserSchema.body>;
