import { useState, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';

const LOCK_IN_TIPS = [
  "Start the timer. Loops don't cook themselves.",
  "Quit stalling. Put one idea down—then build.",
  "Talking won't bounce a track. Press start.",
  "Open DAW, pick a loop, drums, go.",
  "First move: eight bars, no detours.",
  "Clock's live. Put numbers on the board—quietly.",
  "Keep it simple, ship it. Then flex.",
  "Load the kit, not another tab.",
  "No grand plan. One section, print it.",
  "Set a limiter: 30 mins, export no matter what.",
  "You know the recipe. Stop remixing the checklist.",
  "Minimal chain. Max output.",
  "Reference last win. Repeat the steps.",
  "One hook. One bounce. Next.",
  "You ain't stuck. You bored. Move.",
  // Added new tips from the user's suggestion
  "Put phone in another room (timer on desktop).",
  "Decide your 'stopping point' before you start.",
  "Label your DAW markers (Verse, Pre, Hook) now.",
  "When stuck, bounce a 30s loop and move on.",
  "Mute FX buses during writing; add later.",
  "Commit to one sound per section—choice beats options.",
  "Use a ref track at -12 LUFS for perspective.",
  "Name your session YYYY-MM-DD(at least) before you hit Rec.",
];

export default function LockInTips() {
  const [currentTip, setCurrentTip] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useGSAP(() => {
    // Slide down from top animation
    gsap.fromTo('.lock-in-tips', 
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power2.out", delay: 0.5 }
    );
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % LOCK_IN_TIPS.length);
    }, 4000); // Change tip every 4 seconds

    return () => clearInterval(interval);
  }, [isVisible]);

  return (
    <div className="lock-in-tips fixed top-0 left-0 right-0 z-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-black/80 backdrop-blur-xl border border-cyan-400/50 rounded-xl p-6 shadow-lg shadow-cyan-400/30">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">📟</span>
            <h3 className="text-cyan-300 font-semibold text-lg">Lock-In Tips</h3>
          </div>
          <p className="text-white font-mono text-base leading-relaxed">
            {LOCK_IN_TIPS[currentTip]}
          </p>
          <div className="flex justify-center mt-4">
            <div className="flex gap-1">
              {LOCK_IN_TIPS.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentTip 
                      ? 'bg-cyan-400' 
                      : 'bg-white/20'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
