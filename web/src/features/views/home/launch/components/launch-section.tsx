import { getProductById } from "@/features/product";

import LaunchDetails from "./launch-details";
import LaunchHero from "./launch-hero";

interface LaunchSectionProps {
    id: number;
}

export default async function LaunchSection({ id }: LaunchSectionProps) {
    const product = await getProductById(id);

    return (
        <div className="flex flex-col gap-10">
            <LaunchHero product={product} />
            <LaunchDetails description={product.description} />
        </div>
    );
}
