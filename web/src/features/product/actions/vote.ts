'use server'

import { revalidateTag } from "next/cache";
import z from "zod";

import { Product } from "@/models/product.schema";
import { apiPatch } from "@/utils/api/api-client";

const voteResponseSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    isUpvoted: z.boolean(),
});

export type VoteResponse = z.infer<typeof voteResponseSchema>;

export async function toggleVoteAction(productId: Product['id']): Promise<VoteResponse> {
    const response = await apiPatch(`/products/${productId}/vote`, {}, voteResponseSchema);

    if (!response.success) {
        throw new Error("Vote failed")
    }

    revalidateTag(`product-${productId}`, 'max');
    return response;
};