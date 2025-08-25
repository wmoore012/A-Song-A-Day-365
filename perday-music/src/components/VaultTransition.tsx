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

        // Force animations in dev/tests, only respect reduced motion in production
        const shouldAnimate =
          import.meta?.env?.MODE !== 'test' &&
          window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true
            ? false
            : true;

        console.log('VaultTransition: isOpen =', isOpen, 'isTransitioning =', isTransitioning);

        if (!shouldAnimate) {
          console.log('VaultTransition: Skipping animation due to reduced motion preference');
          onTransitionComplete();
          return;
        }

        if (isOpen && !isTransitioning) {
          console.log('VaultTransition: Starting vault door animation');
          console.log('VaultTransition: vaultRef.current =', vaultRef.current);
          setIsTransitioning(true);

          // Simple and reliable vault door effect
          const tl = gsap.timeline({
            onComplete: () => {
              console.log('VaultTransition: Animation complete, calling onTransitionComplete');
              setIsTransitioning(false);
              onTransitionComplete();
            },
            onStart: () => {
              console.log('VaultTransition: Animation started');
            }
          });

          // Enhanced vault door opening animation
          if (vaultRef.current) {
            // Create a more sophisticated animation sequence
            const vaultDoor = vaultRef.current;

            // First, animate the bolts retracting
            const bolts = vaultDoor.querySelectorAll('.absolute.w-6.h-16');
            bolts.forEach((bolt, index) => {
              tl.to(bolt, {
                scaleY: 0.3,
                duration: 0.5,
                ease: "power2.in",
                delay: index * 0.1
              }, 0);
            });

            // Then, make the security light turn green
            const securityLight = vaultDoor.querySelector('.bg-red-500');
            if (securityLight) {
              tl.to(securityLight, {
                backgroundColor: '#10b981', // green-500
                duration: 0.3
              }, 0.8);
            }

            // Finally, slide the entire vault door up and out of view
            tl.to(vaultDoor, {
              y: '-100vh',
              duration: 2.5,
              ease: "power2.inOut",
              onUpdate: function() {
                console.log('VaultTransition: Progress =', this.progress());
              }
            }, 1);

            // Add a subtle shake effect during opening
            tl.to(vaultDoor, {
              x: '+=2',
              duration: 0.1,
              repeat: 5,
              yoyo: true,
              ease: "none"
            }, 1);

          } else {
            console.error('VaultTransition: vaultRef.current is null');
            setIsTransitioning(false);
            onTransitionComplete();
          }
        }
      }, [isOpen, isTransitioning, onTransitionComplete]);

      return (
        <>
          {/* Realistic Bank Vault Door */}
          <div
            ref={vaultRef}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{
              background: 'radial-gradient(circle at center, #2c2c2c 0%, #1a1a1a 70%, #0d0d0d 100%)',
              perspective: '1000px'
            }}
          >
            {/* Vault Door Container */}
            <div className="relative w-96 h-[600px] rounded-lg overflow-hidden shadow-2xl"
                 style={{
                   background: 'linear-gradient(145deg, #4a4a4a 0%, #2c2c2c 50%, #1a1a1a 100%)',
                   boxShadow: 'inset 0 0 50px rgba(255,255,255,0.1), 0 0 100px rgba(0,0,0,0.8)',
                   border: '8px solid #666'
                 }}>

              {/* Vault Door Metal Texture */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0" style={{
                  backgroundImage: `
                    repeating-linear-gradient(
                      0deg,
                      transparent,
                      transparent 2px,
                      rgba(255,255,255,0.1) 2px,
                      rgba(255,255,255,0.1) 4px
                    ),
                    repeating-linear-gradient(
                      90deg,
                      transparent,
                      transparent 2px,
                      rgba(255,255,255,0.1) 2px,
                      rgba(255,255,255,0.1) 4px
                    )
                  `,
                  backgroundSize: '20px 20px'
                }}></div>
              </div>

              {/* Vault Door Center Circle */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-32 h-32 rounded-full border-8 border-gray-400 bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center shadow-inner">
                  <div className="w-20 h-20 rounded-full border-4 border-gray-300 bg-gradient-to-br from-gray-500 to-gray-700 flex items-center justify-center">
                    <div className="text-4xl">🔒</div>
                  </div>
                </div>
              </div>

              {/* Vault Door Bolts (animated) */}
              <div className="absolute top-8 left-8 w-6 h-16 bg-gradient-to-b from-gray-400 to-gray-600 rounded shadow-lg">
                <div className="w-full h-2 bg-gray-300 rounded-t mt-1"></div>
              </div>
              <div className="absolute top-8 right-8 w-6 h-16 bg-gradient-to-b from-gray-400 to-gray-600 rounded shadow-lg">
                <div className="w-full h-2 bg-gray-300 rounded-t mt-1"></div>
              </div>
              <div className="absolute bottom-8 left-8 w-6 h-16 bg-gradient-to-b from-gray-400 to-gray-600 rounded shadow-lg">
                <div className="w-full h-2 bg-gray-300 rounded-t mt-1"></div>
              </div>
              <div className="absolute bottom-8 right-8 w-6 h-16 bg-gradient-to-b from-gray-400 to-gray-600 rounded shadow-lg">
                <div className="w-full h-2 bg-gray-300 rounded-t mt-1"></div>
              </div>

              {/* Vault Door Handle */}
              <div className="absolute top-1/2 right-4 transform -translate-y-1/2 w-8 h-24 bg-gradient-to-b from-yellow-600 to-yellow-800 rounded-lg shadow-xl">
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-yellow-400"></div>
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-yellow-400"></div>
              </div>

              {/* Vault Door Warning Text */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
                <div className="text-yellow-400 font-bold text-sm mb-1">SECURE VAULT</div>
                <div className="text-gray-400 text-xs">AUTHORIZED PERSONNEL ONLY</div>
                <div className="text-gray-500 text-xs mt-2">INITIALIZING SECURE CONNECTION...</div>
              </div>

              {/* Vault Door Side Panels */}
              <div className="absolute -left-8 top-0 bottom-0 w-8 bg-gradient-to-b from-gray-700 to-gray-900 rounded-l-lg shadow-2xl"></div>
              <div className="absolute -right-8 top-0 bottom-0 w-8 bg-gradient-to-b from-gray-700 to-gray-900 rounded-r-lg shadow-2xl"></div>

              {/* Vault Door Hinges */}
              <div className="absolute left-2 top-8 w-3 h-3 rounded-full bg-gray-600 shadow-lg"></div>
              <div className="absolute left-2 top-20 w-3 h-3 rounded-full bg-gray-600 shadow-lg"></div>
              <div className="absolute left-2 bottom-20 w-3 h-3 rounded-full bg-gray-600 shadow-lg"></div>
              <div className="absolute left-2 bottom-8 w-3 h-3 rounded-full bg-gray-600 shadow-lg"></div>

              {/* Vault Door Security Panel */}
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-24 h-8 bg-black rounded border border-gray-600 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse mr-2"></div>
                <div className="text-green-400 text-xs font-mono">SECURE</div>
              </div>
            </div>

            {/* Vault Door Shadow/Glow Effect */}
            <div className="absolute inset-0 rounded-lg shadow-[0_0_100px_rgba(255,255,255,0.1)]"></div>
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
