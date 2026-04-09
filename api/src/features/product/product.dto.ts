import { Prisma } from "@/lib/prisma/generated/client";

// export const productInclude = {
//     include: {
//         maker: { select: { id: true, name: true } },
//         _count: { select: { votes: true } }
//     }
// } satisfies Prisma.ProductFindManyArgs

export const getProductInclude = (since?: Date) => ({
    include: {
        maker: {select: {id: true, name: true}},
        _count: {
            select: {
                votes: {
                    where: since ? {createdAt: {gte: since}} : undefined
                }
            }
        }
    }
}) satisfies Prisma.ProductFindManyArgs

export type ProductWithRelations = Prisma.ProductGetPayload<ReturnType <typeof getProductInclude>>

export const toProductDTO = ({ _count, maker, ...rest }: ProductWithRelations) => ({
    ...rest,
    votesCount: _count.votes,
    makerId: undefined
});

export type ProductDTO = ReturnType<typeof toProductDTO>;