import { Product } from "@/components/shared/product-feed";
import { constants } from "@/utils/constants";
import z from "zod";

const voteResponseSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    isUpvoted: z.boolean(),
});

export type VoteResponse = z.infer<typeof voteResponseSchema>;

export async function toggleVoteAction(productId: Product['id']): Promise<VoteResponse> {
    const response = await fetch(`${constants.API.BROWSER_URL}/products/${productId}/vote`, {
        method: 'PATCH',
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error("Vote failed")
    }

    const json = await response.json();
    return voteResponseSchema.parse(json);
}
