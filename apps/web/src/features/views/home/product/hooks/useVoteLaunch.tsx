'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { ROUTES } from '@/config/routes';
import { Launch } from '@/models/launch.schema';
import { Product } from '@/models/product.schema';
import { useAuthStore } from '@/store/auth.store';

import { toggleLaunchVoteAction } from '../actions/vote-launch';

export default function useVoteLaunch(
    productId: Product['id'],
    launchId: Launch['id'],
    initialVotes: number
) {
    const [votes, setVotes] = useState(initialVotes);
    const [isVoted, setIsVoted] = useState(false);
    const user = useAuthStore((state) => state.user);
    const router = useRouter();

    const { mutate, isPending } = useMutation({
        mutationFn: () => toggleLaunchVoteAction(productId, launchId),
        onMutate: () => {
            setVotes((prev) => (isVoted ? prev - 1 : prev + 1));
            setIsVoted((prev) => !prev);
        },
        onError: () => {
            setVotes(initialVotes);
            setIsVoted(false);
            toast.error('Failed to vote. Please try again.');
        },
    });

    return {
        votes,
        isVoted,
        vote: () => {
            if (!user) return router.push(ROUTES.login);
            mutate();
        },
        isPending,
    };
}
