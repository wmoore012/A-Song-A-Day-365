import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface AudioVisualizerProps {
  isActive?: boolean;
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

export default function AudioVisualizer({ 
  isActive = false, 
  className = "",
  size = 'medium'
}: AudioVisualizerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const barsRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const topBallRef = useRef<HTMLDivElement>(null);
  const bottomBallRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !isActive) return;

    const shouldAnimate = import.meta?.env?.MODE !== 'test' && 
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true ? false : true;
    if (!shouldAnimate) return;

    // Get all bars
    const bars = gsap.utils.toArray('.eq__bar');
    const minHeight = 4.8;
    const maxHeight = 100;
    const delay = 0.05;

    // Create possible values array
    const definedVals = [];
    for (let i = 0; i < maxHeight - minHeight; i++) {
      definedVals.push(Math.ceil(minHeight + i));
    }

    // Weighted random function for natural animation
    function weightedRandom(collection: number[], ease: string) {
      return gsap.utils.pipe(
        Math.random,
        gsap.parseEase(ease),
        gsap.utils.mapRange(0, 1, -0.5, collection.length - 0.5),
        gsap.utils.snap(1),
        (i: number) => collection[i]
      );
    }

    // Create animation values
    const vals: number[] = [];
    for (let i = 0; i < 200; i++) {
      vals.push(weightedRandom(definedVals, "power1.in")());
    }

    // Intro animation
    const tl = gsap.timeline({
      delay: 0.5
    });

    tl.from(containerRef.current, {
      opacity: 0,
      duration: 1,
      ease: 'none'
    })
    .from(bars, {
      y: "500%",
      opacity: 0,
      duration: 2,
      ease: 'elastic(2, 0.7)',
      stagger: 0.04
    }, 0.8)
    .from([topBallRef.current, bottomBallRef.current], {
      scale: 0,
      duration: 1.2,
      ease: 'elastic(1, 0.75)',
      transformOrigin: 'center center'
    }, 1.3)
    .from(topBallRef.current, {
      y: '350%',
      duration: 2,
      ease: 'elastic(1, 0.75)',
      transformOrigin: 'center center'
    }, 1.3)
    .from(bottomBallRef.current, {
      y: '-350%',
      duration: 2,
      ease: 'elastic(1, 0.75)',
      transformOrigin: 'center center'
    }, 1.3)
    .from(progressRef.current, {
      scaleY: 0,
      duration: 2,
      ease: 'elastic(1.1, 0.9)'
    }, 1.3);

    // Start continuous wave animation after intro
    setTimeout(() => {
      bars.forEach((bar: any, i: number) => {
        const barTl = gsap.timeline({
          repeat: -1,
          delay: delay * i
        });
        
        vals.forEach((val: number) => {
          barTl.to(bar, {
            height: `${val}%`,
            duration: 0.25,
            ease: 'sine.inOut'
          });
        });
      });
    }, 3500);

    // Set initial states
    gsap.set(bars, { height: `${minHeight}%` });
    gsap.set(containerRef.current, { autoAlpha: 1 });

  }, [isActive]);

  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24', 
    large: 'w-32 h-32'
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {/* SVG Filters */}
      <svg className="absolute inset-0 w-0 h-0">
        <defs>
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" />
            <feColorMatrix type="saturate" values="0"/>
          </filter>
        </defs>
      </svg>

      {/* Main Container */}
      <div 
        ref={containerRef}
        className="relative w-full h-full flex items-center justify-center"
        style={{
          backgroundImage: 'linear-gradient(204deg, #333333 41%, #232323 89%)',
          borderRadius: '25%',
          boxShadow: `
            -15px 22px 34px 0 rgba(0,0,0,0.26),
            -110px 72px 264px 0 rgba(0,0,0,0.25),
            -90px 122px 200px -150px rgba(0,0,0,0.7),
            11px 53px 40px 0 rgba(0,0,0,0.12),
            -34px 53px 84px 0 rgba(0,0,0,0.06),
            -110px 92px 400px 0 rgba(0,0,0,0.07),
            inset 0.1vmin 0.1vmin 0.1vmin 0.15vmin rgba(0,0,0,0.2),
            inset 0 0.35vmin 0.5vmin 0.2vmin rgba(0,0,0,0.50),
            inset 0.2vmin -0.6vmin 0.8vmin 0.8vmin rgba(0,0,0,0.10),
            inset 0 -0.5vmin 1.0vmin 0.0vmin rgba(0,0,0,0.5),
            inset -0.5vmin 0.3vmin 0.5vmin -0.05vmin rgba(255,255,255,0.6)
          `
        }}
      >
        {/* Noise Overlay */}
        <div 
          className="absolute inset-0 mix-blend-multiply opacity-30"
          style={{ filter: 'url(#noise)' }}
        />

        {/* Equalizer Bars */}
        <div 
          ref={barsRef}
          className="eq grid grid-cols-2 gap-[5.4%] w-[89.6%] h-[61%]"
          style={{ filter: 'drop-shadow(-0.1vmin 0.5vmin 1vmin rgba(0,0,0,0.6))' }}
        >
          {/* Left Bars */}
          <div className="eq__bars-l flex justify-between items-center">
            {Array.from({ length: 11 }).map((_, i) => (
              <div
                key={`left-${i}`}
                className="eq__bar relative w-[7%] h-[4.8%] overflow-hidden bg-red-500 flex flex-col justify-center"
                style={{ clipPath: 'inset(0 round 20px)' }}
              />
            ))}
          </div>
          
          {/* Right Bars */}
          <div className="eq__bars-r flex justify-between items-center">
            {Array.from({ length: 11 }).map((_, i) => (
              <div
                key={`right-${i}`}
                className="eq__bar relative w-[7%] h-[4.8%] overflow-hidden bg-white flex flex-col justify-center"
                style={{ clipPath: 'inset(0 round 20px)' }}
              />
            ))}
          </div>
        </div>

        {/* Progress Bar */}
        <div 
          ref={progressRef}
          className="prog absolute flex items-center justify-center w-[10.08%] h-[80.7%]"
          style={{ filter: 'drop-shadow(-0.2vmin 0.7vmin 0.8vmin rgba(0,0,0,0.7))' }}
        >
          <div 
            className="prog__bar relative w-[24%] h-[76%]"
            style={{
              background: `
                linear-gradient(-15deg, rgba(0,0,0,0) 98%, rgba(0,35,108,0.69) 100%),
                linear-gradient(10deg, rgba(0,35,108,0.35) 0%, rgba(0,0,0,0) 1.5%),
                linear-gradient(90deg, rgba(255,255,255,0) 40%, rgba(255,255,255,0.1) 60%, rgba(255,255,255,0) 100%),
                linear-gradient(90deg, #1F56B4 0%, #266CB9 7%, #007FD2 18%, #0095F4 55%, #019CF3 72%, #02A2F3 79%, #0085ED 100%)
              `
            }}
          >
            {/* Progress Bar Highlight */}
            <div 
              className="absolute left-[54%] w-[3%] h-[40%]"
              style={{
                background: 'linear-gradient(0deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 100%)'
              }}
            />
          </div>
          
          {/* Top Ball */}
          <div 
            ref={topBallRef}
            className="prog__ball prog__ball--top absolute top-0 w-full h-[12.48%] bg-[#00A1FD] rounded-full"
            style={{ boxShadow: 'inset 0.8vmin -0.7vmin 1.5vmin 0 rgba(4,54,90,0.7)' }}
          >
            <div className="absolute left-[37%] top-[30%] w-[25%] h-[22%] rounded-full bg-gradient-radial from-white/25 to-transparent" />
            <div className="absolute left-[60%] top-[20%] w-[35%] h-[28%] rounded-full bg-gradient-radial from-white/30 to-transparent rotate-[50deg]" />
          </div>
          
          {/* Bottom Ball */}
          <div 
            ref={bottomBallRef}
            className="prog__ball prog__ball--btm absolute bottom-0 w-full h-[12.48%] bg-[#00A1FD] rounded-full"
            style={{ boxShadow: 'inset 0.8vmin -0.7vmin 1.5vmin 0 rgba(4,54,90,0.7)' }}
          >
            <div className="absolute left-[37%] top-[30%] w-[25%] h-[22%] rounded-full bg-gradient-radial from-white/25 to-transparent" />
            <div className="absolute left-[60%] top-[20%] w-[35%] h-[28%] rounded-full bg-gradient-radial from-white/30 to-transparent rotate-[50deg]" />
          </div>
        </div>
      </div>
    </div>
  );
}
