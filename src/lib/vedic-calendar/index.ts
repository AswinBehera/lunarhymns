/**
 * Vedic Calendar Main Module
 *
 * This module provides a comprehensive interface for calculating Vedic calendar
 * elements based on astronomical positions of the Sun and Moon.
 *
 * The Vedic calendar is a lunisolar calendar system that has been used in India
 * for thousands of years. It combines:
 * - Lunar months (based on Moon's phases)
 * - Solar year (based on Sun's position)
 * - Tithis (lunar days based on Moon-Sun elongation)
 * - Nakshatras (lunar mansions based on Moon's position)
 *
 * Usage:
 * ```typescript
 * import { calculateVedicTime } from './lib/vedic-calendar';
 *
 * // Calculate for current time at a specific location
 * const vedicTime = calculateVedicTime(28.6139, 77.2090); // New Delhi
 *
 * // Calculate for a specific date
 * const historicDate = new Date('2024-01-01');
 * const vedicTime = calculateVedicTime(28.6139, 77.2090, historicDate);
 * ```
 */

import type { VedicTime } from './vedicTime';
import { getMasaName } from './vedicTime';
import { getCelestialData } from './astronomicalCalculations';
import { calculateTithi } from './tithiCalculator';
import { calculateNakshatra } from './nakshatraCalculator';

/**
 * Options for Vedic time calculation
 */
export interface VedicTimeOptions {
  /** Observer's latitude in degrees (-90 to +90) */
  latitude: number;

  /** Observer's longitude in degrees (-180 to +180) */
  longitude: number;

  /** Date and time for calculation (defaults to current time) */
  date?: Date;
}

/**
 * Calculate the current Vedic masa (lunar month)
 *
 * The masa is determined by the nakshatra in which the full moon (Purnima) occurs.
 * This is an approximation based on the Sun's longitude.
 *
 * Traditional determination of masa:
 * - The masa is named after the nakshatra of the full moon
 * - A lunar month typically spans from one new moon to the next
 * - Solar months are based on Sun's transit through zodiac signs
 *
 * This simplified calculation uses the Sun's longitude:
 * - Each 30° of solar longitude corresponds roughly to one masa
 * - Mesha (Aries) starts at 0°, corresponding to Chaitra masa
 *
 * Note: A precise masa calculation would require tracking the actual full moon
 * and determining the prevailing nakshatra at that time. This is a simplified
 * approximation suitable for general calendar display.
 *
 * @param sunLongitude - The Sun's ecliptic longitude in degrees
 * @returns The masa number (1-12)
 */
function calculateMasa(sunLongitude: number): number {
  // Approximate masa from Sun's longitude
  // Each zodiac sign (30°) roughly corresponds to a masa
  // Start from Mesha (Aries) at 0° for Chaitra masa

  // Adjust so that 0° starts at Chaitra (March-April)
  // In tropical system, 0° is at spring equinox (around March 21)
  const adjustedLongitude = sunLongitude;

  // Calculate masa (1-12)
  const masaIndex = Math.floor(adjustedLongitude / 30);
  const masa = (masaIndex % 12) + 1;

  return masa;
}

/**
 * Calculate complete Vedic time information
 *
 * This is the main function that combines all calculations to provide
 * a complete picture of the current Vedic calendar state.
 *
 * @param latitude - Observer's latitude in degrees
 * @param longitude - Observer's longitude in degrees
 * @param date - Optional date for calculation (defaults to now)
 * @returns Complete VedicTime object with all calendar information
 *
 * @example
 * // Calculate for current time in New Delhi
 * const vedicTime = calculateVedicTime(28.6139, 77.2090);
 *
 * @example
 * // Calculate for specific date in Varanasi
 * const date = new Date('2024-12-25T10:00:00');
 * const vedicTime = calculateVedicTime(25.3176, 82.9739, date);
 */
export function calculateVedicTime(
  latitude: number,
  longitude: number,
  date: Date = new Date()
): VedicTime {
  // Get celestial data
  const celestialData = getCelestialData(date, latitude, longitude);

  // Calculate tithi information
  const tithiData = calculateTithi(date, latitude, longitude);

  // Calculate nakshatra information
  const nakshatraData = calculateNakshatra(date, latitude, longitude);

  // Calculate masa (lunar month)
  const masa = calculateMasa(celestialData.sunLongitude);
  const masaName = getMasaName(masa);

  // Assemble complete VedicTime object
  const vedicTime: VedicTime = {
    // Tithi information
    tithi: tithiData.tithiNumber,
    tithiName: tithiData.tithiName,
    tithiProgress: tithiData.progress,
    minutesToNextTithi: tithiData.minutesToNext,

    // Nakshatra information
    nakshatra: nakshatraData.nakshatraNumber,
    nakshatraName: nakshatraData.nakshatraName,
    nakshatraProgress: nakshatraData.progress,
    minutesToNextNakshatra: nakshatraData.minutesToNext,

    // Paksha (lunar fortnight)
    paksha: tithiData.paksha,

    // Masa (lunar month)
    masa,
    masaName,

    // Astronomical data
    moonPhase: celestialData.moonPhase,
    moonLongitude: celestialData.moonLongitude,
    sunLongitude: celestialData.sunLongitude,
    elongation: celestialData.elongation,

    // Metadata
    calculatedFor: date,
  };

  return vedicTime;
}

/**
 * Calculate Vedic time with options object
 *
 * Alternative interface that accepts an options object for more flexibility.
 *
 * @param options - Configuration options
 * @returns Complete VedicTime object
 *
 * @example
 * const vedicTime = calculateVedicTimeWithOptions({
 *   latitude: 28.6139,
 *   longitude: 77.2090,
 *   date: new Date('2024-12-25')
 * });
 */
export function calculateVedicTimeWithOptions(options: VedicTimeOptions): VedicTime {
  const { latitude, longitude, date = new Date() } = options;
  return calculateVedicTime(latitude, longitude, date);
}

// Re-export types and utilities for convenience
export type { VedicTime, Paksha } from './vedicTime';
export type { TithiResult } from './tithiCalculator';
export type { NakshatraResult } from './nakshatraCalculator';

export {
  TITHI_NAMES,
  NAKSHATRA_NAMES,
  MASA_NAMES,
  VEDIC_CONSTANTS,
  getTithiName,
  getNakshatraName,
  getMasaName,
} from './vedicTime';

export {
  getSunLongitude,
  getMoonLongitude,
  getElongation,
  getMoonPhase,
  getMoonIllumination,
} from './astronomicalCalculations';

export {
  calculateTithi,
  calculateTithiNumber,
  determinePaksha,
  isPurnima,
  isAmavasya,
  isEkadashi,
} from './tithiCalculator';

export {
  calculateNakshatra,
  calculateNakshatraNumber,
  calculateNakshatraPada,
  getMoonRashi,
  NAKSHATRA_DETAILS,
} from './nakshatraCalculator';
