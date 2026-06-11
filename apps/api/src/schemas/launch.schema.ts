import z from 'zod';

import { trimmedString } from '@/lib/zod/extras';
import { constants } from '@/utils/constant';

const launchStatusList = constants.launchStatus;

export const baseLaunchSchema = z.object({
    name: trimmedString.min(1).max(100),
    tagline: trimmedString.min(1).max(250),
    description: trimmedString.max(1000).optional(),
    launchDate: z.coerce.date(),
});

export const launchResponseSchema = baseLaunchSchema.extend({
    id: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    status: z.enum(launchStatusList),
    votesCount: z.number(),
    productId: z.coerce.number(),
});

export type Launch = z.infer<typeof launchResponseSchema>;
export type BaseLaunch = z.infer<typeof baseLaunchSchema>;
