export interface ProductFeedSectionHeaderProps {
    title: string
    description: string
}

export default function ProductFeedSectionHeader({title, description}: ProductFeedSectionHeaderProps){
    return (
        <div className="flex flex-col">
            <h2 className="text-3xl font-bold">{title}</h2>
            <p>{description}</p>
        </div>
    )
}