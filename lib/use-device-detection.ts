/**
 * React hooks for device detection and performance optimization
 */

'use client';

import { useState, useEffect } from 'react';
import {
  isTouchDevice,
  isCoarsePointer,
  prefersReducedMotion,
  shouldReduceAnimations,
} from './device-detection';

/**
 * Hook to detect if the device is a touch device
 * Returns true for phones/tablets, false for desktop
 */
export function useIsTouchDevice(): boolean {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch(isTouchDevice());
  }, []);

  return isTouch;
}

/**
 * Hook to detect if the device has a coarse pointer (touch)
 * More accurate than touch detection alone
 */
export function useIsCoarsePointer(): boolean {
  const [isCoarse, setIsCoarse] = useState(false);

  useEffect(() => {
    setIsCoarse(isCoarsePointer());

    // Listen for changes (e.g., when connecting/disconnecting mouse)
    const mediaQuery = window.matchMedia('(pointer: coarse)');
    const handler = (e: MediaQueryListEvent) => setIsCoarse(e.matches);

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return isCoarse;
}

/**
 * Hook to detect if user prefers reduced motion
 * Respects system accessibility settings
 */
export function usePrefersReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(prefersReducedMotion());

    // Listen for changes to system preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return reducedMotion;
}

/**
 * Combined hook for determining if animations should be reduced
 * Considers both touch devices and reduced motion preference
 * 
 * Use this for most animation decisions
 */
export function useShouldReduceAnimations(): boolean {
  const [shouldReduce, setShouldReduce] = useState(true); // Start conservative

  useEffect(() => {
    setShouldReduce(shouldReduceAnimations());

    // Listen for changes to reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = () => setShouldReduce(shouldReduceAnimations());

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return shouldReduce;
}

/**
 * Hook to detect viewport size and breakpoints
 * Useful for conditional rendering based on screen size
 */
export function useViewportSize() {
  const [size, setSize] = useState({
    width: 0,
    height: 0,
    isMobile: true,
    isTablet: false,
    isDesktop: false,
  });

  useEffect(() => {
    const updateSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      setSize({
        width,
        height,
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024,
      });
    };

    updateSize();

    // Use passive listener for better scroll performance
    window.addEventListener('resize', updateSize, { passive: true });
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return size;
}

/**
 * Hook for detecting network connection quality
 * Can be used to conditionally load heavy assets
 */
export function useNetworkQuality() {
  const [quality, setQuality] = useState<'slow' | 'fast' | 'unknown'>('unknown');

  useEffect(() => {
    // @ts-ignore - NetworkInformation API is not fully typed
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

    if (!connection) {
      setQuality('unknown');
      return;
    }

    const updateQuality = () => {
      const effectiveType = connection.effectiveType;

      if (effectiveType === 'slow-2g' || effectiveType === '2g') {
        setQuality('slow');
      } else if (effectiveType === '3g') {
        setQuality('slow');
      } else {
        setQuality('fast');
      }
    };

    updateQuality();

    connection.addEventListener('change', updateQuality);
    return () => connection.removeEventListener('change', updateQuality);
  }, []);

  return quality;
}
