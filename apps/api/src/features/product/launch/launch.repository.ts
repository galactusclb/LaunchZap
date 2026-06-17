import { Prisma, Product, User, LaunchVote, Launch } from '@/lib/prisma/generated/client';
import prisma, { PrismaTransactionClient } from '@/lib/prisma/prisma.ts';
import { constants } from '@/utils/constant';
import { paginate } from '@/utils/paginate-helpers';

import { getLaunchInclude } from './launch.dto';
import { LaunchFilterQuery, UpdateLaunchInput } from './launch.schema';

const defaultStatus = constants.launchStatus.PUBLISHED;

export const findAll = async (query: LaunchFilterQuery) => {
    const where: Prisma.LaunchWhereInput = {
        ...(query.search && {
            OR: [{ tagline: { contains: query.search, mode: 'insensitive' } }],
        }),
        ...((query.launchDateFrom || query.launchDateTo) && {
            launchDate: {
                ...(query.launchDateFrom && { gte: query.launchDateFrom }),
                ...(query.launchDateTo && { lte: query.launchDateTo }),
            },
        }),
        status: query.status ?? defaultStatus,
    };

    const [data, total] = await Promise.all([
        prisma.launch.findMany({
            where,
            orderBy:
                query.sortBy === 'votes'
                    ? { launchVote: { _count: query.sortOrder } }
                    : { createdAt: query.sortOrder },
            ...getLaunchInclude(),
            ...paginate(query),
        }),
        prisma.launch.count({ where }),
    ]);

    return { data, total };
};

export const findById = async (
    id: Launch['id'],
    prismaIntance: PrismaTransactionClient = prisma
) => {
    return await prismaIntance.launch.findFirst({
        where: {
            id,
            status: constants.launchStatus.PUBLISHED,
        },
        include: getLaunchInclude().include,
    });
};

export const findProduct = async (productId: number) => {
    return await prisma.product.findUnique({
        where: {
            id: productId,
        },
    });
};

export const findPublishedOrDraft = async (productId: number) => {
    return await prisma.launch.findFirst({
        where: {
            productId,
            status: { in: [constants.launchStatus.DRAFT, constants.launchStatus.PUBLISHED] },
        },
    });
};

export const scheduleLaunch = async (
    productId: Product['id'],
    input: Pick<Prisma.LaunchCreateInput, 'tagline' | 'description' | 'launchDate' | 'gallery'>
) => {
    return await prisma.launch.create({
        data: {
            productId,
            tagline: input.tagline,
            description: input.description ?? '',
            launchDate: input.launchDate,
            gallery: input.gallery,
        },
    });
};

export const updateLaunch = async (launchId: Launch['id'], input: UpdateLaunchInput) => {
    return await prisma.launch.update({
        where: {
            id: launchId,
        },
        data: {
            tagline: input.tagline,
            description: input.description,
            launchDate: input.launchDate,
            gallery: input.gallery,
        },
    });
};

export const findVote = async (
    userId: User['id'],
    launchId: LaunchVote['id'],
    prismaIntance: PrismaTransactionClient = prisma
) => {
    return await prismaIntance.launchVote.findFirst({
        where: {
            userId,
            launchId,
        },
    });
};

export const removeVote = async (
    id: LaunchVote['id'],
    prismaIntance: PrismaTransactionClient = prisma
) => {
    return await prismaIntance.launchVote.delete({
        where: {
            id,
        },
    });
};

export const createVote = async (
    userId: User['id'],
    launchId: LaunchVote['id'],
    prismaIntance: PrismaTransactionClient = prisma
) => {
    return await prismaIntance.launchVote.create({
        data: {
            launchId: launchId,
            userId: userId,
        },
    });
};
