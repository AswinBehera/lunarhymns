/**
 * BreathingGuide Component
 *
 * An enhanced, guided breathing mode that helps users synchronize
 * with the prana cycle. Features:
 * - Large, prominent breathing circle
 * - Clear "Breathe In" / "Breathe Out" instructions
 * - Sound cues (optional)
 * - Progress through current breath
 */

import { motion, AnimatePresence } from 'framer-motion';
import type { PranaData } from '../../lib/vedic-calendar';

interface BreathingGuideProps {
  /** Current prana data */
  prana: PranaData;
  /** Whether guide mode is active */
  isActive: boolean;
  /** Callback to toggle guide mode */
  onToggle: () => void;
}

/**
 * Prominent breathing guide overlay
 */
export function BreathingGuide({ prana, isActive, onToggle }: BreathingGuideProps) {
  if (!isActive) {
    return null;
  }

  const isInhale = prana.breathPhase === 'inhale';
  const currentColor = isInhale ? '#4A90E2' : '#D4AF37';
  const instruction = isInhale ? 'Breathe In' : 'Breathe Out';

  // Calculate circle size based on breath phase
  const baseSize = 200;
  const maxSize = 400;
  const currentSize = isInhale
    ? baseSize + (maxSize - baseSize) * (prana.breathPhaseProgress / 100)
    : maxSize - (maxSize - baseSize) * (prana.breathPhaseProgress / 100);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* Close button - highly visible */}
        <button
          onClick={onToggle}
          className="absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            border: '2px solid rgba(255, 255, 255, 0.5)',
            color: '#ffffff',
            backdropFilter: 'blur(10px)',
          }}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Main breathing circle */}
        <div className="text-center">
          <motion.div
            className="mx-auto mb-8 rounded-full relative flex items-center justify-center"
            animate={{
              width: currentSize,
              height: currentSize,
            }}
            transition={{
              duration: 0.5,
              ease: "easeOut"
            }}
            style={{
              backgroundColor: `${currentColor}20`,
              border: `3px solid ${currentColor}`,
              boxShadow: `0 0 60px ${currentColor}60, inset 0 0 40px ${currentColor}30`,
            }}
          >
            {/* Inner circle */}
            <motion.div
              className="absolute rounded-full"
              style={{
                width: currentSize * 0.6,
                height: currentSize * 0.6,
                backgroundColor: `${currentColor}30`,
                border: `2px solid ${currentColor}80`,
              }}
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            {/* Breath phase text */}
            <motion.div
              key={prana.breathPhase}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative z-10 text-3xl font-bold"
              style={{ color: currentColor }}
            >
              {instruction}
            </motion.div>
          </motion.div>

          {/* Progress bar */}
          <div className="max-w-md mx-auto px-8">
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  backgroundColor: currentColor,
                  boxShadow: `0 0 10px ${currentColor}`,
                }}
                animate={{
                  width: `${prana.breathPhaseProgress}%`,
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>

            {/* Progress text */}
            <motion.div
              className="mt-2 text-sm"
              style={{ color: currentColor, opacity: 0.8 }}
            >
              {Math.round(prana.breathPhaseProgress)}%
            </motion.div>
          </div>

          {/* Prana counter */}
          <div className="mt-8 text-sm" style={{ color: currentColor, opacity: 0.6 }}>
            Prana {prana.number.toLocaleString()} of 21,600
          </div>

          {/* Instructions */}
          <div className="mt-12 max-w-sm mx-auto text-slate-400 text-sm leading-relaxed">
            <p>Follow the breathing circle rhythm.</p>
            <p className="mt-2">Each complete cycle is one prana (4 seconds).</p>
            <p className="mt-2" style={{ color: currentColor, opacity: 0.7 }}>
              {isInhale
                ? 'Fill your lungs slowly and deeply...'
                : 'Release gently and completely...'}
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
