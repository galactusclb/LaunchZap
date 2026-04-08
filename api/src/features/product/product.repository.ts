import prisma from "@/lib/prisma/prisma.ts"
import { CreateProduct, ProductFilterQuery } from "./product.schema"
import { Prisma } from "@/lib/prisma/generated/client"
import { paginate } from "@/utils/paginate-helpers"

export const findAll = async (query: ProductFilterQuery) => {
    const where: Prisma.ProductWhereInput = {
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

    const orderBy: Prisma.ProductOrderByWithRelationInput = query.sortBy 
        ? {[query.sortBy]: query.sortOrder}
        : { createdAt: query.sortOrder}
    
    const [data, total] = await prisma.$transaction([
        prisma.product.findMany({
            where,
            orderBy,
            ...paginate(query)
        }),
        prisma.product.count({where})
    ]);
    
    return {data, total}
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