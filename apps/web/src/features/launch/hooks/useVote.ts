'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { ROUTES } from '@/config/routes';
import { useMyVotes } from '@/features/user';
import { useAuthStore } from '@/store/auth.store';

import { toggleVoteAction } from '../actions/vote';

export default function useVote(id: number, initialVotes: number) {
    const queryClient = useQueryClient();
    const { data: votedIds } = useMyVotes();
    const isVoted = votedIds?.has(id) ?? false;
    const [votes, setVotes] = useState(initialVotes);

    const user = useAuthStore((state) => state.user);

    const router = useRouter();

    const { mutate, isPending } = useMutation({
        mutationFn: () => toggleVoteAction(id),
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ['users', 'me', 'votes'] });

            const previousVotedIds = queryClient.getQueryData<Set<number>>([
                'users',
                'me',
                'votes',
            ]);
            let previousCount = 0;

            queryClient.setQueryData(['users', 'me', 'votes'], (old: Set<number> = new Set()) => {
                const next = new Set(old);
                if (next.has(id)) next.delete(id);
                else next.add(id);
                return next;
            });

            setVotes((prev) => {
                previousCount = prev;
                return isVoted ? prev - 1 : prev + 1;
            });

            return { previousVotedIds, previousCount };
        },
        onError: (_, __, context) => {
            queryClient.setQueryData(['users', 'me', 'votes'], context?.previousVotedIds);
            setVotes(context?.previousCount ?? initialVotes);
            toast.error('Failed to vote. Please try again.');
        },
    });

    const handleVote = () => {
        if (!user) {
            return router.push(ROUTES.login);
        }

        mutate();
    };

    return { votes, isVoted, vote: handleVote, isPending };
}
