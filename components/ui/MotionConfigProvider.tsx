'use client';

import { MotionConfig } from 'framer-motion';

/**
 * Wraps the app in framer-motion's MotionConfig with reducedMotion="user".
 * This respects the user's OS-level prefers-reduced-motion setting globally,
 * so individual components don't need to check it themselves.
 */
export function MotionConfigProvider({ children }: { children: React.ReactNode }) {
    return (
        <MotionConfig reducedMotion="user">
            {children}
        </MotionConfig>
    );
}
