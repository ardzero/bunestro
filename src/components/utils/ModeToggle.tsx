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
		// Read from localStorage on mount to sync with stored preference
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
		localStorage.setItem("theme", theme);
	}, [theme]);

	return (
		<TooltipProvider>
			<RadioGroup
				value={theme}
				defaultValue="system"
				className={cn(
					"flex gap-0 rounded-3xl border bg-background/65 backdrop-blur-2xl",
					className,
				)}
			>
				<Tooltip>
					<TooltipTrigger asChild>
						<Label
							htmlFor="light"
							className="flex flex-col items-center justify-between rounded-full bg-popover p-2 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:bg-accent"
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
							className="flex flex-col items-center justify-between rounded-full bg-popover p-2 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:bg-accent"
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
							className="flex flex-col items-center justify-between rounded-full bg-popover p-2 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:bg-accent"
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
