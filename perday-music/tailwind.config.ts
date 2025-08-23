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
          amber: '#FFB020',
          amberLight: '#FFD700',
          amberDark: '#FF8C00',
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
        },
        amberPulse: {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(255, 176, 32, 0.6)',
            filter: 'brightness(1)'
          },
          '50%': { 
            boxShadow: '0 0 30px rgba(255, 176, 32, 0.8), 0 0 40px rgba(255, 176, 32, 0.4)',
            filter: 'brightness(1.2)'
          },
        },
        amberGlow: {
          '0%, 100%': { 
            boxShadow: '0 0 15px rgba(255, 176, 32, 0.5)',
          },
          '50%': { 
            boxShadow: '0 0 25px rgba(255, 176, 32, 0.8), 0 0 35px rgba(255, 176, 32, 0.3)',
          },
        },
        slideInRight: {
          '0%': { 
            transform: 'translateX(100%)',
            opacity: '0'
          },
          '100%': { 
            transform: 'translateX(0)',
            opacity: '1'
          },
        }
      },
      animation: {
        pulseGlow: 'pulseGlow 6s ease-in-out infinite',
        breathe: 'breathe 4s ease-in-out infinite',
        amberPulse: 'amberPulse 3s ease-in-out infinite',
        amberGlow: 'amberGlow 2s ease-in-out infinite',
        slideInRight: 'slideInRight 0.3s ease-out',
      },
    }
  },
  plugins: [],
} satisfies Config;
