/**
 * BreathingButton Component
 *
 * A central breathing/meditation button positioned at the clock center.
 * Features:
 * - Om symbol (ॐ) icon
 * - Pulsating animation synchronized with prana cycle
 * - Golden glow effect
 * - Opens breathing guide on click
 */

import { motion } from 'framer-motion';
import type { PranaData } from '../../lib/vedic-calendar';

interface BreathingButtonProps {
  /** Current prana data for syncing pulse */
  prana: PranaData;
  /** Click handler to open breathing guide */
  onClick: () => void;
}

/**
 * Central breathing meditation button
 */
export function BreathingButton({ prana, onClick }: BreathingButtonProps) {
  const goldColor = '#D4AF37';
  const cyanColor = '#87CEEB';

  // Blend colors based on breath phase
  const currentColor = prana.breathPhase === 'inhale' ? cyanColor : goldColor;
  const buttonSize = 80;

  return (
    <motion.button
      onClick={onClick}
      className="relative z-20 rounded-full flex items-center justify-center cursor-pointer"
      style={{
        width: buttonSize,
        height: buttonSize,
        backgroundColor: 'rgba(15, 23, 42, 0.8)',
        border: `2px solid ${currentColor}`,
        boxShadow: `0 0 30px ${currentColor}80, inset 0 0 20px ${currentColor}30`,
        backdropFilter: 'blur(10px)',
      }}
      animate={{
        scale: [1, 1.08, 1],
        boxShadow: [
          `0 0 30px ${currentColor}80, inset 0 0 20px ${currentColor}30`,
          `0 0 45px ${currentColor}90, inset 0 0 30px ${currentColor}40`,
          `0 0 30px ${currentColor}80, inset 0 0 20px ${currentColor}30`,
        ],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      whileHover={{
        scale: 1.15,
        transition: { duration: 0.2 }
      }}
      whileTap={{
        scale: 0.95,
        transition: { duration: 0.1 }
      }}
    >
      {/* Om symbol */}
      <motion.div
        className="text-4xl font-bold select-none"
        style={{
          color: currentColor,
          fontFamily: '"Noto Sans Devanagari", serif',
          textShadow: `0 0 10px ${currentColor}`,
        }}
        animate={{
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        ॐ
      </motion.div>

      {/* Outer ripple effect */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          border: `1px solid ${currentColor}`,
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.6, 0, 0.6],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeOut"
        }}
      />

      {/* Inner glow circle */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: buttonSize * 0.6,
          height: buttonSize * 0.6,
          backgroundColor: `${currentColor}15`,
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.button>
  );
}
