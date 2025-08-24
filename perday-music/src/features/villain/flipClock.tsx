import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface FlipClockProps {
  text: string;
  className?: string;
  onComplete?: () => void;
}

export default function FlipClock({ text, className = "", onComplete }: FlipClockProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [displayText, setDisplayText] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !text) return;

    const shouldAnimate = import.meta?.env?.MODE !== 'test' && 
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true ? false : true;
    if (!shouldAnimate) {
      setDisplayText(text);
      return;
    }

    setIsAnimating(true);
    
    // Create timeline for authentic flip animation
    const tl = gsap.timeline({
      onComplete: () => {
        setIsAnimating(false);
        if (onComplete) onComplete();
      }
    });

    const chars = text.split('');
    
    // Start with random characters
    setDisplayText(chars.map(() => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()'[Math.floor(Math.random() * 62)]).join(''));

    // Animate each character with authentic flip effect
    chars.forEach((char, index) => {
      const randomDuration = 3 + Math.random() * 5; // 3-8 seconds
      const randomDelay = Math.random() * 2; // 0-2 seconds delay
      
      tl.to({}, {
        duration: randomDuration,
        delay: randomDelay,
        ease: "power2.out",
        onUpdate: function() {
          const progress = this.progress();
          
          // Random character flipping effect
          if (progress < 0.8) {
            const randomChar = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()'[Math.floor(Math.random() * 62)];
            setDisplayText(prev => {
              const chars = prev.split('');
              chars[index] = randomChar;
              return chars.join('');
            });
          } else {
            // Final character reveal
            setDisplayText(prev => {
              const chars = prev.split('');
              chars[index] = char;
              return chars.join('');
            });
          }
        }
      }, index * 0.1); // Stagger the start of each character
    });
  }, [text, onComplete]);

  return (
    <div 
      ref={containerRef} 
      className={`font-mono font-bold tracking-wider ${className}`}
    >
      {displayText.split('').map((char, index) => (
        <div key={index} className="inline-block mx-1">
          {/* Top half of flip digit */}
          <div className="relative w-8 h-10 overflow-hidden">
            <div 
              className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-gray-800 to-gray-900 border border-cyan-400/30 rounded-t-md flex items-center justify-center text-cyan-300 text-lg font-bold"
              style={{
                transformOrigin: 'bottom',
                transform: isAnimating ? 'rotateX(0deg)' : 'rotateX(0deg)',
                transition: 'transform 0.3s ease-in-out',
                textShadow: isAnimating ? '0 0 8px rgba(34, 211, 238, 0.8)' : 'none'
              }}
            >
              {char}
            </div>
          </div>
          
          {/* Bottom half of flip digit */}
          <div className="relative w-8 h-10 overflow-hidden">
            <div 
              className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-gray-700 to-gray-800 border border-cyan-400/30 rounded-b-md flex items-center justify-center text-cyan-300 text-lg font-bold"
              style={{
                transformOrigin: 'top',
                transform: isAnimating ? 'rotateX(0deg)' : 'rotateX(0deg)',
                transition: 'transform 0.3s ease-in-out',
                textShadow: isAnimating ? '0 0 8px rgba(34, 211, 238, 0.8)' : 'none'
              }}
            >
              {char}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
