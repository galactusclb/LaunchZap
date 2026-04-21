'use client'

import ItemButton from "@/components/shared/product-feed/item-button";
import useVote from "@/features/product/hooks/useVote";

interface LaunchVoteButtonProps {
    id: number;
    votesCount: number;
}

export default function LaunchVoteButton({ id, votesCount }: LaunchVoteButtonProps) {
    const { votes, isVoted, vote, isPending } = useVote(id, votesCount);

    return (
        <ItemButton
            size="hero"
            value={String(votes)}
            isVoted={isVoted}
            onClick={() => vote()}
            disabled={isPending}
        />
    );
}
