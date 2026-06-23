import { createHash } from 'crypto';

import { logger } from '@/lib/logger';
import prisma from '@/lib/prisma/prisma.ts';
import { redisClient, redisUtils } from '@/lib/redis/redis-client.ts';
import { User } from '@/schemas/user.schema.ts';
import { constants } from '@/utils/constant/index.ts';
import { ConflictError, NotFoundError, UnauthorizedError } from '@/utils/errors/http-error.ts';
import { paginatedResponse } from '@/utils/paginate-helpers.ts';

import * as repo from './launch.repository.ts';
import {
    CreateLaunchInput,
    Launch,
    LaunchFilterQuery,
    UpdateLaunchInput,
} from './launch.schema.ts';

const CACHE_KEY_PREFIX = 'lz:api:product-launches';
const CACHE_KEY_LIST = `${CACHE_KEY_PREFIX}:list`;
const CACHE_KEY_VERSION = `${CACHE_KEY_PREFIX}:version`;
const CACHE_KEY_ITEM = `${CACHE_KEY_PREFIX}:item`;
const CACHE_KEY_ITEM_VOTE_COUNT = `${CACHE_KEY_PREFIX}:item:vote`;

const VOTE_COUNT_TTL = 60 * 60 * 24;

export const doGetLaunchById = async (id: Launch['id']) => {
    const cacheKey = `${CACHE_KEY_ITEM}:${id}`;
    const voteKey = `${CACHE_KEY_ITEM_VOTE_COUNT}:${id}`;

    const getCachedLaunch = redisUtils.swrCache(
        cacheKey,
        async () => {
            logger.debug('[product-launch] item cache miss', { cacheKey, id });
            return repo.findById(id);
        },
        { ...constants.cache.product.item }
    );

    const cachedVoteCount = redisClient?.get(voteKey) ?? null;

    const [product, cachedCount] = await Promise.all([getCachedLaunch, cachedVoteCount]);

    if (!product) throw new NotFoundError('Launch not found');

    if (cachedCount === null) {
        void redisClient?.set(
            voteKey,
            String(product._count.launchVote),
            'EX',
            VOTE_COUNT_TTL,
            'NX'
        );
    } else {
        void redisClient?.expire(voteKey, VOTE_COUNT_TTL);
    }

    return {
        ...product,
        _count: {
            ...product._count,
            votes: cachedCount !== null ? parseInt(cachedCount) : product._count.launchVote,
        },
    };
};

export const doGetProductLaunchList = async (
    productId: Launch['productId'],
    query: LaunchFilterQuery
) => {
    const sortedQuery = JSON.stringify(query, Object.keys(query).sort());
    const queryHash = createHash('sha1').update(sortedQuery).digest('hex').slice(0, 12);
    const version = (await redisClient?.get(CACHE_KEY_VERSION)) ?? '0';
    const cacheKey = `${CACHE_KEY_LIST}:${productId}:v${version}:${queryHash}`;

    return redisUtils.swrCache(
        cacheKey,
        async () => {
            logger.debug(`[product-launch] ${productId} launch list cache miss`, {
                cacheKey,
                query,
            });
            const { data, total } = await repo.findAll(productId, query);
            return paginatedResponse(data, total, query);
        },
        { ...constants.cache.product.list }
    );
};

export const doScheduleLaunch = async (
    ownerId: string,
    productId: number,
    input: CreateLaunchInput
) => {
    const rateBouncerKey = `${CACHE_KEY_PREFIX}:${ownerId}:bouncer`;
    const maximumBouncerLimit = 5;

    await redisUtils.rateLimiter(rateBouncerKey, maximumBouncerLimit);

    const product = await repo.findProduct(productId);
    if (!product) throw new NotFoundError('Product not found');
    if (product.makerId !== ownerId) throw new UnauthorizedError('Unowned product');

    const publishedOrDraft = await repo.findPublishedOrDraft(productId);

    if (publishedOrDraft) {
        throw new ConflictError(
            'This product already has an active launch. Complete or remove it before scheduling a new one.'
        );
    }

    const launch = await repo.scheduleLaunch(productId, input);

    void redisClient
        ?.incr(CACHE_KEY_VERSION)
        .catch((err) => logger.error('[product-launch] failed to bump version', { err }));

    return launch;
};

export const doUpdateLaunch = async (
    ownerId: string,
    productId: number,
    launchId: string,
    input: UpdateLaunchInput
) => {
    const cacheKey = `${CACHE_KEY_ITEM}:${launchId}`;

    const product = await repo.findProduct(productId);
    if (!product) {
        throw new NotFoundError('Product not found');
    }

    if (product.makerId !== ownerId) {
        throw new UnauthorizedError('Unowned product');
    }

    const launchExist = await repo.findById(launchId);
    if (!launchExist) {
        throw new NotFoundError('Launch not found');
    }

    if (launchExist.productId !== productId) {
        throw new UnauthorizedError('Launch does not belong to this product');
    }

    const launch = await repo.updateLaunch(launchId, input);

    void redisClient
        ?.incr(CACHE_KEY_VERSION)
        .catch((err) => logger.error('[product-launch] failed to bump version', { err }));

    void redisClient
        ?.del(cacheKey)
        .catch((err) => logger.error('[product-launch] failed to invalidate item cache', { err }));

    return launch;
};

export const doVoteLaunch = async (userId: User['id'], launchId: Launch['id']) => {
    const result = await prisma.$transaction(async (tx) => {
        const existing = await repo.findVote(userId, launchId, tx);

        if (existing) {
            await repo.removeVote(existing.id, tx);
            return { isUpvoted: false };
        }

        await repo.createVote(userId, launchId, tx);
        return { isUpvoted: true };
    });

    const voteKey = `${CACHE_KEY_ITEM_VOTE_COUNT}:${launchId}`;

    const keyExists = await redisClient?.exists(voteKey);

    if (!keyExists) {
        await redisUtils?.withLock(`${voteKey}:init`, async () => {
            const fresh = await repo.findById(launchId);
            if (fresh) {
                void redisClient?.set(
                    voteKey,
                    String(fresh?._count.launchVote),
                    'EX',
                    VOTE_COUNT_TTL,
                    'NX'
                );
            }
        });

        return result;
    }

    try {
        await (result.isUpvoted ? redisClient?.incr(voteKey) : redisClient?.decr(voteKey));
    } catch (err) {
        logger.error('[product-launch] vote count cache drift', {
            err,
            launchId,
            isUpvoted: result.isUpvoted,
        });
    }

    return result;
};
