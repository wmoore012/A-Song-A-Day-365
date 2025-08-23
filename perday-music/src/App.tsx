import { useRef } from "react";
import { useAppStore } from "./store/store";
import PageVisibilityBadge from "./ui/PageVisibilityBadge";
import PrestartPanel from "./features/prestart/PrestartPanel";
import AudioHud from "./features/sound/AudioHud";
import { AnalyticsHud } from "./features/AnalyticsHud";

// Fail loud: validate preconditions
function must<T>(value: T | null | undefined, msg: string): T {
  if (value == null) throw new Error(msg);
  return value;
}

export default function App() {
  const fadeOutRef = useRef<() => void>(() => {});
  const phase = useAppStore((s) => s.phase);
  const setPhase = useAppStore((s) => s.setPhase);
  const prestartTotalMs = useAppStore((s) => s.prestartTotalMs);
  const motionOk = useAppStore((s) => s.motionOk);

  // Validate store state
  must(phase, "Phase must be defined");
  must(setPhase, "setPhase must be defined");
  must(prestartTotalMs, "prestartTotalMs must be defined");
  must(motionOk, "motionOk must be defined");

  const handleLockIn = () => {
    setPhase("prestart");
    fadeOutRef.current();
  };

  return (
    <div 
      className="min-h-screen bg-[var(--brand-bg)] text-[var(--brand-fg)]"
      data-testid="app-main"
      aria-label="Perday Music Application"
    >
      <PageVisibilityBadge />
      
      {/* Logo */}
      <div className="fixed top-6 left-6 z-10">
        <div className="text-2xl font-black text-white">
          <span className="text-[#7c5cff]">Per</span>day
        </div>
        <div className="text-xs text-white/60">Music</div>
      </div>
      
      <PrestartPanel 
        onLockIn={handleLockIn}
        fadeOutMusic={fadeOutRef.current}
      />

      <AudioHud fadeOutRef={fadeOutRef} />
      
      <AnalyticsHud 
        grades={[85, 92, 78, 88, 95, 82, 90]}
        latencies={[1200, 800, 1500, 1100, 900, 1300, 1000]}
      />
    </div>
  );
}
