

import { useRef, useEffect } from "react";
import { useAppStore } from "./store/store";
import PageVisibilityBadge from "./ui/PageVisibilityBadge";
import AudioHud from "./features/sound/AudioHud";
import { AnalyticsHud } from "./features/AnalyticsHud";
import GateLayout from "./components/GateLayout";
import PerdayLogo from "./components/PerdayLogo";

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

  // Safe motion detection after mount
  useEffect(() => {
    useAppStore.getState().hydrateMotion();
  }, []);

  // Validate store state
  must(phase, "Phase must be defined");
  must(setPhase, "setPhase must be defined");
  must(prestartTotalMs, "prestartTotalMs must be defined");
  must(motionOk, "motionOk must be defined");



  return (
    <div 
      className="min-h-screen bg-[var(--brand-bg)] text-[var(--brand-fg)]"
      data-testid="app-main"
      aria-label="Perday Music Application"
    >
      <PageVisibilityBadge />
      
      <GateLayout>
        {/* Dashboard Content - only shown after POST_ACTIONS */}
        <div className="p-8 pt-20">
          {/* Logo */}
          <div className="mb-8">
            <PerdayLogo size={64} />
          </div>
          
          <div className="mt-8">
            <AudioHud fadeOutRef={fadeOutRef} />
          </div>
          
          <div className="mt-8">
            <AnalyticsHud 
              grades={[85, 92, 78, 88, 95, 82, 90]}
              latencies={[1200, 800, 1500, 1100, 900, 1300, 1000]}
            />
          </div>
        </div>
      </GateLayout>
    </div>
  );
}
