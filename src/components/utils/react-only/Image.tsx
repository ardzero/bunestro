import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useLazyLoad } from "@/hooks/useLazyLoad";
import { cn } from "@/lib/utils";
// lazy loads imgs with a placeholder on the client side
// requires client:load directive to work,
interface ResponsiveImageProps
	extends React.ImgHTMLAttributes<HTMLImageElement> {
	src: string;
	alt: string;
	width: number;
	height: number;
	className?: string;
	skeletonClassName?: string;
}

export function Img({
	src,
	alt,
	width,
	height,
	className = "",
	skeletonClassName = "",
	...restProps
}: ResponsiveImageProps) {
	const [imageRef, isInView] = useLazyLoad();
	const [isLoaded, setIsLoaded] = useState(false);
	const [hasError, setHasError] = useState(false);
	const aspectRatio = `${width} / ${height}`;
	const showAltText = width > 100 && height > 100;

	return (
		<div
			ref={imageRef}
			className={cn("relative w-full overflow-hidden", className)}
			style={{
				aspectRatio: aspectRatio,
				maxWidth: `${width}px`,
			}}
		>
			{/* fallback for users with JS disabled */}
			<noscript>
				<img
					{...restProps}
					src={src}
					alt={alt}
					width={width}
					height={height}
					className="absolute top-0 left-0 h-full w-full object-cover"
				/>
			</noscript>

			{isInView ? (
				<img
					{...restProps}
					src={src}
					alt={alt}
					width={width}
					height={height}
					className={cn(
						"absolute top-0 left-0 h-full w-full object-cover transition-opacity duration-300",
						isLoaded && !hasError ? "opacity-100" : "opacity-0",
					)}
					onLoad={() => setIsLoaded(true)}
					onError={() => setHasError(true)}
					loading="lazy"
				/>
			) : null}
			{!isLoaded && (
				<Skeleton
					className={cn(
						"absolute top-0 left-0 h-full w-full rounded-none",
						skeletonClassName,
						hasError && "[animation-play-state:paused]",
					)}
				/>
			)}
			{hasError && (
				<div className="absolute inset-0 flex flex-col items-center justify-center text-red-600">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						className="h-[30%] max-h-[40px] min-h-[30px] w-[30%] max-w-[40px] min-w-[30px]"
					>
						<circle cx="12" cy="12" r="10"></circle>
						<line x1="12" y1="8" x2="12" y2="12"></line>
						<line x1="12" y1="16" x2="12.01" y2="16"></line>
					</svg>
					{showAltText && (
						<span className="mt-2 px-2 text-center text-sm">{alt}</span>
					)}
				</div>
			)}
		</div>
	);
}
