import { ProductFeedSection, ProductFeedSectionHeader } from '@/components/shared/product-feed';
import { getDailyProducts } from '@/features/product/index.server';

export default function LaunchFeedSection() {
    return (
        <div className="flex flex-col gap-6">
            <ProductFeedSectionHeader
                title="Recent Launches"
                description="Discover what's been launching recently"
            />
            <ProductFeedSection endpoint="/products?q=daily" fetcher={getDailyProducts} />
        </div>
    );
}
