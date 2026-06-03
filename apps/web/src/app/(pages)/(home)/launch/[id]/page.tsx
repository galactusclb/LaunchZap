import { Suspense } from 'react';

import {
    getDailyProducts,
    getNewProducts,
    getWeeklyProducts,
} from '@/features/product/index.server';
import { LaunchPageContainer } from '@/features/views/home/launch';
import type { LaunchPageContainerProps } from '@/features/views/home/launch';
import { ProductIdParam } from '@/models/product.schema';

type ProductStaticParams = Record<keyof ProductIdParam, string>;

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

        return Array.from(ids).map((id) => ({ id: String(id) }));
    } catch (error) {
        console.warn('API unreachable at build, falling back to ISR:', error);
        return [];
    }
}

export default async function LaunchItemPage({
    params,
}: {
    params: LaunchPageContainerProps['params'];
}) {
    return (
        <Suspense>
            <LaunchPageContainer params={params} />
        </Suspense>
    );
}
