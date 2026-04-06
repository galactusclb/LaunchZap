import { cacheLife } from "next/cache";
import ProductItem from "./product-item";
import { Product, ProductListFullResponse } from "./product-feed.schema";
import { constants } from "@/utils/constants";

async function getProducts(): Promise<Product[]>  {
    'use cache'
    cacheLife('hours');

    const response = await fetch(`${constants.API.BASE_URL}/products`);
    if(!response.ok) throw new Error('Failed to fetch products')

    const json = await response.json() as ProductListFullResponse;

    return json?.data
}

interface ProductFeedSectionProps {
    title: string,
    fetcher: ()=> Promise<Product[]>
}

export default async function ProductFeedSection({
    title,
    fetcher
}: ProductFeedSectionProps){
    const data = await getProducts();

    return (
        <div className="flex flex-col gap-4">
            {
                data?.map((item, key) => {
                    return (
                        <ProductItem item={item} key={key} />
                    )
                })
            }
        </div>
    )
}