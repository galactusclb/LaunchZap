import { createHash } from 'crypto';

import { logger } from '@/lib/logger';
import { redisClient, redisUtils } from '@/lib/redis/redis-client';
import { constants } from '@/utils/constant';
import { NotFoundError } from '@/utils/errors/http-error';
import { paginatedResponse } from '@/utils/paginate-helpers';

import * as repo from './launch.repository';
import { LaunchFilterQuery } from './launch.schema';

const CACHE_KEY_PREFIX = 'lz:api:launches';
const CACHE_KEY_LIST = `${CACHE_KEY_PREFIX}:list`;
const CACHE_KEY_VERSION = `${CACHE_KEY_PREFIX}:version`;
const CACHE_KEY_ITEM = `${CACHE_KEY_PREFIX}:item`;

export const doGetLaunches = async (query: LaunchFilterQuery) => {
    const sortedQuery = JSON.stringify(query, Object.keys(query).sort());
    const queryHash = createHash('sha1').update(sortedQuery).digest('hex').slice(0, 12);
    const version = (await redisClient?.get(CACHE_KEY_VERSION)) ?? '0';
    const cacheKey = `${CACHE_KEY_LIST}:v${version}:${queryHash}`;

    return redisUtils.swrCache(
        cacheKey,
        async () => {
            logger.debug('[launches] list cache miss', { cacheKey, query });
            const { data, total } = await repo.findAll(query);
            return paginatedResponse(data, total, query);
        },
        { ...constants.cache.product.list }
    );
};

export const doGetLaunchBySlug = async (slug: string) => {
    const cacheKey = `${CACHE_KEY_ITEM}:${slug}`;

    const launch = await redisUtils.swrCache(
        cacheKey,
        async () => {
            logger.debug('[launches] item cache miss', { cacheKey, slug });
            return repo.findBySlug(slug);
        },
        { ...constants.cache.product.item }
    );

    if (!launch) throw new NotFoundError('Launch not found');

    return launch;
};
