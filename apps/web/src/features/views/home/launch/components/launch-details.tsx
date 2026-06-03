import { Separator } from '@/components/ui/separator';

interface LaunchDetailsProps {
    description?: string | null;
}

export default function LaunchDetails({ description }: LaunchDetailsProps) {
    if (!description) return null;

    return (
        <div className="flex flex-col gap-4">
            <Separator />
            <div className="flex flex-col gap-3">
                <h2 className="text-xl font-semibold">About</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {description}
                </p>
            </div>
        </div>
    );
}
