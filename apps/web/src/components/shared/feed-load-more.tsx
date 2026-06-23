'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { ApiMeta } from '@/models/api-response.schema';

interface FeedLoadMoreProps<T extends { id: string | number }> {
    queryKey: string[];
    fetchPage: (page: number) => Promise<{ data: T[]; meta: ApiMeta | undefined }>;
    renderItem: (item: T) => ReactNode;
    initialMeta?: ApiMeta;
}

export default function FeedLoadMore<T extends { id: string | number }>({
    queryKey,
    fetchPage,
    renderItem,
    initialMeta,
}: FeedLoadMoreProps<T>) {
    const hasMoreInitially = initialMeta ? initialMeta.page < initialMeta.totalPages : true;

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey,
        queryFn: ({ pageParam }) => fetchPage(pageParam),
        initialPageParam: 2,
        getNextPageParam: (lastPage) => {
            if (!lastPage.meta) return undefined;
            const { page, totalPages } = lastPage.meta;
            return page < totalPages ? page + 1 : undefined;
        },
        enabled: false,
    });

    const items = data?.pages.flatMap((p) => p.data) ?? [];
    const canLoadMore = data ? hasNextPage : hasMoreInitially;

    if (!canLoadMore && !items.length) return null;

    return (
        <div className="flex flex-col gap-4">
            {items.map((item) => renderItem(item))}
            {canLoadMore && (
                <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                >
                    {isFetchingNextPage ? 'Loading...' : 'Load more'}
                </Button>
            )}
        </div>
    );
}
