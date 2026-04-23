import { z } from 'zod';

export const loginSearchParamsSchema = z.object({
    returnTo: z
        .string()
        .optional()
        .transform((value) => {
            if (!value || !value.startsWith('/') || value.startsWith('//')) return '/';
            return value;
        }),
});

export type LoginSearchParams = z.infer<typeof loginSearchParamsSchema>;
