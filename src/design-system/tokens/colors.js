/**
 * Design Tokens: Colors
 * 
 * A custom color system designed for enterprise dashboards.
 * NOT based on Material Design. Inspired by Linear, Stripe, Vercel.
 * 
 * Usage: import { colors } from '@/design-system/tokens'
 */

export const colors = {
  // ═══════════════════════════════════════════════════════════════
  // NEUTRAL SCALE (Primary UI colors)
  // Used for backgrounds, text, borders, and most UI elements
  // ═══════════════════════════════════════════════════════════════
  neutral: {
    0: '#FFFFFF',
    50: '#FAFAFA',
    100: '#F4F4F5',
    200: '#E4E4E7',
    300: '#D4D4D8',
    400: '#A1A1AA',
    500: '#71717A',
    600: '#52525B',
    700: '#3F3F46',
    800: '#27272A',
    900: '#18181B',
    950: '#09090B',
  },

  // ═══════════════════════════════════════════════════════════════
  // BRAND COLORS
  // Primary brand identity - Teal/Cyan professional tone
  // ═══════════════════════════════════════════════════════════════
  brand: {
    50: '#ECFEFF',
    100: '#CFFAFE',
    200: '#A5F3FC',
    300: '#67E8F9',
    400: '#22D3EE',
    500: '#06B6D4',  // Primary brand color
    600: '#0891B2',
    700: '#0E7490',
    800: '#155E75',
    900: '#164E63',
  },

  // ═══════════════════════════════════════════════════════════════
  // SEMANTIC COLORS
  // Consistent meaning across the application
  // ═══════════════════════════════════════════════════════════════
  
  // Success - Green for positive actions, confirmations
  success: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    200: '#BBF7D0',
    300: '#86EFAC',
    400: '#4ADE80',
    500: '#22C55E',
    600: '#16A34A',
    700: '#15803D',
    800: '#166534',
    900: '#14532D',
  },

  // Warning - Amber for caution states
  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
  },

  // Error - Red for destructive actions, errors
  error: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
  },

  // Info - Blue for informational states
  info: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
  },

  // ═══════════════════════════════════════════════════════════════
  // ACCENT COLORS
  // For data visualization, badges, and highlights
  // ═══════════════════════════════════════════════════════════════
  accent: {
    violet: '#8B5CF6',
    purple: '#A855F7',
    pink: '#EC4899',
    rose: '#F43F5E',
    orange: '#F97316',
    lime: '#84CC16',
    emerald: '#10B981',
    sky: '#0EA5E9',
  },

  // ═══════════════════════════════════════════════════════════════
  // CHART COLORS
  // Harmonious palette for data visualization
  // ═══════════════════════════════════════════════════════════════
  chart: {
    primary: '#06B6D4',
    secondary: '#8B5CF6',
    tertiary: '#F59E0B',
    quaternary: '#22C55E',
    quinary: '#EC4899',
    senary: '#3B82F6',
  },
};

// ═══════════════════════════════════════════════════════════════
// SEMANTIC ALIASES
// Use these for consistent theming
// ═══════════════════════════════════════════════════════════════
export const semanticColors = {
  // Backgrounds
  bg: {
    primary: colors.neutral[0],
    secondary: colors.neutral[50],
    tertiary: colors.neutral[100],
    inverse: colors.neutral[900],
    brand: colors.brand[500],
    subtle: colors.neutral[50],
    muted: colors.neutral[100],
  },

  // Text
  text: {
    primary: colors.neutral[900],
    secondary: colors.neutral[600],
    tertiary: colors.neutral[500],
    muted: colors.neutral[400],
    inverse: colors.neutral[0],
    brand: colors.brand[600],
    link: colors.brand[600],
    linkHover: colors.brand[700],
  },

  // Borders
  border: {
    default: colors.neutral[200],
    subtle: colors.neutral[100],
    strong: colors.neutral[300],
    focus: colors.brand[500],
    error: colors.error[500],
  },

  // Interactive states
  interactive: {
    default: colors.brand[500],
    hover: colors.brand[600],
    active: colors.brand[700],
    disabled: colors.neutral[300],
  },
};

// ═══════════════════════════════════════════════════════════════
// DARK MODE COLORS
// Inverted semantic colors for dark mode
// ═══════════════════════════════════════════════════════════════
export const darkSemanticColors = {
  bg: {
    primary: colors.neutral[950],
    secondary: colors.neutral[900],
    tertiary: colors.neutral[800],
    inverse: colors.neutral[0],
    brand: colors.brand[500],
    subtle: colors.neutral[900],
    muted: colors.neutral[800],
  },

  text: {
    primary: colors.neutral[50],
    secondary: colors.neutral[400],
    tertiary: colors.neutral[500],
    muted: colors.neutral[600],
    inverse: colors.neutral[900],
    brand: colors.brand[400],
    link: colors.brand[400],
    linkHover: colors.brand[300],
  },

  border: {
    default: colors.neutral[800],
    subtle: colors.neutral[900],
    strong: colors.neutral[700],
    focus: colors.brand[500],
    error: colors.error[500],
  },

  interactive: {
    default: colors.brand[500],
    hover: colors.brand[400],
    active: colors.brand[300],
    disabled: colors.neutral[700],
  },
};

export default colors;
