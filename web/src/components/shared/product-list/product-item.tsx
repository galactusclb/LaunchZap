import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ItemButton from "./item-button";
import { Product } from "./product.schema";

interface ProductItemProps {
    item: Product
}

export default function ProductItem({item}: ProductItemProps){
    return (
        <div className="flex gap-4 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 duration-300">
            <Avatar className="rounded-lg size-12">
                <AvatarImage src={item.logoUrl}/>
                <AvatarFallback className="rounded-lg bg-purple-100">CN</AvatarFallback>
            </Avatar>

            <div className="flex flex-col flex-1">
                <span className="font-semibold text-primary">{item.name}</span>
                <span className="text-base font-normal text-secondary-foreground">{item.tagline}</span>
            </div>

            <ItemButton />
            <ItemButton />
        </div>
    )
}