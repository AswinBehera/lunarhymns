/**
 * MoonIndicator Component
 *
 * Displays the Moon's current position on the outer orbital ring
 * based on its nakshatra position. Shows the moon phase (waxing/waning)
 * inside the moon circle using visual dark/light portions.
 */

import { motion } from 'framer-motion';

interface MoonIndicatorProps {
  /** Moon phase as decimal (0 = New Moon, 0.5 = Full Moon, 1 = New Moon) */
  moonPhase: number;

  /** Current nakshatra number (1-27) */
  nakshatra: number;

  /** Progress through current nakshatra (0-100) */
  nakshatraProgress?: number;
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
 * Moon position indicator with visual phase representation
 */
export function MoonIndicator({
  moonPhase,
  nakshatra,
  nakshatraProgress = 0,
}: MoonIndicatorProps) {
  const centerX = 500;
  const centerY = 500;
  const outerRadius = 400;
  const moonRadius = 25;

  // Calculate angle based on nakshatra position
  // Each nakshatra spans 360/27 degrees
  const baseAngle = ((nakshatra - 1) * 360) / 27;
  const progressAngle = (nakshatraProgress / 100) * (360 / 27);
  const angle = baseAngle + progressAngle;

  // Get moon position on the outer ring (for initial placement)
  const moonPos = polarToCartesian(centerX, centerY, outerRadius, 0);

  // Calculate illumination for visual phase
  // moonPhase: 0 = new (dark), 0.25 = first quarter, 0.5 = full, 0.75 = last quarter
  const illumination = moonPhase;

  // Gold and silver colors
  const goldColor = '#D4AF37';
  const silverColor = '#C0C0C0';
  const darkMoonColor = '#2D3748';

  return (
    <svg
      width="1000"
      height="1000"
      viewBox="0 0 1000 1000"
      className="absolute inset-0 pointer-events-none"
    >
      <defs>
        {/* Moon glow filter */}
        <filter id="moonGlow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Radial gradient for moon illumination */}
        <radialGradient id="moonIllumination" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="70%" stopColor={silverColor} stopOpacity="0.7" />
          <stop offset="100%" stopColor={goldColor} stopOpacity="0.5" />
        </radialGradient>
      </defs>

      {/* Animated moon position - rotates smoothly around center */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          rotate: angle
        }}
        transition={{
          opacity: { duration: 0.5 },
          rotate: {
            duration: 2,
            ease: "easeInOut"
          }
        }}
        style={{ originX: '50%', originY: '50%' }}
      >
        {/* Outer glow ring - pulsing effect */}
        <motion.circle
          cx={moonPos.x}
          cy={moonPos.y}
          r={moonRadius + 8}
          fill="none"
          stroke={silverColor}
          strokeWidth="1"
          opacity="0.3"
          filter="url(#moonGlow)"
          animate={{
            r: [moonRadius + 8, moonRadius + 10, moonRadius + 8],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Main moon circle - background (dark side) */}
        <circle
          cx={moonPos.x}
          cy={moonPos.y}
          r={moonRadius}
          fill={darkMoonColor}
          stroke={goldColor}
          strokeWidth="1.5"
        />

        {/* Illuminated portion of moon */}
        {/* Create a clipping path based on moon phase */}
        <defs>
          <clipPath id={`moonClip-${nakshatra}`}>
            {/* For 0-0.5 (new to full): expand from right */}
            {illumination <= 0.5 ? (
              <ellipse
                cx={moonPos.x}
                cy={moonPos.y}
                rx={moonRadius * (illumination * 2)}
                ry={moonRadius}
              />
            ) : (
              /* For 0.5-1 (full to new): shrink from left */
              <ellipse
                cx={moonPos.x}
                cy={moonPos.y}
                rx={moonRadius * ((1 - illumination) * 2)}
                ry={moonRadius}
                transform={`translate(${moonRadius * 2 * (illumination - 0.5)}, 0)`}
              />
            )}
          </clipPath>
        </defs>

        {/* Light portion (illuminated side) */}
        <circle
          cx={moonPos.x}
          cy={moonPos.y}
          r={moonRadius}
          fill="url(#moonIllumination)"
          clipPath={`url(#moonClip-${nakshatra})`}
          filter="url(#moonGlow)"
        />

        {/* Line connecting moon to center (orbital path indicator) */}
        <motion.line
          x1={centerX}
          y1={centerY}
          x2={moonPos.x}
          y2={moonPos.y}
          stroke={goldColor}
          strokeWidth="1"
          opacity="0.2"
          strokeDasharray="5,5"
          animate={{
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Small text label near moon */}
        <text
          x={moonPos.x}
          y={moonPos.y - moonRadius - 15}
          textAnchor="middle"
          fill={goldColor}
          fontSize="12"
          opacity="0.7"
          fontFamily="system-ui"
        >
          {nakshatra}
        </text>
      </motion.g>
    </svg>
  );
}
