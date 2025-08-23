import type { Config } from "tailwindcss";
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: { 
    extend: {
      colors: {
        synth: {
          violet: '#6C1AED',
          magenta: '#F16DFB', 
          white: '#FFFFFF',
          icy: '#B2EBFF',
          aqua: '#55CBDC',
        }
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { filter: 'brightness(1)' },
          '50%': { filter: 'brightness(1.4)' },
        },
        breathe: {
          '0%, 100%': { 
            boxShadow: '0 0 28px 14px #B2EBFF, inset 0 0 36px #F16DFB',
            filter: 'brightness(1)'
          },
          '50%': { 
            boxShadow: '0 0 32px 18px #B2EBFF, inset 0 0 40px #F16DFB',
            filter: 'brightness(1.3)'
          },
        }
      },
      animation: {
        pulseGlow: 'pulseGlow 6s ease-in-out infinite',
        breathe: 'breathe 4s ease-in-out infinite',
      },
    }
  },
  plugins: [],
} satisfies Config;
