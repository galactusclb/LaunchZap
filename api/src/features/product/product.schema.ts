import z from "zod";

import { userSchema } from "../auth/auth.schema";

import { trimmedString } from "@/lib/zod/extras.ts";
import { ProductStatus } from "@/prisma/client";
import { paginationSchema, sortSchema } from "@/schemas/pagination.schema";


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
    maker: userSchema.pick({
        id: true,
        name: true
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

export const getProductByIdSchema = {
    params: z.object({ id: z.coerce.number() })
}

export const voteProductSchema = {
    params: z.object({ id: z.coerce.number() })
}

// export type Product = z.infer<typeof baseProductSchema>;
export type Product = z.infer<typeof productResponseSchema>;
export type CreateProduct = z.infer<typeof createProductSchema.body>;
export type GetProductById = z.infer<typeof getProductByIdSchema.params>;
export type VoteProduct = z.infer<typeof voteProductSchema.params>;
export type ProductFilterQuery = z.infer<typeof productFilterSchema>;