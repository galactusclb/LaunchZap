import { Button } from "@/components/ui/button";
import { ArrowBigUp } from "lucide-react";

interface ItemButtonProps {
	value: string,
}

export default function ItemButton({value}: ItemButtonProps) {
	return (
		<Button variant={"outline"} className="flex size-14 flex-col items-center justify-center gap-1 rounded-xl border-2 border-gray-200 transition-all duration-300">
				<ArrowBigUp /> {value}
		</Button>
	);
}
