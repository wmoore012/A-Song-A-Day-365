import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

interface SpinningLogoProps {
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

export default function SpinningLogo({ className = '', size = 'medium' }: SpinningLogoProps) {
  const logoRef = useRef<HTMLDivElement>(null);
  
  const sizeClasses = {
    small: 'text-2xl',
    medium: 'text-4xl',
    large: 'text-6xl'
  };

  useGSAP(() => {
    if (!logoRef.current) return;

    const prefersReduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (import.meta?.env?.MODE === 'test' || prefersReduce) return;

    const ctx = gsap.context(() => {
      // Random flick animation
      const flickLogo = () => {
        const duration = 0.3 + Math.random() * 0.4; // 0.3-0.7s
        const rotations = 2 + Math.random() * 4; // 2-6 rotations
        const ease = "power2.out";
        
        gsap.to(logoRef.current, {
          rotation: `+=${360 * rotations}`,
          duration: duration,
          ease: ease,
          onComplete: () => {
            // Schedule next flick
            setTimeout(flickLogo, 3000 + Math.random() * 5000); // 3-8 seconds
          }
        });
      };

      // Start the flick cycle
      setTimeout(flickLogo, 2000 + Math.random() * 3000); // Initial delay 2-5 seconds

    }, logoRef);

    return () => ctx.revert();
  }, []);

  return (
    <div 
      ref={logoRef}
      className={`${sizeClasses[size]} font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 ${className}`}
    >
      Perday Music 365™
    </div>
  );
}
