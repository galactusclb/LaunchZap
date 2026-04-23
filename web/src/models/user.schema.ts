import z from "zod";

import { apiResponseSchema } from "@/models/api-response.schema";

export enum UserRole {
    USER  = 'USER',
    ADMIN = 'ADMIN',
}

export const baseUserSchema = z.object({
    email:      z.email(),
    name:       z.string(),
    pictureUrl: z.url().optional(),
});

export const userResponseSchema = baseUserSchema.extend({
    id:   z.string(),
    role: z.enum(UserRole),
});

export const meFullResponseSchema = apiResponseSchema.single(userResponseSchema);

export const logoutResponseSchema = apiResponseSchema.single(z.void())

export type User           = z.infer<typeof userResponseSchema>;
export type MeFullResponse = z.infer<typeof meFullResponseSchema>;
