import { createHash } from 'crypto';

import { User } from '../auth/auth.schema.ts';

import * as repo from './product.repository.ts';
import { CreateProduct, Product, ProductFilterQuery } from './product.schema.ts';

import { logger } from '@/lib/logger';
import prisma from '@/lib/prisma/prisma.ts';
import { redisClient, redisUtils } from '@/lib/redis/redis-client.ts';
import { ConflictError, NotFoundError } from '@/utils/errors/http-error.ts';
import { paginatedResponse } from '@/utils/paginate-helpers.ts';

const CACHE_KEY_PREFIX = "lz:api:product";
const CACHE_KEY_LIST = `${CACHE_KEY_PREFIX}:list`;
const CACHE_KEY_VERSION = `${CACHE_KEY_PREFIX}:version`;
const CACHE_KEY_ITEM = `${CACHE_KEY_PREFIX}:item`;

export const doGetById = async (id: Product['id']) => {
    const cacheKey = `${CACHE_KEY_ITEM}:${id}`;

    const product = await redisUtils.swrCache(
        cacheKey,
        async ()=> {
            logger.debug('[product] item cache miss', { cacheKey, id });
            return repo.findById(id);
        }
    );

    if (!product) throw new NotFoundError("Product not found");
    return product;
};

export const doGetAllProducts = async (query: ProductFilterQuery) => {
    const sortedQuery = JSON.stringify(query, Object.keys(query).sort())
    const queryHash = createHash('sha1').update(sortedQuery).digest('hex').slice(0,12);
    const version = (await redisClient?.get(CACHE_KEY_VERSION)) ?? "0";
    const cacheKey = `${CACHE_KEY_LIST}:v${version}:${queryHash}`;

    return redisUtils.swrCache(
        cacheKey,
        async ()=> {
            logger.debug('[product] list cache miss', { cacheKey, query });
            const { data, total } = await repo.findAll(query);
            return paginatedResponse(data, total, query);
        }
    );
};

export const doCreateProduct = async (makerId: string,input: CreateProduct) => {
    const isExist = await repo.findByName(input.name);

    if (isExist) throw new ConflictError("Product is already exist!");

    const product = await repo.createProduct(makerId, input);

    void redisClient?.incr(CACHE_KEY_VERSION).catch(err =>
        logger.error('[product] failed to bump version', { err })
    );

    return product;
};

export const doVoteProduct = async (userId: User['id'], productId: Product['id']) => {
    return prisma.$transaction(async (tx) => {

        const existing = await repo.findVote(userId, productId, tx);

        if (existing) {
            await repo.removeVote(existing.id, tx);
            return { isUpvoted: false };
        }

        await repo.createVote(userId, productId, tx);
        
        return { isUpvoted: true };
    });
};