import { ProductStatus } from "@/prisma/client";
import { trimmedString } from "@/lib/zod/extras.ts";

import z from "zod";

export const baseProductSchema = z.object({
    name: trimmedString.min(1).max(100),
    tagline: trimmedString.min(1).max(250),
    description: trimmedString.max(1000).optional(),
    
    websiteUrl : z.string().url(),
    logoUrl : z.string().url().optional(),
    launchDate : z.coerce.date()
});

export const createProductSchema = {
    body: baseProductSchema
};

export const productResponseSchema = baseProductSchema.extend({
    id: z.number(),
    createdAt: z.date(),
    updatedAt: z.date(),

    status: z.nativeEnum(ProductStatus),
    maker: z.object({
        id: z.string(),
        name: z.string()
    }),

    votesCount: z.number()
});

export type Product = z.infer<typeof baseProductSchema>;
export type ProductOject = z.infer<typeof productResponseSchema>;
export type CreateProduct = z.infer<typeof createProductSchema.body>;