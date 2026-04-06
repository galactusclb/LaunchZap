'use client'

import { ComponentType, ReactNode } from "react";
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

    return (
        <ReactErrorBoundary FallbackComponent={fallback}>
            {children}
        </ReactErrorBoundary>
    )
}