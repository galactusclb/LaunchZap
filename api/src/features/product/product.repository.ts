import prisma from "@/lib/prisma/prisma.ts"

export const findAll = async () => {
    return await prisma.product.findMany()
}

export const findByName = async (name: string)=>{
    return await prisma.product.findUnique({
        where: {
            id: "12"
        }
    })
}