// Animation duration constants
export const DURATIONS = {
  fast: 0.15,
  quick: 0.3,
  normal: 0.5,
  slow: 0.8,
  slower: 1.2,
  slowest: 2.0,
  
  // Specific component durations
  buttonHover: 0.2,
  buttonPress: 0.1,
  modalEnter: 0.4,
  modalExit: 0.3,
  pageTransition: 0.6,
  vaultLift: 1.5,
  gearSpin: 0.8,
  counterBreathe: 3.0,
  villainType: 0.05,
  atomOrbit: 20.0
} as const;

// Animation easing functions
export const EASES = {
  // Standard eases
  linear: 'none',
  easeIn: 'power2.in',
  easeOut: 'power2.out',
  easeInOut: 'power2.inOut',
  
  // Custom eases
  bounce: 'bounce.out',
  elastic: 'elastic.out(1, 0.3)',
  back: 'back.out(1.7)',
  
  // Component-specific eases
  buttonPress: 'power3.out',
  modalEnter: 'back.out(1.2)',
  gearSpin: 'power1.inOut',
  counterBreathe: 'power1.inOut'
} as const;

// Animation stagger delays
export const STAGGERS = {
  quick: 0.05,
  normal: 0.1,
  slow: 0.2,
  slower: 0.3,
  
  // Component-specific
  gearItems: 0.15,
  atomParticles: 0.1,
  villainChars: 0.03
} as const;

// Z-index layers
export const Z_LAYERS = {
  background: -10,
  content: 10,
  hud: 20,
  overlay: 50,
  modal: 100,
  tooltip: 200,
  toast: 300
} as const;

// Animation colors for effects
export const ANIM_COLORS = {
  // Primary brand colors
  primary: '#ffb74d', // synth-amber
  secondary: '#9c27b0', // synth-violet
  accent: '#e91e63', // synth-magenta
  highlight: '#00bcd4', // synth-cyan
  
  // State colors
  success: '#4caf50',
  warning: '#ff9800',
  error: '#f44336',
  info: '#2196f3',
  
  // Effect colors
  glow: 'rgba(255, 183, 77, 0.8)',
  shadow: 'rgba(0, 0, 0, 0.3)',
  backdrop: 'rgba(0, 0, 0, 0.8)',
  glass: 'rgba(255, 255, 255, 0.1)'
} as const;

// Animation properties
export const ANIM_PROPS = {
  // Transform values
  scale: {
    small: 0.95,
    normal: 1.0,
    large: 1.05,
    xl: 1.1
  },
  
  // Opacity values
  opacity: {
    invisible: 0,
    subtle: 0.3,
    visible: 0.7,
    full: 1.0
  },
  
  // Rotation values (in degrees)
  rotation: {
    small: 5,
    medium: 15,
    large: 45,
    full: 360
  }
} as const;

// Performance settings
export const PERFORMANCE = {
  // Reduced motion overrides
  reducedMotion: {
    duration: 0.1,
    ease: 'none',
    stagger: 0
  },
  
  // Intersection observer thresholds
  observerThresholds: [0, 0.25, 0.5, 0.75, 1],
  
  // Animation frame rate limits
  maxFPS: 60,
  minFrameTime: 1000 / 60
} as const;

// Export types
export type Duration = typeof DURATIONS[keyof typeof DURATIONS];
export type Ease = typeof EASES[keyof typeof EASES];
export type Stagger = typeof STAGGERS[keyof typeof STAGGERS];
export type ZLayer = typeof Z_LAYERS[keyof typeof Z_LAYERS];
export type AnimColor = typeof ANIM_COLORS[keyof typeof ANIM_COLORS];
