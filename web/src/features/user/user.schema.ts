import { ApiResponseSchema } from "@/models/api.interface";
import { productResponseSchema } from "@/features/product/product.schema";
import z from "zod";

export const myVotesResponseSchema = ApiResponseSchema.extend({
    data: z.array(z.object({ productId: productResponseSchema.shape.id }))
});

export type MyVotesResponse = z.infer<typeof myVotesResponseSchema>;
