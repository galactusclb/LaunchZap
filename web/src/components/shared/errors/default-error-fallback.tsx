import { AlertCircle } from "lucide-react";
import { FallbackProps } from "react-error-boundary";

import { Button } from "@/components/ui/button";

export default function DefaultErrorFallback({ resetErrorBoundary }: FallbackProps) {
    return (
        <div role="alert" className="flex flex-col items-center justify-center gap-4 py-12 text-center">
            <AlertCircle className="size-8 text-destructive" aria-hidden="true" />
            <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">This section could not load</p>
                <p className="text-sm text-muted-foreground">
                    Give it another try, or reload the page if it keeps happening.
                </p>
            </div>
            <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" onClick={resetErrorBoundary}>
                    Try again
                </Button>
                <button
                    type="button"
                    className="text-xs text-muted-foreground underline-offset-4 hover:underline transition-colors"
                    onClick={() => window.location.reload()}
                >
                    Reload page
                </button>
            </div>
        </div>
    );
}
