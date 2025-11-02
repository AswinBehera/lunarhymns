/**
 * Color Palette
 *
 * Centralized color definitions for consistent theming.
 * Dark, cosmic theme with gold and cyan accents.
 */

export const COLORS = {
  // Background colors
  background: {
    primary: 'rgb(10, 15, 30)',           // Very dark blue-black
    secondary: 'rgb(15, 23, 42)',          // Slightly lighter
    elevated: 'rgb(20, 30, 50)',          // Elevated card background
    panel: 'rgba(15, 23, 42, 0.95)',      // Panel background with transparency
    panelHover: 'rgba(15, 23, 42, 0.98)', // Panel hover state
  },

  // Accent colors
  accent: {
    gold: '#D4AF37',                       // Primary accent (gold)
    goldLight: '#F4E5B8',                  // Light gold
    goldDim: '#9A7D28',                    // Dim gold
    cyan: '#4DD0E1',                       // Secondary accent (cyan/prana)
    cyanLight: '#87CEEB',                  // Light cyan
    cyanDim: '#26A69A',                    // Dim cyan
    purple: '#9B7EBD',                     // Purple for symbolism/spiritual
    purpleLight: '#C9A7D8',                // Light purple
    purpleDim: '#6B5684',                  // Dim purple
  },

  // Text colors
  text: {
    primary: 'rgba(255, 255, 255, 0.95)',  // White
    secondary: 'rgba(255, 255, 255, 0.75)', // Light gray
    tertiary: 'rgba(255, 255, 255, 0.6)',  // Medium gray
    disabled: 'rgba(255, 255, 255, 0.4)',  // Dim gray
  },

  // Border colors
  border: {
    subtle: 'rgba(212, 175, 55, 0.2)',     // Subtle gold border
    normal: 'rgba(212, 175, 55, 0.3)',     // Normal gold border
    strong: 'rgba(212, 175, 55, 0.5)',     // Strong gold border
  },

  // Status colors
  status: {
    success: '#4CAF50',                    // Green
    warning: '#FFC107',                    // Amber
    error: '#F44336',                      // Red
    info: '#2196F3',                       // Blue
  },

  // Semantic colors
  semantic: {
    inhale: '#4DD0E1',                     // Cyan for inhale
    exhale: '#D4AF37',                     // Gold for exhale
    active: '#D4AF37',                     // Active state
    inactive: 'rgba(212, 175, 55, 0.3)',   // Inactive state
  },
} as const;

/**
 * Typography scale
 */
export const TYPOGRAPHY = {
  fontSize: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
  },

  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

/**
 * Spacing scale (Tailwind-like)
 */
export const SPACING = {
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
} as const;

/**
 * Animation durations
 */
export const ANIMATION = {
  duration: {
    fast: 150,      // 150ms - Button hover
    normal: 200,    // 200ms - Modal fade
    panel: 300,     // 300ms - Panel slide
    prana: 4000,    // 4000ms - Breathing cycle
  },

  easing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
} as const;

/**
 * Z-index layers
 */
export const Z_INDEX = {
  background: 0,
  base: 10,
  panels: 30,
  modal: 40,
  notification: 50,
  tooltip: 60,
} as const;

/**
 * Border radius
 */
export const BORDER_RADIUS = {
  none: '0',
  sm: '0.25rem',    // 4px
  md: '0.5rem',     // 8px
  lg: '0.75rem',    // 12px
  xl: '1rem',       // 16px
  full: '9999px',   // Fully rounded
} as const;

/**
 * Shadows
 */
export const SHADOWS = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  glow: '0 0 20px rgba(212, 175, 55, 0.4)',
  glowCyan: '0 0 20px rgba(77, 208, 225, 0.4)',
} as const;

/**
 * Helper function to create RGBA color with opacity
 */
export function withOpacity(color: string, opacity: number): string {
  // If color is already rgb/rgba, extract RGB values
  const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (rgbMatch) {
    return `rgba(${rgbMatch[1]}, ${rgbMatch[2]}, ${rgbMatch[3]}, ${opacity})`;
  }

  // If hex color, convert to rgba
  if (color.startsWith('#')) {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  return color;
}

/**
 * Get color with opacity
 */
export function getColor(color: string, opacity?: number): string {
  if (opacity !== undefined) {
    return withOpacity(color, opacity);
  }
  return color;
}
