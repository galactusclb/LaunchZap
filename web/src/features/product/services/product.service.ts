'use cache'

import { cacheLife, cacheTag } from "next/cache"
import { unstable_rethrow } from "next/navigation"

import { Product, ProductListFullResponse, productListFullResponseSchema, productSingleResponseSchema } from "@/models/product.schema"
import { ApiError } from "@/utils/api/api-error"
import { apiCacheable } from "@/utils/api/api-server"

export type ProductFeedResult = Pick<ProductListFullResponse, 'data' | 'meta'>

export async function getDailyProducts(): Promise<ProductFeedResult> {
    cacheLife('hours');
    cacheTag('products');

    return apiCacheable('/products?q=daily', productListFullResponseSchema);
}

export async function getWeeklyProducts(): Promise<ProductFeedResult> {
    cacheLife('days');
    cacheTag('products');

    return apiCacheable('/products?q=weekly', productListFullResponseSchema);
}

export async function getNewProducts(): Promise<ProductFeedResult> {
    cacheLife('minutes');
    cacheTag('products');

    return apiCacheable('/products?q=new', productListFullResponseSchema);
}

export async function getProductById(id: number): Promise<Product | null> {
    cacheLife('minutes');
    cacheTag('products', `product-${id}`);

    try {
        const response = await apiCacheable(`/products/${id}`, productSingleResponseSchema);
        return response.data ?? null;
    } catch (error) {
        unstable_rethrow(error);
        if (error instanceof ApiError && error.status === 404) return null;
        throw error;
    }
}