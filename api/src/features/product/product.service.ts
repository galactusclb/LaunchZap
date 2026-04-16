
import { User } from '../auth/auth.schema.ts';

import * as repo from './product.repository.ts';
import { CreateProduct, Product, ProductFilterQuery } from './product.schema.ts';

import prisma from '@/lib/prisma/prisma.ts';
import { ConflictError } from '@/utils/errors/http-error.ts';
import { paginatedResponse } from '@/utils/paginate-helpers.ts';

export const doGetAllProducts = async (query: ProductFilterQuery) => {
    const { data, total } = await repo.findAll(query);
    return paginatedResponse(data, total, query);
};

export const doCreateProduct = async (input: CreateProduct) => {
    const isExist = await repo.findByName(input.name);

    if (isExist) throw new ConflictError("Product is already exist!");

    return await repo.createProduct(input);
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