/**
 * Muhurta Calculator Module
 *
 * Muhurtas are time divisions in Vedic timekeeping. A complete day (24 hours or 1440 minutes)
 * is divided into 30 muhurtas, each lasting 48 minutes.
 *
 * The 30 muhurtas are calculated from sunrise to sunrise, with each having specific
 * qualities and ruling deities.
 */

import * as Astronomy from 'astronomy-engine';

/**
 * Muhurta data structure
 */
export interface MuhurtaInfo {
  /** Muhurta number (1-30) */
  number: number;
  /** Name in English */
  name: string;
  /** Name in Sanskrit (Devanagari) */
  nameSanskrit: string;
  /** Progress through current muhurta (0-100%) */
  progress: number;
  /** Estimated minutes until next muhurta */
  timeRemaining: number;
}

/**
 * Muhurta Names (30 divisions of day)
 *
 * Each muhurta is 48 minutes long (1440 minutes / 30 = 48 minutes)
 * The cycle starts at sunrise and continues through the day and night.
 */
export const MUHURTA_NAMES = [
  { name: 'Rudra', sanskrit: 'रुद्र' },           // 1
  { name: 'Ahi', sanskrit: 'आहि' },              // 2
  { name: 'Mitra', sanskrit: 'मित्र' },          // 3
  { name: 'Pitri', sanskrit: 'पितृ' },           // 4
  { name: 'Vasu', sanskrit: 'वसु' },             // 5
  { name: 'Vara', sanskrit: 'वर' },              // 6
  { name: 'Vishve', sanskrit: 'विश्वे' },         // 7
  { name: 'Vidhi', sanskrit: 'विधि' },           // 8
  { name: 'Satamukhi', sanskrit: 'सतमुखी' },     // 9
  { name: 'Puruhuta', sanskrit: 'पुरुहूत' },     // 10
  { name: 'Vahini', sanskrit: 'वाहिनी' },        // 11
  { name: 'Naktanara', sanskrit: 'नक्तनार' },    // 12
  { name: 'Varuna', sanskrit: 'वरुण' },          // 13
  { name: 'Aryama', sanskrit: 'अर्यमा' },        // 14
  { name: 'Bhaga', sanskrit: 'भग' },             // 15
  { name: 'Girisha', sanskrit: 'गिरीश' },        // 16
  { name: 'Ajapada', sanskrit: 'अजपाद' },        // 17
  { name: 'Ahirbudhnya', sanskrit: 'अहिर्बुध्न्य' }, // 18
  { name: 'Pushan', sanskrit: 'पूषन्' },         // 19
  { name: 'Ashvini', sanskrit: 'अश्विनी' },      // 20
  { name: 'Yama', sanskrit: 'यम' },              // 21
  { name: 'Agni', sanskrit: 'अग्नि' },           // 22
  { name: 'Vidhatri', sanskrit: 'विधातृ' },      // 23
  { name: 'Kanda', sanskrit: 'कण्ड' },           // 24
  { name: 'Aditi', sanskrit: 'अदिति' },          // 25
  { name: 'Jiva', sanskrit: 'जीव' },             // 26 (also called Amrita)
  { name: 'Vishnu', sanskrit: 'विष्णु' },        // 27
  { name: 'Dyumadgadyuti', sanskrit: 'द्युमद्गद्युति' }, // 28
  { name: 'Brahma', sanskrit: 'ब्रह्मा' },       // 29
  { name: 'Samudram', sanskrit: 'समुद्रम्' },    // 30
] as const;

/**
 * Duration of each muhurta in minutes
 */
export const MINUTES_PER_MUHURTA = 48;

/**
 * Total number of muhurtas in a day
 */
export const MUHURTAS_PER_DAY = 30;

/**
 * Get sunrise time for a given date and location
 *
 * @param date - The date for which to calculate sunrise
 * @param latitude - Observer's latitude in degrees
 * @param longitude - Observer's longitude in degrees
 * @returns Date object representing sunrise time, or null if no sunrise (polar regions)
 */
export function getSunrise(date: Date, latitude: number, longitude: number): Date | null {
  try {
    // Create observer location
    const observer = new Astronomy.Observer(latitude, longitude, 0);

    // Search for sunrise on the given date
    // Start search at midnight of the given day
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    // Search for next sunrise after midnight
    const sunrise = Astronomy.SearchRiseSet(
      Astronomy.Body.Sun,
      observer,
      +1, // Direction: +1 for rise, -1 for set
      startOfDay,
      1 // Search within 1 day
    );

    return sunrise ? sunrise.date : null;
  } catch (error) {
    console.error('Error calculating sunrise:', error);
    return null;
  }
}

/**
 * Calculate current muhurta based on time since sunrise
 *
 * @param date - The current date and time
 * @param latitude - Observer's latitude in degrees
 * @param longitude - Observer's longitude in degrees
 * @returns MuhurtaInfo object with current muhurta details
 */
export function calculateMuhurta(
  date: Date,
  latitude: number,
  longitude: number
): MuhurtaInfo {
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

  // Calculate minutes since sunrise
  const timeSinceSunrise = (date.getTime() - sunrise.getTime()) / (1000 * 60);

  // Calculate muhurta number (0-29, then add 1 to make it 1-30)
  const muhurtaIndex = Math.floor(timeSinceSunrise / MINUTES_PER_MUHURTA) % MUHURTAS_PER_DAY;
  const muhurtaNumber = muhurtaIndex + 1;

  // Calculate progress through current muhurta (0-100%)
  const minutesIntoMuhurta = timeSinceSunrise % MINUTES_PER_MUHURTA;
  const progress = (minutesIntoMuhurta / MINUTES_PER_MUHURTA) * 100;

  // Calculate time remaining in current muhurta
  const timeRemaining = MINUTES_PER_MUHURTA - minutesIntoMuhurta;

  // Get muhurta name
  const muhurtaData = MUHURTA_NAMES[muhurtaIndex];

  return {
    number: muhurtaNumber,
    name: muhurtaData.name,
    nameSanskrit: muhurtaData.sanskrit,
    progress,
    timeRemaining,
  };
}

/**
 * Get muhurta name by number (1-30)
 */
export function getMuhurtaName(muhurtaNumber: number): { name: string; sanskrit: string } {
  const index = (muhurtaNumber - 1) % MUHURTAS_PER_DAY;
  return MUHURTA_NAMES[index];
}
