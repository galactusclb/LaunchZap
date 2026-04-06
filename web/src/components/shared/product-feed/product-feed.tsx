import { Product } from "./product-feed.schema"
import ProductItem from "./product-item"

interface ProductFeedProps {
    products: Product[]
}

export default async function ProductFeed({ products }: ProductFeedProps) {

    return (
        <div className="flex flex-col gap-4">
            {
                products?.map((item, key) => {
                    return (
                        <ProductItem item={item} key={key} />
                    )
                })
            }
        </div>
    )
}