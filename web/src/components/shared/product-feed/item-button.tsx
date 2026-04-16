import { Button } from "@/components/ui/button";
import { ArrowBigUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface ItemButtonProps {
	value: string;
	isVoted?: boolean;
	onClick?: () => void;
	disabled?: boolean;
}

export default function ItemButton({ value, isVoted, onClick, disabled }: ItemButtonProps) {
	return (
		<Button
			variant={"outline"}
			className={cn(
				"flex size-14 flex-col items-center justify-center gap-1 rounded-xl border-2 transition-all duration-300",
				isVoted
					? "border-orange-400 bg-orange-50 text-orange-500 hover:bg-orange-100 hover:text-orange-500"
					: "border-gray-200"
			)}
			onClick={onClick}
			disabled={disabled}>
			<ArrowBigUp className={cn(isVoted && "fill-orange-400")} />
			{value}
		</Button>
	);
}