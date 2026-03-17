import { Button } from "@/components/ui/button";
import { ChevronUp, MessageCircle } from "lucide-react";

export default function ItemButton() {
	return (
		<Button variant={"outline"} className="flex size-14 flex-col items-center justify-center gap-1 rounded-xl border-2 border-gray-200 transition-all duration-300">
				<MessageCircle />2
		</Button>
	);
}
