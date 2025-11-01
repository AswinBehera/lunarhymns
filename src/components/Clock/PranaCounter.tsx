/**
 * PranaCounter Component
 *
 * Displays prana progress through the day including:
 * - Total pranas elapsed since sunrise
 * - Pranas remaining until next sunrise
 * - Visual progress bar
 * - Percentage complete
 */

import { memo } from 'react';
import { motion } from 'framer-motion';
import type { PranaData } from '../../lib/vedic-calendar';
import { PRANA_CONSTANTS } from '../../lib/vedic-calendar';

interface PranaCounterProps {
  /** Current prana data */
  prana: PranaData;
}

/**
 * Prana progress display with counter and bar
 */
const PranaCounterComponent = ({ prana }: PranaCounterProps) => {
  const pranaColor = '#87CEEB';
  const pranaGlowColor = '#B0E0E6';

  // Calculate pranas remaining
  const pranasRemaining = PRANA_CONSTANTS.PRANAS_PER_DAY - prana.number;

  // Calculate percentage of day complete
  const dayProgress = (prana.number / PRANA_CONSTANTS.PRANAS_PER_DAY) * 100;

  return (
    <div className="fixed top-4 right-4 z-40 pointer-events-auto">
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="bg-slate-900/90 backdrop-blur-md rounded-xl border shadow-2xl"
        style={{
          borderColor: `${pranaColor}60`,
          boxShadow: `0 0 20px ${pranaColor}30`,
        }}
      >
        {/* Header */}
        <div
          className="px-4 py-2 border-b"
          style={{
            borderColor: `${pranaColor}40`,
            background: `linear-gradient(to bottom, ${pranaColor}15, transparent)`,
          }}
        >
          <h3
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: pranaGlowColor }}
          >
            Prana Counter
          </h3>
        </div>

        {/* Content */}
        <div className="px-4 py-3 space-y-3">
          {/* Current prana number */}
          <div>
            <div
              className="text-xs mb-1"
              style={{ color: pranaColor, opacity: 0.7 }}
            >
              Current Prana
            </div>
            <motion.div
              key={prana.number}
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-2xl font-bold"
              style={{ color: pranaGlowColor }}
            >
              {prana.number.toLocaleString()}
            </motion.div>
          </div>

          {/* Progress bar */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span style={{ color: pranaColor, opacity: 0.7 }}>
                Day Progress
              </span>
              <motion.span
                key={Math.floor(dayProgress)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ color: pranaGlowColor }}
              >
                {dayProgress.toFixed(1)}%
              </motion.span>
            </div>

            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  backgroundColor: pranaColor,
                  boxShadow: `0 0 10px ${pranaColor}`,
                }}
                animate={{
                  width: `${dayProgress}%`,
                }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Pranas remaining */}
          <div className="flex items-center justify-between">
            <span
              className="text-xs"
              style={{ color: pranaColor, opacity: 0.7 }}
            >
              Remaining
            </span>
            <span className="text-sm font-semibold" style={{ color: pranaGlowColor }}>
              {pranasRemaining.toLocaleString()}
            </span>
          </div>

          {/* Breath phase indicator */}
          <div
            className="pt-2 border-t text-center"
            style={{ borderColor: `${pranaColor}30` }}
          >
            <div
              className="text-xs uppercase tracking-wider mb-1"
              style={{ color: pranaColor, opacity: 0.7 }}
            >
              Breathing
            </div>
            <motion.div
              key={prana.breathPhase}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium"
              style={{
                backgroundColor:
                  prana.breathPhase === 'inhale'
                    ? 'rgba(74, 144, 226, 0.2)'
                    : 'rgba(212, 175, 55, 0.2)',
                border: `1px solid ${
                  prana.breathPhase === 'inhale' ? '#4A90E2' : '#D4AF37'
                }`,
                color:
                  prana.breathPhase === 'inhale' ? '#4A90E2' : '#D4AF37',
              }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor:
                    prana.breathPhase === 'inhale' ? '#4A90E2' : '#D4AF37',
                }}
              />
              {prana.breathPhase === 'inhale' ? 'Inhale' : 'Exhale'}
            </motion.div>
          </div>

          {/* Time info */}
          <div
            className="pt-2 border-t text-xs text-center"
            style={{
              borderColor: `${pranaColor}30`,
              color: pranaColor,
              opacity: 0.6,
            }}
          >
            1 Prana = 4 seconds
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Memoize to prevent unnecessary re-renders
export const PranaCounter = memo(PranaCounterComponent);
