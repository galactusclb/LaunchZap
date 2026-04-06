import { cacheLife } from "next/cache";
import ProductItem from "./product-item";
import { Product, ProductListFullResponse } from "./product.schema";
import { constants } from "@/utils/constants";

async function getProducts(): Promise<Product[]>  {
    'use cache'
    cacheLife('hours');

    const response = await fetch(`${constants.API.BASE_URL}/products`);
    const json = await response.json() as ProductListFullResponse;

    return json?.data
}

export default async function ProductList(){
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