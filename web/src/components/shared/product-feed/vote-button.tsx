'use client'

import { useOptimistic, useTransition } from "react";
import { toast } from "sonner";
import ItemButton from "./item-button";
import { Product } from "./product-feed.schema";
import { toggleVoteAction } from "@/features/product/actions/vote";

type VoteButtonProps = Pick<Product, "id" | "votesCount">

export default function VoteButton({id, votesCount: initialVotes}: VoteButtonProps){

    const [optimisticVotes, setOptimisticVotes] = useOptimistic<number>(initialVotes);
    const [isPending, startTransition] = useTransition();

    const handleVote = ()=>{
        startTransition( async ()=>{
            setOptimisticVotes(optimisticVotes+1);

            try {
                const result = await toggleVoteAction(id);
                if (!result.isUpvoted) setOptimisticVotes(optimisticVotes - 1);
            } catch {
                setOptimisticVotes(initialVotes);
                toast.error("Failed to vote. Please try again.");
            }
        })
    }

    return (
        <ItemButton 
            value={String(optimisticVotes)}
            onClick={handleVote}
            disabled={isPending}
        />
    )
}