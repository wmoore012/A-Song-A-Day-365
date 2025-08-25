import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}",
    "./**/*.{ts,tsx}" // Include any files outside src/ if they exist
  ],
  theme: {
    extend: {
      colors: {
        synth: {
          white: '#ffffff',
          icy: '#b3e5fc',
          aqua: '#00bcd4',
          amber: '#ffb74d',
          amberLight: '#ffcc80',
          amberDark: '#f57c00',
          magenta: '#e91e63',
          violet: '#9c27b0',
        },
      },
      animation: {
        'amberGlow': 'amberGlow 2s ease-in-out infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'breathe': 'breathe 3s ease-in-out infinite',
        'amberPulse': 'amberPulse 2s ease-in-out infinite',
        'slideInRight': 'slideInRight 0.5s ease-out',
      },
      keyframes: {
        amberGlow: {
          '0%, 100%': { textShadow: '0 0 5px rgba(255, 183, 77, 0.5)' },
          '50%': { textShadow: '0 0 20px rgba(255, 183, 77, 1), 0 0 30px rgba(255, 183, 77, 0.8)' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        amberPulse: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(255, 183, 77, 0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(255, 183, 77, 0.8), 0 0 30px rgba(255, 183, 77, 0.4)' },
        },
        slideInRight: {
          'from': { transform: 'translateX(100%)', opacity: '0' },
          'to': { transform: 'translateX(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
