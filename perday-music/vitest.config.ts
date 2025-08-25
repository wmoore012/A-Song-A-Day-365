import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react()],
  resolve: {
    // Teach CI that "@" means "perday-music/src"
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    // Give tests a pretend browser
    environment: 'jsdom',
    // Make test functions global (describe, it, expect, etc.)
    globals: true,
    // Run our setup (mocks, etc.)
    setupFiles: ['./src/test/setup.ts'],
    // Only test the app code
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    // Explicitly exclude legacy and other unwanted directories
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
  },
})
