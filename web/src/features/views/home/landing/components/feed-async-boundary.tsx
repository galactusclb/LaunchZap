import { ErrorBoundary } from "@/components/shared/errors"
import { ReactNode, Suspense } from "react"

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
