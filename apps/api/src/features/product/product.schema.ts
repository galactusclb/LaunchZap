import z from 'zod';

import { ProductStatus } from '@/prisma/client';
import { paginationSchema, sortSchema } from '@/schemas/pagination.schema';
import { baseProductSchema } from '@/schemas/product.schema';

export type { Product } from '@/schemas/product.schema';

export const productFilterSchema = paginationSchema.merge(sortSchema).extend({
    q: z.enum(['new', 'daily', 'weekly', 'hot']).optional(),
    search: z.string().optional(),
    status: z.nativeEnum(ProductStatus).optional(),
    launchDataFrom: z.coerce.date().optional(),
    launchDateTo: z.coerce.date().optional(),
});

export const createProductSchema = { body: baseProductSchema };
export const getProductsSchema = { query: productFilterSchema };
export const getProductByIdSchema = { params: z.object({ id: z.coerce.number() }) };
export const voteProductSchema = { params: z.object({ id: z.coerce.number() }) };

export type CreateProduct = z.infer<typeof createProductSchema.body>;
export type GetProductById = z.infer<typeof getProductByIdSchema.params>;
export type VoteProduct = z.infer<typeof voteProductSchema.params>;
export type ProductFilterQuery = z.infer<typeof productFilterSchema>;
