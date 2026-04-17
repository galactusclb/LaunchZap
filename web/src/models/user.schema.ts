import { ApiResponseSchema } from "@/models/api.interface";
import z from "zod";
import { productResponseSchema } from "./product.schema";

export const myVotesResponseSchema = ApiResponseSchema.extend({
    data: z.array(z.object({ productId: productResponseSchema.shape.id }))
});

export type MyVotesResponse = z.infer<typeof myVotesResponseSchema>;
