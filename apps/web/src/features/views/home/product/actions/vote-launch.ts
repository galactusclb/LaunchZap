'use server';

import z from 'zod';

import { Launch } from '@/models/launch.schema';
import { Product } from '@/models/product.schema';
import { apiServer } from '@/utils/api/api-server';

const voteResponseSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    isUpvoted: z.boolean(),
});

export type LaunchVoteResponse = z.infer<typeof voteResponseSchema>;

export async function toggleLaunchVoteAction(
    productId: Product['id'],
    launchId: Launch['id']
): Promise<LaunchVoteResponse> {
    const response = await apiServer(
        `/products/${productId}/launches/${launchId}/vote`,
        voteResponseSchema,
        { method: 'PATCH' }
    );

    if (!response.success) throw new Error('Vote failed');
    return response;
}
