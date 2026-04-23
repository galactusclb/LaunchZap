import { ReactNode, Suspense } from "react"

import { ErrorBoundary } from "@/components/shared/errors"

interface FeedAsyncBoundaryProps {
    children: ReactNode
}

export default function FeedAsyncBoundary({ children }: FeedAsyncBoundaryProps) {
    return (
        <ErrorBoundary >
            <Suspense fallback={<>Loading....</>}>
                {children}
            </Suspense>
        </ErrorBoundary>
    )
}
