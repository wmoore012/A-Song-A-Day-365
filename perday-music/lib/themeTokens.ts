// Spacing scale
export const SPACING = {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '1rem',       // 16px
  lg: '1.5rem',     // 24px
  xl: '2rem',       // 32px
  '2xl': '3rem',    // 48px
  '3xl': '4rem',    // 64px
  '4xl': '6rem',    // 96px
  
  // Component-specific spacing
  buttonPadding: '0.75rem 1.5rem',
  cardPadding: '1.5rem',
  modalPadding: '2rem',
  sectionGap: '3rem'
} as const;

// Border radius values
export const RADIUS = {
  none: '0',
  sm: '0.125rem',   // 2px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  '3xl': '1.5rem',  // 24px
  full: '9999px',
  
  // Component-specific
  button: '0.5rem',
  card: '1rem',
  modal: '1.5rem',
  pill: '9999px'
} as const;

// Z-index scale
export const Z_INDEX = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
  
  // Component-specific
  background: -10,
  content: 10,
  hud: 20,
  overlay: 50,
  modal: 100,
  tooltip: 200,
  toast: 300
} as const;

// Shadow values
export const SHADOWS = {
  none: 'none',
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  
  // Component-specific
  button: '0 2px 4px rgb(0 0 0 / 0.1)',
  buttonHover: '0 4px 8px rgb(0 0 0 / 0.15)',
  card: '0 1px 3px rgb(0 0 0 / 0.1)',
  modal: '0 20px 25px -5px rgb(0 0 0 / 0.2)',
  glow: '0 0 20px rgb(255 183 77 / 0.5)',
  neon: '0 0 10px rgb(0 188 212 / 0.6), 0 0 20px rgb(0 188 212 / 0.4)'
} as const;

// Typography scale
export const TYPOGRAPHY = {
  // Font sizes
  xs: '0.75rem',    // 12px
  sm: '0.875rem',   // 14px
  base: '1rem',     // 16px
  lg: '1.125rem',   // 18px
  xl: '1.25rem',    // 20px
  '2xl': '1.5rem',  // 24px
  '3xl': '1.875rem', // 30px
  '4xl': '2.25rem',  // 36px
  '5xl': '3rem',     // 48px
  '6xl': '3.75rem',  // 60px
  
  // Line heights
  tight: '1.25',
  snug: '1.375',
  normal: '1.5',
  relaxed: '1.625',
  loose: '2',
  
  // Font weights
  thin: '100',
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
  black: '900'
} as const;

// Breakpoint values
export const BREAKPOINTS = {
  xs: '320px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
} as const;

// Container max-widths
export const CONTAINERS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
  full: '100%'
} as const;

// Animation timing functions
export const TRANSITIONS = {
  // Duration
  fast: '150ms',
  normal: '300ms',
  slow: '500ms',
  slower: '700ms',
  
  // Easing
  ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  
  // Component-specific
  button: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  modal: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  page: '500ms cubic-bezier(0.4, 0, 0.2, 1)'
} as const;

// Export types
export type Spacing = typeof SPACING[keyof typeof SPACING];
export type Radius = typeof RADIUS[keyof typeof RADIUS];
export type ZIndex = typeof Z_INDEX[keyof typeof Z_INDEX];
export type Shadow = typeof SHADOWS[keyof typeof SHADOWS];
export type Typography = typeof TYPOGRAPHY[keyof typeof TYPOGRAPHY];
export type Breakpoint = typeof BREAKPOINTS[keyof typeof BREAKPOINTS];
export type Container = typeof CONTAINERS[keyof typeof CONTAINERS];
export type Transition = typeof TRANSITIONS[keyof typeof TRANSITIONS];
