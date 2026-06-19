import { Prisma, Product, User, Vote } from '@/lib/prisma/generated/client';
import prisma, { PrismaTransactionClient } from '@/lib/prisma/prisma.ts';
import { constants } from '@/utils/constant';
import { paginate } from '@/utils/paginate-helpers';

import { getProductInclude } from './product.dto';
import { ProductFilterQuery } from './product.schema';
import { categoryFilter, getDateRange } from './product.utils';

const defaultStatus = constants.productStatus.APPROVED;

export const findAll = async (query: ProductFilterQuery) => {
    const where: Prisma.ProductWhereInput = {
        ...categoryFilter(query.q ?? ''),
        ...(query.search && {
            OR: [
                { name: { contains: query.search, mode: 'insensitive' } },
                { tagline: { contains: query.search, mode: 'insensitive' } },
            ],
        }),
        status: query.status ?? defaultStatus,
    };

    const orderBy: Prisma.ProductOrderByWithRelationInput =
        query.sortBy === 'votes'
            ? { votes: { _count: query.sortOrder } }
            : { createdAt: query.sortOrder };

    const [data, total] = await Promise.all([
        prisma.product.findMany({
            where,
            orderBy,
            ...getProductInclude(getDateRange(query.q ?? '')),
            ...paginate(query),
        }),
        prisma.product.count({ where }),
    ]);

    return { data, total };
};

export const findById = async (
    id: Product['id'],
    prismaIntance: PrismaTransactionClient = prisma
) => {
    return await prismaIntance.product.findFirst({
        where: {
            id,
            status: constants.productStatus.APPROVED,
        },
        include: getProductInclude().include,
    });
};

export const findByIdForMaker = async (
    makerId: Product['makerId'],
    productId: Product['id'],
    prismaIntance: PrismaTransactionClient = prisma
) => {
    return await prismaIntance.product.findFirst({
        where: {
            id: productId,
            makerId,
        },
        ...getProductInclude(),
    });
};

export const findByName = async (name: string) => {
    return await prisma.product.findFirst({
        where: {
            name,
        },
    });
};

export const createProduct = async (
    makerId: User['id'],
    input: Omit<
        Prisma.ProductCreateInput,
        'updatedAt' | 'createdAt' | 'maker' | 'votes' | 'makerId'
    >
) => {
    return await prisma.product.create({
        data: {
            ...input,
            makerId,
            status: input.status ?? constants.productStatus.DRAFT,
        },
    });
};

export const updateProduct = async (
    productId: Product['id'],
    input: Omit<
        Prisma.ProductUpdateInput,
        'updatedAt' | 'createdAt' | 'maker' | 'votes' | 'maketId'
    >
) => {
    return await prisma.product.update({
        where: {
            id: productId,
        },
        data: input,
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
