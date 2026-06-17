import z from 'zod';

import { httpUrl, trimmedString } from '@/lib/zod/extras';
import { constants } from '@/utils/constant';

import { productResponseSchema } from './product.schema';

const MAX_LAUNCH_SCHEDULE_DAYS = 90;

const launchStatusList = constants.launchStatus;

export const baseLaunchSchema = z.object({
    productId: productResponseSchema.shape.id,
    tagline: trimmedString.min(1).max(250),
    description: trimmedString.max(1000),
    launchDate: z.coerce
        .date()
        .refine((d) => d > new Date(), { message: 'Launch date must be in the future' })
        .refine(
            (d) => {
                const max = new Date();
                max.setDate(max.getDate() + MAX_LAUNCH_SCHEDULE_DAYS);
                return d <= max;
            },
            {
                message: `Launch date cannot be more than ${MAX_LAUNCH_SCHEDULE_DAYS} days in the future`,
            }
        ),
    gallery: z.array(httpUrl).max(5),
    status: z.nativeEnum(launchStatusList),
});

export const launchResponseSchema = baseLaunchSchema.extend({
    id: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    votesCount: z.number(),
});

export type Launch = z.infer<typeof launchResponseSchema>;
export type BaseLaunch = z.infer<typeof baseLaunchSchema>;
