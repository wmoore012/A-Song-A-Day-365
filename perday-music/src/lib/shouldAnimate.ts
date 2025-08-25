/**
 * Centralized animation policy for the entire app
 * Respects reduced motion preferences and environment
 */
export const shouldAnimate = (active?: boolean) =>
  !!active &&
  !(import.meta?.env?.MODE === 'production' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);

export const shouldAnimateModal = shouldAnimate;
export const shouldAnimateButton = shouldAnimate;

/**
 * Animation tokens for consistent timing and easing
 */
export const ANIM = {
  ease: {
    inOut: 'cubic-bezier(0.23, 1, 0.32, 1)',
    out: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    in: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
    elastic: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    back: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },
  duration: {
    xs: 0.2,
    sm: 0.4,
    md: 0.8,
    lg: 1.2,
    xl: 1.8,
  },
  stagger: {
    xs: 0.05,
    sm: 0.1,
    md: 0.15,
    lg: 0.2,
  },
} as const;

/**
 * Theme tokens for consistent visual properties
 */
export const THEME = {
  colors: {
    primary: 'hsl(var(--color-primary))',
    secondary: 'hsl(var(--color-secondary))',
    accent: 'hsl(var(--color-accent))',
    synth: {
      white: 'var(--synth-white)',
      icy: 'var(--synth-icy)',
      aqua: 'var(--synth-aqua)',
      amber: 'var(--synth-amber)',
      amberLight: 'var(--synth-amberLight)',
      magenta: 'var(--synth-magenta)',
      violet: 'var(--synth-violet)',
    },
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  radius: {
    sm: 'var(--radius-sm)',
    md: 'var(--radius-md)',
    lg: 'var(--radius-lg)',
    xl: 'var(--radius-xl)',
  },
  zIndex: {
    base: 0,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modal: 1040,
    popover: 1050,
    tooltip: 1060,
    toast: 1070,
  },
} as const;
