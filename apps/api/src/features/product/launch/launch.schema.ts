import z from 'zod';

import { baseLaunchSchema, launchResponseSchema } from '@/schemas/launch.schema';
import { paginationSchema, sortSchema } from '@/schemas/pagination.schema';
import { constants } from '@/utils/constant';

export type { Launch } from '@/schemas/launch.schema';

const publicFilterbleStatus = constants.launchStatus.PUBLISHED;

export const launchFilterSchema = paginationSchema.merge(sortSchema).extend({
    search: z.string().optional(),
    status: z.literal(publicFilterbleStatus).optional(),
    launchDateFrom: z.coerce.date().optional(),
    launchDateTo: z.coerce.date().optional(),
    sortBy: z.enum(['createdAt', 'votes']).optional(),
});

export const getLaunchByIdSchema = {
    params: launchResponseSchema.pick({
        id: true,
        productId: true,
    }),
};

export const createLaunchSchema = {
    params: launchResponseSchema.pick({ productId: true }),
    body: baseLaunchSchema,
};

export const updateLaunchSchema = {
    ...getLaunchByIdSchema,
    body: baseLaunchSchema.partial(),
};

export const getLaunchsSchema = { query: launchFilterSchema };
export const voteLaunchSchema = { params: launchResponseSchema.pick({ id: true }) };

export type CreateLaunchInput = z.infer<typeof createLaunchSchema.body>;
export type UpdateLaunchInput = z.infer<typeof updateLaunchSchema.body>;
export type GetLaunchById = z.infer<typeof getLaunchByIdSchema.params>;
export type VoteLaunch = z.infer<typeof voteLaunchSchema.params>;
export type LaunchFilterQuery = z.infer<typeof launchFilterSchema>;
