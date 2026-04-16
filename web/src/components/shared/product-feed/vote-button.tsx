'use client'

import { useOptimistic, useTransition } from "react";
import { toast } from "sonner";
import ItemButton from "./item-button";
import { Product } from "./product-feed.schema";
import { toggleVoteAction } from "@/features/product/actions/vote";
import useMyVotes from "@/features/user/hooks/useMyVotes";

type VoteButtonProps = Pick<Product, "id" | "votesCount">

export default function VoteButton({id, votesCount: initialVotes}: VoteButtonProps){

    const { data: votedIds } = useMyVotes();
    const isVoted = votedIds?.has(id) ?? false;

    const [optimisticVotes, setOptimisticVotes] = useOptimistic<number>(initialVotes);
    const [optimisticVoted, setOptimisticVoted] = useOptimistic<boolean>(isVoted);
    const [isPending, startTransition] = useTransition();

    const handleVote = () => {
        startTransition(async () => {
            setOptimisticVotes(optimisticVoted ? optimisticVotes - 1 : optimisticVotes + 1);
            setOptimisticVoted(!optimisticVoted);

            try {
                const res= await toggleVoteAction(id);
                console.log('res', res)
            } catch {
                setOptimisticVotes(initialVotes);
                setOptimisticVoted(isVoted);
                toast.error("Failed to vote. Please try again.");
            }
        })
    }

    return (
        <ItemButton
            value={String(optimisticVotes)}
            isVoted={optimisticVoted}
            onClick={handleVote}
            disabled={isPending}
        />
    )
}