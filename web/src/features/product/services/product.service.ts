'use cache'

import { cacheLife, cacheTag } from "next/cache"

import { Product, ProductListFullResponse, productListFullResponseSchema, productSingleResponseSchema } from "@/models/product.schema"
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

export async function getProductById(id: number): Promise<Product> {
    cacheLife('minutes');
    cacheTag('products', `product-${id}`);

    const response = await apiCacheable(`/products/${id}`, productSingleResponseSchema)
    if (!response.success) throw new Error(`Failed to fetch product ${id}`);

    if (!response.data) throw new Error(`Product ${id} not found`);
    return response.data;
}