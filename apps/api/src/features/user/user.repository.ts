import { User } from '@/lib/prisma/generated/client';
import prisma from '@/lib/prisma/prisma';

export const findVotedProductsByUser = async (userId: User['id']) => {
    return await prisma.vote.findMany({
        where: { userId },
        select: {
            productId: true,
        },
    });
};
