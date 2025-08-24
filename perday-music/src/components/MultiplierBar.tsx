import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface MultiplierBarProps {
  multiplier?: number;
  className?: string;
}

export default function MultiplierBar({ multiplier = 1.0, className = "" }: MultiplierBarProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const [isDying, setIsDying] = useState(false);

  useEffect(() => {
    if (!barRef.current) return;

    const shouldAnimate = import.meta?.env?.MODE !== 'test' && 
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true ? false : true;
    if (!shouldAnimate) return;

    // Check if multiplier is dying (below 1.5x)
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
  }, [multiplier]);

  // Calculate bar width based on multiplier (1.0x = 0%, 2.0x = 100%)
  const barWidth = Math.max(0, Math.min(100, (multiplier - 1) * 100));

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="text-sm font-medium text-synth-white">Multiplier</span>
      <div className="flex-1 h-3 bg-synth-muted rounded-full overflow-hidden relative">
        <div
          ref={barRef}
          className="h-full rounded-full transition-all duration-300 ease-out"
          style={{
            width: `${barWidth}%`,
            background: isDying 
              ? 'linear-gradient(90deg, #dc2626, #ea580c, #d97706)' // Red to orange for dying
              : 'linear-gradient(90deg, #16a34a, #0d9488, #f59e0b)' // Green to cyan to amber
          }}
        />
      </div>
      <span className={`text-sm font-bold ${
        isDying ? 'text-purple-400 animate-pulse' : 'text-synth-amber'
      }`}>
        {multiplier.toFixed(1)}x
      </span>
    </div>
  );
}
