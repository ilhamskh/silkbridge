'use client';

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export function ReadingProgress() {
    const [progress, setProgress] = useState(0);
    const prefersReducedMotion = useReducedMotion();

    useEffect(() => {
        const updateProgress = () => {
            const article = document.querySelector('article');
            if (!article) return;

            const articleRect = article.getBoundingClientRect();
            const articleTop = articleRect.top + window.scrollY;
            const articleHeight = articleRect.height;
            const windowHeight = window.innerHeight;
            const scrollY = window.scrollY;

            // Calculate how far through the article we've scrolled
            const start = articleTop - windowHeight * 0.2;
            const end = articleTop + articleHeight - windowHeight * 0.8;
            const current = scrollY;

            if (current <= start) {
                setProgress(0);
            } else if (current >= end) {
                setProgress(100);
            } else {
                const percentage = ((current - start) / (end - start)) * 100;
                setProgress(Math.min(100, Math.max(0, percentage)));
            }
        };

        updateProgress();
        window.addEventListener('scroll', updateProgress, { passive: true });
        window.addEventListener('resize', updateProgress, { passive: true });

        return () => {
            window.removeEventListener('scroll', updateProgress);
            window.removeEventListener('resize', updateProgress);
        };
    }, []);

    return (
        <div
            className="fixed top-0 left-0 right-0 h-1 bg-primary-100 z-50"
            role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Reading progress"
        >
            <motion.div
                className="h-full bg-gradient-to-r from-primary-500 to-primary-600 origin-left"
                style={{ width: `${progress}%` }}
                initial={false}
                animate={{ width: `${progress}%` }}
                transition={
                    prefersReducedMotion
                        ? { duration: 0 }
                        : { type: 'spring', stiffness: 300, damping: 30 }
                }
            />
        </div>
    );
}
