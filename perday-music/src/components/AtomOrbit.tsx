import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

export default function AtomOrbit() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Force animations in dev/tests, only respect reduced motion in production
    const shouldAnimate = 
      import.meta?.env?.MODE !== 'test' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true
        ? false
        : true;
    
    if (!shouldAnimate) return;

    // Create spinning animation for each ring
    const rings = containerRef.current.querySelectorAll('.ring');
    const dots = containerRef.current.querySelectorAll('.dot');

    rings.forEach((ring, index) => {
      gsap.to(ring, {
        rotation: 360,
        duration: 8 + index * 2, // Different speeds for each ring
        repeat: -1,
        ease: "none",
        transformOrigin: "center center"
      });
    });

    dots.forEach((dot, index) => {
      gsap.to(dot, {
        rotation: 360,
        duration: 12 + index * 3, // Different speeds for each dot
        repeat: -1,
        ease: "none",
        transformOrigin: "center center"
      });
    });

    return () => {
      gsap.killTweensOf(rings);
      gsap.killTweensOf(dots);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-80 h-80">
      <svg
        width="320"
        height="320"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Rings with synth colors */}
        <circle cx="50" cy="50" r="49" opacity="0.1" className="ring" stroke="#6C1AED" strokeWidth="0.3" fill="none" />
        <circle cx="50" cy="50" r="40" opacity="0.15" className="ring" stroke="#F16DFB" strokeWidth="0.3" fill="none" />
        <circle cx="50" cy="50" r="30" opacity="0.2" className="ring" stroke="#B2EBFF" strokeWidth="0.3" fill="none" />
        <circle cx="50" cy="50" r="20" opacity="0.25" className="ring" stroke="#55CBDC" strokeWidth="0.3" fill="none" />
        <circle cx="50" cy="50" r="15" opacity="0.3" className="ring" stroke="#FFB020" strokeWidth="0.3" fill="none" />
        <circle cx="50" cy="50" r="10" opacity="0.35" className="ring" stroke="#FFD700" strokeWidth="0.3" fill="none" />
        
        {/* Dots with synth colors */}
        <circle cx="99" cy="50" className="dot" r="0.75" fill="#6C1AED" filter="url(#glow)" />
        <circle cx="50" cy="90" className="dot" r="0.75" fill="#F16DFB" filter="url(#glow)" />
        <circle cx="20" cy="50" className="dot" r="0.75" fill="#B2EBFF" filter="url(#glow)" />
        <circle cx="70" cy="50" className="dot" r="0.75" fill="#55CBDC" filter="url(#glow)" />
        <circle cx="50" cy="35" className="dot" r="0.75" fill="#FFB020" filter="url(#glow)" />
        <circle cx="50" cy="60" className="dot" r="0.75" fill="#FFD700" filter="url(#glow)" />
      </svg>
    </div>
  );
}
