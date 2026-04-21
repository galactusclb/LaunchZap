import { ProductIdParam, productIdParamSchema } from "@/models/product.schema";
import LaunchAsyncBoundary from "./components/launch-async-boundary";
import LaunchSection from "./components/launch-section";
import { notFound } from "next/navigation";

export interface LaunchPageContainerProps {
    params: Promise<ProductIdParam>
}

export default async function LaunchPageContainer({ params }: LaunchPageContainerProps) {
    
    const parsedParams = productIdParamSchema.safeParse(await params);

    if(!parsedParams.success) notFound();

    const {id} = parsedParams.data;

    return (
        <div className="w-full mx-auto py-10 px-4">
            <LaunchAsyncBoundary>
                <LaunchSection id={id} />
            </LaunchAsyncBoundary>
        </div>
    );
}
