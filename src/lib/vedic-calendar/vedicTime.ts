/**
 * Vedic Calendar Types and Constants
 *
 * This module defines the core data structures and constants used in Vedic timekeeping.
 * The Vedic calendar is lunisolar, meaning it tracks both lunar and solar cycles.
 */

/**
 * Paksha represents the lunar fortnight
 * - Shukla Paksha: Waxing moon (New Moon to Full Moon)
 * - Krishna Paksha: Waning moon (Full Moon to New Moon)
 */
export type Paksha = 'Shukla' | 'Krishna';

/**
 * Muhurta information structure
 */
export interface MuhurtaData {
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
 * Prana information structure
 */
export interface PranaData {
  /** Current prana number (0-21599) */
  number: number;
  /** Angle for clock hand display (0-360 degrees) */
  angle: number;
  /** Progress to next prana (0-100%) */
  progress: number;
  /** Current breath phase */
  breathPhase: 'inhale' | 'exhale';
  /** Progress within current breath phase (0-100%) */
  breathPhaseProgress: number;
}

/**
 * Complete Vedic Time representation
 */
export interface VedicTime {
  /** Current tithi (lunar day) number (1-30) */
  tithi: number;
  /** Name of the current tithi */
  tithiName: string;
  /** Progress through current tithi (0-100%) */
  tithiProgress: number;
  /** Estimated minutes until next tithi */
  minutesToNextTithi: number;

  /** Current nakshatra (lunar mansion) number (1-27) */
  nakshatra: number;
  /** Name of the current nakshatra */
  nakshatraName: string;
  /** Progress through current nakshatra (0-100%) */
  nakshatraProgress: number;
  /** Estimated minutes until next nakshatra */
  minutesToNextNakshatra: number;

  /** Current paksha (lunar fortnight) */
  paksha: Paksha;

  /** Current masa (lunar month) number (1-12) */
  masa: number;
  /** Name of the current masa */
  masaName: string;

  /** Current muhurta (time division) */
  muhurta: MuhurtaData;

  /** Current prana (breath cycle) */
  prana: PranaData;

  /** Moon phase as a decimal (0 = New Moon, 0.5 = Full Moon, 1 = New Moon) */
  moonPhase: number;

  /** Moon's ecliptic longitude in degrees */
  moonLongitude: number;

  /** Sun's ecliptic longitude in degrees */
  sunLongitude: number;

  /** Elongation (angular separation) between Moon and Sun in degrees */
  elongation: number;

  /** Date and time for which this calculation was made */
  calculatedFor: Date;
}

/**
 * Tithi Names (Lunar Days)
 *
 * A tithi is a lunar day, defined as the time it takes for the elongation between
 * the Moon and Sun to increase by 12 degrees. There are 30 tithis in a lunar month:
 * - 15 in Shukla Paksha (waxing)
 * - 15 in Krishna Paksha (waning)
 */
export const TITHI_NAMES: readonly string[] = [
  'Pratipad (प्रतिपदा)',      // 1st lunar day
  'Dwitiya (द्वितीया)',        // 2nd
  'Tritiya (तृतीया)',         // 3rd
  'Chaturthi (चतुर्थी)',      // 4th
  'Panchami (पञ्चमी)',        // 5th
  'Shashthi (षष्ठी)',         // 6th
  'Saptami (सप्तमी)',         // 7th
  'Ashtami (अष्टमी)',         // 8th
  'Navami (नवमी)',            // 9th
  'Dashami (दशमी)',           // 10th
  'Ekadashi (एकादशी)',        // 11th (auspicious fasting day)
  'Dwadashi (द्वादशी)',       // 12th
  'Trayodashi (त्रयोदशी)',    // 13th
  'Chaturdashi (चतुर्दशी)',   // 14th
  'Purnima/Amavasya (पूर्णिमा/अमावस्या)', // 15th (Full/New Moon)
] as const;

/**
 * Nakshatra Names (Lunar Mansions)
 *
 * Nakshatras are 27 (sometimes 28) lunar mansions that divide the ecliptic into
 * equal segments of 13°20' each. Each nakshatra has its own deity, symbol, and
 * characteristics. The Moon takes approximately 27.3 days to transit all nakshatras.
 */
export const NAKSHATRA_NAMES: readonly string[] = [
  'Ashwini (अश्विनी)',        // 0° - 13°20'
  'Bharani (भरणी)',           // 13°20' - 26°40'
  'Krittika (कृत्तिका)',      // 26°40' - 40°
  'Rohini (रोहिणी)',          // 40° - 53°20'
  'Mrigashira (मृगशिरा)',     // 53°20' - 66°40'
  'Ardra (आर्द्रा)',           // 66°40' - 80°
  'Punarvasu (पुनर्वसु)',      // 80° - 93°20'
  'Pushya (पुष्य)',           // 93°20' - 106°40'
  'Ashlesha (अश्लेषा)',        // 106°40' - 120°
  'Magha (मघा)',              // 120° - 133°20'
  'Purva Phalguni (पूर्व फाल्गुनी)', // 133°20' - 146°40'
  'Uttara Phalguni (उत्तर फाल्गुनी)', // 146°40' - 160°
  'Hasta (हस्त)',             // 160° - 173°20'
  'Chitra (चित्रा)',          // 173°20' - 186°40'
  'Swati (स्वाति)',           // 186°40' - 200°
  'Vishakha (विशाखा)',        // 200° - 213°20'
  'Anuradha (अनुराधा)',       // 213°20' - 226°40'
  'Jyeshtha (ज्येष्ठा)',      // 226°40' - 240°
  'Mula (मूल)',               // 240° - 253°20'
  'Purva Ashadha (पूर्वाषाढ़ा)', // 253°20' - 266°40'
  'Uttara Ashadha (उत्तराषाढ़ा)', // 266°40' - 280°
  'Shravana (श्रवण)',         // 280° - 293°20'
  'Dhanishta (धनिष्ठा)',      // 293°20' - 306°40'
  'Shatabhisha (शतभिषा)',     // 306°40' - 320°
  'Purva Bhadrapada (पूर्वभाद्रपदा)', // 320° - 333°20'
  'Uttara Bhadrapada (उत्तरभाद्रपदा)', // 333°20' - 346°40'
  'Revati (रेवती)',           // 346°40' - 360°
] as const;

/**
 * Masa Names (Lunar Months)
 *
 * The Vedic calendar uses 12 lunar months. Each month begins on the day after
 * the full moon (Purnimanta system) or the new moon (Amanta system).
 * The month names are derived from the nakshatra in which the full moon occurs.
 */
export const MASA_NAMES: readonly string[] = [
  'Chaitra (चैत्र)',          // March-April (Spring)
  'Vaishakha (वैशाख)',        // April-May
  'Jyeshtha (ज्येष्ठ)',       // May-June
  'Ashadha (आषाढ़)',          // June-July (Monsoon begins)
  'Shravana (श्रावण)',        // July-August
  'Bhadrapada (भाद्रपद)',     // August-September
  'Ashwin (आश्विन)',          // September-October (Autumn)
  'Kartik (कार्तिक)',         // October-November
  'Margashirsha (मार्गशीर्ष)', // November-December
  'Pausha (पौष)',             // December-January (Winter)
  'Magha (माघ)',              // January-February
  'Phalguna (फाल्गुन)',       // February-March
] as const;

/**
 * Get tithi name by number (1-30)
 */
export function getTithiName(tithiNumber: number): string {
  // Tithis 1-15 are in one paksha, 16-30 in the other
  // Both pakshas use the same 15 names
  const index = ((tithiNumber - 1) % 15);
  return TITHI_NAMES[index];
}

/**
 * Get nakshatra name by number (1-27)
 */
export function getNakshatraName(nakshatraNumber: number): string {
  return NAKSHATRA_NAMES[nakshatraNumber - 1];
}

/**
 * Get masa name by number (1-12)
 */
export function getMasaName(masaNumber: number): string {
  return MASA_NAMES[masaNumber - 1];
}

/**
 * Astronomical Constants
 */
export const VEDIC_CONSTANTS = {
  /** Degrees in a full circle */
  FULL_CIRCLE: 360,

  /** Degrees per tithi (360° / 30 tithis = 12°) */
  DEGREES_PER_TITHI: 12,

  /** Degrees per nakshatra (360° / 27 nakshatras = 13.333...°) */
  DEGREES_PER_NAKSHATRA: 360 / 27,

  /** Number of tithis in a lunar month */
  TITHIS_PER_MONTH: 30,

  /** Number of tithis in a paksha (fortnight) */
  TITHIS_PER_PAKSHA: 15,

  /** Number of nakshatras */
  NAKSHATRA_COUNT: 27,

  /** Number of lunar months in a year */
  MASA_COUNT: 12,
} as const;
