import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface BarChartData {
  label: string;
  value: number;
  maxValue: number;
}

interface EnhancedBarChartProps {
  data: BarChartData[];
  title?: string;
  subtitle?: string;
  className?: string;
  isActive?: boolean;
}

export default function EnhancedBarChart({ 
  data, 
  title = "Stats", 
  subtitle = "Performance Metrics",
  className = "",
  isActive = false
}: EnhancedBarChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const barsRef = useRef<HTMLUListElement>(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!containerRef.current || !isActive) return;

    const shouldAnimate = import.meta?.env?.MODE !== 'test' && 
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true ? false : true;
    if (!shouldAnimate) return;

    // Entrance animation
    const tl = gsap.timeline({
      delay: 0.3
    });

    tl.from(containerRef.current, {
      y: -50,
      opacity: 0,
      duration: 0.8,
      ease: 'cubic-bezier(0.23, 1, 0.32, 1)'
    })
    .from('.stats__item', {
      y: 100,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'cubic-bezier(0.23, 1, 0.32, 1)'
    }, '-=0.4');

  }, [isActive]);

  const handleBarClick = (index: number) => {
    setSelectedIndex(index);
    setIsOverlayOpen(true);
  };

  const closeOverlay = () => {
    setIsOverlayOpen(false);
  };

  const selectedData = data[selectedIndex] || data[0];

  return (
    <div className={`relative ${className}`}>
      {/* Main Chart */}
      <div ref={containerRef} className="stats relative p-6">
        {/* Header */}
        <div className="stats__header flex items-center transform translate-y-0 opacity-100 transition-all duration-400">
          <div className="stats__header-num mr-6">
            <p className="text-6xl font-bold m-0 text-amber-400">{data.length}</p>
          </div>
          <div className="stats__header-name">
            <p className="text-amber-200/80 m-0 text-lg">{title}</p>
            <span className="block text-white font-bold text-3xl leading-tight">{subtitle}</span>
          </div>
        </div>

        {/* Bars */}
        <ul ref={barsRef} className="stats__list flex mt-8">
          {data.map((item, index) => (
            <li 
              key={index}
              className="stats__item h-96 flex flex-col-reverse float-left relative text-center mr-6 perspective-1000 transition-all duration-300 hover:opacity-70 cursor-pointer"
              onClick={() => handleBarClick(index)}
            >
              <p className="stats__item-num mt-6 opacity-100 transition-all duration-400 text-amber-400 font-bold">
                {item.value}
              </p>
              <div 
                className="stats__item-bar order-0 w-10 bg-white transform scale-y-100 cursor-pointer transition-all duration-500"
                style={{
                  height: `${(item.value / item.maxValue) * 300}px`,
                  background: 'linear-gradient(180deg, #f59e0b 0%, #fbbf24 50%, #fde047 100%)',
                  boxShadow: `
                    10px 15px rgba(0,0,0,0.2),
                    0 0 20px rgba(245, 158, 11, 0.3),
                    inset 0 2px 4px rgba(255,255,255,0.3)
                  `,
                  borderRadius: '8px'
                }}
              />
            </li>
          ))}
        </ul>

        {/* Overlay */}
        <div 
          className={`stats__overlay fixed inset-0 w-full h-full p-6 transform scale-100 transition-all duration-600 ${
            isOverlayOpen ? 'opacity-100 visible' : 'opacity-0 invisible scale-150'
          }`}
          style={{
            background: 'radial-gradient(circle at center, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.95) 100%)'
          }}
        >
          {/* Back Button */}
          <div className="stats__overlay-back flex items-center cursor-pointer absolute top-6 left-6">
            <svg 
              className="w-9 h-9 transition-all duration-500 hover:-translate-x-1" 
              fill="white" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 36 36"
              onClick={closeOverlay}
            >
              <path d="M30 16.5H11.74l8.38-8.38L18 6 6 18l12 12 2.12-2.12-8.38-8.38H30v-3z" />
            </svg>
            <p className="font-bold text-2xl m-0 ml-3 text-white">Back</p>
          </div>

          {/* Center Info */}
          <div className="stats__overlay-avg absolute top-1/2 left-1/2 w-80 h-80 rounded-full transform -translate-x-1/2 -translate-y-1/2 text-center bg-gradient-to-br from-amber-500/20 to-orange-500/20 backdrop-blur-sm border border-amber-400/30 flex flex-col justify-center">
            <p className="m-0 text-amber-400 font-bold text-6xl">
              {selectedData.value}
            </p>
            <p className="text-white/80 text-lg">Current Value</p>
          </div>

          {/* Bottom Info */}
          <div className="stats__overlay-info absolute bottom-6 left-12 flex">
            <div className="stats__overlay-info-half mr-6">
              <p className="m-0 leading-tight text-amber-400 font-bold text-5xl">
                {selectedData.maxValue}
              </p>
              <p className="text-white/80">Max Value</p>
            </div>
            <div className="stats__overlay-info-half">
              <p className="m-0 leading-tight text-amber-400 font-bold text-5xl">
                {selectedData.label}
              </p>
              <p className="text-white/80">Metric</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
