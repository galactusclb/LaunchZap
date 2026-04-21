import { cacheLife } from "next/cache"
import { constants } from "@/utils/constants"
import { ProductListFullResponse, productListFullResponseSchema } from "@/models/product.schema"

export type ProductFeedResult = Pick<ProductListFullResponse, 'data' | 'meta'>

async function fetchProducts(endpoint: string): Promise<ProductFeedResult> {
    const response = await fetch(`${constants.API.URL}${endpoint}`)

    if (!response.ok) throw new Error(`Failed to fetch from ${endpoint}`)

    const {data, meta} = productListFullResponseSchema.parse(await response.json())
    return { data, meta};
}

export async function getDailyProducts(): Promise<ProductFeedResult> {
    'use cache'
    cacheLife('hours')

    return fetchProducts('/products?q=daily')
}

export async function getWeeklyProducts(): Promise<ProductFeedResult> {
    'use cache'
    cacheLife('days')

    return fetchProducts('/products?q=weekly')
}

export async function getNewProducts(): Promise<ProductFeedResult> {
    'use cache'
    cacheLife('minutes')

    return fetchProducts('/products?q=new')
}
