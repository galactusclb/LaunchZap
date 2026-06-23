import { Prisma } from '@/lib/prisma/generated/client';
import { omit } from '@/utils/object';

export const getLaunchInclude = () =>
    ({
        include: {
            _count: {
                select: { launchVote: true },
            },
            product: {
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    logoUrl: true,
                    maker: { select: { id: true, name: true } },
                },
            },
        },
    }) satisfies Prisma.LaunchFindManyArgs;

export type LaunchWithRelations = Prisma.LaunchGetPayload<ReturnType<typeof getLaunchInclude>>;

export const toLaunchDTO = (p: LaunchWithRelations) => ({
    ...omit(p, ['_count', 'updatedAt']),
    votesCount: p._count.launchVote,
});

export type LaunchDTO = ReturnType<typeof toLaunchDTO>;
