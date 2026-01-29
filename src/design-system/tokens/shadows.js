/**
 * Design Tokens: Shadows & Effects
 * 
 * Minimal, subtle shadows for a modern, flat aesthetic.
 * Inspired by Linear and Vercel's shadow systems.
 */

// Box shadows - subtle, professional
export const shadows = {
  none: 'none',
  
  // Standard shadows (increasing intensity)
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  
  // Inner shadow (for inset effects)
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
  
  // Focus ring (for accessibility)
  focus: '0 0 0 3px rgba(6, 182, 212, 0.4)',
  focusError: '0 0 0 3px rgba(239, 68, 68, 0.4)',
  
  // Card shadows
  card: '0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px -1px rgba(0, 0, 0, 0.08)',
  cardHover: '0 10px 40px -10px rgba(0, 0, 0, 0.12), 0 4px 6px -4px rgba(0, 0, 0, 0.08)',
  
  // Dropdown/Popover shadows
  dropdown: '0 10px 38px -10px rgba(22, 23, 24, 0.35), 0 10px 20px -15px rgba(22, 23, 24, 0.2)',
  
  // Modal shadow
  modal: '0 16px 70px rgba(0, 0, 0, 0.2)',
};

// Dark mode shadows (more subtle on dark backgrounds)
export const darkShadows = {
  none: 'none',
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.4)',
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.5), 0 1px 2px -1px rgba(0, 0, 0, 0.5)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -2px rgba(0, 0, 0, 0.5)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -4px rgba(0, 0, 0, 0.5)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.3)',
  focus: '0 0 0 3px rgba(6, 182, 212, 0.5)',
  focusError: '0 0 0 3px rgba(239, 68, 68, 0.5)',
  card: '0 1px 3px 0 rgba(0, 0, 0, 0.4)',
  cardHover: '0 10px 40px -10px rgba(0, 0, 0, 0.5)',
  dropdown: '0 10px 38px -10px rgba(0, 0, 0, 0.7), 0 10px 20px -15px rgba(0, 0, 0, 0.5)',
  modal: '0 16px 70px rgba(0, 0, 0, 0.5)',
};

// Border radius - consistent, modern
export const radius = {
  none: '0',
  sm: '4px',
  md: '6px',
  lg: '8px',
  xl: '12px',
  '2xl': '16px',
  '3xl': '24px',
  full: '9999px',
};

// Transitions - smooth, professional
export const transitions = {
  // Duration
  duration: {
    instant: '0ms',
    fast: '100ms',
    normal: '200ms',
    slow: '300ms',
    slower: '500ms',
  },
  
  // Easing
  easing: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },
  
  // Pre-defined transitions
  default: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
  colors: 'color 200ms ease, background-color 200ms ease, border-color 200ms ease',
  transform: 'transform 200ms cubic-bezier(0.4, 0, 0.2, 1)',
  opacity: 'opacity 200ms ease',
  shadow: 'box-shadow 200ms cubic-bezier(0.4, 0, 0.2, 1)',
};

// Z-index scale
export const zIndex = {
  hide: -1,
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  modalBackdrop: 1300,
  modal: 1400,
  popover: 1500,
  tooltip: 1600,
  toast: 1700,
};

export default {
  shadows,
  darkShadows,
  radius,
  transitions,
  zIndex,
};
