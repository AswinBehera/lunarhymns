/**
 * MuhurtaRing Component
 *
 * Renders a ring showing the 30 muhurtas (time divisions of 48 minutes each).
 * Positioned between the middle and inner rings at radius ~250px.
 * Highlights the current muhurta and shows progress through it.
 */

import { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MUHURTA_NAMES } from '../../lib/vedic-calendar';
import type { MuhurtaData } from '../../lib/vedic-calendar';
import { getMuhurtaDetails } from '../../data/muhurtaDetails';
import type { MuhurtaDetail } from '../../data/muhurtaDetails';
import { MuhurtaInfoPanel } from './MuhurtaInfoPanel';

interface MuhurtaRingProps {
  /** Current muhurta data */
  muhurta: MuhurtaData;
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
 * Create an SVG arc path
 */
function describeArc(
  x: number,
  y: number,
  radius: number,
  startAngle: number,
  endAngle: number
): string {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  return [
    'M', start.x, start.y,
    'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y
  ].join(' ');
}

/**
 * Muhurta ring visualization with 30 segments
 */
const MuhurtaRingComponent = ({ muhurta }: MuhurtaRingProps) => {
  const [hoveredMuhurta, setHoveredMuhurta] = useState<number | null>(null);
  const [selectedMuhurta, setSelectedMuhurta] = useState<MuhurtaDetail | null>(null);

  const centerX = 500;
  const centerY = 500;
  const muhurtaRadius = 280; // Updated to fit between tithi (350) and inner (200)
  const segmentAngle = 360 / 30; // 12 degrees per muhurta

  const goldColor = '#D4AF37';
  const dimGoldColor = '#9A7D28';
  const lightGoldColor = '#F4E5B8';

  return (
    <>
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 1000 1000"
      preserveAspectRatio="xMidYMid meet"
      className="pointer-events-none"
      style={{ zIndex: 5 }}
    >
      <defs>
        {/* Gradient for current muhurta segment */}
        <linearGradient id="muhurtaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={lightGoldColor} stopOpacity="0.4" />
          <stop offset="50%" stopColor={goldColor} stopOpacity="0.6" />
          <stop offset="100%" stopColor={dimGoldColor} stopOpacity="0.4" />
        </linearGradient>

        {/* Glow filter for current muhurta */}
        <filter id="muhurtaGlow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Strong pulse glow */}
        <filter id="muhurtaPulse">
          <feGaussianBlur stdDeviation="5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Main muhurta ring - static, no rotation */}
      <g>
        {/* Base ring circle */}
        <circle
          cx={centerX}
          cy={centerY}
          r={muhurtaRadius}
          fill="none"
          stroke={goldColor}
          strokeWidth="2.5"
          opacity="0.5"
        />

        {/* Draw 30 muhurta segments */}
        {Array.from({ length: 30 }).map((_, index) => {
          const muhurtaNumber = index + 1;
          const startAngle = index * segmentAngle;
          const endAngle = (index + 1) * segmentAngle;
          const midAngle = startAngle + segmentAngle / 2;

          const isActive = muhurtaNumber === muhurta.number;
          const isHovered = muhurtaNumber === hoveredMuhurta;

          // Positions for markers
          const innerPos = polarToCartesian(centerX, centerY, muhurtaRadius - 15, midAngle);
          const outerPos = polarToCartesian(centerX, centerY, muhurtaRadius + 15, midAngle);
          const tickPos = polarToCartesian(centerX, centerY, muhurtaRadius, startAngle);

          return (
            <g key={`muhurta-${index}`}>
              {/* Current muhurta - highlighted arc segment */}
              {isActive && (
                <>
                  {/* Background arc for current muhurta */}
                  <motion.path
                    d={describeArc(centerX, centerY, muhurtaRadius, startAngle, endAngle)}
                    fill="none"
                    stroke="url(#muhurtaGradient)"
                    strokeWidth="20"
                    opacity="0.5"
                    filter="url(#muhurtaGlow)"
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: [0.5, 0.7, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />

                  {/* Progress arc within current muhurta */}
                  <motion.path
                    d={describeArc(
                      centerX,
                      centerY,
                      muhurtaRadius,
                      startAngle,
                      startAngle + (segmentAngle * muhurta.progress / 100)
                    )}
                    fill="none"
                    stroke={goldColor}
                    strokeWidth="22"
                    opacity="0.8"
                    filter="url(#muhurtaPulse)"
                    strokeLinecap="round"
                    animate={{
                      opacity: [0.8, 1, 0.8],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />

                  {/* Outer glow ring */}
                  <motion.circle
                    cx={centerX}
                    cy={centerY}
                    r={muhurtaRadius}
                    fill="none"
                    stroke={goldColor}
                    strokeWidth="3"
                    opacity="0.3"
                    filter="url(#muhurtaPulse)"
                    animate={{
                      r: [muhurtaRadius - 2, muhurtaRadius + 2, muhurtaRadius - 2],
                      opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </>
              )}

              {/* Tick marks at muhurta boundaries */}
              <motion.line
                x1={tickPos.x}
                y1={tickPos.y}
                x2={centerX + (muhurtaRadius - 8) * Math.cos(((startAngle - 90) * Math.PI) / 180)}
                y2={centerY + (muhurtaRadius - 8) * Math.sin(((startAngle - 90) * Math.PI) / 180)}
                stroke={isActive ? goldColor : dimGoldColor}
                strokeWidth={isActive ? 2 : 1}
                opacity={isActive ? 0.9 : isHovered ? 0.6 : 0.3}
                style={{ pointerEvents: 'all', cursor: 'pointer' }}
                onMouseEnter={() => setHoveredMuhurta(muhurtaNumber)}
                onMouseLeave={() => setHoveredMuhurta(null)}
                onClick={() => {
                  const details = getMuhurtaDetails(muhurtaNumber);
                  if (details) setSelectedMuhurta(details);
                }}
              />

              {/* Muhurta markers - small dots */}
              <motion.circle
                cx={innerPos.x}
                cy={innerPos.y}
                r={isActive ? 5 : isHovered ? 4 : 2.5}
                fill={isActive ? lightGoldColor : isHovered ? goldColor : dimGoldColor}
                opacity={isActive ? 1 : isHovered ? 0.8 : 0.4}
                filter={isActive ? 'url(#muhurtaGlow)' : undefined}
                style={{ pointerEvents: 'all', cursor: 'pointer' }}
                onMouseEnter={() => setHoveredMuhurta(muhurtaNumber)}
                onMouseLeave={() => setHoveredMuhurta(null)}
                onClick={() => {
                  const details = getMuhurtaDetails(muhurtaNumber);
                  if (details) setSelectedMuhurta(details);
                }}
                animate={
                  isActive
                    ? {
                        r: [5, 7, 5],
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

              {/* Highlight every 6th muhurta (5 major divisions) */}
              {muhurtaNumber % 6 === 0 && (
                <motion.line
                  x1={innerPos.x}
                  y1={innerPos.y}
                  x2={outerPos.x}
                  y2={outerPos.y}
                  stroke={goldColor}
                  strokeWidth="1.5"
                  opacity="0.4"
                  animate={{
                    opacity: [0.4, 0.6, 0.4],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.1
                  }}
                />
              )}
            </g>
          );
        })}

        {/* Progress indicator - rotating pointer showing current position */}
        {(() => {
          const currentAngle = (muhurta.number - 1) * segmentAngle + (segmentAngle * muhurta.progress / 100);
          const pointerInner = polarToCartesian(centerX, centerY, muhurtaRadius - 25, currentAngle);
          const pointerOuter = polarToCartesian(centerX, centerY, muhurtaRadius + 25, currentAngle);

          return (
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Pointer line */}
              <motion.line
                x1={pointerInner.x}
                y1={pointerInner.y}
                x2={pointerOuter.x}
                y2={pointerOuter.y}
                stroke={lightGoldColor}
                strokeWidth="2.5"
                opacity="0.9"
                filter="url(#muhurtaGlow)"
                strokeLinecap="round"
                animate={{
                  opacity: [0.9, 1, 0.9],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              {/* Pointer head - small circle */}
              <motion.circle
                cx={pointerOuter.x}
                cy={pointerOuter.y}
                r={4}
                fill={lightGoldColor}
                opacity="1"
                filter="url(#muhurtaPulse)"
                animate={{
                  r: [4, 5, 4],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.g>
          );
        })()}
      </g>

      {/* Hover tooltip - shows muhurta name */}
      <AnimatePresence>
        {hoveredMuhurta !== null && (
          <motion.g
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            style={{ pointerEvents: 'none' }}
          >
            {(() => {
              const angle = ((hoveredMuhurta - 1) * segmentAngle) + (segmentAngle / 2);
              const labelPos = polarToCartesian(centerX, centerY, muhurtaRadius + 50, angle);
              const muhurtaInfo = MUHURTA_NAMES[hoveredMuhurta - 1];

              return (
                <>
                  {/* Tooltip background */}
                  <rect
                    x={labelPos.x - 70}
                    y={labelPos.y - 25}
                    width="140"
                    height="50"
                    fill="rgba(0, 0, 0, 0.9)"
                    stroke={goldColor}
                    strokeWidth="1.5"
                    rx="6"
                    filter="url(#muhurtaGlow)"
                  />

                  {/* Muhurta name in English */}
                  <text
                    x={labelPos.x}
                    y={labelPos.y - 5}
                    textAnchor="middle"
                    fill={lightGoldColor}
                    fontSize="13"
                    fontFamily="system-ui"
                    fontWeight="600"
                  >
                    {muhurtaInfo.name}
                  </text>

                  {/* Muhurta name in Sanskrit */}
                  <text
                    x={labelPos.x}
                    y={labelPos.y + 12}
                    textAnchor="middle"
                    fill={goldColor}
                    fontSize="11"
                    fontFamily='"Noto Sans Devanagari", serif'
                    fontWeight="500"
                  >
                    {muhurtaInfo.sanskrit}
                  </text>
                </>
              );
            })()}
          </motion.g>
        )}
      </AnimatePresence>
    </svg>

    {/* Muhurta info panel */}
    <MuhurtaInfoPanel
      muhurta={selectedMuhurta}
      onClose={() => setSelectedMuhurta(null)}
    />
  </>
  );
};

// Memoize to prevent unnecessary re-renders
export const MuhurtaRing = memo(MuhurtaRingComponent);
