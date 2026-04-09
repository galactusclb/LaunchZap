import { Prisma } from "@/lib/prisma/generated/client"

export const getDateRange = (q: string): Date | undefined => {
    const now = new Date()
    const day = 1000 * 60 * 60 * 24

    const ranges: Record<string, Date> = {
        daily: new Date(now.getTime() - day),
        weekly: new Date(now.getTime() - day * 7),
        hot: new Date(now.getTime() - day * 2),
    }

    return ranges[q]
}

export const categoryFilter = (q: string): Prisma.ProductWhereInput => {
    if (q === 'new') return {};

    const since = getDateRange(q);
    if (!since) return {}

    return {
        OR: [
            { createdAt: { gte: since } },
            { votes: { some: { createdAt: { gte: since } } } }
        ]
    }
}

// export const categoryOrderBy = (q: string): Prisma.ProductOrderByWithRelationInput =>{
//     if(q === 'new') return { createdAt: 'desc' };

//     return {
//         votes: { _count: 'desc' }
//     }
// }