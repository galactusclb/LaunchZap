import { LaunchPageContainer } from "@/features/views/home/launch";
import type { LaunchPageContainerProps } from "@/features/views/home/launch";
import { Suspense } from "react";

export default async function LaunchItemPage({
    params,
}: {
    params: LaunchPageContainerProps['params'];
}) {
    return (
        <Suspense>
            <LaunchPageContainer params={params} />
        </Suspense>
    );
}