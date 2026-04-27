import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Product } from "./product-feed.schema";
import VoteButton from "./vote-button";

interface ProductItemProps {
    item: Product
}

export default function ProductItem({ item }: ProductItemProps) {
    return (
        <Link href={`/launch/${item.id}`} className="flex gap-4 p-4 bg-card rounded-lg hover:bg-muted transition-colors duration-200">
            <Avatar className="rounded-lg size-12">
                <AvatarImage src={item?.logoUrl ?? ""} />
                <AvatarFallback className="rounded-lg bg-brand/15 text-brand-foreground text-sm font-semibold">
                    {item.name.charAt(0).toUpperCase()}
                </AvatarFallback>
            </Avatar>

            <div className="flex flex-col flex-1">
                <span className="font-semibold text-primary">{item.name}</span>
                <span className="text-base font-normal text-secondary-foreground">{item.tagline}</span>
            </div>

            <VoteButton id={item.id} votesCount={item.votesCount} />
        </Link>
    )
}
