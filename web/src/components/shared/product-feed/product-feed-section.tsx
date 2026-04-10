import ProductFeedSectionHeader, { ProductFeedSectionHeaderProps } from "./product-feed-section-header";
import { Product } from "./product-feed.schema";
import ProductItem from "./product-item";

interface ProductFeedSectionProps {
    header: ProductFeedSectionHeaderProps,
    fetcher: () => Promise<Product[]>
}

export default async function ProductFeedSection({
    header,
    fetcher
}: ProductFeedSectionProps) {
    const data = await fetcher();

    return (
        <div className="flex flex-col gap-6 w-full">
            <ProductFeedSectionHeader {...header} />
            {!data.length ? (
                (
                    <p className="text-muted-foreground">No products yet. Check back soon.</p>
                )
            ) : (
                <div className="flex flex-col gap-4">
                    {
                        data?.map((item) => {
                            return (
                                <ProductItem item={item} key={item.id} />
                            )
                        })
                    }
                </div>
            )}
        </div>
    )
}