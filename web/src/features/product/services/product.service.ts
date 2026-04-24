'use cache'

import { cacheLife } from "next/cache"

import { Product, ProductListFullResponse, productListFullResponseSchema, productSingleResponseSchema } from "@/models/product.schema"
import { constants } from "@/utils/constants/server"

export type ProductFeedResult = Pick<ProductListFullResponse, 'data' | 'meta'>

async function fetchProducts(endpoint: string): Promise<ProductFeedResult> {
    const response = await fetch(`${constants.API.URL}${endpoint}`)

    if (!response.ok) throw new Error(`Failed to fetch from ${endpoint}`)

    const {data, meta} = productListFullResponseSchema.parse(await response.json())
    return { data, meta};
}

export async function getDailyProducts(): Promise<ProductFeedResult> {
    cacheLife('hours')

    return fetchProducts('/products?q=daily')
}

export async function getWeeklyProducts(): Promise<ProductFeedResult> {
    cacheLife('days')

    return fetchProducts('/products?q=weekly')
}

export async function getNewProducts(): Promise<ProductFeedResult> {
    cacheLife('minutes')

    return fetchProducts('/products?q=new')
}

export async function getProductById(id: number): Promise<Product> {
    cacheLife('minutes')

    const response = await fetch(`${constants.API.URL}/products/${id}`)
    if (!response.ok) throw new Error(`Failed to fetch product ${id}`)

    const { data } = productSingleResponseSchema.parse(await response.json())
    if (!data) throw new Error(`Product ${id} not found`)
    return data
}