/**
 * Tithi Calculator Module
 *
 * A tithi is a lunar day in the Vedic calendar, defined by the angular relationship
 * between the Sun and Moon (elongation). Unlike solar days which are based on Earth's
 * rotation, tithis are based on the Moon's orbital motion.
 *
 * Key Concepts:
 * - Each tithi spans 12° of elongation (360° ÷ 30 tithis = 12°/tithi)
 * - Tithi duration varies from ~19 to ~26 hours due to elliptical orbits
 * - 15 tithis form a paksha (fortnight)
 * - 30 tithis form a lunar month (approximately 29.5 days)
 */

import { getElongation, getElongationRate } from './astronomicalCalculations';
import type { Paksha } from './vedicTime';
import { VEDIC_CONSTANTS, getTithiName } from './vedicTime';

/**
 * Result of tithi calculation
 */
export interface TithiResult {
  /** Current tithi number (1-30) */
  tithiNumber: number;

  /** Name of the tithi in Sanskrit with transliteration */
  tithiName: string;

  /** Current paksha (Shukla = waxing, Krishna = waning) */
  paksha: Paksha;

  /** Progress through the current tithi (0-100%) */
  progress: number;

  /** Estimated minutes until the next tithi begins */
  minutesToNext: number;

  /** The elongation value used for this calculation */
  elongation: number;
}

/**
 * Calculate the current tithi from elongation
 *
 * Tithi Numbering System:
 * - Elongation 0-12°: Tithi 1 (Pratipad) - Shukla Paksha
 * - Elongation 12-24°: Tithi 2 (Dwitiya) - Shukla Paksha
 * - ...
 * - Elongation 168-180°: Tithi 15 (Purnima/Full Moon) - Shukla Paksha
 * - Elongation 180-192°: Tithi 16 (Pratipad) - Krishna Paksha
 * - ...
 * - Elongation 348-360°: Tithi 30 (Amavasya/New Moon) - Krishna Paksha
 *
 * @param elongation - The angular separation between Moon and Sun (0-360°)
 * @returns The tithi number (1-30)
 */
export function calculateTithiNumber(elongation: number): number {
  // Each tithi is 12 degrees of elongation
  // Tithi number = floor(elongation / 12) + 1
  // This gives us 1-30 for the full lunar cycle

  const tithiIndex = Math.floor(elongation / VEDIC_CONSTANTS.DEGREES_PER_TITHI);

  // Convert 0-29 index to 1-30 tithi number
  return tithiIndex + 1;
}

/**
 * Determine the paksha (lunar fortnight) from elongation
 *
 * The lunar month is divided into two pakshas:
 * - Shukla Paksha (Waxing): Moon is getting brighter (0° to 180°)
 * - Krishna Paksha (Waning): Moon is getting darker (180° to 360°)
 *
 * @param elongation - The angular separation between Moon and Sun (0-360°)
 * @returns 'Shukla' or 'Krishna'
 */
export function determinePaksha(elongation: number): Paksha {
  // Shukla Paksha: 0° to 180° (New Moon to Full Moon)
  // Krishna Paksha: 180° to 360° (Full Moon to New Moon)
  return elongation < 180 ? 'Shukla' : 'Krishna';
}

/**
 * Calculate the progress through the current tithi
 *
 * Since each tithi spans 12°, we can calculate how far we are through
 * the current tithi by taking the remainder of elongation / 12.
 *
 * @param elongation - The angular separation between Moon and Sun (0-360°)
 * @returns Progress as a percentage (0-100)
 */
export function calculateTithiProgress(elongation: number): number {
  // Get the remainder when dividing elongation by 12
  const remainderDegrees = elongation % VEDIC_CONSTANTS.DEGREES_PER_TITHI;

  // Convert to percentage
  const progress = (remainderDegrees / VEDIC_CONSTANTS.DEGREES_PER_TITHI) * 100;

  return progress;
}

/**
 * Estimate the time until the next tithi begins
 *
 * This calculation uses the current rate of change of elongation to estimate
 * when the elongation will reach the next 12° boundary.
 *
 * Note: This is an approximation because:
 * 1. The Moon's orbital speed varies (faster at perigee, slower at apogee)
 * 2. We're using a linear approximation of a non-linear process
 *
 * For more accuracy, you would need to use iterative methods or ephemeris tables.
 *
 * @param elongation - Current elongation in degrees
 * @param elongationRate - Rate of change in degrees per hour
 * @returns Estimated minutes until next tithi
 */
export function estimateTimeToNextTithi(
  elongation: number,
  elongationRate: number
): number {
  // Calculate how many degrees until the next tithi boundary
  const currentProgress = elongation % VEDIC_CONSTANTS.DEGREES_PER_TITHI;
  const degreesRemaining = VEDIC_CONSTANTS.DEGREES_PER_TITHI - currentProgress;

  // Calculate hours needed at current rate
  const hoursToNext = degreesRemaining / elongationRate;

  // Convert to minutes
  const minutesToNext = hoursToNext * 60;

  return minutesToNext;
}

/**
 * Calculate complete tithi information for a given date and location
 *
 * This is the main function that combines all tithi calculations.
 *
 * @param date - The date and time for the calculation
 * @param latitude - Observer's latitude in degrees
 * @param longitude - Observer's longitude in degrees
 * @returns Complete tithi information
 */
export function calculateTithi(
  date: Date,
  latitude: number = 0,
  longitude: number = 0
): TithiResult {
  // Get the current elongation
  const elongation = getElongation(date, latitude, longitude);

  // Calculate tithi number
  const tithiNumber = calculateTithiNumber(elongation);

  // Get tithi name
  const tithiName = getTithiName(tithiNumber);

  // Determine paksha
  const paksha = determinePaksha(elongation);

  // Calculate progress through current tithi
  const progress = calculateTithiProgress(elongation);

  // Get elongation rate for time estimation
  const elongationRate = getElongationRate(date, latitude, longitude);

  // Estimate time to next tithi
  const minutesToNext = estimateTimeToNextTithi(elongation, elongationRate);

  return {
    tithiNumber,
    tithiName,
    paksha,
    progress,
    minutesToNext,
    elongation,
  };
}

/**
 * Check if the current date is Purnima (Full Moon)
 *
 * Purnima occurs when the tithi is 15 in Shukla Paksha (elongation ~180°)
 *
 * @param elongation - Current elongation in degrees
 * @returns true if it's Purnima
 */
export function isPurnima(elongation: number): boolean {
  const tithi = calculateTithiNumber(elongation);
  const paksha = determinePaksha(elongation);
  return tithi === 15 && paksha === 'Shukla';
}

/**
 * Check if the current date is Amavasya (New Moon)
 *
 * Amavasya occurs when the tithi is 30/15 in Krishna Paksha (elongation ~0° or ~360°)
 *
 * @param elongation - Current elongation in degrees
 * @returns true if it's Amavasya
 */
export function isAmavasya(elongation: number): boolean {
  const tithi = calculateTithiNumber(elongation);
  const paksha = determinePaksha(elongation);
  return tithi === 30 || (tithi === 15 && paksha === 'Krishna');
}

/**
 * Check if the current date is Ekadashi (11th tithi)
 *
 * Ekadashi is considered highly auspicious for fasting and spiritual practices.
 * It occurs twice per month (once in each paksha).
 *
 * @param elongation - Current elongation in degrees
 * @returns true if it's Ekadashi
 */
export function isEkadashi(elongation: number): boolean {
  const tithi = calculateTithiNumber(elongation);
  // Ekadashi is tithi 11 in Shukla or tithi 26 in Krishna
  return tithi === 11 || tithi === 26;
}
