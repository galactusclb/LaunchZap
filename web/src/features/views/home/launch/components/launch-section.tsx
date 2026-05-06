import { getProductById } from "@/features/product/index.server";

import LaunchDetails from "./launch-details";
import LaunchHero from "./launch-hero";
import LaunchNotFound from "./launch-not-found";

interface LaunchSectionProps {
    id: number;
}

export default async function LaunchSection({ id }: LaunchSectionProps) {
    const product = await getProductById(id);

    if (!product) return <LaunchNotFound />;

    return (
        <div className="flex flex-col gap-10">
            <LaunchHero product={product} />
            <LaunchDetails description={product.description} />
        </div>
    );
}
