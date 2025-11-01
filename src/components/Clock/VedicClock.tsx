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
import { MuhurtaRing } from './MuhurtaRing';
import { PranaHand } from './PranaHand';
import { BreathingAnimation } from './BreathingAnimation';
import { BreathingButton } from './BreathingButton';
import { BreathingGuide } from './BreathingGuide';
import { BreathingModal } from '../Meditation/BreathingModal';

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
}: VedicClockProps) {
  const [vedicTime, setVedicTime] = useState<VedicTime | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBreathingGuideActive, setIsBreathingGuideActive] = useState(false);
  const [isBreathingModalOpen, setIsBreathingModalOpen] = useState(false);

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
    // Update every 4 seconds (1 prana cycle) - good balance between accuracy and performance
    const intervalId = setInterval(updateVedicTime, 4000);

    // Cleanup on unmount
    return () => clearInterval(intervalId);
  }, [latitude, longitude]);

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
      <div className="relative w-full max-w-5xl aspect-square mx-auto">
        {/* Layer 1: Orbital Rings (background) */}
        <div className="absolute inset-0 flex items-center justify-center">
          <OrbitalRings
            currentTithi={vedicTime.tithi}
            currentNakshatra={vedicTime.nakshatra}
          />
        </div>

        {/* Layer 2: Muhurta Ring (middle layer) */}
        <div className="absolute inset-0 flex items-center justify-center">
          <MuhurtaRing muhurta={vedicTime.muhurta} />
        </div>

        {/* Layer 3: Moon Indicator (on the rings) */}
        <div className="absolute inset-0 flex items-center justify-center">
          <MoonIndicator
            moonPhase={vedicTime.moonPhase}
            nakshatra={vedicTime.nakshatra}
            nakshatraProgress={vedicTime.nakshatraProgress}
          />
        </div>

        {/* Layer 4: Breathing Animation (center effect) */}
        <div className="absolute inset-0 flex items-center justify-center">
          <BreathingAnimation prana={vedicTime.prana} />
        </div>

        {/* Layer 5: Prana Hand (clock hand) */}
        <div className="absolute inset-0 flex items-center justify-center">
          <PranaHand prana={vedicTime.prana} />
        </div>

        {/* Layer 6: Central Breathing Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <BreathingButton
            prana={vedicTime.prana}
            onClick={() => setIsBreathingModalOpen(true)}
          />
        </div>
      </div>

      {/* Breathing guide overlay (legacy - can be removed if not needed) */}
      <BreathingGuide
        prana={vedicTime.prana}
        isActive={isBreathingGuideActive}
        onToggle={() => setIsBreathingGuideActive(!isBreathingGuideActive)}
      />

      {/* Breathing meditation modal */}
      <BreathingModal
        isOpen={isBreathingModalOpen}
        pranaData={vedicTime.prana}
        onClose={() => setIsBreathingModalOpen(false)}
      />
    </ClockContainer>
  );
}
