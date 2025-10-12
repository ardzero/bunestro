"use client";
// a btn to take user to the top of the page
import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

export function ScrollToTopButton({
	className,
	iconClassName,
}: {
	className?: string;
	iconClassName?: string;
}) {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const toggleVisibility = () => {
			// Check if page is scrolled at all
			if (window.scrollY > 0) setIsVisible(true);
			else setIsVisible(false);
		};

		// Check visibility on mount
		toggleVisibility();

		window.addEventListener("scroll", toggleVisibility);
		return () => window.removeEventListener("scroll", toggleVisibility);
	}, []);

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<button
						onClick={scrollToTop}
						className={cn(
							"rounded-xl bg-primary p-2 text-primary-foreground shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-primary/90 hover:shadow-xl",
							isVisible
								? "motion-scale-in-[0.24] motion-translate-x-in-[0%] motion-translate-y-in-[111%]"
								: "pointer-events-none motion-scale-out-[0] motion-opacity-out-[0%] motion-translate-y-out-[90%]",
							className,
						)}
						aria-label="Scroll to top"
					>
						<ArrowUp className={cn("size-4", iconClassName)} />
					</button>
				</TooltipTrigger>
				<TooltipContent className="text-[12px]">
					<p>Go to top</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
