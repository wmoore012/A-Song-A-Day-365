/// <reference types="vitest/globals" />
import '@testing-library/jest-dom';

// Mock matchMedia for reduced motion tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock performance.now for consistent timing tests
vi.spyOn(performance, 'now').mockReturnValue(1000);

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock ECharts to avoid canvas issues in tests
vi.mock('echarts-for-react', () => ({
  default: () => null
}));

// Mock GSAP (named export)
vi.mock('gsap', () => {
  const to = vi.fn().mockReturnValue({
    onComplete: vi.fn(),
    onUpdate: vi.fn(),
    kill: vi.fn(),
  });
  const fromTo = vi.fn().mockReturnValue({
    onComplete: vi.fn(),
    onUpdate: vi.fn(),
    kill: vi.fn(),
  });
  const set = vi.fn();
  const timeline = vi.fn(() => ({
    to: vi.fn().mockReturnValue({
      onComplete: vi.fn(),
      onUpdate: vi.fn(),
      kill: vi.fn(),
    }),
    fromTo: vi.fn().mockReturnValue({
      onComplete: vi.fn(),
      onUpdate: vi.fn(),
      kill: vi.fn(),
    }),
    set: vi.fn(),
    add: vi.fn(),
    play: vi.fn(),
    kill: vi.fn(),
  }));
  const gsap = { 
    to, 
    fromTo, 
    set, 
    timeline, 
    registerPlugin: vi.fn(),
    killTweensOf: vi.fn(),
  };
  return { gsap };
});

// Mock @gsap/react hook to just run the passed function immediately
vi.mock('@gsap/react', () => {
  return {
    useGSAP: (fn?: any) => {
      if (typeof fn === 'function') fn();
      return {}; // shape doesn't matter for your tests
    },
  };
});

// Reset mocks between tests
beforeEach(() => {
  vi.clearAllMocks();
  localStorageMock.getItem.mockReturnValue(null);
});
