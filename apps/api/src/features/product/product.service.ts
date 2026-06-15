import { createHash } from 'crypto';

import { logger } from '@/lib/logger';
import prisma from '@/lib/prisma/prisma.ts';
import { redisClient, redisUtils } from '@/lib/redis/redis-client.ts';
import { User } from '@/schemas/user.schema';
import { constants } from '@/utils/constant/index.ts';
import { ConflictError, NotFoundError } from '@/utils/errors/http-error.ts';
import { paginatedResponse } from '@/utils/paginate-helpers.ts';

import * as repo from './product.repository.ts';
import { CreateProductInput, Product, ProductFilterQuery } from './product.schema.ts';

const CACHE_KEY_PREFIX = 'lz:api:product';
const CACHE_KEY_LIST = `${CACHE_KEY_PREFIX}:list`;
const CACHE_KEY_VERSION = `${CACHE_KEY_PREFIX}:version`;
const CACHE_KEY_ITEM = `${CACHE_KEY_PREFIX}:item`;
const CACHE_KEY_ITEM_VOTE_COUNT = `${CACHE_KEY_PREFIX}:item:vote`;

const VOTE_COUNT_TTL = 60 * 60 * 24;

export const doGetById = async (id: Product['id']) => {
    const cacheKey = `${CACHE_KEY_ITEM}:${id}`;
    const voteKey = `${CACHE_KEY_ITEM_VOTE_COUNT}:${id}`;

    const getProduct = redisUtils.swrCache(
        cacheKey,
        async () => {
            logger.debug('[product] item cache miss', { cacheKey, id });
            return repo.findById(id);
        },
        { ...constants.cache.product.item }
    );

    const cachedVoteCount = redisClient?.get(voteKey) ?? null;

    const [product, cachedCount] = await Promise.all([getProduct, cachedVoteCount]);

    if (!product) throw new NotFoundError('Product not found');

    if (cachedCount === null) {
        void redisClient?.set(voteKey, String(product._count.votes), 'EX', VOTE_COUNT_TTL, 'NX');
    } else {
        void redisClient?.expire(voteKey, VOTE_COUNT_TTL);
    }

    return {
        ...product,
        _count: {
            ...product._count,
            votes: cachedCount !== null ? parseInt(cachedCount) : product._count.votes,
        },
    };
};

export const doGetAllProducts = async (query: ProductFilterQuery) => {
    const sortedQuery = JSON.stringify(query, Object.keys(query).sort());
    const queryHash = createHash('sha1').update(sortedQuery).digest('hex').slice(0, 12);
    const version = (await redisClient?.get(CACHE_KEY_VERSION)) ?? '0';
    const cacheKey = `${CACHE_KEY_LIST}:v${version}:${queryHash}`;

    return redisUtils.swrCache(
        cacheKey,
        async () => {
            logger.debug('[product] list cache miss', { cacheKey, query });
            const { data, total } = await repo.findAll(query);
            return paginatedResponse(data, total, query);
        },
        { ...constants.cache.product.list }
    );
};

export const doCreateProduct = async (makerId: string, input: CreateProductInput) => {
    const isExist = await repo.findByName(input.name);

    if (isExist) throw new ConflictError('Product is already exist!');

    const product = await repo.createProduct(makerId, input);

    void redisClient
        ?.incr(CACHE_KEY_VERSION)
        .catch((err) => logger.error('[product] failed to bump version', { err }));

    return product;
};

export const doVoteProduct = async (userId: User['id'], productId: Product['id']) => {
    const result = await prisma.$transaction(async (tx) => {
        const existing = await repo.findVote(userId, productId, tx);

        if (existing) {
            await repo.removeVote(existing.id, tx);
            return { isUpvoted: false };
        }

        await repo.createVote(userId, productId, tx);
        return { isUpvoted: true };
    });

    const voteKey = `${CACHE_KEY_ITEM_VOTE_COUNT}:${productId}`;

    const keyExists = await redisClient?.exists(voteKey);

    if (!keyExists) {
        await redisUtils?.withLock(`${voteKey}:init`, async () => {
            const fresh = await repo.findById(productId);
            if (fresh) {
                void redisClient?.set(
                    voteKey,
                    String(fresh?._count.votes),
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
        logger.error('[product] vote count cache drift', {
            err,
            productId,
            isUpvoted: result.isUpvoted,
        });
    }

    return result;
};
