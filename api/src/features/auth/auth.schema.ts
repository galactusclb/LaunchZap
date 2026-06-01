import z from 'zod';

import { baseUserSchema } from '@/schemas/user.schema';

export type {User} from "@/schemas/user.schema";

export const createUserSchema = {
    body: baseUserSchema,
};

export const updateUserSchema = {
    params: z.object({ id: z.string().cuid() }),
    body:   baseUserSchema.partial(),
};

export const getUserSchema = {
    params: z.object({ id: z.string().cuid() }),
};

export type CreateUser = z.infer<typeof createUserSchema.body>;
export type UpdateUser = z.infer<typeof updateUserSchema.body>;
