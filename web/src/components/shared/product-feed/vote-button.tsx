'use client'

import ItemButton from "./item-button";
import { Product } from "./product-feed.schema";
import useVote from "@/features/product/hooks/useVote";

type VoteButtonProps = Pick<Product, "id" | "votesCount">

export default function VoteButton({ id, votesCount: initialVotes }: VoteButtonProps) {
    const { votes, isVoted, vote, isPending } = useVote(id, initialVotes);

    return (
        <ItemButton
            value={String(votes)}
            isVoted={isVoted}
            onClick={() => vote()}
            disabled={isPending}
        />
    );
}
