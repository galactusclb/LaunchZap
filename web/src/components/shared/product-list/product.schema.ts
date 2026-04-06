import { ApiResponseSchema } from "@/models/api.interface";

import z from "zod";

export enum ProductStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED"
}

export const baseProductSchema = z.object({
    name: z.string().min(1).max(100),
    tagline: z.string().min(1).max(250),
    description: z.string().max(1000).optional(),
    
    websiteUrl: z.url(),
    logoUrl: z.url().optional(),
    launchDate: z.coerce.date()
});

export const createProductSchema = {
    body: baseProductSchema
};

export const productResponseSchema = baseProductSchema.extend({
    id: z.number(),
    createdAt: z.date(),
    updatedAt: z.date(),

    status: z.enum(ProductStatus),
    maker: z.object({
        id: z.string(),
        name: z.string()
    }).optional(),

    votesCount: z.number()
});

export const productListFullResponseSchema = ApiResponseSchema.extend({
    data: z.array(productResponseSchema)
})

// export type Product = z.infer<typeof baseProductSchema>;
export type Product = z.infer<typeof productResponseSchema>;
export type ProductListFullResponse = z.infer<typeof productListFullResponseSchema>
export type CreateProduct = z.infer<typeof createProductSchema.body>;