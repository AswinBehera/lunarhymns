/**
 * TimeDetails Component
 *
 * Displays comprehensive Vedic time information in an elegant sidebar.
 * Shows tithi, paksha, nakshatra, masa, and upcoming changes.
 * Features smooth animations when values change.
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { VedicTime } from '../../lib/vedic-calendar';

interface TimeDetailsProps {
  vedicTime: VedicTime;
}

/**
 * Format date in DD/MM/YYYY format
 */
// function formatDate(date: Date): string {
//   const day = String(date.getDate()).padStart(2, '0');
//   const month = String(date.getMonth() + 1).padStart(2, '0');
//   const year = date.getFullYear();
//   return `${day}/${month}/${year}`;
// }

/**
 * Format date and time in DD/MM/YYYY HH:MM:SS format
 */
function formatDateTime(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

/**
 * Format time remaining in human-readable format
 */
function formatTimeRemaining(minutes: number): string {
  if (minutes < 60) {
    return `${Math.round(minutes)} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  if (hours < 24) {
    return `${hours}h ${mins}m`;
  }
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  return `${days}d ${remainingHours}h`;
}

/**
 * Detailed time information display
 */
export function TimeDetails({ vedicTime }: TimeDetailsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every second
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const goldColor = '#D4AF37';
  const lightGoldColor = '#F4E5B8';
  const dimGoldColor = '#9A7D28';

  return (
    <div className="fixed left-4 top-1/2 -translate-y-1/2 z-40 pointer-events-auto">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="relative"
      >
        {/* Collapse/Expand Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute -right-3 top-4 w-10 h-10 rounded-full shadow-lg z-50 flex items-center justify-center"
          style={{
            backgroundColor: goldColor,
            boxShadow: `0 0 20px ${goldColor}40`,
          }}
        >
          <motion.svg
            className="w-5 h-5 text-slate-950"
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
              d={isExpanded ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"}
            />
          </motion.svg>
        </motion.button>

        {/* Main Panel */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, x: -50, width: 0 }}
              animate={{ opacity: 1, x: 0, width: 'auto' }}
              exit={{ opacity: 0, x: -50, width: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-slate-900/90 backdrop-blur-md rounded-r-xl border-l-0 border border-yellow-900/30 shadow-2xl overflow-hidden"
              style={{
                minWidth: '320px',
                maxWidth: '380px',
              }}
            >
              {/* Header */}
              <div
                className="px-5 py-4 border-b"
                style={{
                  borderColor: `${goldColor}30`,
                  background: `linear-gradient(to bottom, ${goldColor}10, transparent)`,
                }}
              >
                <h3 className="text-lg font-bold" style={{ color: lightGoldColor }}>
                  Vedic Time Details
                </h3>
                <p className="text-xs mt-1" style={{ color: dimGoldColor }}>
                  {formatDateTime(currentTime)}
                </p>
              </div>

              {/* Content */}
              <div className="px-5 py-4 space-y-4 max-h-[70vh] overflow-y-auto">
                {/* Tithi Section */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" style={{ color: goldColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <span className="text-xs uppercase tracking-wider font-semibold" style={{ color: dimGoldColor }}>
                      Tithi (Lunar Day)
                    </span>
                  </div>

                  <div className="pl-7 space-y-2">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={vedicTime.tithi}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="text-xl font-bold" style={{ color: lightGoldColor }}>
                          {vedicTime.tithiName.split('(')[0].trim()}
                        </div>
                        <div className="text-sm" style={{ color: dimGoldColor }}>
                          Tithi {vedicTime.tithi} of 30 • {vedicTime.paksha} Paksha
                        </div>
                      </motion.div>
                    </AnimatePresence>

                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between text-xs mb-1" style={{ color: dimGoldColor }}>
                        <span>Progress</span>
                        <AnimatePresence mode="wait">
                          <motion.span
                            key={Math.round(vedicTime.tithiProgress)}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            {Math.round(vedicTime.tithiProgress)}%
                          </motion.span>
                        </AnimatePresence>
                      </div>
                      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: goldColor }}
                          animate={{ width: `${vedicTime.tithiProgress}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                      <div className="text-xs mt-1" style={{ color: dimGoldColor }}>
                        Next in {formatTimeRemaining(vedicTime.minutesToNextTithi)}
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Divider */}
                <div className="h-px" style={{ backgroundColor: `${goldColor}20` }} />

                {/* Nakshatra Section */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" style={{ color: goldColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    <span className="text-xs uppercase tracking-wider font-semibold" style={{ color: dimGoldColor }}>
                      Nakshatra (Lunar Mansion)
                    </span>
                  </div>

                  <div className="pl-7 space-y-2">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={vedicTime.nakshatra}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="text-xl font-bold" style={{ color: lightGoldColor }}>
                          {vedicTime.nakshatraName.split('(')[0].trim()}
                        </div>
                        <div className="text-sm" style={{ color: dimGoldColor }}>
                          {vedicTime.nakshatra} of 27
                        </div>
                      </motion.div>
                    </AnimatePresence>

                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between text-xs mb-1" style={{ color: dimGoldColor }}>
                        <span>Progress</span>
                        <AnimatePresence mode="wait">
                          <motion.span
                            key={Math.round(vedicTime.nakshatraProgress)}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            {Math.round(vedicTime.nakshatraProgress)}%
                          </motion.span>
                        </AnimatePresence>
                      </div>
                      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: goldColor, opacity: 0.8 }}
                          animate={{ width: `${vedicTime.nakshatraProgress}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                      <div className="text-xs mt-1" style={{ color: dimGoldColor }}>
                        Next in {formatTimeRemaining(vedicTime.minutesToNextNakshatra)}
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Divider */}
                <div className="h-px" style={{ backgroundColor: `${goldColor}20` }} />

                {/* Paksha Section */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" style={{ color: goldColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                    <span className="text-xs uppercase tracking-wider font-semibold" style={{ color: dimGoldColor }}>
                      Paksha (Lunar Fortnight)
                    </span>
                  </div>

                  <div className="pl-7">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={vedicTime.paksha}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
                        style={{
                          backgroundColor: `${goldColor}15`,
                          border: `1px solid ${goldColor}40`,
                        }}
                      >
                        <span style={{ color: lightGoldColor }}>
                          {vedicTime.paksha === 'Shukla' ? '🌒' : '🌘'}
                        </span>
                        <span className="font-medium" style={{ color: lightGoldColor }}>
                          {vedicTime.paksha} Paksha
                        </span>
                      </motion.div>
                    </AnimatePresence>
                    <div className="text-xs mt-2" style={{ color: dimGoldColor }}>
                      {vedicTime.paksha === 'Shukla' ? 'Waxing Moon' : 'Waning Moon'}
                    </div>
                  </div>
                </motion.div>

                {/* Divider */}
                <div className="h-px" style={{ backgroundColor: `${goldColor}20` }} />

                {/* Masa Section */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" style={{ color: goldColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs uppercase tracking-wider font-semibold" style={{ color: dimGoldColor }}>
                      Masa (Lunar Month)
                    </span>
                  </div>

                  <div className="pl-7">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={vedicTime.masa}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="text-lg font-bold" style={{ color: lightGoldColor }}>
                          {vedicTime.masaName.split('(')[0].trim()}
                        </div>
                        <div className="text-sm" style={{ color: dimGoldColor }}>
                          Month {vedicTime.masa} of 12
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </motion.div>

                {/* Divider */}
                <div className="h-px" style={{ backgroundColor: `${goldColor}20` }} />

                {/* Moon Phase Section */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" style={{ color: goldColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                    <span className="text-xs uppercase tracking-wider font-semibold" style={{ color: dimGoldColor }}>
                      Moon Phase
                    </span>
                  </div>

                  <div className="pl-7 flex items-center gap-3">
                    {/* Visual Moon */}
                    <motion.div
                      className="relative w-12 h-12 rounded-full flex-shrink-0"
                      style={{
                        backgroundColor: '#2D3748',
                        border: `2px solid ${goldColor}`,
                      }}
                      animate={{
                        boxShadow: [
                          `0 0 10px ${goldColor}30`,
                          `0 0 20px ${goldColor}50`,
                          `0 0 10px ${goldColor}30`,
                        ],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        style={{
                          background: `linear-gradient(90deg, ${lightGoldColor} 0%, ${goldColor} 100%)`,
                        }}
                        animate={{
                          clipPath:
                            vedicTime.moonPhase <= 0.5
                              ? `circle(${vedicTime.moonPhase * 100}% at 50% 50%)`
                              : `circle(${(1 - vedicTime.moonPhase) * 100}% at 50% 50%)`,
                        }}
                        transition={{ duration: 0.5 }}
                      />
                    </motion.div>

                    {/* Percentage */}
                    <div>
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={Math.round(vedicTime.moonPhase * 100)}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 1.1 }}
                          transition={{ duration: 0.3 }}
                          className="text-2xl font-bold"
                          style={{ color: lightGoldColor }}
                        >
                          {(vedicTime.moonPhase * 100).toFixed(1)}%
                        </motion.div>
                      </AnimatePresence>
                      <div className="text-xs" style={{ color: dimGoldColor }}>
                        Illuminated
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Divider */}
                <div className="h-px" style={{ backgroundColor: `${goldColor}20` }} />

                {/* Astronomical Coordinates */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" style={{ color: goldColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-xs uppercase tracking-wider font-semibold" style={{ color: dimGoldColor }}>
                      Celestial Coordinates
                    </span>
                  </div>

                  <div className="pl-7 space-y-1 text-xs" style={{ color: dimGoldColor }}>
                    <div className="flex justify-between">
                      <span>Moon Longitude:</span>
                      <span style={{ color: lightGoldColor }}>{vedicTime.moonLongitude.toFixed(2)}°</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sun Longitude:</span>
                      <span style={{ color: lightGoldColor }}>{vedicTime.sunLongitude.toFixed(2)}°</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Elongation:</span>
                      <span style={{ color: lightGoldColor }}>{vedicTime.elongation.toFixed(2)}°</span>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Footer */}
              <div
                className="px-5 py-3 border-t text-center text-xs"
                style={{
                  borderColor: `${goldColor}30`,
                  color: dimGoldColor,
                  background: `linear-gradient(to top, ${goldColor}10, transparent)`,
                }}
              >
                Current time: {currentTime.toLocaleTimeString()}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
