/**
 * Prana Calculator Module
 *
 * In Vedic timekeeping, a prana is a unit of time equal to one breath cycle (4 seconds).
 * There are 21,600 pranas in a complete day (24 hours), corresponding to the traditional
 * count of 21,600 breaths a person takes in a day.
 *
 * Key Concepts:
 * - 1 prana = 4 seconds (one complete breath cycle)
 * - 21,600 pranas = 86,400 seconds = 24 hours
 * - Pranas are counted from sunrise to sunrise
 */

import { getSunrise } from './muhurtaCalculator';

/**
 * Prana information structure
 */
export interface PranaInfo {
  /** Current prana number (0-21599) */
  number: number;
  /** Angle for clock hand display (0-360 degrees) */
  angle: number;
  /** Progress to next prana (0-100%) */
  progress: number;
  /** Seconds elapsed since sunrise */
  secondsSinceSunrise: number;
  /** Time of sunrise used for calculation */
  sunrise: Date;
}

/**
 * Constants for prana calculations
 */
export const PRANA_CONSTANTS = {
  /** Seconds per prana (one breath cycle) */
  SECONDS_PER_PRANA: 4,
  /** Total pranas in a day (sunrise to sunrise) */
  PRANAS_PER_DAY: 21600,
  /** Total seconds in a day */
  SECONDS_PER_DAY: 86400,
} as const;

/**
 * Calculate current prana based on time elapsed since sunrise
 *
 * @param date - The current date and time
 * @param latitude - Observer's latitude in degrees
 * @param longitude - Observer's longitude in degrees
 * @returns PranaInfo object with current prana details
 */
export function calculatePrana(
  date: Date,
  latitude: number,
  longitude: number
): PranaInfo {
  // Get sunrise for today
  let sunrise = getSunrise(date, latitude, longitude);

  // If sunrise is null or after current time, get previous day's sunrise
  if (!sunrise || sunrise > date) {
    const yesterday = new Date(date);
    yesterday.setDate(yesterday.getDate() - 1);
    sunrise = getSunrise(yesterday, latitude, longitude);
  }

  // If still no sunrise (polar regions), use midnight as reference
  if (!sunrise) {
    sunrise = new Date(date);
    sunrise.setHours(0, 0, 0, 0);
  }

  // Calculate seconds elapsed since sunrise
  const secondsSinceSunrise = (date.getTime() - sunrise.getTime()) / 1000;

  // Calculate current prana number (0-21599)
  // Each prana is 4 seconds
  const pranaNumber = Math.floor(
    (secondsSinceSunrise / PRANA_CONSTANTS.SECONDS_PER_PRANA) % PRANA_CONSTANTS.PRANAS_PER_DAY
  );

  // Calculate angle for clock hand (0-360 degrees)
  // Complete one rotation every 21,600 pranas (24 hours)
  const angle = (pranaNumber / PRANA_CONSTANTS.PRANAS_PER_DAY) * 360;

  // Calculate progress to next prana (0-100%)
  const secondsIntoPrana = secondsSinceSunrise % PRANA_CONSTANTS.SECONDS_PER_PRANA;
  const progress = (secondsIntoPrana / PRANA_CONSTANTS.SECONDS_PER_PRANA) * 100;

  return {
    number: pranaNumber,
    angle,
    progress,
    secondsSinceSunrise,
    sunrise,
  };
}

/**
 * Calculate which phase of the breath cycle we're in
 *
 * @param progress - Progress through current prana (0-100%)
 * @returns 'inhale' (0-50%) or 'exhale' (50-100%)
 */
export function getBreathPhase(progress: number): 'inhale' | 'exhale' {
  return progress < 50 ? 'inhale' : 'exhale';
}

/**
 * Get breath cycle progress within current phase
 *
 * @param progress - Overall progress through prana (0-100%)
 * @returns Progress within current phase (0-100%)
 */
export function getBreathPhaseProgress(progress: number): number {
  if (progress < 50) {
    // Inhale phase: 0-50% maps to 0-100%
    return (progress / 50) * 100;
  } else {
    // Exhale phase: 50-100% maps to 0-100%
    return ((progress - 50) / 50) * 100;
  }
}

/**
 * Calculate pranas remaining until next muhurta
 * (Useful for showing relationship between different time units)
 *
 * @param pranaNumber - Current prana number
 * @returns Pranas remaining until next muhurta boundary
 */
export function getPranasToNextMuhurta(pranaNumber: number): number {
  // 1 muhurta = 48 minutes = 2880 seconds = 720 pranas
  const PRANAS_PER_MUHURTA = 720;
  const pranasIntoMuhurta = pranaNumber % PRANAS_PER_MUHURTA;
  return PRANAS_PER_MUHURTA - pranasIntoMuhurta;
}

/**
 * Convert prana number to time string (HH:MM:SS since sunrise)
 *
 * @param pranaNumber - The prana number to convert
 * @returns Time string in HH:MM:SS format
 */
export function pranaToTimeString(pranaNumber: number): string {
  const totalSeconds = pranaNumber * PRANA_CONSTANTS.SECONDS_PER_PRANA;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
