import { ProductStatus } from "@/prisma/client";
import { trimmedString } from "@/lib/zod/extras.ts";
import { paginationSchema, sortSchema } from "@/schemas/pagination.schema";

import z from "zod";

export const baseProductSchema = z.object({
    name: trimmedString.min(1).max(100),
    tagline: trimmedString.min(1).max(250),
    description: trimmedString.max(1000).optional(),
    
    websiteUrl : z.string().url(),
    logoUrl : z.string().url().optional(),
    launchDate : z.coerce.date()
});

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

export const productFilterSchema = paginationSchema.merge(sortSchema).extend({
    q: z.enum(['new', 'daily', 'weekly', 'hot']).optional(),
    search: z.string().optional(),
    status: z.nativeEnum(ProductStatus).optional(),
    launchDataFrom: z.coerce.date().optional(),
    launchDateTo: z.coerce.date().optional(),
});

export const createProductSchema = {
    body: baseProductSchema
};

export const getProductsSchema = {
    query: productFilterSchema
}

export type Product = z.infer<typeof baseProductSchema>;
export type ProductOject = z.infer<typeof productResponseSchema>;
export type CreateProduct = z.infer<typeof createProductSchema.body>;
export type ProductFilterQuery = z.infer<typeof productFilterSchema>;