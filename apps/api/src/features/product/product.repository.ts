import { getProductInclude } from './product.dto';
import { CreateProductInput, ProductFilterQuery } from './product.schema';
import { categoryFilter, getDateRange } from './product.utils';

import { Prisma, Product, User, Vote } from '@/lib/prisma/generated/client';
import prisma, { PrismaTransactionClient } from '@/lib/prisma/prisma.ts';
import { paginate } from '@/utils/paginate-helpers';

export const findAll = async (query: ProductFilterQuery) => {
    const where: Prisma.ProductWhereInput = {
        ...categoryFilter(query.q ?? ''),
        ...(query.search && {
            OR: [
                { name: { contains: query.search, mode: 'insensitive' } },
                { tagline: { contains: query.search, mode: 'insensitive' } },
            ],
        }),
        ...(query.status && { status: query.status }),
    };

    // const orderBy: Prisma.ProductOrderByWithRelationInput = query.sortBy
    //     ? {[query.sortBy]: query.sortOrder}
    //     : { createdAt: query.sortOrder}
    // const orderBy = categoryOrderBy(query.q ?? '')

    const [data, total] = await Promise.all([
        prisma.product.findMany({
            where,
            // orderBy,
            ...getProductInclude(getDateRange(query.q ?? '')),
            ...paginate(query),
        }),
        prisma.product.count({ where }),
    ]);

    const sorted = data.sort((a, b) => b._count.votes - a._count.votes);
    return { data: sorted, total };
};

export const findById = async (
    id: Product['id'],
    prismaIntance: PrismaTransactionClient = prisma
) => {
    return await prismaIntance.product.findFirst({
        where: { id },
        include: getProductInclude().include,
    });
};

export const findByName = async (name: string) => {
    return await prisma.product.findFirst({
        where: {
            name,
        },
    });
};

export const createProduct = async (makerId: User['id'], input: CreateProductInput) => {
    return await prisma.product.create({
        data: {
            name: input.name,
            description: input.description ?? '',
            tagline: input.tagline,
            websiteUrl: input.websiteUrl,
            logoUrl: input.logoUrl,
            makerId,
        },
    });
};

export const findVote = async (
    userId: User['id'],
    productId: Product['id'],
    prismaIntance: PrismaTransactionClient = prisma
) => {
    return await prismaIntance.vote.findFirst({
        where: {
            userId,
            productId,
        },
    });
};

export const removeVote = async (
    id: Vote['id'],
    prismaIntance: PrismaTransactionClient = prisma
) => {
    return await prismaIntance.vote.delete({
        where: {
            id,
        },
    });
};

export const createVote = async (
    userId: User['id'],
    productId: Product['id'],
    prismaIntance: PrismaTransactionClient = prisma
) => {
    return await prismaIntance.vote.create({
        data: {
            productId: productId,
            userId: userId,
        },
    });
};
