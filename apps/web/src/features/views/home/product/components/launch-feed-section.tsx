import { ProductFeedSectionHeader } from '@/components/shared/product-feed';
import { Launch } from '@/models/launch.schema';
import { Product } from '@/models/product.schema';

import LaunchFeedNoItem from './launch-feed-no-item';
import LaunchItem from './launch-item';
import LaunchLoadMore from './launch-load-more';

interface LaunchFeedSectionProps {
    productId: Product['id'];
    launches: Launch[];
}

export default function LaunchFeedSection({ productId, launches }: LaunchFeedSectionProps) {
    return (
        <div className="flex flex-col gap-6">
            <ProductFeedSectionHeader
                title="Recent Launches"
                description="Discover what's been launching recently"
            />

            {!launches?.length ? (
                <LaunchFeedNoItem />
            ) : (
                <div className="flex flex-col gap-4">
                    {launches.map((item) => (
                        <LaunchItem item={item} key={item.id} />
                    ))}
                </div>
            )}

            {launches?.length > 0 ? (
                <LaunchLoadMore endpoint={`/products/${productId}/launches`} />
            ) : null}
        </div>
    );
}
