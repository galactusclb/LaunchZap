import z from 'zod';

import { trimmedString } from '@/lib/zod/extras';
import { constants } from '@/utils/constant';

import { productResponseSchema } from './product.schema';

const launchStatusList = constants.launchStatus;

export const baseLaunchSchema = z.object({
    productId: productResponseSchema.shape.id,
    tagline: trimmedString.min(1).max(250),
    description: trimmedString.max(1000),
    launchDate: z.coerce.date(),
    gallery: z.array(z.string()),
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
