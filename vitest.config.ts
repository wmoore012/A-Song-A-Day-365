import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // Only run tests in perday-music directory
    include: ['perday-music/src/**/*.{test,spec}.{ts,tsx}'],
    // Explicitly exclude all legacy tests and directories
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/legacy/**',
      '**/tests/**',
      '**/*.dom.test.js',
      '**/*.function.test.js',
      '**/test-baby-site/**',
      '**/perday-rebuild/**'
    ],
    // Environment for React testing
    environment: 'jsdom',
    globals: true
  },
})
