/**
 * Design Tokens: Typography
 * 
 * Modern, readable typography system.
 * Primary font: Inter (clean, professional, great for dashboards)
 * Mono font: JetBrains Mono (for code and numbers)
 */

// Font families
export const fontFamily = {
  sans: [
    'Inter',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
  ].join(', '),
  
  mono: [
    '"JetBrains Mono"',
    '"SF Mono"',
    'Monaco',
    'Consolas',
    '"Liberation Mono"',
    '"Courier New"',
    'monospace',
  ].join(', '),
};

// Font sizes (in px, with line height ratios)
export const fontSize = {
  xs: { size: 12, lineHeight: 1.5, letterSpacing: '0.01em' },
  sm: { size: 14, lineHeight: 1.5, letterSpacing: '0' },
  base: { size: 16, lineHeight: 1.5, letterSpacing: '0' },
  lg: { size: 18, lineHeight: 1.5, letterSpacing: '-0.01em' },
  xl: { size: 20, lineHeight: 1.4, letterSpacing: '-0.01em' },
  '2xl': { size: 24, lineHeight: 1.35, letterSpacing: '-0.02em' },
  '3xl': { size: 30, lineHeight: 1.3, letterSpacing: '-0.02em' },
  '4xl': { size: 36, lineHeight: 1.25, letterSpacing: '-0.02em' },
  '5xl': { size: 48, lineHeight: 1.2, letterSpacing: '-0.03em' },
  '6xl': { size: 60, lineHeight: 1.1, letterSpacing: '-0.03em' },
};

// Font weights
export const fontWeight = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
};

// Pre-defined text styles
export const textStyles = {
  // Headings
  h1: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize['4xl'].size,
    fontWeight: fontWeight.bold,
    lineHeight: fontSize['4xl'].lineHeight,
    letterSpacing: fontSize['4xl'].letterSpacing,
  },
  h2: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize['3xl'].size,
    fontWeight: fontWeight.bold,
    lineHeight: fontSize['3xl'].lineHeight,
    letterSpacing: fontSize['3xl'].letterSpacing,
  },
  h3: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize['2xl'].size,
    fontWeight: fontWeight.semibold,
    lineHeight: fontSize['2xl'].lineHeight,
    letterSpacing: fontSize['2xl'].letterSpacing,
  },
  h4: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.xl.size,
    fontWeight: fontWeight.semibold,
    lineHeight: fontSize.xl.lineHeight,
    letterSpacing: fontSize.xl.letterSpacing,
  },
  h5: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.lg.size,
    fontWeight: fontWeight.semibold,
    lineHeight: fontSize.lg.lineHeight,
    letterSpacing: fontSize.lg.letterSpacing,
  },
  h6: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.base.size,
    fontWeight: fontWeight.semibold,
    lineHeight: fontSize.base.lineHeight,
    letterSpacing: fontSize.base.letterSpacing,
  },

  // Body text
  bodyLg: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.lg.size,
    fontWeight: fontWeight.normal,
    lineHeight: fontSize.lg.lineHeight,
    letterSpacing: fontSize.lg.letterSpacing,
  },
  body: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.base.size,
    fontWeight: fontWeight.normal,
    lineHeight: fontSize.base.lineHeight,
    letterSpacing: fontSize.base.letterSpacing,
  },
  bodySm: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.sm.size,
    fontWeight: fontWeight.normal,
    lineHeight: fontSize.sm.lineHeight,
    letterSpacing: fontSize.sm.letterSpacing,
  },

  // Labels and captions
  label: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.sm.size,
    fontWeight: fontWeight.medium,
    lineHeight: fontSize.sm.lineHeight,
    letterSpacing: '0.01em',
  },
  labelSm: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.xs.size,
    fontWeight: fontWeight.medium,
    lineHeight: fontSize.xs.lineHeight,
    letterSpacing: '0.02em',
  },
  caption: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.xs.size,
    fontWeight: fontWeight.normal,
    lineHeight: fontSize.xs.lineHeight,
    letterSpacing: fontSize.xs.letterSpacing,
  },

  // Special
  overline: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.xs.size,
    fontWeight: fontWeight.semibold,
    lineHeight: fontSize.xs.lineHeight,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  },
  code: {
    fontFamily: fontFamily.mono,
    fontSize: fontSize.sm.size,
    fontWeight: fontWeight.normal,
    lineHeight: 1.6,
    letterSpacing: '0',
  },
  stat: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize['3xl'].size,
    fontWeight: fontWeight.bold,
    lineHeight: 1,
    letterSpacing: '-0.02em',
    fontVariantNumeric: 'tabular-nums',
  },
};

// CSS helper to generate font styles
export const getFontStyle = (style) => {
  const s = textStyles[style];
  if (!s) return {};
  
  return {
    fontFamily: s.fontFamily,
    fontSize: `${s.fontSize}px`,
    fontWeight: s.fontWeight,
    lineHeight: s.lineHeight,
    letterSpacing: s.letterSpacing,
    ...(s.textTransform && { textTransform: s.textTransform }),
    ...(s.fontVariantNumeric && { fontVariantNumeric: s.fontVariantNumeric }),
  };
};

export default {
  fontFamily,
  fontSize,
  fontWeight,
  textStyles,
  getFontStyle,
};
