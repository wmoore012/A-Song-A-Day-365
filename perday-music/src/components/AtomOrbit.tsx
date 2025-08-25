import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

export default function AtomOrbit() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!root.current) return;

    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;

    if (import.meta?.env?.MODE === 'test' || reduceMotion) return;

    const rings = root.current.querySelectorAll('.ring');
    const dots = root.current.querySelectorAll('.dot');

    const ctx = gsap.context(() => {
      rings.forEach((ring, i) => {
        gsap.to(ring, { 
          rotation: 360, 
          duration: 8 + i * 2, 
          repeat: -1, 
          ease: 'none', 
          transformOrigin: '50% 50%' 
        });
      });
      dots.forEach((dot, i) => {
        gsap.to(dot, { 
          rotation: 360, 
          duration: 12 + i * 3, 
          repeat: -1, 
          ease: 'none', 
          transformOrigin: '50% 50%' 
        });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={root}
      className="relative w-80 h-80 pointer-events-none"
      aria-hidden
    >
      {/* SVG rings and dots */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 320 320">
        {/* Outer ring */}
        <circle
          className="ring"
          cx="160"
          cy="160"
          r="150"
          fill="none"
          stroke="url(#gradient-outer)"
          strokeWidth="2"
          opacity="0.3"
        />
        
        {/* Middle ring */}
        <circle
          className="ring"
          cx="160"
          cy="160"
          r="100"
          fill="none"
          stroke="url(#gradient-middle)"
          strokeWidth="1.5"
          opacity="0.4"
        />
        
        {/* Inner ring */}
        <circle
          className="ring"
          cx="160"
          cy="160"
          r="50"
          fill="none"
          stroke="url(#gradient-inner)"
          strokeWidth="1"
          opacity="0.5"
        />
        
        {/* Dots */}
        <circle className="dot" cx="160" cy="10" r="3" fill="#00bcd4" />
        <circle className="dot" cx="310" cy="160" r="3" fill="#e91e63" />
        <circle className="dot" cx="160" cy="310" r="3" fill="#9c27b0" />
        <circle className="dot" cx="10" cy="160" r="3" fill="#ffb74d" />
        
        {/* Diagonal dots */}
        <circle className="dot" cx="220" cy="100" r="2" fill="#00bcd4" opacity="0.7" />
        <circle className="dot" cx="220" cy="220" r="2" fill="#e91e63" opacity="0.7" />
        <circle className="dot" cx="100" cy="220" r="2" fill="#9c27b0" opacity="0.7" />
        <circle className="dot" cx="100" cy="100" r="2" fill="#ffb74d" opacity="0.7" />
        
        {/* Gradients */}
        <defs>
          <linearGradient id="gradient-outer" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00bcd4" />
            <stop offset="50%" stopColor="#e91e63" />
            <stop offset="100%" stopColor="#9c27b0" />
          </linearGradient>
          <linearGradient id="gradient-middle" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e91e63" />
            <stop offset="50%" stopColor="#9c27b0" />
            <stop offset="100%" stopColor="#ffb74d" />
          </linearGradient>
          <linearGradient id="gradient-inner" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9c27b0" />
            <stop offset="50%" stopColor="#ffb74d" />
            <stop offset="100%" stopColor="#00bcd4" />
          </linearGradient>
        </defs>
      </svg>

      {/* Perday Music 365 overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-xs text-synth-amber font-bold animate-pulse bg-black/20 backdrop-blur-sm px-2 py-1 rounded-full">
          Perday Music 365
        </div>
      </div>
    </div>
  );
}
