import { ReactNode, Suspense } from 'react';

import { ErrorBoundary } from '@/components/shared/errors';

interface LaunchAsyncBoundaryProps {
    children: ReactNode;
}

export default function LaunchAsyncBoundary({ children }: LaunchAsyncBoundaryProps) {
    return (
        <ErrorBoundary>
            <Suspense fallback={<LaunchSkeleton />}>{children}</Suspense>
        </ErrorBoundary>
    );
}

function LaunchSkeleton() {
    return (
        <div className="flex flex-col gap-6 animate-pulse">
            <div className="flex gap-5 items-start">
                <div className="size-20 rounded-2xl bg-muted shrink-0" />
                <div className="flex flex-col flex-1 gap-2">
                    <div className="h-7 w-48 rounded-md bg-muted" />
                    <div className="h-5 w-72 rounded-md bg-muted" />
                    <div className="h-8 w-32 rounded-md bg-muted mt-1" />
                </div>
                <div className="size-20 rounded-2xl bg-muted shrink-0" />
            </div>
            <div className="h-px bg-muted" />
            <div className="flex gap-4">
                <div className="h-4 w-24 rounded bg-muted" />
                <div className="h-4 w-32 rounded bg-muted" />
            </div>
        </div>
    );
}
