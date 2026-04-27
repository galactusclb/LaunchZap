import { Calendar, ExternalLink, User } from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Product } from "@/models/product.schema";

import LaunchVoteButton from "./launch-vote-button";

interface LaunchHeroProps {
    product: Product;
}

export default function LaunchHero({ product }: LaunchHeroProps) {
    const launchDate = new Date(product.launchDate).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });

    return (
        <div className="flex flex-col gap-8">
            <div className="flex gap-5 items-start">
                <Avatar className="rounded-2xl size-20 shrink-0">
                    <AvatarImage src={product.logoUrl ?? undefined} />
                    <AvatarFallback className="rounded-2xl bg-brand/15 text-brand-foreground text-2xl font-bold">
                        {product.name[0]}
                    </AvatarFallback>
                </Avatar>

                <div className="flex flex-col flex-1 gap-1 min-w-0">
                    <h1 className="text-4xl font-black tracking-tight">{product.name}</h1>
                    <p className="text-muted-foreground text-base">{product.tagline}</p>
                    <div className="mt-4">
                        <Button asChild size="sm" className="gap-1.5 bg-brand text-brand-foreground hover:bg-brand/90 border-transparent">
                            <Link href={product.websiteUrl} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="size-3.5" />
                                Visit Website
                            </Link>
                        </Button>
                    </div>
                </div>

                <LaunchVoteButton id={product.id} votesCount={product.votesCount} />
            </div>

            <Separator />

            <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                {product.maker && (
                    <div className="flex items-center gap-1.5">
                        <User className="size-3.5 shrink-0" />
                        <span>
                            By <span className="font-medium text-foreground">{product.maker.name}</span>
                        </span>
                    </div>
                )}
                <div className="flex items-center gap-1.5">
                    <Calendar className="size-3.5 shrink-0" />
                    <span>Launched {launchDate}</span>
                </div>
                <span className="ml-auto px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs font-medium capitalize">
                    {product.status.toLowerCase()}
                </span>
            </div>
        </div>
    );
}
