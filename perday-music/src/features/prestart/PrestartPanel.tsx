import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useAppStore } from "../../store/store";
import { usePrestart } from "./usePrestart";
import RotatingHero from "../../ui/RotatingHero";
import { StartCtaOverlay } from "../../ui/StartCtaOverlay";
import { useVillainAnnounce } from "../fx/useVillainAnnounce";

gsap.registerPlugin(useGSAP);

export default function PrestartPanel({
  onLockIn,
  fadeOutMusic, // supply from AudioHud
}: {
  onLockIn: () => void;
  fadeOutMusic?: () => void;
}) {
  const prestartTotalMs = useAppStore((s) => s.prestartTotalMs);
  const setPhase = useAppStore((s) => s.setPhase);
  const markReadyAt = useAppStore((s) => s.markReadyAt);
  const motionOk = useAppStore((s) => s.motionOk);
  const { mmss, readyAtMs, sealed, tapReady, msLeft } = usePrestart(prestartTotalMs);
  const cardRef = useRef<HTMLDivElement>(null);
  const { villainNudge } = useVillainAnnounce();

  // entrance
  useGSAP(() => {
    if (!motionOk || !cardRef.current) return;
    gsap.fromTo(cardRef.current, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: .45, ease: "power2.out" });
  }, [motionOk]);

  // celebrate Ready micro-step
  useEffect(() => {
    if (readyAtMs == null) return;
    markReadyAt(readyAtMs);
    villainNudge("⚡ Ready! Your multiplier is powered up!");
  }, [readyAtMs, markReadyAt, villainNudge]);

  // nudge when timer gets low
  useEffect(() => {
    if (readyAtMs != null) return; // already ready
    if (msLeft <= 60000 && msLeft > 59000) { // around 1 minute left
      villainNudge("⏰ 1 minute left! Ready to power up your multiplier?");
    }
  }, [msLeft, readyAtMs, villainNudge]);

  // auto lock-in at T-0
  useEffect(() => {
    if (!sealed) return;
    // missed Ready? nudge a little shade
    if (readyAtMs == null) {
      villainNudge("Missed the Ready button? No worries, we're starting anyway! 🚀");
    }
    fadeOutMusic?.();
    setPhase("lockin");
    onLockIn();
  }, [sealed, readyAtMs, fadeOutMusic, setPhase, onLockIn, villainNudge]);

  const handleStartNow = () => {
    fadeOutMusic?.();
    setPhase("lockin");
    onLockIn();
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center p-4">
        <div ref={cardRef} className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-8 max-w-md w-full text-center" data-testid="prestart-panel">
          <div className="text-lg font-semibold text-white/90 mb-2">7-minute Pre-Start to get your mind right.</div>
          <div className="text-sm text-white/60 mb-6">This is the EASY step. We'll start the timer for you if you don't do anything!</div>
          
          <div className={`text-7xl font-black tabular-nums mb-8 ${mmss === "00:00" ? "text-rose-400" : "text-white"}`}>{mmss}</div>

          <div className="space-y-4">
            <button 
              className="w-full px-6 py-4 rounded-xl bg-[#7c5cff] hover:bg-[#8e77ff] font-extrabold shadow hover:shadow-[0_10px_24px_rgba(124,92,255,.25)] transition text-lg" 
              onClick={tapReady} 
              disabled={readyAtMs != null}
            >
              ⚡ Ready (Power up your Multiplier)
            </button>
            <button 
              className="w-full px-6 py-4 rounded-xl bg-white/10 hover:bg-white/15 font-bold text-lg" 
              onClick={handleStartNow}
            >
              🚀 Start Now (Skip Pre-Start)
            </button>
          </div>

          <div className="mt-6">
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
      </div>

      {/* "Hey! This is cool but…" sticky CTA while exploring */}
      <StartCtaOverlay
        visible={readyAtMs == null}
        onClick={tapReady}
      />
    </>
  );
}
