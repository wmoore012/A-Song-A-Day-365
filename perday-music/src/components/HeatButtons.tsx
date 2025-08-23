import { useState, useCallback } from 'react';
import LiquidGlassButton from './LiquidGlassButton';
import { gsap } from 'gsap';

interface HeatButtonProps {
  label: string;
  color: string;
  onClick?: () => void;
}

export default function HeatButtons() {
  const [heatCount, setHeatCount] = useState(0);

  const createHeatAnimation = useCallback((x: number, y: number, color: string) => {
    // Create +1 element
    const heatElement = document.createElement('div');
    heatElement.textContent = '+1';
    heatElement.className = 'absolute pointer-events-none text-2xl font-bold z-50';
    heatElement.style.color = color;
    heatElement.style.left = `${x}px`;
    heatElement.style.top = `${y}px`;
    
    document.body.appendChild(heatElement);

    // Animate the +1 shooting out diagonally
    gsap.fromTo(heatElement, 
      {
        scale: 0,
        opacity: 1,
        x: 0,
        y: 0
      },
      {
        scale: 1.5,
        opacity: 0,
        x: (Math.random() - 0.5) * 200, // Random diagonal direction
        y: -100 - Math.random() * 100,   // Always go up
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
      createHeatAnimation(x, y, color);
    }
  }, [createHeatAnimation]);

  const heatButtons = [
    { label: 'Heat Check', color: '#FF6B6B', variant: 'primary' as const },
    { label: 'Vibes', color: '#4ECDC4', variant: 'secondary' as const },
    { label: 'Flow', color: '#45B7D1', variant: 'ghost' as const },
    { label: 'Energy', color: '#96CEB4', variant: 'primary' as const },
    { label: 'Groove', color: '#FFEAA7', variant: 'secondary' as const },
    { label: 'Soul', color: '#DDA0DD', variant: 'ghost' as const }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-6">
      {heatButtons.map((button, index) => (
        <LiquidGlassButton
          key={button.label}
          variant={button.variant}
          size="lg"
          className="h-20 text-center"
          onClick={() => handleHeatClick(button.color)}
          data-heat-color={button.color}
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-lg font-bold">{button.label}</span>
            <span className="text-sm opacity-80">🔥</span>
          </div>
        </LiquidGlassButton>
      ))}
      
      <div className="col-span-2 md:col-span-3 text-center mt-4">
        <div className="text-synth-amber text-2xl font-bold">
          Heat Level: {heatCount}
        </div>
        <div className="text-synth-icy text-sm">
          Keep the energy flowing! 🔥
        </div>
      </div>
    </div>
  );
}
