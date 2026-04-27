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
					? "border-brand bg-brand/10 text-brand hover:bg-brand/20 hover:text-brand"
					: "border-border"
			)}
			onClick={onClick}
			disabled={disabled}>
			<ArrowBigUp className={cn(size === "hero" && "size-6", isVoted && "fill-brand")} />
			{Number(value) < 1 ? <Minus /> : value}
		</Button>
	);
}
