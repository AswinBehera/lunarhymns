/**
 * Nakshatra Calculator Module
 *
 * Nakshatras (lunar mansions) are 27 divisions of the ecliptic, each spanning
 * 13°20' (13.333...°). They are one of the most ancient astronomical concepts
 * in Vedic tradition, predating even the zodiac signs.
 *
 * Key Concepts:
 * - 27 nakshatras divide the 360° ecliptic (360° ÷ 27 = 13.333...° each)
 * - The Moon transits one nakshatra approximately every day
 * - Each nakshatra has unique characteristics, deity, and symbolism
 * - Nakshatras are used for determining auspicious times (muhurta)
 * - The nakshatra where the Moon is located is particularly significant
 *
 * Note: Some systems use 28 nakshatras (including Abhijit), but the standard
 * Vedic system uses 27 for calendar calculations.
 */

import { getMoonLongitude } from './astronomicalCalculations';
import { VEDIC_CONSTANTS, getNakshatraName } from './vedicTime';

/**
 * Result of nakshatra calculation
 */
export interface NakshatraResult {
  /** Current nakshatra number (1-27) */
  nakshatraNumber: number;

  /** Name of the nakshatra in Sanskrit with transliteration */
  nakshatraName: string;

  /** Progress through the current nakshatra (0-100%) */
  progress: number;

  /** Estimated minutes until the next nakshatra begins */
  minutesToNext: number;

  /** The Moon's ecliptic longitude used for this calculation */
  moonLongitude: number;

  /** The pada (quarter) of the nakshatra (1-4) */
  pada: number;
}

/**
 * Calculate the current nakshatra from Moon's ecliptic longitude
 *
 * Nakshatra Numbering System:
 * 1. Ashwini: 0° - 13°20'
 * 2. Bharani: 13°20' - 26°40'
 * 3. Krittika: 26°40' - 40°
 * ... and so on for all 27 nakshatras
 *
 * Formula: nakshatra_number = floor(moon_longitude / 13.333...) + 1
 *
 * @param moonLongitude - The Moon's ecliptic longitude in degrees (0-360°)
 * @returns The nakshatra number (1-27)
 */
export function calculateNakshatraNumber(moonLongitude: number): number {
  // Each nakshatra spans 13.333...° (360 / 27)
  const nakshatraIndex = Math.floor(
    moonLongitude / VEDIC_CONSTANTS.DEGREES_PER_NAKSHATRA
  );

  // Convert 0-26 index to 1-27 nakshatra number
  // Handle edge case where moonLongitude = 360
  const nakshatraNumber = (nakshatraIndex % VEDIC_CONSTANTS.NAKSHATRA_COUNT) + 1;

  return nakshatraNumber;
}

/**
 * Calculate the progress through the current nakshatra
 *
 * Each nakshatra spans 13°20' (13.333...°). The progress tells us how far
 * the Moon has traveled through the current nakshatra.
 *
 * @param moonLongitude - The Moon's ecliptic longitude in degrees (0-360°)
 * @returns Progress as a percentage (0-100)
 */
export function calculateNakshatraProgress(moonLongitude: number): number {
  // Get the remainder when dividing by nakshatra span
  const remainderDegrees = moonLongitude % VEDIC_CONSTANTS.DEGREES_PER_NAKSHATRA;

  // Convert to percentage
  const progress = (remainderDegrees / VEDIC_CONSTANTS.DEGREES_PER_NAKSHATRA) * 100;

  return progress;
}

/**
 * Calculate the pada (quarter) of the current nakshatra
 *
 * Each nakshatra is divided into 4 padas (quarters) of 3°20' each.
 * Padas are important in Vedic astrology and muhurta (electional astrology).
 *
 * The 4 padas correspond to the 4 elements or qualities:
 * - Pada 1: Often represents initiation, beginning
 * - Pada 2: Represents consolidation, material
 * - Pada 3: Represents transformation, mental
 * - Pada 4: Represents completion, spiritual
 *
 * @param moonLongitude - The Moon's ecliptic longitude in degrees (0-360°)
 * @returns The pada number (1-4)
 */
export function calculateNakshatraPada(moonLongitude: number): number {
  // Get position within current nakshatra
  const positionInNakshatra = moonLongitude % VEDIC_CONSTANTS.DEGREES_PER_NAKSHATRA;

  // Each pada is 1/4 of nakshatra (3.333...°)
  const degreesPerPada = VEDIC_CONSTANTS.DEGREES_PER_NAKSHATRA / 4;

  // Calculate pada (0-3, then add 1 for 1-4)
  const pada = Math.floor(positionInNakshatra / degreesPerPada) + 1;

  return pada;
}

/**
 * Estimate the time until the next nakshatra begins
 *
 * The Moon moves approximately 13° per day on average, but this varies due to:
 * 1. Elliptical orbit (faster at perigee, slower at apogee)
 * 2. Gravitational perturbations from the Sun and planets
 *
 * Average Moon speed: ~0.5°/hour or ~13.2°/day
 * Time per nakshatra: ~24 hours (ranges from ~21 to ~27 hours)
 *
 * @param moonLongitude - Current Moon longitude in degrees
 * @param date - Current date for calculating Moon's speed
 * @param latitude - Observer's latitude
 * @param longitude - Observer's longitude
 * @returns Estimated minutes until next nakshatra
 */
export function estimateTimeToNextNakshatra(
  moonLongitude: number,
  date: Date,
  latitude: number = 0,
  longitude: number = 0
): number {
  // Calculate current progress in degrees
  const currentProgress = moonLongitude % VEDIC_CONSTANTS.DEGREES_PER_NAKSHATRA;
  const degreesRemaining = VEDIC_CONSTANTS.DEGREES_PER_NAKSHATRA - currentProgress;

  // Calculate Moon's speed by checking position 1 hour later
  const oneHourLater = new Date(date.getTime() + 60 * 60 * 1000);
  const futureMoonLon = getMoonLongitude(oneHourLater, latitude, longitude);

  // Calculate rate (handle wrap-around at 360°)
  let moonSpeed = futureMoonLon - moonLongitude;
  if (moonSpeed < 0) {
    moonSpeed += 360;
  }

  // Calculate hours needed
  const hoursToNext = degreesRemaining / moonSpeed;

  // Convert to minutes
  const minutesToNext = hoursToNext * 60;

  return minutesToNext;
}

/**
 * Calculate complete nakshatra information for a given date and location
 *
 * This is the main function that combines all nakshatra calculations.
 *
 * @param date - The date and time for the calculation
 * @param latitude - Observer's latitude in degrees
 * @param longitude - Observer's longitude in degrees
 * @returns Complete nakshatra information
 */
export function calculateNakshatra(
  date: Date,
  latitude: number = 0,
  longitude: number = 0
): NakshatraResult {
  // Get Moon's current longitude
  const moonLongitude = getMoonLongitude(date, latitude, longitude);

  // Calculate nakshatra number
  const nakshatraNumber = calculateNakshatraNumber(moonLongitude);

  // Get nakshatra name
  const nakshatraName = getNakshatraName(nakshatraNumber);

  // Calculate progress through current nakshatra
  const progress = calculateNakshatraProgress(moonLongitude);

  // Calculate pada (quarter)
  const pada = calculateNakshatraPada(moonLongitude);

  // Estimate time to next nakshatra
  const minutesToNext = estimateTimeToNextNakshatra(
    moonLongitude,
    date,
    latitude,
    longitude
  );

  return {
    nakshatraNumber,
    nakshatraName,
    progress,
    minutesToNext,
    moonLongitude,
    pada,
  };
}

/**
 * Get the rashi (zodiac sign) from Moon's longitude
 *
 * While this is primarily a nakshatra calculator, the Moon's rashi is also
 * important in Vedic astrology. Each rashi spans 30°.
 *
 * Rashis (Zodiac Signs):
 * 1. Mesha (Aries): 0°-30°
 * 2. Vrishabha (Taurus): 30°-60°
 * 3. Mithuna (Gemini): 60°-90°
 * 4. Karka (Cancer): 90°-120°
 * 5. Simha (Leo): 120°-150°
 * 6. Kanya (Virgo): 150°-180°
 * 7. Tula (Libra): 180°-210°
 * 8. Vrishchika (Scorpio): 210°-240°
 * 9. Dhanu (Sagittarius): 240°-270°
 * 10. Makara (Capricorn): 270°-300°
 * 11. Kumbha (Aquarius): 300°-330°
 * 12. Meena (Pisces): 330°-360°
 *
 * @param moonLongitude - The Moon's ecliptic longitude in degrees
 * @returns The rashi number (1-12)
 */
export function getMoonRashi(moonLongitude: number): number {
  const rashiIndex = Math.floor(moonLongitude / 30);
  return (rashiIndex % 12) + 1;
}

/**
 * Nakshatra names for easy reference
 */
export const NAKSHATRA_DETAILS = [
  { number: 1, name: 'Ashwini', deity: 'Ashwini Kumaras', symbol: 'Horse Head' },
  { number: 2, name: 'Bharani', deity: 'Yama', symbol: 'Yoni' },
  { number: 3, name: 'Krittika', deity: 'Agni', symbol: 'Razor' },
  { number: 4, name: 'Rohini', deity: 'Brahma', symbol: 'Cart' },
  { number: 5, name: 'Mrigashira', deity: 'Soma', symbol: 'Deer Head' },
  { number: 6, name: 'Ardra', deity: 'Rudra', symbol: 'Teardrop' },
  { number: 7, name: 'Punarvasu', deity: 'Aditi', symbol: 'Bow and Quiver' },
  { number: 8, name: 'Pushya', deity: 'Brihaspati', symbol: 'Flower' },
  { number: 9, name: 'Ashlesha', deity: 'Nagas', symbol: 'Serpent' },
  { number: 10, name: 'Magha', deity: 'Pitris', symbol: 'Throne' },
  { number: 11, name: 'Purva Phalguni', deity: 'Bhaga', symbol: 'Hammock' },
  { number: 12, name: 'Uttara Phalguni', deity: 'Aryaman', symbol: 'Bed' },
  { number: 13, name: 'Hasta', deity: 'Savitar', symbol: 'Hand' },
  { number: 14, name: 'Chitra', deity: 'Vishwakarma', symbol: 'Pearl' },
  { number: 15, name: 'Swati', deity: 'Vayu', symbol: 'Coral' },
  { number: 16, name: 'Vishakha', deity: 'Indra-Agni', symbol: 'Archway' },
  { number: 17, name: 'Anuradha', deity: 'Mitra', symbol: 'Lotus' },
  { number: 18, name: 'Jyeshtha', deity: 'Indra', symbol: 'Earring' },
  { number: 19, name: 'Mula', deity: 'Nirriti', symbol: 'Root' },
  { number: 20, name: 'Purva Ashadha', deity: 'Apas', symbol: 'Elephant Tusk' },
  { number: 21, name: 'Uttara Ashadha', deity: 'Vishvadevas', symbol: 'Elephant Tusk' },
  { number: 22, name: 'Shravana', deity: 'Vishnu', symbol: 'Ear' },
  { number: 23, name: 'Dhanishta', deity: 'Vasus', symbol: 'Drum' },
  { number: 24, name: 'Shatabhisha', deity: 'Varuna', symbol: 'Empty Circle' },
  { number: 25, name: 'Purva Bhadrapada', deity: 'Aja Ekapada', symbol: 'Sword' },
  { number: 26, name: 'Uttara Bhadrapada', deity: 'Ahir Budhnya', symbol: 'Twins' },
  { number: 27, name: 'Revati', deity: 'Pushan', symbol: 'Fish' },
] as const;
