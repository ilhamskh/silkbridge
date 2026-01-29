'use client';

import { useEffect, useRef } from 'react';

export function HeroParallaxBlue() {
    const layer1Ref = useRef<HTMLDivElement>(null);
    const layer2Ref = useRef<HTMLDivElement>(null);
    const layer3Ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const isReducedMotion =
            typeof window !== 'undefined' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const isCoarsePointer =
            typeof window !== 'undefined' &&
            window.matchMedia('(pointer: coarse)').matches;

        if (isReducedMotion || isCoarsePointer) return;

        let rafId = 0;

        const onScroll = () => {
            if (rafId) return;
            rafId = window.requestAnimationFrame(() => {
                rafId = 0;
                const y = window.scrollY || 0;
                const maxScroll = 700;
                const t = Math.max(0, Math.min(1, y / maxScroll));

                if (layer1Ref.current) {
                    const translate1 = Math.round(t * 20);
                    layer1Ref.current.style.transform = `translateY(${translate1}px)`;
                }

                if (layer2Ref.current) {
                    const translate2 = Math.round(t * 35);
                    layer2Ref.current.style.transform = `translateY(${translate2}px)`;
                }

                if (layer3Ref.current) {
                    const translate3 = Math.round(t * 50);
                    layer3Ref.current.style.transform = `translateY(${translate3}px)`;
                }
            });
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();

        return () => {
            window.removeEventListener('scroll', onScroll);
            if (rafId) window.cancelAnimationFrame(rafId);
        };
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden">
            {/* Layer 1 - Base gradient (slowest) */}
            <div
                ref={layer1Ref}
                className="absolute inset-0 will-change-transform bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950"
            />

            {/* Layer 2 - Middle accent (medium speed) */}
            <div
                ref={layer2Ref}
                className="absolute inset-0 will-change-transform bg-[radial-gradient(circle_at_30%_50%,rgba(47,104,187,0.3),transparent_70%)]"
            />

            {/* Layer 3 - Top highlight (fastest) */}
            <div
                ref={layer3Ref}
                className="absolute inset-0 will-change-transform bg-[radial-gradient(ellipse_at_50%_-20%,rgba(109,160,210,0.2),transparent_50%)]"
            />
        </div>
    );
}
