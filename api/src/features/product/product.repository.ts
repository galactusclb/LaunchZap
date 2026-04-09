import prisma from "@/lib/prisma/prisma.ts"
import { CreateProduct, ProductFilterQuery } from "./product.schema"
import { Prisma } from "@/lib/prisma/generated/client"
import { paginate } from "@/utils/paginate-helpers"
import { categoryFilter, getDateRange } from "./product.utils"
import { getProductInclude } from "./product.dto"

export const findAll = async (query: ProductFilterQuery) => {
    const where: Prisma.ProductWhereInput = {
        ...categoryFilter(query.q ?? ''),
        ...(query.search && {
            OR: [
                {name: {contains: query.search, mode: "insensitive"}},
                {tagline: {contains: query.search, mode: "insensitive"}}
            ]
        }),
        ...(query.status && {status: query.status}),
        ...((query.launchDataFrom || query.launchDateTo)  && {
            launchDate: {
                ...(query.launchDataFrom && {gte: query.launchDataFrom}),
                ...(query.launchDateTo && {lte: query.launchDateTo})
            }
        })
    }

    // const orderBy: Prisma.ProductOrderByWithRelationInput = query.sortBy 
    //     ? {[query.sortBy]: query.sortOrder}
    //     : { createdAt: query.sortOrder}
    // const orderBy = categoryOrderBy(query.q ?? '')
    
    const [data, total] = await prisma.$transaction([
        prisma.product.findMany({
            where,
            // orderBy,
            ...getProductInclude(getDateRange(query.q ?? '')),
            ...paginate(query)
        }),
        prisma.product.count({where})
    ]);
    
    const sorted = data.sort((a,b)=>a._count.votes - b._count.votes)
    return {data: sorted, total}
}

export const findByName = async (name: string)=>{
    return await prisma.product.findFirst({
        where: {
            name
        }
    })
}

export const createProduct = async (input: CreateProduct)=>{
    return await prisma.product.create({
        data: {
            name: input.name,
            description: input.description ?? "",
            tagline: input.tagline,
            websiteUrl: input.websiteUrl,
            launchDate: input.launchDate,
        }
    })
}