/** @type {import('vitest').UserConfig} */
export default {
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.js']
  }
}
