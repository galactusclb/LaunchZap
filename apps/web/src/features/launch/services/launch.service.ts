'use cache';

import { cacheLife, cacheTag } from 'next/cache';
import { unstable_rethrow } from 'next/navigation';

import {
    LaunchDetail,
    launchDetailResponseSchema,
    launchFeedResponseSchema,
    LaunchFeedResult,
} from '@/models/launch.schema';
import { ProductListFullResponse } from '@/models/product.schema';
import { ApiError } from '@/utils/api/api-error';
import { apiCacheable } from '@/utils/api/api-server';

export type ProductFeedResult = Pick<ProductListFullResponse, 'data' | 'meta'>;

export async function getDailyLaunches(): Promise<LaunchFeedResult> {
    cacheLife('hours');
    cacheTag('launches');

    return apiCacheable('/launches?q=daily', launchFeedResponseSchema);
}

export async function getLaunchBySlug(slug: string): Promise<LaunchDetail | null> {
    cacheLife('minutes');
    cacheTag('launches', `launch-${slug}`);

    try {
        const response = await apiCacheable(`/launches/${slug}`, launchDetailResponseSchema);
        return response.data ?? null;
    } catch (error) {
        unstable_rethrow(error);
        if (error instanceof ApiError && error.status === 404) return null;
        throw error;
    }
}
