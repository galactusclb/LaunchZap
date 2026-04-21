import { Button } from "@/components/ui/button";
import { FallbackProps } from "react-error-boundary";

export default function DefaultErrorFallback({ resetErrorBoundary }: FallbackProps){

    return (
        <div>
            <h5 className="text-xl font-semibold text-red-500">Something went wrong</h5>
            <p className="text-red-500 text-sm">An unexpected error occurred. Please try again.</p>
            <Button className="mt-4" variant={"destructive"} onClick={resetErrorBoundary}>Retry</Button>
        </div>
    )
}