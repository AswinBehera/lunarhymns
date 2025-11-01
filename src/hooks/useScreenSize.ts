/**
 * useScreenSize Hook
 *
 * Detects screen size and returns breakpoint information
 * for responsive behavior across the app.
 */

import { useState, useEffect } from 'react';

export type ScreenSize = 'mobile' | 'tablet' | 'desktop';

export interface ScreenSizeInfo {
  /** Current screen size category */
  size: ScreenSize;
  /** Whether the screen is mobile (< 768px) */
  isMobile: boolean;
  /** Whether the screen is tablet (768px - 1024px) */
  isTablet: boolean;
  /** Whether the screen is desktop (> 1024px) */
  isDesktop: boolean;
  /** Current window width in pixels */
  width: number;
  /** Current window height in pixels */
  height: number;
}

/**
 * Hook to detect and track screen size
 */
export function useScreenSize(): ScreenSizeInfo {
  const getScreenSize = (): ScreenSizeInfo => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    let size: ScreenSize;
    if (width < 768) {
      size = 'mobile';
    } else if (width < 1024) {
      size = 'tablet';
    } else {
      size = 'desktop';
    }

    return {
      size,
      isMobile: size === 'mobile',
      isTablet: size === 'tablet',
      isDesktop: size === 'desktop',
      width,
      height,
    };
  };

  const [screenSize, setScreenSize] = useState<ScreenSizeInfo>(getScreenSize());

  useEffect(() => {
    const handleResize = () => {
      setScreenSize(getScreenSize());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return screenSize;
}
