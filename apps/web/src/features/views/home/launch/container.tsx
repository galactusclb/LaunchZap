import { notFound } from 'next/navigation';
import z from 'zod';

import LaunchAsyncBoundary from './components/launch-async-boundary';
import LaunchSection from './components/launch-section';

const launchSlugParamSchema = z.object({ id: z.string().min(1) });

export interface LaunchPageContainerProps {
    params: Promise<{ id: string }>;
}

export default async function LaunchPageContainer({ params }: LaunchPageContainerProps) {
    const parsedParams = launchSlugParamSchema.safeParse(await params);

    if (!parsedParams.success) notFound();

    const { id } = parsedParams.data;

    return (
        <div className="w-full mx-auto">
            <LaunchAsyncBoundary>
                <LaunchSection slug={id} />
            </LaunchAsyncBoundary>
        </div>
    );
}
