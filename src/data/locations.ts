/**
 * Location Database
 *
 * Common cities and places around the world with their coordinates
 */

export interface LocationData {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  /** Optional alternative names for search */
  aliases?: string[];
}

export const LOCATIONS: LocationData[] = [
  // India - Major Cities
  { name: 'Varanasi', country: 'India', latitude: 25.3176, longitude: 82.9739 },
  { name: 'New Delhi', country: 'India', latitude: 28.6139, longitude: 77.2090, aliases: ['Delhi'] },
  { name: 'Mumbai', country: 'India', latitude: 19.0760, longitude: 72.8777, aliases: ['Bombay'] },
  { name: 'Bengaluru', country: 'India', latitude: 12.9716, longitude: 77.5946, aliases: ['Bangalore'] },
  { name: 'Kolkata', country: 'India', latitude: 22.5726, longitude: 88.3639, aliases: ['Calcutta'] },
  { name: 'Chennai', country: 'India', latitude: 13.0827, longitude: 80.2707, aliases: ['Madras'] },
  { name: 'Hyderabad', country: 'India', latitude: 17.3850, longitude: 78.4867 },
  { name: 'Pune', country: 'India', latitude: 18.5204, longitude: 73.8567 },
  { name: 'Ahmedabad', country: 'India', latitude: 23.0225, longitude: 72.5714 },
  { name: 'Jaipur', country: 'India', latitude: 26.9124, longitude: 75.7873 },
  { name: 'Rishikesh', country: 'India', latitude: 30.0869, longitude: 78.2676 },
  { name: 'Haridwar', country: 'India', latitude: 29.9457, longitude: 78.1642 },
  { name: 'Ujjain', country: 'India', latitude: 23.1765, longitude: 75.7885 },
  { name: 'Prayagraj', country: 'India', latitude: 25.4358, longitude: 81.8463, aliases: ['Allahabad'] },

  // USA - Major Cities
  { name: 'New York', country: 'USA', latitude: 40.7128, longitude: -74.0060, aliases: ['NYC'] },
  { name: 'Los Angeles', country: 'USA', latitude: 34.0522, longitude: -118.2437, aliases: ['LA'] },
  { name: 'Chicago', country: 'USA', latitude: 41.8781, longitude: -87.6298 },
  { name: 'San Francisco', country: 'USA', latitude: 37.7749, longitude: -122.4194, aliases: ['SF'] },
  { name: 'Seattle', country: 'USA', latitude: 47.6062, longitude: -122.3321 },
  { name: 'Boston', country: 'USA', latitude: 42.3601, longitude: -71.0589 },
  { name: 'Washington DC', country: 'USA', latitude: 38.9072, longitude: -77.0369, aliases: ['DC', 'Washington'] },
  { name: 'Miami', country: 'USA', latitude: 25.7617, longitude: -80.1918 },

  // UK
  { name: 'London', country: 'UK', latitude: 51.5074, longitude: -0.1278 },
  { name: 'Manchester', country: 'UK', latitude: 53.4808, longitude: -2.2426 },
  { name: 'Edinburgh', country: 'UK', latitude: 55.9533, longitude: -3.1883 },

  // Europe
  { name: 'Paris', country: 'France', latitude: 48.8566, longitude: 2.3522 },
  { name: 'Berlin', country: 'Germany', latitude: 52.5200, longitude: 13.4050 },
  { name: 'Rome', country: 'Italy', latitude: 41.9028, longitude: 12.4964 },
  { name: 'Madrid', country: 'Spain', latitude: 40.4168, longitude: -3.7038 },
  { name: 'Amsterdam', country: 'Netherlands', latitude: 52.3676, longitude: 4.9041 },
  { name: 'Vienna', country: 'Austria', latitude: 48.2082, longitude: 16.3738 },
  { name: 'Prague', country: 'Czech Republic', latitude: 50.0755, longitude: 14.4378 },
  { name: 'Athens', country: 'Greece', latitude: 37.9838, longitude: 23.7275 },

  // Asia-Pacific
  { name: 'Tokyo', country: 'Japan', latitude: 35.6762, longitude: 139.6503 },
  { name: 'Kyoto', country: 'Japan', latitude: 35.0116, longitude: 135.7681 },
  { name: 'Singapore', country: 'Singapore', latitude: 1.3521, longitude: 103.8198 },
  { name: 'Hong Kong', country: 'Hong Kong', latitude: 22.3193, longitude: 114.1694 },
  { name: 'Bangkok', country: 'Thailand', latitude: 13.7563, longitude: 100.5018 },
  { name: 'Bali', country: 'Indonesia', latitude: -8.4095, longitude: 115.1889 },
  { name: 'Sydney', country: 'Australia', latitude: -33.8688, longitude: 151.2093 },
  { name: 'Melbourne', country: 'Australia', latitude: -37.8136, longitude: 144.9631 },
  { name: 'Auckland', country: 'New Zealand', latitude: -36.8485, longitude: 174.7633 },

  // Middle East
  { name: 'Dubai', country: 'UAE', latitude: 25.2048, longitude: 55.2708 },
  { name: 'Jerusalem', country: 'Israel', latitude: 31.7683, longitude: 35.2137 },
  { name: 'Mecca', country: 'Saudi Arabia', latitude: 21.4225, longitude: 39.8262 },

  // South America
  { name: 'São Paulo', country: 'Brazil', latitude: -23.5505, longitude: -46.6333 },
  { name: 'Rio de Janeiro', country: 'Brazil', latitude: -22.9068, longitude: -43.1729 },
  { name: 'Buenos Aires', country: 'Argentina', latitude: -34.6037, longitude: -58.3816 },
  { name: 'Lima', country: 'Peru', latitude: -12.0464, longitude: -77.0428 },

  // Africa
  { name: 'Cairo', country: 'Egypt', latitude: 30.0444, longitude: 31.2357 },
  { name: 'Cape Town', country: 'South Africa', latitude: -33.9249, longitude: 18.4241 },
  { name: 'Nairobi', country: 'Kenya', latitude: -1.2864, longitude: 36.8172 },

  // Canada
  { name: 'Toronto', country: 'Canada', latitude: 43.6532, longitude: -79.3832 },
  { name: 'Vancouver', country: 'Canada', latitude: 49.2827, longitude: -123.1207 },
  { name: 'Montreal', country: 'Canada', latitude: 45.5017, longitude: -73.5673 },
];

/**
 * Search locations by name or country
 */
export function searchLocations(query: string): LocationData[] {
  if (!query || query.trim().length === 0) {
    return LOCATIONS;
  }

  const lowerQuery = query.toLowerCase().trim();

  return LOCATIONS.filter(loc => {
    const nameMatch = loc.name.toLowerCase().includes(lowerQuery);
    const countryMatch = loc.country.toLowerCase().includes(lowerQuery);
    const aliasMatch = loc.aliases?.some(alias =>
      alias.toLowerCase().includes(lowerQuery)
    );

    return nameMatch || countryMatch || aliasMatch;
  });
}

/**
 * Get location by exact name
 */
export function getLocationByName(name: string): LocationData | undefined {
  return LOCATIONS.find(loc =>
    loc.name.toLowerCase() === name.toLowerCase()
  );
}
