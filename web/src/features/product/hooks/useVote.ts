'use client'

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { toggleVoteAction } from "@/features/product/actions/vote";
import useMyVotes from "@/features/user/hooks/useMyVotes";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";

export default function useVote(id: number, initialVotes: number) {
    const queryClient = useQueryClient();
    const { data: votedIds } = useMyVotes();
    const isVoted = votedIds?.has(id) ?? false;
    const [votes, setVotes] = useState(initialVotes);

    const user = useAuthStore(state=>state.user);

    const router = useRouter();

    const { mutate, isPending } = useMutation({
        mutationFn: () => toggleVoteAction(id),
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ['users', 'me', 'votes'] });

            const previousVotedIds = queryClient.getQueryData<Set<number>>(['users', 'me', 'votes']);
            let previousCount = 0;

            queryClient.setQueryData(['users', 'me', 'votes'], (old: Set<number> = new Set()) => {
                const next = new Set(old);
                if (next.has(id)) next.delete(id); else next.add(id);
                return next;
            });

            setVotes(prev => { previousCount = prev; return isVoted ? prev - 1 : prev + 1; });

            return { previousVotedIds, previousCount };
        },
        onError: (_, __, context) => {
            queryClient.setQueryData(['users', 'me', 'votes'], context?.previousVotedIds);
            setVotes(context?.previousCount ?? initialVotes);
            toast.error("Failed to vote. Please try again.");
        },
    });

    const handleVote = ()=>{
        if(!user) {
            return router.push('/login')
        };

        mutate()
    }

    return { votes, isVoted, vote: handleVote, isPending };
}
