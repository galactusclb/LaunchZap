import z from 'zod';

import { trimmedString } from '@/lib/zod/extras';
import { ProductStatus } from '@/prisma/client';
import { userSchema } from '@/schemas/user.schema';

export const baseProductSchema = z.object({
    name:        trimmedString.min(1).max(100),
    tagline:     trimmedString.min(1).max(250),
    description: trimmedString.max(1000).optional(),
    websiteUrl:  z.string().url(),
    logoUrl:     z.string().url().optional(),
    launchDate:  z.coerce.date(),
});

export const productResponseSchema = baseProductSchema.extend({
    id:         z.number(),
    createdAt:  z.date(),
    updatedAt:  z.date(),
    status:     z.nativeEnum(ProductStatus),
    maker:      userSchema.pick({ id: true, name: true }),
    votesCount: z.number(),
});

export type Product     = z.infer<typeof productResponseSchema>;
export type BaseProduct = z.infer<typeof baseProductSchema>;
