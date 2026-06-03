'use server';

import { revalidateTag } from 'next/cache';
import z from 'zod';

import { Product } from '@/models/product.schema';
import { apiServer } from '@/utils/api/api-server';

const voteResponseSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    isUpvoted: z.boolean(),
});

export type VoteResponse = z.infer<typeof voteResponseSchema>;

export async function toggleVoteAction(productId: Product['id']): Promise<VoteResponse> {
    const response = await apiServer(`/products/${productId}/vote`, voteResponseSchema, {
        method: 'PATCH',
    });

    if (!response.success) {
        throw new Error('Vote failed');
    }

    revalidateTag(`product-${productId}`, 'max');
    return response;
}
