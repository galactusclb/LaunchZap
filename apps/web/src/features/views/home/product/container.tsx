import { notFound } from 'next/navigation';

import { ProductIdParam, productIdParamSchema } from '@/models/product.schema';

import ProductAsyncBoundary from './components/product-async-boundary';
import ProductSection from './components/product-section';

export interface ProductPageContainerProps {
    params: Promise<ProductIdParam>;
}

export default async function ProductPageContainer({ params }: ProductPageContainerProps) {
    const parsedParams = productIdParamSchema.safeParse(await params);

    if (!parsedParams.success) notFound();

    const { id } = parsedParams.data;

    return (
        <div className="w-full mx-auto">
            <ProductAsyncBoundary>
                <ProductSection id={id} />
            </ProductAsyncBoundary>
        </div>
    );
}
