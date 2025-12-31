import * as React from "react";
import { LaptopIcon, Moon, Sun } from "lucide-react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const buttonClassName =
	"relative z-10 flex flex-col items-center justify-between p-2 hover:text-accent-foreground cursor-pointer transition-colors";

export function ModeToggle({
	className,
	iconClassName,
}: {
	className?: string;
	iconClassName?: string;
}) {
	const [theme, setThemeState] = React.useState<"light" | "dark" | "system">(
		"system",
	);

	React.useEffect(() => {
		const storedTheme = localStorage.getItem("theme");
		if (storedTheme === "light" || storedTheme === "dark") {
			setThemeState(storedTheme);
		} else {
			setThemeState("system");
		}
	}, []);

	React.useEffect(() => {
		const isDark =
			theme === "dark" ||
			(theme === "system" &&
				window.matchMedia("(prefers-color-scheme: dark)").matches);
		document.documentElement.classList[isDark ? "add" : "remove"]("dark");
		document.documentElement.style.colorScheme = isDark ? "dark" : "light";
		localStorage.setItem("theme", theme);
	}, [theme]);

	// Calculate position for sliding background
	const getPosition = () => {
		switch (theme) {
			case "light":
				return "0%";
			case "dark":
				return "100%";
			case "system":
				return "200%";
			default:
				return "200%";
		}
	};

	return (
		<TooltipProvider>
			<RadioGroup
				value={theme}
				defaultValue="system"
				className={cn(
					"relative flex gap-0 overflow-hidden rounded-md bg-popover backdrop-blur-2xl",
					className,
				)}
			>
				{/* Animated background indicator */}
				<div
					className="absolute inset-y-0 w-[33.333%] bg-foreground/10 transition-transform duration-300 ease-in-out"
					style={{ transform: `translateX(${getPosition()})` }}
				/>
				<Tooltip>
					<TooltipTrigger asChild>
						<Label
							htmlFor="light"
							className={buttonClassName}
							onClick={() => setThemeState("light")}
						>
							<RadioGroupItem
								value="light"
								id="light"
								className="sr-only"
								aria-label="light theme"
							/>
							<Sun className={cn("size-4", iconClassName)} />
						</Label>
					</TooltipTrigger>
					<TooltipContent side="bottom">
						<p>Light</p>
					</TooltipContent>
				</Tooltip>

				<Tooltip>
					<TooltipTrigger asChild>
						<Label
							htmlFor="dark"
							className={buttonClassName}
							onClick={() => setThemeState("dark")}
						>
							<RadioGroupItem
								value="dark"
								id="dark"
								className="sr-only"
								aria-label="dark theme"
							/>
							<Moon className={cn("size-4", iconClassName)} />
						</Label>
					</TooltipTrigger>
					<TooltipContent side="bottom">
						<p>Dark</p>
					</TooltipContent>
				</Tooltip>

				<Tooltip>
					<TooltipTrigger asChild>
						<Label
							htmlFor="system"
							className={buttonClassName}
							onClick={() => setThemeState("system")}
						>
							<RadioGroupItem
								value="system"
								id="system"
								className="sr-only"
								aria-label="system theme"
							/>
							<LaptopIcon className={cn("size-4", iconClassName)} />
						</Label>
					</TooltipTrigger>
					<TooltipContent side="bottom">
						<p>System</p>
					</TooltipContent>
				</Tooltip>
			</RadioGroup>
		</TooltipProvider>
	);
}
