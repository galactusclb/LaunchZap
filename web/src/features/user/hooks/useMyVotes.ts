import { useAuthStore } from "@/store/auth.store";
import { useQuery } from "@tanstack/react-query";
import { apiResponseSchema } from "@/models/api-response.schema";
import z from "zod";
import { productResponseSchema } from "@/models/product.schema";
import { apiGet } from "@/utils/api/api-client";

const myVotesResponseSchema = apiResponseSchema.list(z.object({ productId: productResponseSchema.shape.id }));

export default function useMyVotes(){
    const user = useAuthStore(store=>store.user);

    return useQuery({
        queryKey: ['users', 'me', 'votes'],
        queryFn: async () => {
            const parsed = await apiGet('/users/me/votes', myVotesResponseSchema);
            if (!parsed.success) throw new Error(parsed.error.message);
            return new Set(parsed.data.map(v => v.productId));
        },
        enabled: !!user,
    });
}