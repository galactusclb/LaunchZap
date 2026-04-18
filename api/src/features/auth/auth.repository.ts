import { User } from "./auth.schema";
import { getMeSelect } from "./auth.dto";

import prisma from "@/lib/prisma/prisma";


export async function findUserByGoogleSub(sub?: string | null){
    if (!sub) return;

    return await prisma.user.findUnique({
        where: {
            googleSub: sub
        }
    })
}

export async function findUserByEmail(email: string) {
    return await prisma.user.findUnique({
        where: {email}
    })
}

export async function updateUserById(
    existingProfile: { id: string; name?: string | null; pictureUrl?: string | null },
    loggedProfile: { email: string; name?: string | null; pictureUrl?: string | null }
) {
    return await prisma.user.update({
        where: { id: existingProfile.id},
        data: {
            email: loggedProfile.email,
            name: loggedProfile.name ?? existingProfile.name ?? undefined,
            pictureUrl: loggedProfile.pictureUrl ?? existingProfile.pictureUrl,
            lastLoginAt: new Date(),
        }
    })
}

export async function updateUserByEmail(
    existingProfile: { id: string; name?: string | null; pictureUrl?: string | null },
    loggedProfile: { googleSub?: string | null; name?: string | null; pictureUrl?: string | null }
) {
    return await prisma.user.update({
        where: { id: existingProfile.id},
        data: {
            googleSub: loggedProfile.googleSub,
            name: loggedProfile.name ?? existingProfile.name ?? undefined,
            pictureUrl: loggedProfile.pictureUrl ?? existingProfile.pictureUrl,
            lastLoginAt: new Date(),
        }
    })
}

export async function findMe(id: string) {
    return prisma.user.findUnique({
        where: { id },
        ...getMeSelect,
    });
}

export async function createUser(user:Pick<User, "name" | "email" | "googleSub" | "pictureUrl">) {
    return await prisma.user.create({
      data: {
        name: user.name ?? null,
        email: user.email,
        emailVerified: true,
        googleSub: user.googleSub,
        pictureUrl: user.pictureUrl ?? null,
        lastLoginAt: new Date(),
      }
    })
}