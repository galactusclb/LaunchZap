import { Prisma } from '@/lib/prisma/generated/client';

export const getMeSelect = {
    select: {
        id: true,
        email: true,
        name: true,
        pictureUrl: true,
        role: true,
    },
} satisfies Pick<Prisma.UserFindUniqueArgs, 'select'>;

export type MeWithSelect = Prisma.UserGetPayload<typeof getMeSelect>;

export const toMeDTO = (user: MeWithSelect) => user;

export type MeDTO = ReturnType<typeof toMeDTO>;
