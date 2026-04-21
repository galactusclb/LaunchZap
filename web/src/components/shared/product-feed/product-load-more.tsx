'use client'

import { useInfiniteQuery } from "@tanstack/react-query"
import { constants } from "@/utils/constants"
import { PaginationMeta } from "@/models/api.schema"
import { productListFullResponseSchema } from "@/models/product.schema"
import ProductItem from "./product-item"
import { Button } from "@/components/ui/button"

interface ProductLoadMoreProps {
    endpoint: string
    initialMeta: PaginationMeta
}

const fetchPage = async (endpoint: string, page: number) => {
    const res = await fetch(`${constants.API.BROWSER_URL}${endpoint}&page=${page}`)
    if (!res.ok) throw new Error(`Failed to fetch page ${page}`)
    const json = productListFullResponseSchema.parse(await res.json())
    return { data: json.data ?? [], meta: json.meta }
}

export default function ProductLoadMore({ endpoint, initialMeta }: ProductLoadMoreProps) {
    const hasMoreInitially = initialMeta.page < initialMeta.totalPages

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ['products-more', endpoint],
        queryFn: ({ pageParam }) => fetchPage(endpoint, pageParam),
        initialPageParam: 2,
        getNextPageParam: (lastPage) => {
            if (!lastPage.meta) return undefined
            const { page, totalPages } = lastPage.meta
            return page < totalPages ? page + 1 : undefined
        },
        enabled: false
    })

    const products = data?.pages.flatMap(p => p.data) ?? []
    const canLoadMore = data ? hasNextPage : hasMoreInitially

    if (!hasMoreInitially) return null

    return (
        <div className="flex flex-col gap-4">
            {products.map(item => (
                <ProductItem item={item} key={item.id} />
            ))}
            {canLoadMore && (
                <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                >
                    {isFetchingNextPage ? 'Loading...' : 'See all of top products'}
                </Button>
            )}
        </div>
    )
}
