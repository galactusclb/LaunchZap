import { Button } from "@/components/ui/button";
import { FallbackProps } from "react-error-boundary";

export default function DefaultErrorFallback({ error, resetErrorBoundary }: FallbackProps){

    const message = error instanceof Error ? error.message : "Something went wrong."

    return (
        <div>  
            <h5 className="text-xl font-semibold text-red-500">Error</h5>
            <p className="text-red-500">{message}</p>
            <Button className="mt-4" variant={"destructive"} onClick={resetErrorBoundary}>Retry</Button>
        </div>
    )
}