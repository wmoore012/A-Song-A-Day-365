import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { shouldAnimate } from '../lib/motion';

interface MultiplierBarProps {
  multiplier?: number;
  className?: string;
  isTimeRemaining?: boolean;
}

export default function MultiplierBar({ multiplier = 1.0, className = "", isTimeRemaining = false }: MultiplierBarProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const [isDying, setIsDying] = useState(false);

  useEffect(() => {
    if (!barRef.current) return;

    if (!shouldAnimate()) return;

    if (isTimeRemaining) {
      // For time remaining: check if 10 minutes or less remain
      const minutesRemaining = multiplier * 60; // multiplier is time remaining as fraction
      const isUrgent = minutesRemaining <= 10;
      setIsDying(isUrgent);

      if (isUrgent) {
        // Add urgent animation with red glow
        gsap.to(barRef.current, {
          boxShadow: '0 0 20px rgba(220, 38, 38, 0.8), 0 0 40px rgba(220, 38, 38, 0.4)',
          duration: 0.5,
          ease: "power2.out"
        });
      } else {
        // Remove urgent effects
        gsap.to(barRef.current, {
          boxShadow: '0 0 10px rgba(34, 197, 94, 0.3)',
          duration: 0.5,
          ease: "power2.out"
        });
      }
    } else {
      // Original multiplier logic
      const dying = multiplier < 1.5;
      setIsDying(dying);

      if (dying) {
        // Add dying animation with neon purple glow
        gsap.to(barRef.current, {
          boxShadow: '0 0 20px rgba(147, 51, 234, 0.8), 0 0 40px rgba(147, 51, 234, 0.4)',
          duration: 0.5,
          ease: "power2.out"
        });
      } else {
        // Remove dying effects
        gsap.to(barRef.current, {
          boxShadow: '0 0 10px rgba(34, 197, 94, 0.3)',
          duration: 0.5,
          ease: "power2.out"
        });
      }
    }
  }, [multiplier, isTimeRemaining]);

  // Calculate bar width based on multiplier (1.0x = 0%, 2.0x = 100%) or time remaining (1.0 = 100%, 0.0 = 0%)
  const barWidth = isTimeRemaining 
    ? Math.max(0, Math.min(100, multiplier * 100)) // Time remaining: 1.0 = 100%, 0.0 = 0%
    : Math.max(0, Math.min(100, (multiplier - 1) * 100)); // Multiplier: 1.0x = 0%, 2.0x = 100%

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="text-sm font-medium text-synth-white">
        {isTimeRemaining ? 'Time Remaining' : 'Multiplier'}
      </span>
      <div className="flex-1 h-3 bg-synth-muted rounded-full overflow-hidden relative">
        <div
          ref={barRef}
          className="h-full rounded-full transition-all duration-300 ease-out"
          style={{
            width: `${barWidth}%`,
            background: isDying 
              ? 'linear-gradient(90deg, #dc2626, #ea580c, #d97706)' // Red to orange for urgent
              : 'linear-gradient(90deg, #16a34a, #0d9488, #f59e0b)' // Green to cyan to amber for fun
          }}
        />
      </div>
      <span className={`text-sm font-bold ${
        isDying ? 'text-red-400 animate-pulse' : 'text-synth-amber'
      }`}>
        {isTimeRemaining 
          ? `${Math.floor(multiplier * 60)}m` // Show minutes remaining
          : `${multiplier.toFixed(1)}x` // Show multiplier
        }
      </span>
    </div>
  );
}
