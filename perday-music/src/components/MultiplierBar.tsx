import { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

interface MultiplierBarProps {
  currentMultiplier: number;
  maxMultiplier: number;
  isActive: boolean;
  className?: string;
}

export default function MultiplierBar({ 
  currentMultiplier, 
  maxMultiplier, 
  isActive, 
  className = "" 
}: MultiplierBarProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const [previousMultiplier, setPreviousMultiplier] = useState(currentMultiplier);

  // Calculate percentage for the fill
  const percentage = (currentMultiplier / maxMultiplier) * 100;

  useGSAP(() => {
    if (!fillRef.current || !barRef.current) return;
    
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    // Animate the fill bar
    gsap.to(fillRef.current, {
      width: `${percentage}%`,
      duration: 0.8,
      ease: "power2.out"
    });

    // If multiplier decreased, flash the bar
    if (currentMultiplier < previousMultiplier) {
      // Flash effect
      gsap.timeline()
        .to(barRef.current, {
          scale: 1.05,
          duration: 0.1,
          ease: "power2.out"
        })
        .to(barRef.current, {
          scale: 1,
          duration: 0.1,
          ease: "power2.in"
        })
        .to(barRef.current, {
          boxShadow: "0 0 30px rgba(255, 176, 32, 0.8)",
          duration: 0.2,
          ease: "power2.out"
        })
        .to(barRef.current, {
          boxShadow: "0 0 0px rgba(255, 176, 32, 0)",
          duration: 0.3,
          ease: "power2.out"
        });

      // Pulse the fill color
      gsap.timeline()
        .to(fillRef.current, {
          backgroundColor: "#FF6B35", // Warning orange
          duration: 0.1
        })
        .to(fillRef.current, {
          backgroundColor: "#FFB020", // Back to amber
          duration: 0.3,
          ease: "power2.out"
        });
    }

  }, [currentMultiplier, percentage, previousMultiplier]);

  // Update previous multiplier separately to avoid infinite loop
  useEffect(() => {
    setPreviousMultiplier(currentMultiplier);
  }, [currentMultiplier]);

  // Entrance animation
  useGSAP(() => {
    if (!barRef.current) return;
    
    // Force animations in dev/tests, only respect reduced motion in production
    const shouldAnimate = 
      import.meta?.env?.MODE !== 'test' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true
        ? false
        : true;
    
    if (!shouldAnimate) return;

    gsap.fromTo(barRef.current,
      { opacity: 0, y: 20, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "back.out(1.7)" }
    );
  }, []);

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-synth-icy">Multiplier</span>
        <span className="text-lg font-bold text-synth-amber">
          {currentMultiplier.toFixed(1)}x
        </span>
      </div>
      
      <div 
        ref={barRef}
        className="relative w-full h-4 bg-synth-violet/20 rounded-full overflow-hidden border border-synth-violet/30"
      >
        <div 
          ref={fillRef}
          className={`h-full rounded-full transition-all duration-300 ${
            isActive 
              ? 'bg-gradient-to-r from-synth-amber to-synth-amberLight' 
              : 'bg-gradient-to-r from-synth-violet to-synth-magenta'
          }`}
          style={{ width: `${percentage}%` }}
        />
        
        {/* Glow effect when active */}
        {isActive && (
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-synth-amber/20 to-synth-amberLight/20 animate-pulse" />
        )}
        
        {/* Neon purple glow when multiplier is dying */}
        {isActive && currentMultiplier < 1.5 && (
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400/40 via-magenta-500/40 to-cyan-400/40 animate-pulse shadow-[0_0_20px_rgba(168,85,247,0.6)]" />
        )}
      </div>
      
      {/* Multiplier status */}
      <div className="mt-2 text-xs text-synth-icy/70">
        {isActive ? (
          <span className="text-synth-amber animate-pulse">Activate and maintain YOUR multiplier</span>
        ) : (
          <span>Press Ready to activate multiplier</span>
        )}
      </div>
    </div>
  );
}
