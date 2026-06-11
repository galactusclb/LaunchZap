import { Prisma } from '@/lib/prisma/generated/client';
import { omit } from '@/utils/object';

export const getProductInclude = (since?: Date) =>
    ({
        include: {
            maker: { select: { id: true, name: true } },
            _count: {
                select: {
                    votes: {
                        where: since ? { createdAt: { gte: since } } : undefined,
                    },
                },
            },
        },
    }) satisfies Prisma.ProductFindManyArgs;

export type ProductWithRelations = Prisma.ProductGetPayload<ReturnType<typeof getProductInclude>>;

export const toProductDTO = (p: ProductWithRelations) => ({
    ...omit(p, ['makerId', '_count', 'updatedAt']),
    votesCount: p._count.votes,
});

export type ProductDTO = ReturnType<typeof toProductDTO>;
