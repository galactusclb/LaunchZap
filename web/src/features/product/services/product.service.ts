import { cacheLife } from "next/cache"
import { constants } from "@/utils/constants"
import { Product, ProductListFullResponse } from "@/components/shared/product-feed"

async function fetchProducts(endpoint: string): Promise<Product[]> {
    const response = await fetch(`${constants.API.URL}${endpoint}`)

    if (!response.ok) throw new Error(`Failed to fetch from ${endpoint}`)

    const json = await response.json() as ProductListFullResponse
    return json?.data ?? []
}

export async function getDailyProducts(): Promise<Product[]> {
    'use cache'
    cacheLife('hours')

    return fetchProducts('/products?q=daily')
}

export async function getWeeklyProducts(): Promise<Product[]> {
    'use cache'
    cacheLife('days')

    return fetchProducts('/products?q=weekly')
}

export async function getNewProducts(): Promise<Product[]> {
    'use cache'
    cacheLife('minutes')

    return fetchProducts('/products?q=new')
}
