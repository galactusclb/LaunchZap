import { Suspense } from 'react';

import {
    getDailyProducts,
    getNewProducts,
    getWeeklyProducts,
} from '@/features/product/index.server';
import { ProductPageContainer, ProductPageContainerProps } from '@/features/views/home/product';
import { ProductIdParam } from '@/models/product.schema';

type ProductStaticParams = Record<keyof ProductIdParam, string>;

//ToDo
export async function generateStaticParams(): Promise<ProductStaticParams[]> {
    try {
        const [newP, daily, weekly] = await Promise.all([
            getNewProducts(),
            getDailyProducts(),
            getWeeklyProducts(),
        ]);

        const ids = new Set([
            ...(newP.data?.map((p) => p.id) ?? []),
            ...(daily.data?.map((p) => p.id) ?? []),
            ...(weekly.data?.map((p) => p.id) ?? []),
        ]);

        const idList = Array.from(ids).map((id) => ({ id: String(id) }));

        return idList?.length > 0 ? idList : [{ id: '_placeholder' }];
    } catch (error) {
        console.warn('API unreachable at build, falling back to ISR:', error);
        return [{ id: '_placeholder' }];
    }
}

export default async function ProductItemPage({
    params,
}: {
    params: ProductPageContainerProps['params'];
}) {
    return (
        <Suspense>
            <ProductPageContainer params={params} />
        </Suspense>
    );
}
