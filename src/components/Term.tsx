import { cn } from "@/lib/utils";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

type TTerm = {
	className?: string;
};

export function Term({ className }: TTerm) {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		await navigator.clipboard.writeText("bun create bunestro ");
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div
			className={cn("flex place-items-center items-center gap-1", className)}
		>
			<code className="rounded-md border bg-muted/50 p-2 px-3 text-sm">
				bun create bunestro
			</code>
			<Button size="icon" onClick={handleCopy}>
				<div className="relative h-4 w-4">
					<Copy
						className={`absolute inset-0 transition-all duration-200 ${
							copied
								? "scale-50 rotate-90 opacity-0"
								: "scale-100 rotate-0 opacity-100"
						}`}
					/>
					<Check
						className={`absolute inset-0 transition-all duration-200 ${
							copied
								? "scale-100 rotate-0 opacity-100"
								: "scale-50 -rotate-90 opacity-0"
						}`}
					/>
				</div>
			</Button>
		</div>
	);
}
