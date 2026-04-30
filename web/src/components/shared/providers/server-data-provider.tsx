

import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { ReactNode } from "react";

import { fetchMeServer } from "@/features/auth/index.server";
import { fetchVotesServer } from "@/features/user/index.server";

export default async function ServerDataProvider({
    children
}: { children: ReactNode }) {

    const queryClient = new QueryClient();

    await Promise.all([
        queryClient.prefetchQuery({ queryKey: ['me'], queryFn: fetchMeServer }),
        queryClient.prefetchQuery({ queryKey: ['users', 'me', 'votes'], queryFn: fetchVotesServer }),
    ]);

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            {children}
        </HydrationBoundary>
    )
}