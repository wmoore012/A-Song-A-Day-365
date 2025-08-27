import { useState, useCallback } from 'react';
import LiquidGlassButton from './LiquidGlassButton';
import { gsap } from 'gsap';
import GlassPanel from './common/GlassPanel';

// HeatButtonProps interface removed as it's not used

export default function HeatButtons() {
  const [heatCount, setHeatCount] = useState(0);

  const createHeatAnimation = useCallback((x: number, y: number, color: string, isFire: boolean = false) => {
    // Create element (either +1 or fire emoji)
    const heatElement = document.createElement('div');
    heatElement.textContent = isFire ? '🔥' : '+1';
    heatElement.className = 'absolute pointer-events-none text-3xl font-black z-50';
    heatElement.style.color = color;
    heatElement.style.left = `${x}px`;
    heatElement.style.top = `${y}px`;
    heatElement.style.textShadow = '2px 2px 0px white, -2px -2px 0px white, 2px -2px 0px white, -2px 2px 0px white';
    heatElement.style.filter = 'drop-shadow(0 0 4px rgba(255,255,255,0.8))';
    
    document.body.appendChild(heatElement);

    // Animate the element shooting out diagonally
    gsap.fromTo(heatElement, 
      {
        scale: 0,
        opacity: 1,
        x: 0,
        y: 0,
        rotation: isFire ? -180 : 0
      },
      {
        scale: isFire ? 1.4 : 1.8,
        opacity: 0,
        x: (Math.random() - 0.5) * 200, // Random diagonal direction
        y: -100 - Math.random() * 100,   // Always go up
        rotation: isFire ? 180 : 0,
        duration: 1.5,
        ease: "power2.out",
        onComplete: () => {
          document.body.removeChild(heatElement);
        }
      }
    );
  }, []);

  const handleHeatClick = useCallback((color: string) => {
    setHeatCount(prev => prev + 1);
    
    // Get button position for animation
    const button = document.querySelector(`[data-heat-color="${color}"]`) as HTMLElement;
    if (button) {
      const rect = button.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      
      // Alternate between +1 and fire emoji
      const isFire = heatCount % 2 === 1;
      createHeatAnimation(x, y, color, isFire);
    }
  }, [createHeatAnimation, heatCount]);

  const heatButtons = [
    { label: 'Heat', color: '#FF6B6B', variant: 'primary' as const },
    { label: 'Vibes', color: '#4ECDC4', variant: 'secondary' as const },
    { label: 'Flow', color: '#45B7D1', variant: 'ghost' as const },
    { label: 'Energy', color: '#96CEB4', variant: 'primary' as const },
    { label: 'Groove', color: '#FFEAA7', variant: 'secondary' as const },
    { label: 'Soul', color: '#DDA0DD', variant: 'ghost' as const }
  ];

  return (
    <GlassPanel className="p-4">
      <div className="flex flex-wrap gap-2 justify-center">
        {heatButtons.map((button) => (
          <LiquidGlassButton
            key={button.label}
            variant={button.variant}
            size="sm"
            className="h-12 px-3 text-center"
            onClick={() => handleHeatClick(button.color)}
            data-heat-color={button.color}
          >
            <div className="flex items-center gap-1">
              <span className="text-sm font-bold">{button.label}</span>
              <span className="text-xs opacity-80">🔥</span>
            </div>
          </LiquidGlassButton>
        ))}
      </div>
      
      <div className="text-center mt-3">
        <div className="text-synth-amber text-lg font-bold">
          Heat Level: {heatCount}
        </div>
        <div className="text-synth-icy text-xs">
          Keep the energy flowing! 🔥
        </div>
      </div>
    </GlassPanel>
  );
}
