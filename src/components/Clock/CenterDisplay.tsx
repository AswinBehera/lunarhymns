/**
 * CenterDisplay Component
 *
 * Displays the current Vedic time information in the center of the clock:
 * - Tithi name (Sanskrit and English)
 * - Nakshatra name (Sanskrit and English)
 * - Paksha (lunar fortnight)
 * - Masa (lunar month)
 * - Progress indicators
 *
 * Uses elegant typography with support for Devanagari script.
 * Features smooth transitions when values change.
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { VedicTime } from '../../lib/vedic-calendar';

interface CenterDisplayProps {
  vedicTime: VedicTime;
}

/**
 * Format date in DD/MM/YYYY format
 */
function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Format progress as a percentage string
 */
function formatProgress(progress: number): string {
  return `${Math.round(progress)}%`;
}

/**
 * Format time remaining in human-readable format
 */
function formatTimeRemaining(minutes: number): string {
  if (minutes < 60) {
    return `${Math.round(minutes)}m`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return `${hours}h ${mins}m`;
}

/**
 * Central information display with Vedic time details
 */
export function CenterDisplay({ vedicTime }: CenterDisplayProps) {
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

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  // Item animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.04, 0.62, 0.23, 0.98] as any
      }
    }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center max-w-md"
      >
        {/* Main Tithi Display */}
        <motion.div variants={itemVariants} className="mb-6">
          <motion.div
            className="text-sm uppercase tracking-wider mb-2"
            style={{ color: goldColor }}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            {vedicTime.paksha} Paksha
          </motion.div>

          {/* Tithi name - larger, prominent with smooth transition */}
          <div className="mb-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={vedicTime.tithi}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="text-4xl font-bold mb-1"
                style={{
                  color: lightGoldColor,
                  textShadow: `0 0 20px ${goldColor}40`,
                }}
              >
                {vedicTime.tithiName.split('(')[0].trim()}
              </motion.div>
            </AnimatePresence>
            <motion.div
              className="text-sm opacity-70"
              style={{ color: lightGoldColor }}
              animate={{ opacity: [0.5, 0.7, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              Tithi {vedicTime.tithi}
            </motion.div>
          </div>

          {/* Tithi progress bar */}
          <div className="mt-3 mb-2">
            <div className="flex justify-between text-xs mb-1" style={{ color: goldColor }}>
              <span>Progress</span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={vedicTime.tithiProgress}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  {formatProgress(vedicTime.tithiProgress)}
                </motion.span>
              </AnimatePresence>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  backgroundColor: goldColor,
                  boxShadow: `0 0 10px ${goldColor}`,
                }}
                animate={{
                  width: `${vedicTime.tithiProgress}%`,
                  boxShadow: [
                    `0 0 10px ${goldColor}`,
                    `0 0 15px ${goldColor}`,
                    `0 0 10px ${goldColor}`,
                  ],
                }}
                transition={{
                  width: { duration: 0.8, ease: "easeOut" },
                  boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
              />
            </div>
            <div className="text-xs mt-1 opacity-60" style={{ color: goldColor }}>
              Next in {formatTimeRemaining(vedicTime.minutesToNextTithi)}
            </div>
          </div>
        </motion.div>

        {/* Divider with pulse */}
        <motion.div
          variants={itemVariants}
          className="w-32 h-px mx-auto my-6"
          style={{ backgroundColor: goldColor, opacity: 0.3 }}
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Nakshatra Display */}
        <motion.div variants={itemVariants} className="mb-6">
          <motion.div
            className="text-xs uppercase tracking-wider mb-2"
            style={{ color: goldColor }}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          >
            Nakshatra
          </motion.div>
          <AnimatePresence mode="wait">
            <motion.div
              key={vedicTime.nakshatra}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="text-2xl font-semibold mb-1"
              style={{
                color: lightGoldColor,
                textShadow: `0 0 15px ${goldColor}30`,
              }}
            >
              {vedicTime.nakshatraName.split('(')[0].trim()}
            </motion.div>
          </AnimatePresence>
          <motion.div
            className="text-xs opacity-70"
            style={{ color: lightGoldColor }}
            animate={{ opacity: [0.5, 0.7, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          >
            {vedicTime.nakshatra} of 27
          </motion.div>

          {/* Nakshatra progress bar */}
          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1" style={{ color: goldColor }}>
              <span>Progress</span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={vedicTime.nakshatraProgress}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  {formatProgress(vedicTime.nakshatraProgress)}
                </motion.span>
              </AnimatePresence>
            </div>
            <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  backgroundColor: goldColor,
                  opacity: 0.7,
                  boxShadow: `0 0 8px ${goldColor}`,
                }}
                animate={{
                  width: `${vedicTime.nakshatraProgress}%`,
                  boxShadow: [
                    `0 0 8px ${goldColor}`,
                    `0 0 12px ${goldColor}`,
                    `0 0 8px ${goldColor}`,
                  ],
                }}
                transition={{
                  width: { duration: 0.8, ease: "easeOut" },
                  boxShadow: { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
                }}
              />
            </div>
            <div className="text-xs mt-1 opacity-60" style={{ color: goldColor }}>
              Next in {formatTimeRemaining(vedicTime.minutesToNextNakshatra)}
            </div>
          </div>
        </motion.div>

        {/* Divider with pulse */}
        <motion.div
          variants={itemVariants}
          className="w-32 h-px mx-auto my-6"
          style={{ backgroundColor: goldColor, opacity: 0.3 }}
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />

        {/* Masa Display */}
        <motion.div variants={itemVariants}>
          <motion.div
            className="text-xs uppercase tracking-wider mb-1"
            style={{ color: goldColor }}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          >
            Lunar Month
          </motion.div>
          <AnimatePresence mode="wait">
            <motion.div
              key={vedicTime.masa}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="text-lg font-medium"
              style={{
                color: lightGoldColor,
                textShadow: `0 0 10px ${goldColor}20`,
              }}
            >
              {vedicTime.masaName.split('(')[0].trim()}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Moon Phase Visual Indicator */}
        <motion.div variants={itemVariants} className="mt-6">
          <motion.div
            className="text-xs uppercase tracking-wider mb-2"
            style={{ color: goldColor }}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          >
            Moon Phase
          </motion.div>
          <div className="flex items-center justify-center gap-2">
            {/* Visual moon phase with animation */}
            <motion.div
              className="relative w-12 h-12 rounded-full"
              style={{
                backgroundColor: '#2D3748',
                border: `1px solid ${goldColor}`,
              }}
              animate={{
                boxShadow: [
                  `0 0 5px ${goldColor}40`,
                  `0 0 10px ${goldColor}60`,
                  `0 0 5px ${goldColor}40`,
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {/* Illuminated portion */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `linear-gradient(90deg, ${lightGoldColor} 0%, ${goldColor} 100%)`,
                }}
                animate={{
                  clipPath:
                    vedicTime.moonPhase <= 0.5
                      ? `polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%, 50% ${
                          50 + vedicTime.moonPhase * 100
                        }%)`
                      : `polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% ${
                          (1 - vedicTime.moonPhase) * 100
                        }%)`,
                }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              />
            </motion.div>
            <motion.div
              className="text-sm"
              style={{ color: lightGoldColor }}
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              {(vedicTime.moonPhase * 100).toFixed(1)}%
            </motion.div>
          </div>
        </motion.div>

        {/* Timestamp with fade */}
        <motion.div
          variants={itemVariants}
          className="mt-6 text-xs opacity-50"
          style={{ color: goldColor }}
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          {currentTime.toLocaleTimeString()} • {formatDate(currentTime)}
        </motion.div>
      </motion.div>
    </div>
  );
}
