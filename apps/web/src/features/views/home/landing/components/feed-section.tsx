import { ProductFeedSection, ProductFeedSectionHeader } from '@/components/shared/product-feed';
import { ProductFeedResult } from '@/features/product/index.server';

import FeedAsyncBoundary from './feed-async-boundary';

interface FeedSectionProps {
    title: string;
    description: string;
    endpoint: string;
    fetcher: () => Promise<ProductFeedResult>;
}

export default function FeedSection({ title, description, endpoint, fetcher }: FeedSectionProps) {
    return (
        <div className="flex flex-col gap-6">
            <ProductFeedSectionHeader title={title} description={description} />
            <FeedAsyncBoundary>
                <ProductFeedSection endpoint={endpoint} fetcher={fetcher} />
            </FeedAsyncBoundary>
        </div>
    );
}
