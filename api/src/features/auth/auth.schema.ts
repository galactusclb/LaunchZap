import z from "zod";
import { Roles } from "@/prisma/client"

const baseUserSchema = z.object({
    username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/, {
        message: "Username can only contain letters, numbers, and underscores",
    }),
    email: z.string().email(),
    emailVerified: z.boolean().default(false),
    role: z.nativeEnum(Roles)
});

export const userSchema = baseUserSchema.extend({
  id: z.string().cuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createUserSchema = baseUserSchema;

export const updateUserSchema = baseUserSchema.partial();

export type User = z.infer<typeof userSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;