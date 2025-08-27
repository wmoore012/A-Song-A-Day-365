import { useEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';

type Props = { isActive?: boolean; className?: string; size?: 'small'|'medium'|'large' };
export default function AudioVisualizer({ isActive=false, className="", size='medium' }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sizeClasses = useMemo(() => ({
    small: 'w-16 h-16',
    medium: 'w-24 h-24',
    large: 'w-32 h-32',
  }), []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !isActive) return;

    const prefersReduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (import.meta?.env?.MODE === 'test' || prefersReduce) return;

    const q = gsap.utils.selector(el);
    const bars = q('.eq__bar');

    const ctx = gsap.context(() => {
      gsap.set(bars, { height: '5%' });

      // intro
      const tl = gsap.timeline({ delay: 0.3 });
      tl.from(el, { opacity: 0, duration: 0.6 })
        .from(bars, { y: '400%', opacity: 0, duration: 1.2, stagger: 0.03, ease: 'elastic(1,0.6)' }, 0.1);

      // looping bar movement
      bars.forEach((bar: HTMLElement, i: number) => {
        const loop = gsap.timeline({ repeat: -1, delay: i * 0.05 });
        for (let k = 0; k < 120; k++) {
          const h = 5 + Math.floor(Math.random()*95);
          loop.to(bar, { height: `${h}%`, duration: 0.2, ease: 'sine.inOut' });
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div ref={containerRef} className={`relative ${sizeClasses[size]} ${className}`}>
      {/* EQ Bars */}
      <div className="absolute inset-0 flex items-end justify-center gap-1">
        {Array.from({ length: 12 }, (_, i) => (
          <div
            key={i}
            className="eq__bar w-1 bg-gradient-to-t from-cyan-400 to-purple-500 rounded-t-sm"
            style={{ height: '5%' }}
          />
        ))}
      </div>

      {/* Progress Ring */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="rgba(0, 188, 212, 0.2)"
            strokeWidth="2"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="url(#progress-gradient)"
            strokeWidth="2"
            strokeDasharray="283"
            strokeDashoffset="283"
            className="progress-ring"
          />
          <defs>
            <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00bcd4" />
              <stop offset="50%" stopColor="#e91e63" />
              <stop offset="100%" stopColor="#9c27b0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Floating Balls */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 6 }, (_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-cyan-400 rounded-full opacity-60 floating-ball"
            style={{
              left: `${20 + (i * 12)}%`,
              top: `${30 + (i * 8)}%`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
