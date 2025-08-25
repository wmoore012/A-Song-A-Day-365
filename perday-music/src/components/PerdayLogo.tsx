import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

interface PerdayLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
  variant?: 'default' | 'hero' | 'transition'; // Animation variants
  onAnimationComplete?: () => void;
}

export default function PerdayLogo({ 
  size = 48, 
  className = "", 
  showText = true,
  variant = 'default',
  onAnimationComplete 
}: PerdayLogoProps) {
  const logoRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLImageElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!logoRef.current) return;

    // Guard for tests and reduced motion preferences
    if (import.meta.env.VITEST || (typeof window !== 'undefined' &&
        window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)) {
      return; // skip animations in tests and reduced motion
    }

    // Create timeline for coordinated animations
    const tl = gsap.timeline({
      onComplete: onAnimationComplete
    });

    // Different animations based on variant
    switch (variant) {
      case 'hero':
        // DRAMATIC entrance for hero section
        tl.fromTo(logoRef.current, 
          { opacity: 0, y: -50, scale: 0.5, rotationY: -90 }, 
          { opacity: 1, y: 0, scale: 1, rotationY: 0, duration: 1.2, ease: "back.out(2)" }
        );
        break;
        
      case 'transition':
        // SMOOTH transition animation
        tl.fromTo(logoRef.current,
          { scale: 0, rotation: -180, opacity: 0 },
          { scale: 1, rotation: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
        );
        break;
        

      default:
        // Enhanced default animation
        tl.fromTo(logoRef.current, 
          { opacity: 0, y: -30, scale: 0.8, rotationY: -45 }, 
          { opacity: 1, y: 0, scale: 1, rotationY: 0, duration: 0.8, ease: "back.out(1.7)" }
        );
    }

    // Enhanced icon effects with color pops
    if (iconRef.current) {
      // Initial setup
      gsap.set(iconRef.current, {
        filter: "drop-shadow(0 0 4px rgba(255, 176, 32, 0.3))"
      });

      // STUNNING glow animation with color variations
      gsap.to(iconRef.current, {
        filter: "drop-shadow(0 0 20px rgba(255, 176, 32, 1)) drop-shadow(0 0 40px rgba(255, 176, 32, 0.6))",
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
      });

      // Subtle floating + scale with color trail effect
      gsap.to(iconRef.current, {
        y: -3,
        scale: 1.05,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut"
      });

      // Color rotation effect for premium feel
      gsap.to(iconRef.current, {
        filter: "drop-shadow(0 0 15px rgba(34, 211, 238, 0.8)) drop-shadow(0 0 30px rgba(168, 85, 247, 0.6))",
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        delay: 1
      });
    }

    // Enhanced text animation with stagger and character splitting
    if (textRef.current && showText) {
      const chars = textRef.current.querySelectorAll('.char');
      
      if (chars.length > 0) {
        // Character-by-character reveal (like the portfolio!)
        tl.fromTo(chars,
          { opacity: 0, y: 20, rotationX: 90 },
          { 
            opacity: 1, 
            y: 0, 
            rotationX: 0, 
            duration: 0.05,
            stagger: 0.05,
            ease: "back.out(1.7)" 
          },
          "-=0.4"
        );
      } else {
        // Fallback for non-split text
        tl.fromTo(textRef.current,
          { opacity: 0, x: -20, rotationX: 45 },
          { opacity: 1, x: 0, rotationX: 0, duration: 0.6, ease: "power2.out" },
          "-=0.4"
        );
      }

      // Floating text animation with color shifts
      gsap.to(textRef.current, {
        y: -2,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        delay: 1
      });
    }
  }, { scope: logoRef, dependencies: [showText, variant] });

  // Split text into characters for animation (inspired by portfolio)
  const splitText = (text: string) => {
    return text.split('').map((char, index) => (
      <span key={index} className="char inline-block">{char}</span>
    ));
  };

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
            <span className="text-synth-amber">{splitText('Per')}</span>
            {splitText('day')}
          </div>
          <div className="text-xs text-synth-icy font-medium">
            {splitText('Music')}
          </div>
        </div>
      )}
    </div>
  );
}
