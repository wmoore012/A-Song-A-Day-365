// Animation policy configuration
interface AnimationPolicy {
  // Core settings
  enabled: boolean;
  reducedMotion: boolean;
  isDev: boolean;
  isTest: boolean;
  
  // Performance settings
  maxFPS: number;
  lowPowerMode: boolean;
  
  // Feature flags
  enableGSAP: boolean;
  enableCSS: boolean;
  enableIntersection: boolean;
}

// Default animation policy
const DEFAULT_POLICY: AnimationPolicy = {
  enabled: true,
  reducedMotion: false,
  isDev: import.meta.env.DEV,
  isTest: import.meta.env.MODE === 'test',
  maxFPS: 60,
  lowPowerMode: false,
  enableGSAP: true,
  enableCSS: true,
  enableIntersection: true
};

// Global animation policy instance
let globalPolicy: AnimationPolicy = { ...DEFAULT_POLICY };

// Initialize animation policy
export function initializeAnimationPolicy(overrides?: Partial<AnimationPolicy>): void {
  // Detect reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // Detect low power mode (basic heuristic)
  const lowPowerMode = navigator.hardwareConcurrency ? navigator.hardwareConcurrency < 4 : false;
  
  // Update global policy
  globalPolicy = {
    ...DEFAULT_POLICY,
    reducedMotion: prefersReducedMotion,
    lowPowerMode,
    ...overrides
  };
  
  // Override for dev/test environments
  if (globalPolicy.isDev || globalPolicy.isTest) {
    globalPolicy.reducedMotion = false; // Always enable animations in dev/test
  }
  
  console.log('🎬 Animation Policy:', globalPolicy);
}

// Core animation decision functions
export function shouldAnimate(): boolean {
  return globalPolicy.enabled && !globalPolicy.reducedMotion;
}

export function shouldUseGSAP(): boolean {
  return shouldAnimate() && globalPolicy.enableGSAP;
}

export function shouldUseCSS(): boolean {
  return shouldAnimate() && globalPolicy.enableCSS;
}

export function shouldUseIntersection(): boolean {
  return globalPolicy.enableIntersection;
}

// Duration and easing overrides for reduced motion
export function getAnimationDuration(baseDuration: number): number {
  if (!shouldAnimate()) return 0.1;
  if (globalPolicy.reducedMotion) return Math.min(baseDuration, 0.3);
  return baseDuration;
}

export function getAnimationEase(baseEase: string): string {
  if (!shouldAnimate()) return 'none';
  if (globalPolicy.reducedMotion) return 'none';
  return baseEase;
}

export function getStaggerDelay(baseStagger: number): number {
  if (!shouldAnimate()) return 0;
  if (globalPolicy.reducedMotion) return 0;
  return baseStagger;
}

// Component-specific animation helpers
export function shouldAnimateButton(): boolean {
  return shouldAnimate() && !globalPolicy.lowPowerMode;
}

export function shouldAnimateModal(): boolean {
  return shouldAnimate();
}

export function shouldAnimatePage(): boolean {
  return shouldAnimate() && !globalPolicy.lowPowerMode;
}

export function shouldAnimateParticle(): boolean {
  return shouldAnimate() && !globalPolicy.lowPowerMode;
}

// Performance monitoring
export function getAnimationBudget(): number {
  if (globalPolicy.lowPowerMode) return 0.5;
  if (globalPolicy.reducedMotion) return 0.3;
  return 1.0;
}

// Dynamic policy updates
export function updateAnimationPolicy(updates: Partial<AnimationPolicy>): void {
  globalPolicy = { ...globalPolicy, ...updates };
  console.log('🎬 Animation Policy Updated:', globalPolicy);
}

// Export current policy for debugging
export function getCurrentPolicy(): AnimationPolicy {
  return { ...globalPolicy };
}

// Auto-initialize on module load
if (typeof window !== 'undefined') {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initializeAnimationPolicy());
  } else {
    initializeAnimationPolicy();
  }
  
  // Listen for preference changes
  window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
    updateAnimationPolicy({ reducedMotion: e.matches });
  });
}
