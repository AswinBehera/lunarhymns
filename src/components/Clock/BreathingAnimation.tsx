/**
 * BreathingAnimation Component
 *
 * Displays a meditative breathing visualization with sacred geometry
 * that syncs with the prana cycle. Every 4 seconds (1 prana):
 * - 0-1s: Inhale begins (expand, blue, opacity rises)
 * - 1-2s: Peak inhale (max expansion, full opacity)
 * - 2-3s: Exhale begins (contract, golden, opacity fades)
 * - 3-4s: Complete cycle (return to start)
 */

import { useEffect, useRef, memo } from 'react';
import { motion } from 'framer-motion';
import type { PranaData } from '../../lib/vedic-calendar';

interface BreathingAnimationProps {
  /** Current prana data */
  prana: PranaData;
  /** Enable audio feedback (optional) */
  audioEnabled?: boolean;
}

/**
 * Calculate animation values based on precise progress through 4-second cycle
 */
function getAnimationValues(progress: number): {
  scale: number;
  opacity: number;
  rotation: number;
} {
  // progress is 0-100 over 4 seconds
  // 0-25: Inhale begins (0-1s)
  // 25-50: Peak inhale (1-2s)
  // 50-75: Exhale begins (2-3s)
  // 75-100: Complete (3-4s)

  if (progress < 25) {
    // 0-1s: scale 0.5 → 1, opacity 0 → 1
    const t = progress / 25;
    return {
      scale: 0.5 + t * 0.5,
      opacity: t,
      rotation: t * 90,
    };
  } else if (progress < 50) {
    // 1-2s: scale 1 → 1.2, opacity 1 → 0.8
    const t = (progress - 25) / 25;
    return {
      scale: 1 + t * 0.2,
      opacity: 1 - t * 0.2,
      rotation: 90 + t * 90,
    };
  } else if (progress < 75) {
    // 2-3s: scale 1.2 → 1, opacity 0.8 → 1
    const t = (progress - 50) / 25;
    return {
      scale: 1.2 - t * 0.2,
      opacity: 0.8 + t * 0.2,
      rotation: 180 + t * 90,
    };
  } else {
    // 3-4s: scale 1 → 0.5, opacity 1 → 0
    const t = (progress - 75) / 25;
    return {
      scale: 1 - t * 0.5,
      opacity: 1 - t,
      rotation: 270 + t * 90,
    };
  }
}

/**
 * Breathing visualization with expanding/contracting mandala
 */
const BreathingAnimationComponent = ({ prana, audioEnabled = false }: BreathingAnimationProps) => {
  const centerX = 500;
  const centerY = 500;
  const audioContextRef = useRef<AudioContext | null>(null);
  const lastPranaRef = useRef(prana.number);

  // Colors for breath phases
  const inhaleColor = '#4A90E2'; // Soft blue
  const exhaleColor = '#D4AF37'; // Golden
  const transitionColor = '#7EC8E3'; // Blend color

  // Determine current color based on progress
  let currentColor: string;
  if (prana.progress < 25) {
    currentColor = inhaleColor;
  } else if (prana.progress < 50) {
    currentColor = transitionColor;
  } else if (prana.progress < 75) {
    currentColor = exhaleColor;
  } else {
    currentColor = transitionColor;
  }

  // Get animation values based on progress
  const { scale, opacity, rotation } = getAnimationValues(prana.progress);
  const baseRadius = 50;
  const currentRadius = baseRadius * scale;

  // Play sound at the start of each prana (optional)
  useEffect(() => {
    if (audioEnabled && prana.number !== lastPranaRef.current) {
      playBreathSound(prana.progress < 50 ? 'inhale' : 'exhale');
      lastPranaRef.current = prana.number;
    }
  }, [prana.number, audioEnabled, prana.progress]);


  /**
   * Play a subtle breath sound (Web Audio API)
   */
  const playBreathSound = (phase: 'inhale' | 'exhale') => {
    if (typeof window === 'undefined') return;

    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const ctx = audioContextRef.current;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      // Different frequencies for inhale vs exhale
      oscillator.frequency.value = phase === 'inhale' ? 528 : 396; // Solfeggio frequencies
      oscillator.type = 'sine';

      // Gentle fade in and out
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.1);
      gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.5);
    } catch (error) {
      console.warn('Audio playback not supported:', error);
    }
  };

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 1000 1000"
      preserveAspectRatio="xMidYMid meet"
      className="pointer-events-none"
      style={{ zIndex: 6 }}
    >
      <defs>
        {/* Radial gradient for breath circles */}
        <radialGradient id="breathGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={currentColor} stopOpacity={opacity * 0.8} />
          <stop offset="50%" stopColor={currentColor} stopOpacity={opacity * 0.4} />
          <stop offset="100%" stopColor={currentColor} stopOpacity="0" />
        </radialGradient>

        {/* Glow filter for breath */}
        <filter id="breathGlow">
          <feGaussianBlur stdDeviation="10" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Soft glow */}
        <filter id="breathSoftGlow">
          <feGaussianBlur stdDeviation="5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Lotus petal shape */}
        <path
          id="lotusPetal"
          d="M 0,-40 Q 15,-20 0,0 Q -15,-20 0,-40 Z"
          fill={currentColor}
        />
      </defs>

      <motion.g
        animate={{
          scale,
          opacity,
          rotate: rotation,
        }}
        transition={{
          duration: 0.5,
          ease: "easeOut"
        }}
        style={{ transformOrigin: '500px 500px' }}
      >
        {/* Main breathing circle with gradient fill */}
        <circle
          cx={centerX}
          cy={centerY}
          r={currentRadius * 3}
          fill="url(#breathGradient)"
          filter="url(#breathGlow)"
        />

        {/* Sacred geometry rings */}
        <circle
          cx={centerX}
          cy={centerY}
          r={currentRadius * 2.5}
          fill="none"
          stroke={currentColor}
          strokeWidth="2"
          opacity={opacity * 0.6}
          filter="url(#breathSoftGlow)"
        />

        <circle
          cx={centerX}
          cy={centerY}
          r={currentRadius * 2}
          fill="none"
          stroke={currentColor}
          strokeWidth="1.5"
          opacity={opacity * 0.7}
          filter="url(#breathSoftGlow)"
        />

        <circle
          cx={centerX}
          cy={centerY}
          r={currentRadius * 1.5}
          fill="none"
          stroke={currentColor}
          strokeWidth="1"
          opacity={opacity * 0.8}
        />

        {/* Lotus mandala - 8 petals */}
        {Array.from({ length: 8 }).map((_, index) => {
          const angle = (index * 360) / 8;
          const petalDistance = currentRadius * 1.8;

          return (
            <g
              key={`petal-${index}`}
              transform={`translate(${centerX}, ${centerY}) rotate(${angle})`}
              opacity={opacity * 0.6}
            >
              <use
                href="#lotusPetal"
                transform={`translate(0, -${petalDistance})`}
                fill={currentColor}
                filter="url(#breathSoftGlow)"
              />
            </g>
          );
        })}

        {/* Flowing particles - move inward on exhale, outward on inhale */}
        {Array.from({ length: 12 }).map((_, index) => {
          const angle = (index * 360) / 12 + rotation;

          // Calculate particle position based on breath phase
          // Inhale (0-50): particles move outward
          // Exhale (50-100): particles move inward
          let particleDistance;
          if (prana.progress < 50) {
            particleDistance = currentRadius * (0.5 + prana.progress / 100);
          } else {
            particleDistance = currentRadius * (1.5 - (prana.progress - 50) / 100);
          }

          const x = centerX + particleDistance * Math.cos((angle * Math.PI) / 180);
          const y = centerY + particleDistance * Math.sin((angle * Math.PI) / 180);
          const particleSize = 2 + scale * 2;

          return (
            <circle
              key={`particle-${index}`}
              cx={x}
              cy={y}
              r={particleSize}
              fill={currentColor}
              opacity={opacity * 0.8}
              filter="url(#breathSoftGlow)"
            />
          );
        })}

        {/* Center yantra - sacred geometry */}
        <circle
          cx={centerX}
          cy={centerY}
          r={currentRadius * 0.8}
          fill="none"
          stroke={currentColor}
          strokeWidth="1"
          opacity={opacity * 0.9}
        />

        <circle
          cx={centerX}
          cy={centerY}
          r={currentRadius * 0.5}
          fill="none"
          stroke={currentColor}
          strokeWidth="1"
          opacity={opacity * 0.7}
        />

        {/* Center dot - bindu */}
        <circle
          cx={centerX}
          cy={centerY}
          r={6 * scale}
          fill={currentColor}
          opacity={opacity}
          filter="url(#breathSoftGlow)"
        />

        {/* Ripple effect at transitions */}
        {(prana.progress < 5 || (prana.progress > 48 && prana.progress < 52)) && (
          <>
            <circle
              cx={centerX}
              cy={centerY}
              r={currentRadius * 2}
              fill="none"
              stroke={currentColor}
              strokeWidth="2"
              opacity={opacity * 0.3}
            >
              <animate
                attributeName="r"
                from={currentRadius * 2}
                to={currentRadius * 3.5}
                dur="1s"
                repeatCount="1"
              />
              <animate
                attributeName="opacity"
                from={opacity * 0.5}
                to="0"
                dur="1s"
                repeatCount="1"
              />
            </circle>
          </>
        )}
      </motion.g>
    </svg>
  );
};

// Memoize to prevent unnecessary re-renders
export const BreathingAnimation = memo(BreathingAnimationComponent);
