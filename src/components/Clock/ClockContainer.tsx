/**
 * ClockContainer Component
 *
 * Provides the dark astronomical themed container for the Vedic Clock.
 * Features a starfield background and centers all content.
 */

import type { ReactNode } from 'react';

interface ClockContainerProps {
  children: ReactNode;
}

/**
 * Container component that wraps the Vedic Clock
 * Note: Starfield background is now handled at the App level for full-page coverage
 */
export function ClockContainer({ children }: ClockContainerProps) {
  return (
    <div className="relative w-full h-full min-h-screen overflow-hidden">
      {/* Clock content - centered */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-8">
        {children}
      </div>
    </div>
  );
}
