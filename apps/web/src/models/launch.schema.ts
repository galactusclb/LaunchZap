import z from 'zod';

import { trimmedString } from '@/lib/zod/extras';

import { apiResponseSchema } from './api-response.schema';

const MAX_LAUNCH_SCHEDULE_DAYS = 90;

export enum LaunchStatus {
    DRAFT = 'DRAFT',
    PUBLISHED = 'PUBLISHED',
    LAUNCHED = 'LAUNCHED',
    HIDE = 'HIDE',
}

export const baseLaunchSchema = z.object({
    productId: z.coerce.number(),
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
    gallery: z.array(z.httpUrl()).max(5),
    status: z.enum(LaunchStatus),
});

export const launchResponseSchema = baseLaunchSchema.extend({
    id: z.string(),
    launchDate: z.coerce.date(),
    createdAt: z.date(),
    updatedAt: z.date(),
    votesCount: z.number(),
});

export const launchListResponseSchema = apiResponseSchema.list(launchResponseSchema);

export type Launch = z.infer<typeof launchResponseSchema>;
export type BaseLaunch = z.infer<typeof baseLaunchSchema>;
