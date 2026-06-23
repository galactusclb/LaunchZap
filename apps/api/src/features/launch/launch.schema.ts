import z from 'zod';

import { launchResponseSchema } from '@/schemas/launch.schema';
import { paginationSchema, sortSchema } from '@/schemas/pagination.schema';

const launchQueryPresets = ['daily', 'weekly', 'new'] as const;

export const launchFilterSchema = paginationSchema.merge(sortSchema).extend({
    q: z.enum(launchQueryPresets).optional(),
    search: z.string().optional(),
    sortBy: z.enum(['launchDate', 'votes']).optional(),
});

export const getLaunchesSchema = {
    query: launchFilterSchema,
};

export const getLaunchBySlugSchema = {
    params: launchResponseSchema.pick({ slug: true }),
};

export type LaunchFilterQuery = z.infer<typeof launchFilterSchema>;
export type GetLaunchBySlug = z.infer<typeof getLaunchBySlugSchema.params>;
