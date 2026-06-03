import z from 'zod';

import { apiResponseSchema } from '@/models/api-response.schema';

import { userResponseSchema } from './user.schema';

export enum ProductStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
}

export const baseProductSchema = z.object({
    name: z.string().min(1).max(100),
    tagline: z.string().min(1).max(250),
    description: z.string().max(1000).optional(),

    websiteUrl: z.url(),
    logoUrl: z.url().nullable().optional(),
    launchDate: z.coerce.date(),
});

export const productResponseSchema = baseProductSchema.extend({
    id: z.coerce.number(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),

    status: z.enum(ProductStatus),
    maker: userResponseSchema
        .pick({
            id: true,
            name: true,
        })
        .nullable()
        .optional(),

    votesCount: z.number(),
});

export const productListFullResponseSchema = apiResponseSchema.list(productResponseSchema);

export const productSingleResponseSchema = apiResponseSchema.single(
    productResponseSchema.optional()
);

export const productCreateResponseSchema = apiResponseSchema.single(
    baseProductSchema.extend({
        id: z.coerce.number(),
        status: z.enum(ProductStatus),
        makerId: z.string(),
        createdAt: z.coerce.date(),
        updatedAt: z.coerce.date().optional(),
    })
);

export const productIdParamSchema = productResponseSchema.pick({
    id: true,
});

export type Product = z.infer<typeof productResponseSchema>;
export type ProductListFullResponse = z.infer<typeof productListFullResponseSchema>;
export type ProductSingleResponse = z.infer<typeof productSingleResponseSchema>;
export type CreateProduct = z.infer<typeof baseProductSchema>;
export type ProductIdParam = z.infer<typeof productIdParamSchema>;
