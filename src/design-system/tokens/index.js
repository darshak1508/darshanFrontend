/**
 * Design Tokens - Central Export
 * 
 * Import all design tokens from this single entry point.
 * 
 * Usage:
 * import { colors, spacing, typography, shadows } from '@/design-system/tokens';
 */

export { colors, semanticColors, darkSemanticColors } from './colors';
export { spacing, componentSpacing, space, toRem } from './spacing';
export { fontFamily, fontSize, fontWeight, textStyles, getFontStyle } from './typography';
export { shadows, darkShadows, radius, transitions, zIndex } from './shadows';

// Theme object for CSS-in-JS or context providers
export const lightTheme = {
  colors: require('./colors').semanticColors,
  spacing: require('./spacing').spacing,
  typography: require('./typography'),
  shadows: require('./shadows').shadows,
  radius: require('./shadows').radius,
  transitions: require('./shadows').transitions,
  zIndex: require('./shadows').zIndex,
};

export const darkTheme = {
  colors: require('./colors').darkSemanticColors,
  spacing: require('./spacing').spacing,
  typography: require('./typography'),
  shadows: require('./shadows').darkShadows,
  radius: require('./shadows').radius,
  transitions: require('./shadows').transitions,
  zIndex: require('./shadows').zIndex,
};
