/**
 * LocationInput Component
 *
 * Provides UI for viewing and changing geographic location:
 * - Displays current location coordinates
 * - Shows location name/status
 * - Button to request browser geolocation
 * - Manual input fields for latitude/longitude
 * - Expandable panel to save space
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { LocationState } from '../../hooks/useLocation';

interface LocationInputProps {
  locationState: LocationState;
}

/**
 * Location input and display component
 */
export function LocationInput({ locationState }: LocationInputProps) {
  const { location, loading, error, isManual, requestLocation, setManualLocation } =
    locationState;

  const [isExpanded, setIsExpanded] = useState(false);
  const [tempLat, setTempLat] = useState(location.latitude.toString());
  const [tempLon, setTempLon] = useState(location.longitude.toString());
  const [inputError, setInputError] = useState<string | null>(null);

  const goldColor = '#D4AF37';
  const lightGoldColor = '#F4E5B8';

  /**
   * Handle manual location submission
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInputError(null);

    const lat = parseFloat(tempLat);
    const lon = parseFloat(tempLon);

    // Validate coordinates
    if (isNaN(lat) || isNaN(lon)) {
      setInputError('Please enter valid numbers');
      return;
    }

    if (lat < -90 || lat > 90) {
      setInputError('Latitude must be between -90 and 90');
      return;
    }

    if (lon < -180 || lon > 180) {
      setInputError('Longitude must be between -180 and 180');
      return;
    }

    setManualLocation(lat, lon);
    setIsExpanded(false);
  };

  /**
   * Handle geolocation request
   */
  const handleRequestLocation = () => {
    requestLocation();
    setIsExpanded(false);
  };

  return (
    <div className="fixed top-4 right-4 z-50 pointer-events-auto">
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-slate-900/90 backdrop-blur-sm rounded-lg border border-yellow-900/30 shadow-2xl"
        style={{ minWidth: '280px' }}
      >
        {/* Header - Always Visible */}
        <div
          className="p-4 cursor-pointer select-none"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4"
                style={{ color: goldColor }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="text-xs uppercase tracking-wider" style={{ color: goldColor }}>
                Location
              </span>
            </div>
            <motion.svg
              className="w-4 h-4"
              style={{ color: goldColor }}
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </motion.svg>
          </div>

          {/* Current Location Display */}
          <div className="space-y-1">
            <div className="text-sm font-medium" style={{ color: lightGoldColor }}>
              {location.name || 'Unknown Location'}
              {isManual && (
                <span className="ml-2 text-xs opacity-60">(Manual)</span>
              )}
            </div>
            <div className="text-xs opacity-70" style={{ color: lightGoldColor }}>
              {location.latitude.toFixed(4)}°N, {location.longitude.toFixed(4)}°E
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-2 text-xs text-red-400"
            >
              {error}
            </motion.div>
          )}

          {/* Loading State */}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-2 text-xs"
              style={{ color: goldColor }}
            >
              Requesting location...
            </motion.div>
          )}
        </div>

        {/* Expandable Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden border-t border-yellow-900/30"
            >
              <div className="p-4 space-y-4">
                {/* Request Geolocation Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleRequestLocation}
                  disabled={loading}
                  className="w-full px-4 py-2 rounded-md text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: `${goldColor}20`,
                    border: `1px solid ${goldColor}`,
                    color: lightGoldColor,
                  }}
                >
                  <div className="flex items-center justify-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                    Use My Location
                  </div>
                </motion.button>

                {/* Divider */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-px" style={{ backgroundColor: `${goldColor}30` }} />
                  <span className="text-xs opacity-50" style={{ color: goldColor }}>
                    or
                  </span>
                  <div className="flex-1 h-px" style={{ backgroundColor: `${goldColor}30` }} />
                </div>

                {/* Manual Input Form */}
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="text-xs uppercase tracking-wider mb-2" style={{ color: goldColor }}>
                    Enter Coordinates
                  </div>

                  {/* Latitude Input */}
                  <div>
                    <label className="block text-xs mb-1" style={{ color: lightGoldColor }}>
                      Latitude (-90 to 90)
                    </label>
                    <input
                      type="text"
                      value={tempLat}
                      onChange={(e) => setTempLat(e.target.value)}
                      placeholder="12.9716"
                      className="w-full px-3 py-2 rounded-md text-sm bg-slate-800 border focus:outline-none focus:ring-1 transition-all"
                      style={{
                        borderColor: `${goldColor}40`,
                        color: lightGoldColor,
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = goldColor;
                        e.target.style.boxShadow = `0 0 0 1px ${goldColor}`;
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = `${goldColor}40`;
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>

                  {/* Longitude Input */}
                  <div>
                    <label className="block text-xs mb-1" style={{ color: lightGoldColor }}>
                      Longitude (-180 to 180)
                    </label>
                    <input
                      type="text"
                      value={tempLon}
                      onChange={(e) => setTempLon(e.target.value)}
                      placeholder="77.5946"
                      className="w-full px-3 py-2 rounded-md text-sm bg-slate-800 border focus:outline-none focus:ring-1 transition-all"
                      style={{
                        borderColor: `${goldColor}40`,
                        color: lightGoldColor,
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = goldColor;
                        e.target.style.boxShadow = `0 0 0 1px ${goldColor}`;
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = `${goldColor}40`;
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>

                  {/* Input Error */}
                  {inputError && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-red-400"
                    >
                      {inputError}
                    </motion.div>
                  )}

                  {/* Submit Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full px-4 py-2 rounded-md text-sm font-medium transition-all"
                    style={{
                      backgroundColor: goldColor,
                      color: '#0F172A',
                    }}
                  >
                    Set Location
                  </motion.button>
                </form>

                {/* Popular Locations Quick Select */}
                <div className="pt-2 border-t border-yellow-900/30">
                  <div className="text-xs uppercase tracking-wider mb-2" style={{ color: goldColor }}>
                    Quick Select
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { name: 'Varanasi', lat: 25.3176, lon: 82.9739 },
                      { name: 'New Delhi', lat: 28.6139, lon: 77.2090 },
                      { name: 'Mumbai', lat: 19.0760, lon: 72.8777 },
                      { name: 'Bengaluru', lat: 12.9716, lon: 77.5946 },
                    ].map((loc) => (
                      <motion.button
                        key={loc.name}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setManualLocation(loc.lat, loc.lon, loc.name);
                          setIsExpanded(false);
                        }}
                        className="px-2 py-1 rounded text-xs transition-all"
                        style={{
                          backgroundColor: `${goldColor}10`,
                          border: `1px solid ${goldColor}30`,
                          color: lightGoldColor,
                        }}
                      >
                        {loc.name}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
