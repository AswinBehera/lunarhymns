/**
 * Performance Utilities
 *
 * Helper functions for optimizing React performance.
 */

import { useEffect, useRef, useCallback, type DependencyList } from 'react';

/**
 * Throttle function
 * Limits function execution to once per specified delay
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  let timeoutId: number | null = null;

  return function (...args: Parameters<T>) {
    const now = Date.now();

    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    } else {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        lastCall = Date.now();
        func(...args);
      }, delay - (now - lastCall));
    }
  };
}

/**
 * Debounce function
 * Delays function execution until after delay ms have passed since last call
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: number;

  return function (...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/**
 * Hook for throttled callback
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  deps: DependencyList = []
) {
  const throttledFn = useRef<((...args: Parameters<T>) => void) | undefined>(undefined);

  useEffect(() => {
    throttledFn.current = throttle(callback, delay);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callback, delay, ...deps]);

  return useCallback(
    (...args: Parameters<T>) => {
      throttledFn.current?.(...args);
    },
    []
  );
}

/**
 * Hook for debounced callback
 */
export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  deps: DependencyList = []
) {
  const debouncedFn = useRef<((...args: Parameters<T>) => void) | undefined>(undefined);

  useEffect(() => {
    debouncedFn.current = debounce(callback, delay);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callback, delay, ...deps]);

  return useCallback(
    (...args: Parameters<T>) => {
      debouncedFn.current?.(...args);
    },
    []
  );
}

/**
 * Hook for window resize with throttling
 */
export function useThrottledResize(
  callback: () => void,
  delay: number = 200
) {
  const throttledCallback = useThrottle(callback, delay, [callback]);

  useEffect(() => {
    window.addEventListener('resize', throttledCallback);
    return () => {
      window.removeEventListener('resize', throttledCallback);
    };
  }, [throttledCallback]);
}

/**
 * Hook for lazy loading components
 */
export function useLazyLoad<T>(
  loader: () => Promise<T>,
  shouldLoad: boolean = true
): { data: T | null; isLoading: boolean; error: Error | null } {
  const [data, setData] = React.useState<T | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    if (!shouldLoad || data) return;

    setIsLoading(true);
    loader()
      .then(setData)
      .catch(setError)
      .finally(() => setIsLoading(false));
  }, [shouldLoad, loader, data]);

  return { data, isLoading, error };
}

import React from 'react';

/**
 * Hook for intersection observer (lazy loading images/components)
 */
export function useIntersectionObserver(
  ref: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
): boolean {
  const [isIntersecting, setIsIntersecting] = React.useState(false);

  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        ...options,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [ref, options]);

  return isIntersecting;
}

/**
 * Hook for measuring component performance
 */
export function usePerformanceMeasure(
  componentName: string,
  enabled: boolean = import.meta.env.DEV
) {
  const renderCount = useRef(0);
  const lastRenderTime = useRef(Date.now());

  useEffect(() => {
    if (!enabled) return;

    renderCount.current++;
    const now = Date.now();
    const timeSinceLastRender = now - lastRenderTime.current;

    console.log(
      `[Performance] ${componentName} - Render #${renderCount.current} (${timeSinceLastRender}ms since last render)`
    );

    lastRenderTime.current = now;
  });
}

/**
 * Memoization helper for expensive calculations
 */
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  getCacheKey?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, ReturnType<T>>();

  return ((...args: Parameters<T>) => {
    const key = getCacheKey
      ? getCacheKey(...args)
      : JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

/**
 * Request animation frame hook for smooth animations
 */
export function useAnimationFrame(
  callback: (deltaTime: number) => void,
  enabled: boolean = true
) {
  const requestRef = useRef<number | undefined>(undefined);
  const previousTimeRef = useRef<number | undefined>(undefined);

  const animate: FrameRequestCallback = useCallback(
    (time: number) => {
      if (previousTimeRef.current !== undefined) {
        const deltaTime = time - previousTimeRef.current;
        callback(deltaTime);
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    },
    [callback]
  );

  useEffect(() => {
    if (!enabled) return;

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [animate, enabled]);
}

/**
 * Batch state updates for better performance
 */
export function batchUpdates(updates: (() => void)[]): void {
  // React 18+ automatically batches updates
  updates.forEach(update => update());
}

/**
 * Check if device prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Hook for reduced motion preference
 */
export function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = React.useState(prefersReducedMotion);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handleChange = () => {
      setReducedMotion(mediaQuery.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return reducedMotion;
}
