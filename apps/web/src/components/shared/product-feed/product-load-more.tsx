'use client';

import { ApiMeta } from '@/models/api-response.schema';
import { Product, productListFullResponseSchema } from '@/models/product.schema';
import { apiGet } from '@/utils/api/api-client';

import FeedLoadMore from '../feed-load-more';

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
    return (
        <FeedLoadMore<Product>
            queryKey={['products-more', endpoint]}
            fetchPage={(page) => fetchPage(endpoint, page)}
            renderItem={(item) => <ProductItem item={item} key={item.id} />}
            initialMeta={initialMeta}
        />
    );
}
