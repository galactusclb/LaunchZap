import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { toggleVoteAction } from "@/features/product/actions/vote";
import useMyVotes from "@/features/user/hooks/useMyVotes";

export default function useVote(id: number, initialVotes: number) {
    const queryClient = useQueryClient();
    const { data: votedIds } = useMyVotes();
    const isVoted = votedIds?.has(id) ?? false;
    const [votes, setVotes] = useState(initialVotes);

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

    return { votes, isVoted, vote: mutate, isPending };
}
