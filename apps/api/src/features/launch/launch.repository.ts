import { Prisma, Launch } from '@/lib/prisma/generated/client';
import prisma, { PrismaTransactionClient } from '@/lib/prisma/prisma';
import { constants } from '@/utils/constant';
import { paginate } from '@/utils/paginate-helpers';

import { getLaunchInclude } from './launch.dto';
import { LaunchFilterQuery } from './launch.schema';

const defaultStatus = constants.launchStatus.PUBLISHED;

const buildDateRangeWhere = (q?: string): Prisma.LaunchWhereInput => {
    const now = new Date();

    if (q === 'daily') {
        const start = new Date(now);
        start.setHours(0, 0, 0, 0);
        const end = new Date(now);
        end.setHours(23, 59, 59, 999);
        return { launchDate: { gte: start, lte: end } };
    }

    if (q === 'weekly') {
        const start = new Date(now);
        start.setDate(now.getDate() - 7);
        return { launchDate: { gte: start } };
    }

    return {};
};

export const findAll = async (query: LaunchFilterQuery) => {
    const where: Prisma.LaunchWhereInput = {
        status: defaultStatus,
        ...(query.search && {
            OR: [
                { tagline: { contains: query.search, mode: 'insensitive' } },
                { product: { name: { contains: query.search, mode: 'insensitive' } } },
            ],
        }),
        ...buildDateRangeWhere(query.q),
    };

    const orderBy: Prisma.LaunchOrderByWithRelationInput =
        query.sortBy === 'votes'
            ? { launchVote: { _count: query.sortOrder } }
            : query.q === 'new'
              ? { createdAt: query.sortOrder }
              : { launchDate: query.sortOrder };

    const [data, total] = await Promise.all([
        prisma.launch.findMany({
            where,
            orderBy,
            ...getLaunchInclude(),
            ...paginate(query),
        }),
        prisma.launch.count({ where }),
    ]);

    return { data, total };
};

export const findBySlug = async (
    slug: Launch['slug'],
    prismaInstance: PrismaTransactionClient = prisma
) => {
    return prismaInstance.launch.findFirst({
        where: { slug, status: defaultStatus },
        include: getLaunchInclude().include,
    });
};
