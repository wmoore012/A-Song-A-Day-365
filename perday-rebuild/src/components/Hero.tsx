"use client";

import { useEffect, useRef } from 'react';
import { Music, Flash, Rocket } from 'lucide-react';
import { gsap } from 'gsap';

export default function Hero() {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { rotateY: -15, opacity: 0 },
        { rotateY: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }
      );
    }
  }, []);

  const spin = () => {
    if (cardRef.current) {
      gsap.to(cardRef.current, { rotateY: '+=360', duration: 1, ease: 'power2.inOut' });
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div
        ref={cardRef}
        onClick={spin}
        className="text-center cursor-pointer bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-10 shadow-[0_0_20px_rgba(0,255,255,0.25)]"
      >
        <h1 className="flex items-center justify-center gap-3 text-5xl font-bold text-white mb-8">
          <Music className="w-12 h-12 text-cyan-300" />
          Perday Music 365
        </h1>
        <p className="text-xl text-cyan-300 mb-6">Lock-In is your lane. Hit Ready to power up.</p>

        <div className="space-y-4">
          <button className="px-8 py-4 rounded-2xl text-lg font-bold bg-gradient-to-r from-cyan-400 to-purple-600 text-white shadow-[0_0_12px_rgba(0,255,255,0.6)] hover:shadow-[0_0_24px_rgba(0,255,255,0.9)] transition-shadow">
            <Flash className="w-5 h-5 inline-block mr-2" />
            Ready — Celebrate the first step
          </button>

          <button className="px-8 py-4 rounded-2xl text-lg border-2 border-cyan-400/60 text-cyan-300 hover:bg-cyan-400/20 shadow-[0_0_8px_rgba(0,255,255,0.4)] hover:shadow-[0_0_16px_rgba(0,255,255,0.7)] transition-shadow">
            <Rocket className="w-5 h-5 inline-block mr-2" />
            Start Now (Skip Pre-Start)
          </button>
        </div>
      </div>
    </div>
  );
}


