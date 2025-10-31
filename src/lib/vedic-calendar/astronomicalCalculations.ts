/**
 * Astronomical Calculations Module
 *
 * This module provides functions to calculate celestial positions using the
 * astronomy-engine library. All calculations use tropical coordinates by default,
 * which are then adjusted for Vedic astronomy conventions.
 *
 * Key Concepts:
 * - Ecliptic Longitude: The position of a celestial body along the ecliptic
 *   (the apparent path of the Sun), measured in degrees (0-360°)
 * - Elongation: The angular separation between the Moon and Sun as seen from Earth
 * - Moon Phase: Derived from elongation, representing the illuminated portion
 */

import * as Astronomy from 'astronomy-engine';

/**
 * Normalize an angle to be within 0-360 degrees
 */
function normalizeAngle(degrees: number): number {
  let normalized = degrees % 360;
  if (normalized < 0) {
    normalized += 360;
  }
  return normalized;
}

/**
 * Get the Sun's ecliptic longitude for a given date
 *
 * The Sun's position along the ecliptic determines the solar month and season.
 * The ecliptic is divided into 12 rashis (zodiac signs) of 30° each.
 *
 * @param date - The date and time for the calculation
 * @returns The Sun's ecliptic longitude in degrees (0-360°)
 *
 * Note: This uses tropical coordinates. For sidereal (Vedic astrology), you would
 * need to subtract the ayanamsa (precession correction, approximately 24° currently).
 * However, for calendar calculations, the tropical system works well.
 */
export function getSunLongitude(date: Date): number {
  // Get Sun's geocentric position vector
  const sunVector = Astronomy.GeoVector(Astronomy.Body.Sun, date, false);

  // Convert to ecliptic coordinates
  const ecliptic = Astronomy.Ecliptic(sunVector);

  // Return normalized longitude (0-360°)
  return normalizeAngle(ecliptic.elon);
}

/**
 * Get the Moon's ecliptic longitude for a given date and observer location
 *
 * The Moon's position determines the nakshatra (lunar mansion). The Moon moves
 * approximately 13° per day, completing one orbit in about 27.3 days.
 *
 * @param date - The date and time for the calculation
 * @param latitude - Observer's latitude in degrees
 * @param longitude - Observer's longitude in degrees
 * @returns The Moon's ecliptic longitude in degrees (0-360°)
 *
 * Note: The Moon's position is calculated geocentrically (from Earth's center).
 * For most calendar purposes, topocentric corrections (observer's specific location)
 * are not significant, but we include the option for precision.
 */
export function getMoonLongitude(
  date: Date,
  _latitude: number = 0,
  _longitude: number = 0
): number {
  // Get Moon's geocentric position as a vector
  const moonVector = Astronomy.GeoVector(Astronomy.Body.Moon, date, false);

  // Convert to ecliptic coordinates
  const ecliptic = Astronomy.Ecliptic(moonVector);

  // Return normalized longitude (0-360°)
  return normalizeAngle(ecliptic.elon);
}

/**
 * Calculate the elongation between the Moon and Sun
 *
 * Elongation is the angular separation between the Moon and Sun as seen from Earth.
 * This is the fundamental value for calculating tithis:
 *
 * - 0° = New Moon (Amavasya) - Moon and Sun aligned
 * - 90° = First Quarter
 * - 180° = Full Moon (Purnima) - Moon opposite Sun
 * - 270° = Last Quarter
 *
 * Each tithi represents a 12° increment in elongation.
 *
 * @param date - The date and time for the calculation
 * @param latitude - Observer's latitude in degrees
 * @param longitude - Observer's longitude in degrees
 * @returns The elongation in degrees (0-360°)
 */
export function getElongation(
  date: Date,
  latitude: number = 0,
  longitude: number = 0
): number {
  const sunLon = getSunLongitude(date);
  const moonLon = getMoonLongitude(date, latitude, longitude);

  // Calculate difference
  let elongation = moonLon - sunLon;

  // Normalize to 0-360°
  return normalizeAngle(elongation);
}

/**
 * Calculate the Moon's phase as a decimal value
 *
 * The phase represents how much of the Moon's visible surface is illuminated:
 * - 0.0 = New Moon (completely dark)
 * - 0.25 = First Quarter (half illuminated, waxing)
 * - 0.5 = Full Moon (completely illuminated)
 * - 0.75 = Last Quarter (half illuminated, waning)
 * - 1.0 = New Moon (back to start)
 *
 * This is derived from the elongation using the formula:
 * phase = (elongation / 360°)
 *
 * @param date - The date and time for the calculation
 * @param latitude - Observer's latitude in degrees
 * @param longitude - Observer's longitude in degrees
 * @returns The moon phase as a decimal (0-1)
 */
export function getMoonPhase(
  date: Date,
  latitude: number = 0,
  longitude: number = 0
): number {
  const elongation = getElongation(date, latitude, longitude);

  // Convert elongation to phase (0-1)
  return elongation / 360;
}

/**
 * Calculate the Moon's illumination percentage
 *
 * This represents the percentage of the Moon's disk that is illuminated.
 * Uses the astronomy-engine's built-in illumination calculation.
 *
 * @param date - The date and time for the calculation
 * @returns The illumination percentage (0-100)
 */
export function getMoonIllumination(date: Date): number {
  const illum = Astronomy.Illumination(Astronomy.Body.Moon, date);
  return illum.phase_fraction * 100;
}

/**
 * Get comprehensive celestial data for a given date and location
 *
 * @param date - The date and time for the calculation
 * @param latitude - Observer's latitude in degrees
 * @param longitude - Observer's longitude in degrees
 * @returns Object containing all major celestial coordinates
 */
export interface CelestialData {
  sunLongitude: number;
  moonLongitude: number;
  elongation: number;
  moonPhase: number;
  illumination: number;
}

export function getCelestialData(
  date: Date,
  latitude: number = 0,
  longitude: number = 0
): CelestialData {
  const sunLongitude = getSunLongitude(date);
  const moonLongitude = getMoonLongitude(date, latitude, longitude);
  const elongation = normalizeAngle(moonLongitude - sunLongitude);
  const moonPhase = elongation / 360;
  const illumination = getMoonIllumination(date);

  return {
    sunLongitude,
    moonLongitude,
    elongation,
    moonPhase,
    illumination,
  };
}

/**
 * Calculate the rate of change of elongation (degrees per hour)
 *
 * This is useful for estimating when the next tithi or other event will occur.
 * The Moon moves faster than the Sun, so elongation increases at roughly 0.5°/hour.
 *
 * @param date - The date and time for the calculation
 * @param latitude - Observer's latitude in degrees
 * @param longitude - Observer's longitude in degrees
 * @returns Rate of elongation change in degrees per hour
 */
export function getElongationRate(
  date: Date,
  latitude: number = 0,
  longitude: number = 0
): number {
  // Calculate elongation at current time
  const elongation1 = getElongation(date, latitude, longitude);

  // Calculate elongation 1 hour later
  const date2 = new Date(date.getTime() + 60 * 60 * 1000); // +1 hour
  const elongation2 = getElongation(date2, latitude, longitude);

  // Calculate rate (handle wrap-around at 360°)
  let rate = elongation2 - elongation1;
  if (rate < 0) {
    rate += 360;
  }

  return rate;
}
