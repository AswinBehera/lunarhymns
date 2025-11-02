/**
 * useVedicTime Hook
 *
 * Custom hook that manages Vedic time calculations and updates.
 * Updates every 4 seconds (1 prana cycle) by default.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { calculateVedicTime } from '../lib/vedic-calendar';
import type { VedicTime } from '../types';

export interface UseVedicTimeOptions {
  /** Observer's latitude */
  latitude: number;

  /** Observer's longitude */
  longitude: number;

  /** Update interval in milliseconds (default: 4000 = 1 prana) */
  updateInterval?: number;

  /** Enable automatic updates (default: true) */
  autoUpdate?: boolean;
}

export interface UseVedicTimeResult {
  /** Current Vedic time data */
  vedicTime: VedicTime | null;

  /** Loading state */
  isLoading: boolean;

  /** Error state */
  error: string | null;

  /** Manually trigger update */
  refresh: () => void;

  /** Start automatic updates */
  startUpdates: () => void;

  /** Stop automatic updates */
  stopUpdates: () => void;
}

/**
 * Custom hook for managing Vedic time calculations
 */
export function useVedicTime({
  latitude,
  longitude,
  updateInterval = 4000,
  autoUpdate = true,
}: UseVedicTimeOptions): UseVedicTimeResult {
  const [vedicTime, setVedicTime] = useState<VedicTime | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(autoUpdate);

  const intervalRef = useRef<number | null>(null);

  /**
   * Calculate and update Vedic time
   */
  const calculateTime = useCallback(() => {
    try {
      const time = calculateVedicTime(latitude, longitude);
      setVedicTime(time);
      setError(null);
      setIsLoading(false);
    } catch (err) {
      console.error('Error calculating Vedic time:', err);
      setError(err instanceof Error ? err.message : 'Failed to calculate Vedic time');
      setIsLoading(false);
    }
  }, [latitude, longitude]);

  /**
   * Manually refresh Vedic time
   */
  const refresh = useCallback(() => {
    setIsLoading(true);
    calculateTime();
  }, [calculateTime]);

  /**
   * Start automatic updates
   */
  const startUpdates = useCallback(() => {
    setIsActive(true);
  }, []);

  /**
   * Stop automatic updates
   */
  const stopUpdates = useCallback(() => {
    setIsActive(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  /**
   * Set up automatic updates
   */
  useEffect(() => {
    // Initial calculation
    calculateTime();

    // Set up interval if auto-update is enabled
    if (isActive) {
      intervalRef.current = setInterval(calculateTime, updateInterval);
    }

    // Cleanup on unmount or when dependencies change
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [calculateTime, updateInterval, isActive]);

  /**
   * Recalculate when location changes
   */
  useEffect(() => {
    setIsLoading(true);
    calculateTime();
  }, [latitude, longitude, calculateTime]);

  return {
    vedicTime,
    isLoading,
    error,
    refresh,
    startUpdates,
    stopUpdates,
  };
}

/**
 * Hook to get specific Vedic time component
 */
export function useVedicTimeComponent<K extends keyof VedicTime>(
  options: UseVedicTimeOptions,
  component: K
): VedicTime[K] | null {
  const { vedicTime } = useVedicTime(options);
  return vedicTime ? vedicTime[component] : null;
}

/**
 * Hook to get prana data
 */
export function usePrana(options: UseVedicTimeOptions) {
  return useVedicTimeComponent(options, 'prana');
}

/**
 * Hook to get muhurta data
 */
export function useMuhurta(options: UseVedicTimeOptions) {
  return useVedicTimeComponent(options, 'muhurta');
}

/**
 * Hook to get current tithi
 */
export function useTithi(options: UseVedicTimeOptions) {
  const { vedicTime } = useVedicTime(options);
  return vedicTime
    ? {
        number: vedicTime.tithi,
        name: vedicTime.tithiName,
        progress: vedicTime.tithiProgress,
        timeRemaining: vedicTime.minutesToNextTithi,
      }
    : null;
}

/**
 * Hook to get current nakshatra
 */
export function useNakshatra(options: UseVedicTimeOptions) {
  const { vedicTime } = useVedicTime(options);
  return vedicTime
    ? {
        number: vedicTime.nakshatra,
        name: vedicTime.nakshatraName,
        progress: vedicTime.nakshatraProgress,
        timeRemaining: vedicTime.minutesToNextNakshatra,
      }
    : null;
}
