/**
 * Device detection and performance utilities
 * Optimized for mobile performance and reduced motion
 */

export const isTouchDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

export const isCoarsePointer = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(pointer: coarse)').matches;
};

export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

export const shouldReduceAnimations = (): boolean => {
  return prefersReducedMotion() || isTouchDevice() || isCoarsePointer();
};

/**
 * Passive scroll listener helper
 */
export const addPassiveScrollListener = (
  callback: EventListener,
  element: Window | HTMLElement = window
): (() => void) => {
  element.addEventListener('scroll', callback, { passive: true });
  return () => element.removeEventListener('scroll', callback);
};

/**
 * Throttled RAF scroll handler for performance
 */
export const createThrottledScrollHandler = (
  callback: (scrollY: number) => void,
  threshold = 2 // Only update if delta > threshold
) => {
  let ticking = false;
  let lastScrollY = 0;

  return () => {
    const scrollY = window.scrollY;
    const delta = Math.abs(scrollY - lastScrollY);

    if (!ticking && delta > threshold) {
      window.requestAnimationFrame(() => {
        callback(scrollY);
        lastScrollY = scrollY;
        ticking = false;
      });
      ticking = true;
    }
  };
};
