import prisma from "@/lib/prisma/prisma.ts"

export const findAll = async () => {
    return await prisma.product.findMany()
}