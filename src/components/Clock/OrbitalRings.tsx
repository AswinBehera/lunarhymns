/**
 * OrbitalRings Component
 *
 * Renders three concentric SVG circles representing the orbital paths:
 * - Outer ring (400px): 27 nakshatra markers
 * - Middle ring (300px): 30 tithi markers
 * - Inner ring (200px): Decorative boundary
 *
 * Styled with golden color (#D4AF37) and subtle glow effects
 * Features slow rotation animation and interactive hover states
 */

import { useState, memo } from 'react';
import { motion } from 'framer-motion';
import { NAKSHATRA_NAMES, TITHI_NAMES } from '../../lib/vedic-calendar';

interface OrbitalRingsProps {
  /** Current tithi number (1-30) for highlighting */
  currentTithi?: number;
  /** Current nakshatra number (1-27) for highlighting */
  currentNakshatra?: number;
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
 * Concentric orbital rings with nakshatra and tithi markers
 */
const OrbitalRingsComponent = ({
  currentTithi = 1,
  currentNakshatra = 1,
}: OrbitalRingsProps) => {
  const [hoveredNakshatra, setHoveredNakshatra] = useState<number | null>(null);
  const [hoveredTithi, setHoveredTithi] = useState<number | null>(null);

  const centerX = 500;
  const centerY = 500;
  const outerRadius = 400;  // Nakshatra ring
  const middleRadius = 350; // Tithi ring (updated from 300)
  const innerRadius = 200;  // Decorative boundary

  // Golden color for rings
  const goldColor = '#D4AF37';
  const dimGoldColor = '#9A7D28';

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 1000 1000"
      preserveAspectRatio="xMidYMid meet"
      className="pointer-events-none"
      style={{ filter: 'drop-shadow(0 0 10px rgba(212, 175, 55, 0.3))', zIndex: 1 }}
    >
      {/* Define gradients and glows */}
      <defs>
        {/* Radial gradient for rings */}
        <radialGradient id="ringGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={goldColor} stopOpacity="0.6" />
          <stop offset="100%" stopColor={goldColor} stopOpacity="0.2" />
        </radialGradient>

        {/* Glow filter */}
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Strong glow filter for pulse effect */}
        <filter id="strongGlow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Main rotating group - very slow 120 second rotation */}
      <motion.g
        animate={{ rotate: 360 }}
        transition={{
          duration: 120,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{ originX: '50%', originY: '50%' }}
      >
        {/* Outer ring - Nakshatra ring */}
        <circle
          cx={centerX}
          cy={centerY}
          r={outerRadius}
          fill="none"
          stroke={goldColor}
          strokeWidth="3"
          opacity="0.8"
          filter="url(#glow)"
        />

        {/* Middle ring - Tithi ring */}
        <circle
          cx={centerX}
          cy={centerY}
          r={middleRadius}
          fill="none"
          stroke={goldColor}
          strokeWidth="3"
          opacity="0.7"
          filter="url(#glow)"
        />

        {/* Inner ring - Decorative boundary */}
        <circle
          cx={centerX}
          cy={centerY}
          r={innerRadius}
          fill="none"
          stroke={goldColor}
          strokeWidth="3"
          opacity="0.6"
          filter="url(#glow)"
        />

        {/* Nakshatra markers on outer ring (27 divisions) */}
        {Array.from({ length: 27 }).map((_, index) => {
          const angle = (index * 360) / 27;
          const pos = polarToCartesian(centerX, centerY, outerRadius, angle);
          const nakshatraNumber = index + 1;
          const isActive = nakshatraNumber === currentNakshatra;
          const isHovered = nakshatraNumber === hoveredNakshatra;

          return (
            <g key={`nakshatra-${index}`}>
              {/* Nakshatra dot */}
              <motion.circle
                cx={pos.x}
                cy={pos.y}
                r={isActive ? 6 : isHovered ? 5 : 4}
                fill={isActive || isHovered ? goldColor : dimGoldColor}
                opacity={isActive ? 1 : isHovered ? 0.8 : 0.5}
                filter={isActive ? 'url(#strongGlow)' : isHovered ? 'url(#glow)' : undefined}
                style={{ cursor: 'pointer', pointerEvents: 'all' }}
                onMouseEnter={() => setHoveredNakshatra(nakshatraNumber)}
                onMouseLeave={() => setHoveredNakshatra(null)}
                animate={
                  isActive
                    ? {
                        r: [6, 8, 6],
                        opacity: [1, 0.7, 1],
                      }
                    : {}
                }
                transition={
                  isActive
                    ? {
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }
                    : {}
                }
              />

              {/* Active nakshatra gets a pulsing outer ring */}
              {isActive && (
                <motion.circle
                  cx={pos.x}
                  cy={pos.y}
                  r={10}
                  fill="none"
                  stroke={goldColor}
                  strokeWidth="1"
                  opacity="0.5"
                  animate={{
                    r: [10, 14, 10],
                    opacity: [0.5, 0.2, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              )}

              {/* Radial line from center to marker */}
              {index % 3 === 0 && (
                <motion.line
                  x1={centerX}
                  y1={centerY}
                  x2={pos.x}
                  y2={pos.y}
                  stroke={goldColor}
                  strokeWidth="0.5"
                  opacity="0.2"
                  animate={{
                    opacity: [0.2, 0.3, 0.2],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.1
                  }}
                />
              )}
            </g>
          );
        })}

        {/* Tithi markers on middle ring (30 divisions) */}
        {Array.from({ length: 30 }).map((_, index) => {
          const angle = (index * 360) / 30;
          const pos = polarToCartesian(centerX, centerY, middleRadius, angle);
          const tithiNumber = index + 1;
          const isActive = tithiNumber === currentTithi;
          const isHovered = tithiNumber === hoveredTithi;

          return (
            <g key={`tithi-${index}`}>
              {/* Tithi tick mark */}
              <motion.circle
                cx={pos.x}
                cy={pos.y}
                r={isActive ? 4 : isHovered ? 3 : 2}
                fill={isActive || isHovered ? goldColor : dimGoldColor}
                opacity={isActive ? 0.9 : isHovered ? 0.7 : 0.3}
                filter={isActive ? 'url(#glow)' : undefined}
                style={{ cursor: 'pointer', pointerEvents: 'all' }}
                onMouseEnter={() => setHoveredTithi(tithiNumber)}
                onMouseLeave={() => setHoveredTithi(null)}
                animate={
                  isActive
                    ? {
                        opacity: [0.9, 0.6, 0.9],
                      }
                    : {}
                }
                transition={
                  isActive
                    ? {
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }
                    : {}
                }
              />

              {/* Highlight every 15th tithi (Purnima and Amavasya) */}
              {tithiNumber % 15 === 0 && (
                <motion.circle
                  cx={pos.x}
                  cy={pos.y}
                  r={6}
                  fill="none"
                  stroke={goldColor}
                  strokeWidth="1"
                  opacity="0.6"
                  animate={{
                    r: [6, 8, 6],
                    opacity: [0.6, 0.3, 0.6],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              )}
            </g>
          );
        })}

        {/* Center decorative symbol - pulsing dot */}
        <motion.circle
          cx={centerX}
          cy={centerY}
          r={8}
          fill={goldColor}
          opacity="0.6"
          filter="url(#glow)"
          animate={{
            r: [8, 10, 8],
            opacity: [0.6, 0.8, 0.6],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Decorative corner marks - cardinal directions */}
        {[0, 90, 180, 270].map((angle, idx) => {
          const innerPos = polarToCartesian(centerX, centerY, innerRadius - 15, angle);
          const outerPos = polarToCartesian(centerX, centerY, innerRadius - 5, angle);

          return (
            <motion.line
              key={`cardinal-${angle}`}
              x1={innerPos.x}
              y1={innerPos.y}
              x2={outerPos.x}
              y2={outerPos.y}
              stroke={goldColor}
              strokeWidth="2"
              opacity="0.4"
              animate={{
                opacity: [0.4, 0.6, 0.4],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: idx * 0.5
              }}
            />
          );
        })}
      </motion.g>

      {/* Hover labels - these don't rotate with the rings */}
      {hoveredNakshatra !== null && (
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Find the nakshatra position */}
          {(() => {
            const angle = ((hoveredNakshatra - 1) * 360) / 27;
            const pos = polarToCartesian(centerX, centerY, outerRadius + 40, angle);
            const nakshatraName = NAKSHATRA_NAMES[hoveredNakshatra - 1];

            return (
              <>
                {/* Background for text */}
                <rect
                  x={pos.x - 60}
                  y={pos.y - 15}
                  width="120"
                  height="30"
                  fill="rgba(0, 0, 0, 0.8)"
                  stroke={goldColor}
                  strokeWidth="1"
                  rx="4"
                />
                {/* Nakshatra name */}
                <text
                  x={pos.x}
                  y={pos.y + 5}
                  textAnchor="middle"
                  fill={goldColor}
                  fontSize="12"
                  fontFamily="system-ui"
                  fontWeight="500"
                >
                  {nakshatraName.split('(')[0].trim()}
                </text>
              </>
            );
          })()}
        </motion.g>
      )}

      {/* Tithi hover labels */}
      {hoveredTithi !== null && (
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {(() => {
            const angle = ((hoveredTithi - 1) * 360) / 30;
            const pos = polarToCartesian(centerX, centerY, middleRadius + 40, angle);
            const tithiName = TITHI_NAMES[(hoveredTithi - 1) % 15];

            return (
              <>
                {/* Background for text */}
                <rect
                  x={pos.x - 55}
                  y={pos.y - 15}
                  width="110"
                  height="30"
                  fill="rgba(0, 0, 0, 0.8)"
                  stroke={goldColor}
                  strokeWidth="1"
                  rx="4"
                />
                {/* Tithi name */}
                <text
                  x={pos.x}
                  y={pos.y + 5}
                  textAnchor="middle"
                  fill={goldColor}
                  fontSize="11"
                  fontFamily="system-ui"
                  fontWeight="500"
                >
                  {tithiName.split('(')[0].trim()}
                </text>
              </>
            );
          })()}
        </motion.g>
      )}
    </svg>
  );
};

// Memoize to prevent unnecessary re-renders
export const OrbitalRings = memo(OrbitalRingsComponent);
