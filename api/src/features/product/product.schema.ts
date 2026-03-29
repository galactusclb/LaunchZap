import { trimmedString } from "@/lib/zod/extras.ts";
import {} from "@/lib/prisma/"
import z from "zod";

export const baseProductSchema = z.object({
    name: trimmedString.min(1).max(100),
    tagline: trimmedString.min(1).max(250),
    description: trimmedString.max(1000).optional(),
    
    websiteUrl : z.string().url(),
    logoUrl : z.string().url().optional(),
    launchDate : z.coerce.date()
});

export const createProductSchema = {
    body: baseProductSchema
}

export const productResponseSchema = baseProductSchema.extend({
    id: z.number(),
    createdAt: z.date(),
    updatedAt: z.date(),

    status: ProductStatus
})

export type Product = z.infer<typeof baseProductSchema>;