'use client'
// a hook for animating elements when they enter the viewport (intErsection observer)
// - must be used in a client component
//   const { ref, isInView } = useIntersection({ threshold: 0.2, once: true });
//   <div ref={ref} className={cn(isInView && 'motion-blur-in-[50px]')}>
import { useEffect, useRef, useState } from 'react'

interface UseIntersectionOptions {
    threshold?: number
    root?: Element | null
    rootMargin?: string
    once?: boolean
}

export function useIntersection({
    threshold = 0,
    root = null,
    rootMargin = '0px',
    once = false,
}: UseIntersectionOptions = {}) {
    const [isInView, setIsInView] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const element = ref.current
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true)
                    if (once && element) {
                        observer.unobserve(element)
                    }
                } else if (!once) {
                    setIsInView(false)
                }
            },
            { threshold, root, rootMargin }
        )

        if (element) {
            observer.observe(element)
        }

        return () => {
            if (element) {
                observer.unobserve(element)
            }
        }
    }, [threshold, root, rootMargin, once])

    return { ref, isInView }
}
