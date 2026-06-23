import { Rocket } from 'lucide-react';

export default function LaunchFeedNoItem() {
    return (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl bg-muted/60 py-16 text-center">
            <Rocket className="size-12 text-muted-foreground" aria-hidden="true" />
            <div className="space-y-1.5">
                <p className="text-base font-semibold text-foreground">No launches yet</p>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                    This product hasn&apos;t launched yet. <br /> Check back soon.
                </p>
            </div>
        </div>
    );
}
