import { z } from 'zod';

export const ApiResponseSchema = z.object({
    success: z.boolean().optional(),
    message: z.string(),
    data: z.unknown().optional()
});

export type IApiResponse = z.infer<typeof ApiResponseSchema>