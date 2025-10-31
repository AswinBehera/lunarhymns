/**
 * useLocation Hook
 *
 * Custom hook for managing user's geographic location.
 * Requests browser geolocation and provides fallback to default location.
 *
 * Default location: Bengaluru, India (12.9716° N, 77.5946° E)
 * - Silicon Valley of India
 * - Major tech hub with significant cultural heritage
 */

import { useState, useEffect, useCallback } from 'react';

/**
 * Default location: Bengaluru, India
 */
const DEFAULT_LOCATION = {
  latitude: 12.9716,
  longitude: 77.5946,
  name: 'Bengaluru, India',
};

/**
 * Location data structure
 */
export interface Location {
  latitude: number;
  longitude: number;
  name?: string;
}

/**
 * Location state
 */
export interface LocationState {
  /** Current location */
  location: Location;
  /** Whether geolocation is being requested */
  loading: boolean;
  /** Error message if geolocation failed */
  error: string | null;
  /** Whether location was set manually */
  isManual: boolean;
  /** Function to request geolocation */
  requestLocation: () => void;
  /** Function to set location manually */
  setManualLocation: (lat: number, lon: number, name?: string) => void;
}

/**
 * Custom hook for managing geographic location
 *
 * Features:
 * - Automatically requests browser geolocation on mount
 * - Handles permission denied gracefully
 * - Provides default location fallback
 * - Allows manual location entry
 * - Can re-request location
 *
 * @returns LocationState object with location and control functions
 */
export function useLocation(): LocationState {
  const [location, setLocation] = useState<Location>(DEFAULT_LOCATION);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isManual, setIsManual] = useState(false);

  /**
   * Request geolocation from browser
   */
  const requestLocation = useCallback(() => {
    // Check if geolocation is supported
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setIsManual(false);

    navigator.geolocation.getCurrentPosition(
      // Success callback
      (position) => {
        const { latitude, longitude } = position.coords;

        setLocation({
          latitude,
          longitude,
          name: 'Current Location',
        });
        setLoading(false);
        setError(null);

        console.log('Geolocation obtained:', { latitude, longitude });
      },
      // Error callback
      (error) => {
        setLoading(false);

        // Handle different error types
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setError('Location permission denied. Using default location.');
            break;
          case error.POSITION_UNAVAILABLE:
            setError('Location unavailable. Using default location.');
            break;
          case error.TIMEOUT:
            setError('Location request timed out. Using default location.');
            break;
          default:
            setError('Failed to get location. Using default location.');
        }

        // Fall back to default location
        setLocation(DEFAULT_LOCATION);

        console.warn('Geolocation error:', error.message);
      },
      // Options
      {
        enableHighAccuracy: false, // Don't need GPS precision
        timeout: 10000, // 10 second timeout
        maximumAge: 300000, // Accept 5-minute-old cached position
      }
    );
  }, []);

  /**
   * Set location manually
   */
  const setManualLocation = useCallback(
    (lat: number, lon: number, name?: string) => {
      setLocation({
        latitude: lat,
        longitude: lon,
        name: name || 'Custom Location',
      });
      setIsManual(true);
      setError(null);
      console.log('Manual location set:', { latitude: lat, longitude: lon });
    },
    []
  );

  /**
   * Request location on mount
   */
  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  return {
    location,
    loading,
    error,
    isManual,
    requestLocation,
    setManualLocation,
  };
}
