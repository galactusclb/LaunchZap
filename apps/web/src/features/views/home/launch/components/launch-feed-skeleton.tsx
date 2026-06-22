export function LaunchFeedSkeleton() {
    return (
        <div className="flex flex-col gap-6 animate-pulse">
            <div className="flex flex-col gap-1">
                <div className="h-7 w-40 rounded-md bg-muted" />
                <div className="h-4 w-60 rounded bg-muted" />
            </div>
            {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4 p-4 bg-muted rounded-lg">
                    <div className="size-12 rounded-full bg-muted-foreground/20 shrink-0" />
                    <div className="flex flex-col flex-1 gap-2 justify-center">
                        <div className="h-4 w-32 rounded bg-muted-foreground/20" />
                        <div className="h-3 w-48 rounded bg-muted-foreground/20" />
                    </div>
                </div>
            ))}
        </div>
    );
}
