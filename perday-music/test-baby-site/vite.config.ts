import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Keep config minimal first; we can add aliases and plugins later.
export default defineConfig({
  plugins: [react(), tailwindcss()],
})
