'use client'

import { ComponentType, ErrorInfo, ReactNode } from "react";
import { FallbackProps, ErrorBoundary as ReactErrorBoundary } from "react-error-boundary"
import DefaultErrorFallback from "./default-error-fallback";

interface ErrorBoundaryProps {
    children: ReactNode,
    fallback?: ComponentType<FallbackProps>
}

export default function ErrorBoundary({ 
    children, 
    fallback = DefaultErrorFallback
 }: ErrorBoundaryProps) {

    function handleError(error: unknown, info: ErrorInfo) {
        console.error("[ErrorBoundary]", error, info.componentStack)
    }

    return (
        <ReactErrorBoundary FallbackComponent={fallback} onError={handleError}>
            {children}
        </ReactErrorBoundary>
    )
}