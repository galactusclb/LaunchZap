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
    slug: trimmedString.min(1).max(100),
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
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    votesCount: z.number(),
});

export const launchListResponseSchema = apiResponseSchema.list(launchResponseSchema);

const launchProductSchema = z.object({
    id: z.number(),
    name: z.string(),
    slug: z.string(),
    logoUrl: z.string().nullable(),
    websiteUrl: z.string(),
    maker: z.object({ id: z.string(), name: z.string() }).nullable(),
});

export const launchDetailSchema = launchResponseSchema.omit({ productId: true }).extend({
    product: launchProductSchema,
});

export const launchFeedResponseSchema = apiResponseSchema.list(launchDetailSchema);
export const launchDetailResponseSchema = apiResponseSchema.single(launchDetailSchema);

export type Launch = z.infer<typeof launchResponseSchema>;
export type BaseLaunch = z.infer<typeof baseLaunchSchema>;
export type LaunchDetail = z.infer<typeof launchDetailSchema>;
export type LaunchFeedListFullRespone = z.infer<typeof launchFeedResponseSchema>;
export type LaunchFeedResult = Pick<LaunchFeedListFullRespone, 'data' | 'meta'>;
