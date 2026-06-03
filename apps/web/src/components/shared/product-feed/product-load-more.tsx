'use client';

import { useInfiniteQuery } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { ApiMeta } from '@/models/api-response.schema';
import { productListFullResponseSchema } from '@/models/product.schema';
import { apiGet } from '@/utils/api/api-client';

import ProductItem from './product-item';

interface ProductLoadMoreProps {
    endpoint: string;
    initialMeta: ApiMeta;
}

const fetchPage = async (endpoint: string, page: number) => {
    const res = await apiGet(`${endpoint}&page=${page}`, productListFullResponseSchema);
    if (!res.success) throw new Error(`Failed to fetch page ${page}`);
    return { data: res.data ?? [], meta: res.meta };
};

export default function ProductLoadMore({ endpoint, initialMeta }: ProductLoadMoreProps) {
    const hasMoreInitially = initialMeta.page < initialMeta.totalPages;

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ['products-more', endpoint],
        queryFn: ({ pageParam }) => fetchPage(endpoint, pageParam),
        initialPageParam: 2,
        getNextPageParam: (lastPage) => {
            if (!lastPage.meta) return undefined;
            const { page, totalPages } = lastPage.meta;
            return page < totalPages ? page + 1 : undefined;
        },
        enabled: false,
    });

    const products = data?.pages.flatMap((p) => p.data) ?? [];
    const canLoadMore = data ? hasNextPage : hasMoreInitially;

    if (!hasMoreInitially) return null;

    return (
        <div className="flex flex-col gap-4">
            {products.map((item) => (
                <ProductItem item={item} key={item.id} />
            ))}
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
