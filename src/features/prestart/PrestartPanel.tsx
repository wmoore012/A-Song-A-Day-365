import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useAppStore } from "@/store/store";
import { usePrestart } from "./usePrestart";
import { useVillainAnnounce } from "@/features/fx/useVillainAnnounce";
import { StartCtaOverlay } from "@/ui/StartCtaOverlay";
import RotatingHero from "@/ui/RotatingHero";

gsap.registerPlugin(useGSAP);

// Fail loud: validate preconditions
function must<T>(value: T | null | undefined, msg: string): T {
  if (value == null) throw new Error(msg);
  return value;
}

export default function PrestartPanel({
  onLockIn,
  fadeOutMusic, // supply from AudioHud
}: {
  onLockIn: () => void;
  fadeOutMusic?: () => void;
}) {
  // Validate required props
  if (typeof onLockIn !== 'function') {
    throw new Error("PrestartPanel: onLockIn must be a function");
  }
  const { prestartTotalMs, setPhase, markReadyAt, motionOk } = useAppStore((s:any)=>({
    prestartTotalMs: s.prestartTotalMs, 
    setPhase: s.setPhase, 
    markReadyAt: s.markReadyAt, 
    motionOk: s.motionOk
  }));
  const { msLeft, mmss, readyAtMs, sealed, tapReady } = usePrestart(prestartTotalMs);
  const { powerUp, announce } = useVillainAnnounce();
  const cardRef = useRef<HTMLDivElement>(null);

  // entrance animation - respect reduced motion
  useGSAP(() => {
    if (!cardRef.current) return;
    
    // Respect reduced motion preference
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || !motionOk) return;
    
    gsap.fromTo(cardRef.current, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: .45, ease: "power2.out" });
  }, [motionOk]);

  // celebrate Ready micro-step
  useEffect(() => {
    if (readyAtMs == null) return;
    powerUp("Ready locked. Multiplier armed.");
    markReadyAt(readyAtMs);
  }, [readyAtMs, markReadyAt, powerUp]);

  // auto lock-in at T-0
  useEffect(() => {
    if (!sealed) return;
    // missed Ready? nudge a little shade
    if (readyAtMs == null) announce("https://media.giphy.com/media/OSuaE6AknuRc7syZXp/giphy.gif", "Missed Ready. Lighter multiplier.", 2200);
    fadeOutMusic?.();
    setPhase("lockin");
    onLockIn();
  }, [sealed]);

  return (
    <>
      <div 
        ref={cardRef} 
        className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-5"
        data-testid="prestart-panel"
      >
        <div className="text-sm opacity-80">7-minute Pre-Start to get your mind right.</div>
        <div 
          className={`mt-1 text-6xl font-black tabular-nums ${mmss==="00:00"?"text-rose-400":""}`}
          data-testid="countdown-timer"
          aria-live="polite"
          aria-label={`Time remaining: ${mmss}`}
        >
          {mmss}
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button 
            className="px-5 py-3 rounded-xl bg-[#7c5cff] hover:bg-[#8e77ff] font-extrabold shadow hover:shadow-[0_10px_24px_rgba(124,92,255,.25)] transition-colors"
            onClick={tapReady} 
            disabled={readyAtMs!=null}
            data-testid="ready-button"
            aria-label="Tap when ready to start"
          >
            ⚡ Ready
          </button>
          <button 
            className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 font-bold transition-colors"
            onClick={()=>{ 
              fadeOutMusic?.(); 
              setPhase("lockin"); 
              onLockIn(); 
            }}
            data-testid="start-now-button"
            aria-label="Start immediately without waiting"
          >
            🚀 Start Now
          </button>
        </div>

        <div className="mt-4">
          <RotatingHero
            items={[
              "Tap Ready to power up your Multiplier—feel that first win.",
              "No fluff. One hook. One bounce. Next.",
              "We auto-start at T-0—doing is the default.",
            ]}
            intervalMs={3800}
          />
        </div>
      </div>

      {/* "Hey! This is cool but…" sticky CTA while exploring */}
      <StartCtaOverlay
        visible={readyAtMs==null}
        onClick={tapReady}
      />
    </>
  );
}
