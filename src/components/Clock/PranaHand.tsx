/**
 * PranaHand Component
 *
 * Displays a clock-like hand showing the current prana (breath cycle).
 * The hand completes one full rotation every 21,600 pranas (24 hours).
 * Styled as an ethereal, glowing element distinct from traditional clock hands.
 */

import { motion } from 'framer-motion';
import type { PranaData } from '../../lib/vedic-calendar';

interface PranaHandProps {
  /** Current prana data */
  prana: PranaData;
}

/**
 * Calculate position on a circle given angle and radius
 */
function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
): { x: number; y: number } {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

/**
 * Prana hand - ethereal clock hand showing breath cycles
 */
export function PranaHand({ prana }: PranaHandProps) {
  const centerX = 500;
  const centerY = 500;
  const handLength = 260; // Extends to just inside muhurta ring (280px)

  // Soft cyan/silver color for distinction
  const pranaColor = '#87CEEB'; // Sky blue
  const pranaGlowColor = '#B0E0E6'; // Powder blue
  const pranaTrailColor = '#ADD8E6'; // Light blue

  // Calculate hand tip position
  const tipPos = polarToCartesian(centerX, centerY, handLength, prana.angle);

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 1000 1000"
      preserveAspectRatio="xMidYMid meet"
      className="pointer-events-none"
      style={{ zIndex: 8 }}
    >
      <defs>
        {/* Gradient for prana hand */}
        <linearGradient id="pranaGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={pranaColor} stopOpacity="0.1" />
          <stop offset="50%" stopColor={pranaColor} stopOpacity="0.7" />
          <stop offset="100%" stopColor={pranaGlowColor} stopOpacity="0.9" />
        </linearGradient>

        {/* Glow filter for prana hand */}
        <filter id="pranaGlow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Trail blur effect */}
        <filter id="pranaTrail">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Strong pulse glow */}
        <filter id="pranaPulse">
          <feGaussianBlur stdDeviation="6" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g>
        {/* Breath trail effect - fading trail behind the hand */}
        {Array.from({ length: 8 }).map((_, index) => {
          const trailAngle = prana.angle - (index + 1) * 2;
          const trailPos = polarToCartesian(centerX, centerY, handLength - 20, trailAngle);
          const opacity = 0.4 - (index * 0.05);

          return (
            <motion.line
              key={`trail-${index}`}
              x1={centerX}
              y1={centerY}
              x2={trailPos.x}
              y2={trailPos.y}
              stroke={pranaTrailColor}
              strokeWidth={2 - index * 0.2}
              opacity={opacity}
              filter="url(#pranaTrail)"
              strokeLinecap="round"
              initial={{ opacity: 0 }}
              animate={{ opacity }}
              transition={{ duration: 0.5 }}
            />
          );
        })}

        {/* Main prana hand */}
        <motion.line
          x1={centerX}
          y1={centerY}
          x2={tipPos.x}
          y2={tipPos.y}
          stroke="url(#pranaGradient)"
          strokeWidth="3"
          opacity="0.85"
          filter="url(#pranaGlow)"
          strokeLinecap="round"
          animate={{
            opacity: [0.85, 0.95, 0.85],
          }}
          transition={{
            duration: 4, // Breathe every 4 seconds (1 prana)
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Hand tip - glowing circle */}
        <motion.circle
          cx={tipPos.x}
          cy={tipPos.y}
          r={6}
          fill={pranaGlowColor}
          opacity="0.9"
          filter="url(#pranaPulse)"
          animate={{
            r: [6, 8, 6],
            opacity: [0.9, 1, 0.9],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Inner glow at tip */}
        <motion.circle
          cx={tipPos.x}
          cy={tipPos.y}
          r={4}
          fill={pranaColor}
          opacity="1"
          animate={{
            r: [4, 5, 4],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Center hub - connection point */}
        <motion.circle
          cx={centerX}
          cy={centerY}
          r={12}
          fill="none"
          stroke={pranaColor}
          strokeWidth="2"
          opacity="0.6"
          filter="url(#pranaGlow)"
          animate={{
            r: [12, 14, 12],
            opacity: [0.6, 0.8, 0.6],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Center dot */}
        <circle
          cx={centerX}
          cy={centerY}
          r={3}
          fill={pranaGlowColor}
          opacity="0.9"
        />

        {/* Breath phase indicator - expanding/contracting ring */}
        {prana.breathPhase === 'inhale' ? (
          <motion.circle
            cx={centerX}
            cy={centerY}
            r={30}
            fill="none"
            stroke={pranaColor}
            strokeWidth="1"
            opacity="0.3"
            filter="url(#pranaGlow)"
            initial={{ r: 30, opacity: 0.1 }}
            animate={{
              r: 30 + (prana.breathPhaseProgress / 100) * 20,
              opacity: 0.1 + (prana.breathPhaseProgress / 100) * 0.3,
            }}
            transition={{ duration: 0.5 }}
          />
        ) : (
          <motion.circle
            cx={centerX}
            cy={centerY}
            r={50}
            fill="none"
            stroke={pranaTrailColor}
            strokeWidth="1"
            opacity="0.4"
            filter="url(#pranaGlow)"
            initial={{ r: 50, opacity: 0.4 }}
            animate={{
              r: 50 - (prana.breathPhaseProgress / 100) * 20,
              opacity: 0.4 - (prana.breathPhaseProgress / 100) * 0.3,
            }}
            transition={{ duration: 0.5 }}
          />
        )}

        {/* Prana number display near the hand tip */}
        <g opacity="0.8">
          {/* Background for text */}
          <motion.rect
            x={tipPos.x + 15}
            y={tipPos.y - 12}
            width="70"
            height="24"
            fill="rgba(0, 0, 0, 0.7)"
            stroke={pranaColor}
            strokeWidth="1"
            rx="4"
            filter="url(#pranaGlow)"
            animate={{
              opacity: [0.7, 0.9, 0.7],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Prana number text */}
          <text
            x={tipPos.x + 50}
            y={tipPos.y + 3}
            textAnchor="middle"
            fill={pranaGlowColor}
            fontSize="11"
            fontFamily="system-ui"
            fontWeight="600"
          >
            {prana.number.toLocaleString()}
          </text>
        </g>

        {/* Decorative arc showing prana progress within the day */}
        <motion.circle
          cx={centerX}
          cy={centerY}
          r={handLength + 5}
          fill="none"
          stroke={pranaColor}
          strokeWidth="0.5"
          opacity="0.2"
          strokeDasharray={`${(prana.angle / 360) * (2 * Math.PI * (handLength + 5))} ${2 * Math.PI * (handLength + 5)}`}
          strokeDashoffset={0}
          filter="url(#pranaTrail)"
          animate={{
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </g>
    </svg>
  );
}
