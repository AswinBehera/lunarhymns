/**
 * VedicClock Component
 *
 * Main component that orchestrates the Vedic Lunar Clock display.
 * Calculates and updates Vedic time based on astronomical positions,
 * and renders all sub-components in a beautiful layered layout.
 */

import { useState, useEffect } from 'react';
import { calculateVedicTime } from '../../lib/vedic-calendar';
import type { VedicTime } from '../../lib/vedic-calendar';
import { ClockContainer } from './ClockContainer';
import { OrbitalRings } from './OrbitalRings';
import { MoonIndicator } from './MoonIndicator';
import { CenterDisplay } from './CenterDisplay';

interface VedicClockProps {
  /** Observer's latitude in degrees */
  latitude: number;

  /** Observer's longitude in degrees */
  longitude: number;

  /** Location name (optional) */
  locationName?: string;

  /** Update interval in milliseconds (default: 60000 = 1 minute) */
  updateInterval?: number;
}

/**
 * Main Vedic Lunar Clock component
 *
 * Displays a beautiful astronomical clock showing:
 * - Current tithi (lunar day)
 * - Current nakshatra (lunar mansion)
 * - Paksha (waxing/waning fortnight)
 * - Moon phase and position
 * - Progress and time remaining for each element
 */
export function VedicClock({
  latitude,
  longitude,
  locationName,
  updateInterval = 60000, // Update every minute by default
}: VedicClockProps) {
  const [vedicTime, setVedicTime] = useState<VedicTime | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Calculate Vedic time
  const updateVedicTime = () => {
    try {
      const time = calculateVedicTime(latitude, longitude);
      setVedicTime(time);
      setIsLoading(false);
      setError(null);
    } catch (err) {
      console.error('Error calculating Vedic time:', err);
      setError('Failed to calculate Vedic time');
      setIsLoading(false);
    }
  };

  // Initial calculation and periodic updates
  useEffect(() => {
    // Calculate immediately on mount
    updateVedicTime();

    // Set up interval for periodic updates
    const intervalId = setInterval(updateVedicTime, updateInterval);

    // Cleanup on unmount
    return () => clearInterval(intervalId);
  }, [latitude, longitude, updateInterval]);

  // Loading state
  if (isLoading) {
    return (
      <ClockContainer>
        <div className="text-center">
          <div className="text-xl text-yellow-600 mb-4">Calculating Vedic Time...</div>
          <div className="animate-pulse text-yellow-700">
            Aligning with celestial positions...
          </div>
        </div>
      </ClockContainer>
    );
  }

  // Error state
  if (error || !vedicTime) {
    return (
      <ClockContainer>
        <div className="text-center">
          <div className="text-xl text-red-500 mb-4">Error</div>
          <div className="text-red-400">{error || 'Unknown error occurred'}</div>
        </div>
      </ClockContainer>
    );
  }

  return (
    <ClockContainer>
      {/* Main clock container with layered components */}
      <div className="relative w-full max-w-4xl aspect-square">
        {/* Layer 1: Orbital Rings (background) */}
        <div className="absolute inset-0 flex items-center justify-center">
          <OrbitalRings
            currentTithi={vedicTime.tithi}
            currentNakshatra={vedicTime.nakshatra}
          />
        </div>

        {/* Layer 2: Moon Indicator (on the rings) */}
        <div className="absolute inset-0 flex items-center justify-center">
          <MoonIndicator
            moonPhase={vedicTime.moonPhase}
            nakshatra={vedicTime.nakshatra}
            nakshatraProgress={vedicTime.nakshatraProgress}
          />
        </div>

        {/* Layer 3: Center Display (foreground) */}
        <CenterDisplay vedicTime={vedicTime} />
      </div>

      {/* Additional info footer */}
      <div className="absolute bottom-8 left-0 right-0 text-center">
        <div className="text-sm opacity-50 text-yellow-600">
          {locationName && (
            <>
              <div className="font-medium">{locationName}</div>
              <div className="text-xs mt-1">
                {latitude.toFixed(4)}°N, {longitude.toFixed(4)}°E
              </div>
            </>
          )}
          {!locationName && (
            <div>
              Location: {latitude.toFixed(4)}°N, {longitude.toFixed(4)}°E
            </div>
          )}
        </div>
      </div>
    </ClockContainer>
  );
}
