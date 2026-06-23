import { Suspense } from 'react';

import { getProductById } from '@/features/product/index.server';

import LaunchFeedSection from './launch-feed-section';
import { LauncheFeedSkeleton } from './launch-feed-skeleton';
import ProductDetails from './product-details';
import ProductHero from './product-hero';
import ProductNotFound from './product-not-found';

interface ProductSectionProps {
    id: number;
}

export default async function ProductSection({ id }: ProductSectionProps) {
    const product = await getProductById(id);

    if (!product) return <ProductNotFound />;

    return (
        <div className="flex flex-col gap-10">
            <ProductHero product={product} />
            <ProductDetails description={product.description} />
            <Suspense fallback={<LauncheFeedSkeleton />}>
                <LaunchFeedSection />
            </Suspense>
        </div>
    );
}
