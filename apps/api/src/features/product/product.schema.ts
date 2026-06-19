import z from 'zod';

import { paginationSchema, sortSchema } from '@/schemas/pagination.schema';
import { baseProductSchema, productResponseSchema } from '@/schemas/product.schema';
import { constants } from '@/utils/constant';

export type { Product } from '@/schemas/product.schema';

const publicFilterbleStatus = [constants.productStatus.APPROVED] as const;

const ownerStatusUpdatedList = z.enum([
    constants.productStatus.DRAFT,
    constants.productStatus.PENDING,
]);

export const productFilterSchema = paginationSchema.merge(sortSchema).extend({
    q: z.enum(['new', 'daily', 'weekly', 'hot']).optional(),
    search: z.string().optional(),
    status: z.enum(publicFilterbleStatus).optional(),
    sortBy: z.enum(['createdAt', 'votes']).optional(),
});

export const createProductSchema = { body: baseProductSchema };
export const updateProductSchema = {
    body: baseProductSchema.extend({
        status: ownerStatusUpdatedList.optional(),
    }),
};

export const getProductsSchema = { query: productFilterSchema };
export const getProductByIdSchema = { params: z.object({ id: productResponseSchema.shape.id }) };
export const voteProductSchema = { params: z.object({ id: productResponseSchema.shape.id }) };

export type CreateProductInput = z.infer<typeof createProductSchema.body>;
export type UpdateProductInput = z.infer<typeof updateProductSchema.body>;
export type GetProductById = z.infer<typeof getProductByIdSchema.params>;
export type VoteProduct = z.infer<typeof voteProductSchema.params>;
export type ProductFilterQuery = z.infer<typeof productFilterSchema>;
