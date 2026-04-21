import { LaunchPageContainer } from "@/features/views/home/launch";
import { LaunchPageContainerProps } from "@/features/views/home/launch/container";
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