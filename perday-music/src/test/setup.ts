/// <reference types="vitest/globals" />
import '@testing-library/jest-dom';
import { vi } from 'vitest';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((q: string) => ({
    matches: false, media: q, onchange: null,
    addListener: vi.fn(), removeListener: vi.fn(),
    addEventListener: vi.fn(), removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Stable perf.now for latency math
vi.spyOn(performance, 'now').mockReturnValue(1000);

// Typewriter effect is disabled in tests via environment check

// localStorage mock
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

(globalThis as any).ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(), unobserve: vi.fn(), disconnect: vi.fn(),
}));

vi.mock('echarts-for-react', () => ({ default: () => null }));

// Tiny GSAP mock that matches the improved components
vi.mock('gsap', () => {
  const makeTween = () => ({ 
    kill: vi.fn(), 
    play: vi.fn().mockReturnThis(),
    onUpdate: vi.fn(),
    onComplete: vi.fn()
  });
  
  const to = vi.fn(() => makeTween());
  const from = vi.fn(() => makeTween());
  const fromTo = vi.fn(() => makeTween());
  const timeline = vi.fn(() => {
    const tl: any = makeTween();
    tl.to = vi.fn().mockReturnValue(tl);
    tl.from = vi.fn().mockReturnValue(tl);
    tl.fromTo = vi.fn().mockReturnValue(tl);
    tl.set = vi.fn().mockReturnValue(tl);
    tl.add = vi.fn().mockReturnValue(tl);
    tl.killTweensOf = vi.fn();
    tl.kill = vi.fn();
    return tl;
  });
  
  const registerPlugin = vi.fn();
  const killTweensOf = vi.fn();
  
  return { 
    gsap: { 
      to, 
      from, 
      fromTo, 
      set: vi.fn(), 
      timeline, 
      registerPlugin, 
      killTweensOf 
    } 
  };
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