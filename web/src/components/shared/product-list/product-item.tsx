import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import ItemButton from "./item-button";

export default function ProductItem(){
    return (
        <div className="flex gap-4 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 duration-300">
            <Avatar className="rounded-lg size-12">
                <AvatarFallback className="rounded-lg bg-purple-100">CN</AvatarFallback>
            </Avatar>

            <div className="flex flex-col flex-1">
                <span className="font-semibold text-primary">Wispr Flow: Dictation That Works Everywhere</span>
                <span className="text-base font-normal text-secondary-foreground">Stop typing. Start speaking. 4x faster. </span>
            </div>

            <ItemButton />
            <ItemButton />
        </div>
    )
}