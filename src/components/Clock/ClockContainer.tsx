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
 * Container component that wraps the Vedic Clock with a beautiful
 * astronomical dark theme and starfield effect
 */
export function ClockContainer({ children }: ClockContainerProps) {
  return (
    <div className="relative w-full h-full min-h-screen bg-slate-950 overflow-hidden">
      {/* Starfield background effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(17,24,39,1)_0%,_rgba(0,0,0,1)_100%)]">
        {/* Create scattered stars with different sizes and opacities */}
        <div className="absolute inset-0">
          {/* Large stars */}
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={`star-lg-${i}`}
              className="absolute w-1 h-1 bg-white rounded-full opacity-60 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}

          {/* Medium stars */}
          {Array.from({ length: 100 }).map((_, i) => (
            <div
              key={`star-md-${i}`}
              className="absolute w-0.5 h-0.5 bg-white rounded-full opacity-40"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}

          {/* Small stars */}
          {Array.from({ length: 200 }).map((_, i) => (
            <div
              key={`star-sm-${i}`}
              className="absolute w-px h-px bg-white rounded-full opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        {/* Subtle cosmic gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/20 via-transparent to-purple-950/20" />
      </div>

      {/* Clock content - centered */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-8">
        {children}
      </div>
    </div>
  );
}
