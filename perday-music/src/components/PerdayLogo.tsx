import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

interface PerdayLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

export default function PerdayLogo({ size = 48, className = "", showText = true }: PerdayLogoProps) {
  const logoRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLImageElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!logoRef.current) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    // Entrance animation
    gsap.fromTo(logoRef.current, 
      { opacity: 0, y: -10, scale: 0.9 }, 
      { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "back.out(1.7)" }
    );

    // Icon glow effect
    if (iconRef.current) {
      gsap.to(iconRef.current, {
        filter: "drop-shadow(0 0 8px rgba(255, 176, 32, 0.6))",
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
      });
    }

    // Text animation
    if (textRef.current && showText) {
      gsap.fromTo(textRef.current,
        { opacity: 0, x: -10 },
        { opacity: 1, x: 0, duration: 0.4, delay: 0.2, ease: "power2.out" }
      );
    }
  }, [showText]);

  return (
    <div ref={logoRef} className={`flex items-center gap-3 ${className}`}>
      <img
        ref={iconRef}
        src="/perday-logo.png"
        alt="Perday"
        style={{ width: size, height: size }}
        className="rounded-lg"
      />
      {showText && (
        <div ref={textRef} className="flex flex-col">
          <div className="text-xl font-black text-synth-white">
            <span className="text-synth-amber">Per</span>day
          </div>
          <div className="text-xs text-synth-icy font-medium">Music</div>
        </div>
      )}
    </div>
  );
}
