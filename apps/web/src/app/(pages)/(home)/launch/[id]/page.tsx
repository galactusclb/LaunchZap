import { Suspense } from 'react';

import { getDailyLaunches } from '@/features/launch/index.server';
import { LaunchPageContainer } from '@/features/views/home/launch';
import type { LaunchPageContainerProps } from '@/features/views/home/launch';
import { ProductIdParam } from '@/models/product.schema';

type ProductStaticParams = Record<keyof ProductIdParam, string>;

export async function generateStaticParams(): Promise<ProductStaticParams[]> {
    try {
        const launches = await getDailyLaunches();
        const params = (launches.data ?? []).map((l) => ({ id: l.slug }));
        return params.length > 0 ? params : [{ id: '_placeholder' }];
    } catch (error) {
        console.warn('API unreachable at build, falling back to ISR:', error);
        return [{ id: '_placeholder' }];
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
