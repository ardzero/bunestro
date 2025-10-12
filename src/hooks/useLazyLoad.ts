import { useState, useEffect, useRef } from "react";

export function useLazyLoad() {
	const [isIntersecting, setIntersecting] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setIntersecting(true);
					observer.unobserve(entry.target);
				}
			},
			{
				// Start loading when element is 200px before entering viewport
				rootMargin: "200px",
			},
		);

		if (ref.current) {
			observer.observe(ref.current);
		}

		return () => {
			if (ref.current) {
				observer.unobserve(ref.current);
			}
		};
	}, []);

	return [ref, isIntersecting] as const;
}
