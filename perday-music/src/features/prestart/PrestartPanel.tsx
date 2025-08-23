import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useAppStore } from "@/store/store";
import { usePrestart } from "./usePrestart";
import RotatingHero from "@/ui/RotatingHero";
import { StartCtaOverlay } from "@/ui/StartCtaOverlay";

gsap.registerPlugin(useGSAP);

export default function PrestartPanel({
  onLockIn,
  fadeOutMusic, // supply from AudioHud
}: {
  onLockIn: () => void;
  fadeOutMusic?: () => void;
}) {
  const { prestartTotalMs, setPhase, markReadyAt, motionOk } = useAppStore((s: any) => ({
    prestartTotalMs: s.prestartTotalMs, 
    setPhase: s.setPhase, 
    markReadyAt: s.markReadyAt, 
    motionOk: s.motionOk
  }));
  const { mmss, readyAtMs, sealed, tapReady } = usePrestart(prestartTotalMs);
  const cardRef = useRef<HTMLDivElement>(null);

  // entrance
  useGSAP(() => {
    if (!motionOk || !cardRef.current) return;
    gsap.fromTo(cardRef.current, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: .45, ease: "power2.out" });
  }, [motionOk]);

  // celebrate Ready micro-step
  useEffect(() => {
    if (readyAtMs == null) return;
    markReadyAt(readyAtMs);
  }, [readyAtMs, markReadyAt]);

  // auto lock-in at T-0
  useEffect(() => {
    if (!sealed) return;
    // missed Ready? nudge a little shade
    if (readyAtMs == null) {
      // Could add villain announce here
    }
    fadeOutMusic?.();
    setPhase("lockin");
    onLockIn();
  }, [sealed, readyAtMs, fadeOutMusic, setPhase, onLockIn]);

  return (
    <>
      <div ref={cardRef} className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-5">
        <div className="text-sm opacity-80">7-minute Pre-Start to get your mind right.</div>
        <div className={`mt-1 text-6xl font-black tabular-nums ${mmss === "00:00" ? "text-rose-400" : ""}`}>{mmss}</div>

        <div className="mt-4 flex items-center gap-3">
          <button 
            className="px-5 py-3 rounded-xl bg-[#7c5cff] hover:bg-[#8e77ff] font-extrabold shadow hover:shadow-[0_10px_24px_rgba(124,92,255,.25)] transition" 
            onClick={tapReady} 
            disabled={readyAtMs != null}
          >
            ⚡ Ready
          </button>
          <button 
            className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 font-bold" 
            onClick={() => { 
              fadeOutMusic?.(); 
              setPhase("lockin"); 
              onLockIn(); 
            }}
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
        visible={readyAtMs == null}
        onClick={tapReady}
      />
    </>
  );
}
