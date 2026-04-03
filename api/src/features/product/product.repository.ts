import prisma from "@/lib/prisma/prisma.ts"
import { CreateProduct } from "./product.schema"

export const findAll = async () => {
    return await prisma.product.findMany()
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