import { cacheLife } from "next/cache";
import ProductItem from "./product-item";
import { Product, ProductListFullResponse } from "./product-feed.schema";
import { constants } from "@/utils/constants";
import ProductFeedSectionHeader, { ProductFeedSectionHeaderProps } from "./product-feed-section-header";

interface ProductFeedSectionProps {
    header: ProductFeedSectionHeaderProps,
    fetcher: ()=> Promise<Product[]>
}

export default async function ProductFeedSection({
    header,
    fetcher
}: ProductFeedSectionProps){
    const data = await fetcher();

    return (
        <div className="flex flex-col gap-6 w-full">
            <ProductFeedSectionHeader {...header} />
            <div className="flex flex-col gap-4">
                {
                    data?.map((item, key) => {
                        return (
                            <ProductItem item={item} key={key} />
                        )
                    })
                }
            </div>
        </div>
    )
}