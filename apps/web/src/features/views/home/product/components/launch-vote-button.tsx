'use client';

import ItemButton from '@/components/shared/product-feed/item-button';
import { useVote } from '@/features/product';
import { Launch } from '@/models/launch.schema';
import { Product } from '@/models/product.schema';
import useVoteLaunch from '../hooks/useVoteLaunch';

interface LaunchVoteButtonProps {
    productId: Product['id'];
    launchId: Launch['id'];
    votesCount: number;
}

export default function LaunchVoteButton({
    productId,
    launchId,
    votesCount,
}: LaunchVoteButtonProps) {
    const { votes, isVoted, vote, isPending } = useVoteLaunch(productId, launchId, votesCount);

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
