import { Prisma } from '@/lib/prisma/generated/client';
import { omit } from '@/utils/object';

export const getLaunchInclude = () =>
    ({
        include: {
            _count: {
                select: {
                    launchVote: true,
                },
            },
            product: {
                select: {
                    maker: { select: { id: true, name: true } },
                    logoUrl: true,
                    tagline: true,
                },
            },
        },
    }) satisfies Prisma.LaunchFindManyArgs;

export type ProductWithRelations = Prisma.LaunchGetPayload<ReturnType<typeof getLaunchInclude>>;

export const toLaunchDTO = (p: ProductWithRelations) => ({
    ...omit(p, ['_count', 'updatedAt']),
    votesCount: p._count.launchVote,
});

export type ProductDTO = ReturnType<typeof toLaunchDTO>;
