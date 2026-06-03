import { cookies } from 'next/headers';
import z from 'zod';

import { apiResponseSchema } from '@/models/api-response.schema';
import { productResponseSchema } from '@/models/product.schema';
import { apiServer } from '@/utils/api/api-server';

import { userQueries } from '../queries';

const myVotesResponseSchema = apiResponseSchema.single(
    z.array(z.object({ productId: productResponseSchema.shape.id }))
);

export const fetchVotesServer = async () => {
    const cookieStore = await cookies();
    if (!cookieStore.has('refresh_token')) return [];

    const response = await apiServer(userQueries.myVotes.endpoint, myVotesResponseSchema);
    return response.success ? response.data.map((v) => v.productId) : [];
};
