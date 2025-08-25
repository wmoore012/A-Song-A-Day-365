// Global setup for legacy nukes-v2 tests
// This provides minimal DOM API mocks for Node.js environment

// Mock window object
global.window = {
  matchMedia: () => ({ matches: false }),
  localStorage: {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {}
  },
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: () => {},
  location: { href: '' },
  document: {
    createElement: () => ({
      style: {},
      classList: { add: () => {}, remove: () => {} },
      appendChild: () => {},
      removeChild: () => {},
      querySelector: () => null,
      querySelectorAll: () => [],
      getElementById: () => null,
      innerHTML: '',
      textContent: ''
    }),
    body: {
      appendChild: () => {},
      removeChild: () => {},
      innerHTML: ''
    },
    head: {
      appendChild: () => {},
      removeChild: () => {}
    },
    getElementsByTagName: () => [],
    createTextNode: () => ({})
  }
};

// Mock document object
global.document = global.window.document;

// Mock navigator
global.navigator = {
  userAgent: 'node-test'
};

// Mock console for cleaner test output
const originalConsole = global.console;
global.console = {
  ...originalConsole,
  log: () => {}, // Suppress logs in tests
  warn: () => {},
  error: () => {}
};
