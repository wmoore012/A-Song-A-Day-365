/// <reference types="vitest/globals" />
import '@testing-library/jest-dom';

import { vi } from 'vitest';

// --- matchMedia (reduced motion)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // legacy
    removeListener: vi.fn(), // legacy
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// --- stable perf.now for latency math
vi.spyOn(performance, 'now').mockReturnValue(1000);

// --- localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// --- ResizeObserver
(globalThis as any).ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// --- echarts wrapper (render nothing in tests)
vi.mock('echarts-for-react', () => ({ default: () => null }));

// --- Complete GSAP mock (single source of truth)
vi.mock('gsap', () => {
  const makeTween = () => ({ kill: vi.fn(), play: vi.fn().mockReturnThis() });

  const to = vi.fn((target: any, vars: any) => {
    console.log('GSAP MOCK: to() called');

    // Handle usePrestart case - immediately set target to final value
    if (target && typeof target === 'object' && 'v' in vars) {
      console.log('Setting target.v to', vars.v);
      target.v = vars.v;
    }

    // Handle DOM element animations (like devil heads)
    if (typeof target === 'string' && vars) {
      console.log('Animating DOM element:', target, vars);
      // For DOM element animations, immediately call onComplete since we can't actually animate in tests
      if (vars?.onComplete) {
        vars.onComplete();
      }
    }

    // Call callbacks immediately to simulate instant animation
    if (vars?.onUpdate) vars.onUpdate();
    if (vars?.onComplete) vars.onComplete();

    return makeTween();
  });
  const from = vi.fn(() => makeTween());
  const fromTo = vi.fn(() => makeTween());

  const timeline = vi.fn(() => {
    const tl: any = makeTween();
    tl.to = vi.fn().mockReturnValue(tl);
    tl.from = vi.fn().mockReturnValue(tl);
    tl.fromTo = vi.fn().mockReturnValue(tl); // <- PerdayLogo needs this
    tl.set = vi.fn().mockReturnValue(tl);
    tl.add = vi.fn().mockReturnValue(tl);
    tl.killTweensOf = vi.fn();               // <- some code calls it on the tl
    tl.kill = vi.fn();
    return tl;
  });

  const registerPlugin = vi.fn();
  const killTweensOf = vi.fn();              // <- AtomOrbit calls this

  const gsap = { to, from, fromTo, set: vi.fn(), timeline, registerPlugin, killTweensOf };
  return { gsap };
});

// --- @gsap/react: run the callback immediately; accept config form too
vi.mock('@gsap/react', () => {
  return {
    useGSAP: (cb?: (ctx?: unknown) => void) => {
      cb?.();
      return { contextSafe: (fn: any) => fn };
    },
  };
});

// --- localforage - simulate hydration process
vi.mock('localforage', () => {
  const storage = new Map<string, string>();

  // Pre-populate with the exact structure that matches Zustand's partialize config
  storage.set('perday-app', JSON.stringify({
    state: {
      state: 0, // FlowState.PRE_START
      readyPressed: false,
      multiplierPenalty: false,
      target: '',
      durationMin: 0,
      rating: null,
      proof: null
    },
    settings: {
      defaultDuration: 25,
      defaultMultiplier: 1.5,
      autoStartTimer: true,
      soundEnabled: false,
      volume: 0.7,
      notifications: true,
      accountabilityEmail: '',
      userName: '',
      collaborators: ''
    },
    grades: [],
    latencies: [],
    streak: 0,
    freezes: 0,
    prestartTotalMs: 420000, // 7 minutes
    phase: 'countdown',
    readyAt: null,
    motionOk: true,
  }));

  return {
    getItem: vi.fn().mockImplementation(async (key: string) => {
      // Simulate async delay like real localforage
      await new Promise(resolve => setTimeout(resolve, 0));

      const data = storage.get(key);
      if (data) {
        // Return the persisted data which will trigger onRehydrateStorage
        return data;
      }
      return null; // Return null for missing keys
    }),
    setItem: vi.fn().mockImplementation(async (key: string, value: string) => {
      // Simulate async delay
      await new Promise(resolve => setTimeout(resolve, 0));
      storage.set(key, value);
      return value;
    }),
    removeItem: vi.fn().mockImplementation(async (key: string) => {
      // Simulate async delay
      await new Promise(resolve => setTimeout(resolve, 0));
      storage.delete(key);
      return undefined;
    }),
    clear: vi.fn().mockImplementation(async () => {
      // Simulate async delay
      await new Promise(resolve => setTimeout(resolve, 0));
      storage.clear();
      return undefined;
    }),
  };
});

beforeEach(() => {
  vi.clearAllMocks();
  localStorageMock.getItem.mockReturnValue(null);
});