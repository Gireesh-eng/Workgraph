import { useState, useEffect, useRef } from "react";

export function useInView(options?: IntersectionObserverInit) {
    const [isInView, setIsInView] = useState(false);
    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
        const node = ref.current;
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsInView(true);
                if (node) observer.unobserve(node);
            }
        }, options);

        if (node) {
            observer.observe(node);
        }

        return () => {
            if (node) observer.unobserve(node);
        };
    }, [options]);

    return { ref, isInView };
}

export function useCountUp(endValue: number, duration = 2000, trigger = true) {
    const [count, setCount] = useState(0);
    const startTime = useRef<number | null>(null);

    useEffect(() => {
        if (!trigger || endValue <= 0) return;

        let animationFrameId: number;

        function animate(timestamp: number) {
            if (!startTime.current) startTime.current = timestamp;
            const progress = timestamp - startTime.current;
            const percentage = Math.min(progress / duration, 1);

            const easeProgress = percentage === 1 ? 1 : 1 - Math.pow(2, -10 * percentage);

            setCount(Math.floor(endValue * easeProgress));

            if (percentage < 1) {
                animationFrameId = requestAnimationFrame(animate);
            }
        }

        animationFrameId = requestAnimationFrame(animate);

        return () => {
            startTime.current = null;
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        };
    }, [endValue, duration, trigger]);

    return count;
}
