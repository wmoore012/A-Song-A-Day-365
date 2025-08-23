import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';

interface VaultTransitionProps {
  isOpen: boolean;
  onTransitionComplete: () => void;
  children: React.ReactNode;
}

export default function VaultTransition({ isOpen, onTransitionComplete, children }: VaultTransitionProps) {
  const vaultRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (!vaultRef.current || !contentRef.current) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      onTransitionComplete();
      return;
    }

    if (isOpen && !isTransitioning) {
      setIsTransitioning(true);
      
      // Create vault door effect
      const tl = gsap.timeline({
        onComplete: () => {
          setIsTransitioning(false);
          onTransitionComplete();
        }
      });

      // Vault door slides up with increasing speed
      tl.to(vaultRef.current, {
        y: '-100vh',
        duration: 2.5,
        ease: "power2.inOut",
        onUpdate: function() {
          // Increase speed as it goes up (like a real vault)
          const progress = this.progress();
          if (progress > 0.3) {
            this.timeScale(1 + progress * 2);
          }
        }
      })
      .to(contentRef.current, {
        scale: 1.2,
        duration: 1.5,
        ease: "power2.out",
        onUpdate: function() {
          // Zoom effect
          const progress = this.progress();
          if (progress > 0.5) {
            this.timeScale(1 + progress);
          }
        }
      }, "-=1.5")
      .to(contentRef.current, {
        scale: 1,
        duration: 1,
        ease: "power2.inOut"
      }, "-=0.5");
    }
  }, [isOpen, isTransitioning, onTransitionComplete]);

  return (
    <>
      {/* Vault Door (white screen that slides up) */}
      <div
        ref={vaultRef}
        className={`fixed inset-0 bg-white z-50 transform transition-transform duration-1000 ${
          isOpen ? 'translate-y-0' : 'translate-y-0'
        }`}
        style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 50%, #e9ecef 100%)',
          boxShadow: 'inset 0 0 100px rgba(0,0,0,0.1)'
        }}
      >
        {/* Vault door details */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🔒</div>
            <div className="text-2xl font-bold text-gray-700 mb-2">VAULT ACCESS</div>
            <div className="text-lg text-gray-500">Initializing secure connection...</div>
          </div>
        </div>
        
        {/* Vault door lines */}
        <div className="absolute top-1/4 left-0 right-0 h-px bg-gray-300"></div>
        <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-300"></div>
        <div className="absolute top-3/4 left-0 right-0 h-px bg-gray-300"></div>
        <div className="absolute left-1/4 top-0 bottom-0 w-px bg-gray-300"></div>
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-300"></div>
        <div className="absolute left-3/4 top-0 bottom-0 w-px bg-gray-300"></div>
      </div>

      {/* Content that gets revealed */}
      <div
        ref={contentRef}
        className={`relative z-40 ${isTransitioning ? 'pointer-events-none' : ''}`}
      >
        {children}
      </div>
    </>
  );
}
