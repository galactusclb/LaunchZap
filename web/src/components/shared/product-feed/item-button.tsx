import { cva, type VariantProps } from "class-variance-authority";
import { ArrowBigUp, Minus } from "lucide-react";
import { MouseEvent } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";


const itemButtonVariants = cva(
	"flex flex-col items-center justify-center gap-1 border-2 transition-all duration-300",
	{
		variants: {
			size: {
				default: "size-14 rounded-xl",
				hero: "size-20 rounded-2xl text-base font-semibold",
			},
		},
		defaultVariants: {
			size: "default",
		},
	}
);

interface ItemButtonProps extends VariantProps<typeof itemButtonVariants> {
	value: string;
	isVoted?: boolean;
	onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
	disabled?: boolean;
}

export default function ItemButton({ value, isVoted, onClick, disabled, size }: ItemButtonProps) {
	return (
		<Button
			variant="outline"
			className={cn(
				itemButtonVariants({ size }),
				isVoted
					? "border-orange-400 bg-orange-50 text-orange-500 hover:bg-orange-100 hover:text-orange-500"
					: "border-gray-200"
			)}
			onClick={onClick}
			disabled={disabled}>
			<ArrowBigUp className={cn(size === "hero" && "size-6", isVoted && "fill-orange-400")} />
			{Number(value) < 1 ? <Minus /> : value}
		</Button>
	);
}
