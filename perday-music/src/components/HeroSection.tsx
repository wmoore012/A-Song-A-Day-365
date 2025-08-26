import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!heroRef.current || !backgroundRef.current || !contentRef.current) return;

    // Parallax background effect
    gsap.to(backgroundRef.current, {
      yPercent: -30,
      ease: 'none',
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      }
    });

    // Hero content fade and slide effect
    gsap.to(contentRef.current, {
      y: -100,
      opacity: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      }
    });

    // Scale effect for dramatic entrance
    gsap.fromTo(contentRef.current,
      {
        scale: 0.8,
        opacity: 0
      },
      {
        scale: 1,
        opacity: 1,
        duration: 1.5,
        ease: 'power2.out'
      }
    );

  }, { scope: heroRef });

  return (
    <section
      ref={heroRef}
      className="relative h-screen overflow-hidden bg-gradient-to-br from-synth-violet via-synth-magenta to-synth-aqua"
    >
      {/* Animated Background - restored parallax layers */}
      <div
        ref={backgroundRef}
        className="absolute inset-0 opacity-20 parallax-layer"
        data-speed="0.3"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 80%, rgba(178,235,255,0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(108,26,237,0.3) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(255,182,193,0.3) 0%, transparent 50%)
          `,
          backgroundSize: '400px 400px'
        }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-60 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div
        ref={contentRef}
        className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4"
      >
        <div className="space-y-8 max-w-4xl">
          <h1 className="text-6xl md:text-8xl font-black text-white leading-tight">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              PERDAY
            </span>
            <br />
            <span className="text-white">
              MUSIC 365
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-cyan-300/80 max-w-2xl mx-auto leading-relaxed">
            The ultimate productivity gamification platform for music producers.
            Transform your creative workflow with structured sessions, gamified progress tracking,
            and a community-driven approach to consistent music production.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-lg rounded-xl shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105">
              Start Your Journey
            </button>

            <button className="px-8 py-4 border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-white font-bold text-lg rounded-xl transition-all duration-300">
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-bounce"></div>
        </div>
        <p className="text-white text-sm mt-2 text-center">Scroll to explore</p>
      </div>
    </section>
  );
}
