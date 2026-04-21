import { useAuthStore } from "@/store/auth.store";
import { constants } from "@/utils/constants";
import { useQuery } from "@tanstack/react-query";
import { ApiResponseSchema } from "@/models/api.schema";
import z from "zod";
import { productResponseSchema } from "@/models/product.schema";

const myVotesResponseSchema = ApiResponseSchema.extend({
    data: z.array(z.object({ productId: productResponseSchema.shape.id }))
});

export default function useMyVotes(){
    const user = useAuthStore(store=>store.user);

    return useQuery({
        queryKey: ['users', 'me', 'votes'],
        queryFn: async () => {
            const res = await fetch(`${constants.API.BROWSER_URL}/users/me/votes`, {
                credentials: 'include',
            });
            if (!res.ok) throw new Error("Failed to fetch votes");

            const json = await res.json();
            const parsed = myVotesResponseSchema.parse(json);
            return new Set(parsed.data.map(v => v.productId));
        },
        enabled: !!user,
    });
}