import { Rocket } from "lucide-react";

import { ProductFeedResult } from "@/features/product/index.server";

import ProductItem from "./product-item";
import ProductLoadMore from "./product-load-more";

interface ProductFeedSectionProps {
    endpoint: string,
    fetcher: () => Promise<ProductFeedResult>
}

export default async function ProductFeedSection({ endpoint, fetcher }: ProductFeedSectionProps) {
    const { data, meta } = await fetcher();

    return (
        <div className="flex flex-col gap-4 w-full">
            {!data?.length ? (
                <div className="flex flex-col items-center justify-center gap-4 rounded-2xl bg-muted/60 py-16 text-center">
                    <Rocket className="size-12 text-muted-foreground" aria-hidden="true" />
                    <div className="space-y-1.5">
                        <p className="text-base font-semibold text-foreground">No launches yet</p>
                        <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                            Check back soon — new products launch daily.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {data.map((item) => (
                        <ProductItem item={item} key={item.id} />
                    ))}
                </div>
            )}
            {meta && <ProductLoadMore endpoint={endpoint} initialMeta={meta} />}
        </div>
    );
}