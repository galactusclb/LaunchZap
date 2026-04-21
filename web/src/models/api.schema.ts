import { z } from 'zod';

export const PaginationMetaSchema = z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number()
})

export const ApiResponseSchema = z.object({
    success: z.boolean().optional(),
    message: z.string().optional(),
    data: z.unknown().optional(),
    meta: PaginationMetaSchema.optional()
});

export type IApiResponse = z.infer<typeof ApiResponseSchema>;
export type PaginationMeta = z.infer<typeof PaginationMetaSchema>;