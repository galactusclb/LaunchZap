import { ApiResponseSchema } from "@/models/api.schema";
import z from "zod";

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

export const meFullResponseSchema = ApiResponseSchema.extend({
    data: userResponseSchema,
});

export type User           = z.infer<typeof userResponseSchema>;
export type MeFullResponse = z.infer<typeof meFullResponseSchema>;
