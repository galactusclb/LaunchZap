import { ProductFeedResult } from "@/features/product/services/product.service";
import ProductFeedSectionHeader, { ProductFeedSectionHeaderProps } from "./product-feed-section-header";
import ProductItem from "./product-item";
import ProductLoadMore from "./product-load-more";

interface ProductFeedSectionProps {
    header: ProductFeedSectionHeaderProps,
    endpoint: string,
    fetcher: () => Promise<ProductFeedResult>
}

export default async function ProductFeedSection({
    header,
    endpoint,
    fetcher
}: ProductFeedSectionProps) {
    const { data, meta } = await fetcher();

    return (
        <div className="flex flex-col gap-6 w-full">
            <ProductFeedSectionHeader {...header} />
            {!data.length ? (
                <p className="text-muted-foreground">No products yet. Check back soon.</p>
            ) : (
                <div className="flex flex-col gap-4">
                    {data.map((item) => (
                        <ProductItem item={item} key={item.id} />
                    ))}
                </div>
            )}
            {meta && <ProductLoadMore endpoint={endpoint} initialMeta={meta} />}
        </div>
    )
}