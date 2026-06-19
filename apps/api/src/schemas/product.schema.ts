import z from 'zod';

import { httpUrl, trimmedString } from '@/lib/zod/extras';
import { userSchema } from '@/schemas/user.schema';
import { constants } from '@/utils/constant';

const productStatusList = constants.productStatus;

export const baseProductSchema = z.object({
    name: trimmedString.min(1).max(100),
    tagline: trimmedString.min(1).max(250),
    description: trimmedString.max(1000),
    websiteUrl: httpUrl,
    logoUrl: httpUrl.optional(),
    status: z.nativeEnum(productStatusList),
});

export const productResponseSchema = baseProductSchema.extend({
    id: z.coerce.number(),
    createdAt: z.date(),
    updatedAt: z.date(),
    maker: userSchema.pick({ id: true, name: true }),
});

export type Product = z.infer<typeof productResponseSchema>;
export type BaseProduct = z.infer<typeof baseProductSchema>;
