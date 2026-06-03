export interface ProductFeedSectionHeaderProps {
    title: string;
    description: string;
}

export default function ProductFeedSectionHeader({
    title,
    description,
}: ProductFeedSectionHeaderProps) {
    return (
        <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
            <p className="text-sm text-muted-foreground">{description}</p>
        </div>
    );
}
