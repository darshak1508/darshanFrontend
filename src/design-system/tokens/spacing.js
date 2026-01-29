/**
 * Design Tokens: Spacing
 * 
 * 4px base unit system for consistent spacing.
 * Usage: spacing[4] = 16px, spacing[8] = 32px
 */

// Base unit: 4px
const BASE_UNIT = 4;

// Spacing scale (in pixels)
export const spacing = {
  0: 0,
  px: 1,
  0.5: BASE_UNIT * 0.5,   // 2px
  1: BASE_UNIT,            // 4px
  1.5: BASE_UNIT * 1.5,   // 6px
  2: BASE_UNIT * 2,        // 8px
  2.5: BASE_UNIT * 2.5,   // 10px
  3: BASE_UNIT * 3,        // 12px
  3.5: BASE_UNIT * 3.5,   // 14px
  4: BASE_UNIT * 4,        // 16px
  5: BASE_UNIT * 5,        // 20px
  6: BASE_UNIT * 6,        // 24px
  7: BASE_UNIT * 7,        // 28px
  8: BASE_UNIT * 8,        // 32px
  9: BASE_UNIT * 9,        // 36px
  10: BASE_UNIT * 10,      // 40px
  11: BASE_UNIT * 11,      // 44px
  12: BASE_UNIT * 12,      // 48px
  14: BASE_UNIT * 14,      // 56px
  16: BASE_UNIT * 16,      // 64px
  20: BASE_UNIT * 20,      // 80px
  24: BASE_UNIT * 24,      // 96px
  28: BASE_UNIT * 28,      // 112px
  32: BASE_UNIT * 32,      // 128px
  36: BASE_UNIT * 36,      // 144px
  40: BASE_UNIT * 40,      // 160px
  44: BASE_UNIT * 44,      // 176px
  48: BASE_UNIT * 48,      // 192px
  52: BASE_UNIT * 52,      // 208px
  56: BASE_UNIT * 56,      // 224px
  60: BASE_UNIT * 60,      // 240px
  64: BASE_UNIT * 64,      // 256px
  72: BASE_UNIT * 72,      // 288px
  80: BASE_UNIT * 80,      // 320px
  96: BASE_UNIT * 96,      // 384px
};

// Component-specific spacing presets
export const componentSpacing = {
  // Cards
  card: {
    padding: spacing[6],        // 24px
    paddingCompact: spacing[4], // 16px
    gap: spacing[4],            // 16px between cards
  },

  // Buttons
  button: {
    paddingX: {
      sm: spacing[3],   // 12px
      md: spacing[4],   // 16px
      lg: spacing[6],   // 24px
    },
    paddingY: {
      sm: spacing[2],   // 8px
      md: spacing[2.5], // 10px
      lg: spacing[3],   // 12px
    },
    gap: spacing[2],    // 8px icon gap
  },

  // Forms
  form: {
    inputPaddingX: spacing[3],   // 12px
    inputPaddingY: spacing[2.5], // 10px
    labelGap: spacing[1.5],      // 6px
    fieldGap: spacing[5],        // 20px between fields
    sectionGap: spacing[8],      // 32px between sections
  },

  // Layout
  layout: {
    pageGutter: spacing[6],      // 24px
    sectionGap: spacing[8],      // 32px
    contentMaxWidth: 1280,
    sidebarWidth: 260,
    sidebarCollapsed: 72,
    headerHeight: 64,
  },

  // Tables
  table: {
    cellPaddingX: spacing[4],    // 16px
    cellPaddingY: spacing[3],    // 12px
    headerPaddingY: spacing[3],  // 12px
    rowGap: spacing[0],          // No gap (border separated)
  },

  // Modal/Dialog
  modal: {
    padding: spacing[6],         // 24px
    headerGap: spacing[4],       // 16px
    footerGap: spacing[4],       // 16px
    contentGap: spacing[5],      // 20px
  },
};

// Utility function to get spacing in rem
export const toRem = (px) => `${px / 16}rem`;

// Get spacing value with rem unit
export const space = (key) => toRem(spacing[key] || 0);

export default spacing;
