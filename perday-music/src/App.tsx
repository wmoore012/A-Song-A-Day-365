

import { useRef } from "react";
import { useAppStore } from "./store/store";
import PageVisibilityBadge from "./ui/PageVisibilityBadge";
import PrestartPanel from "./features/prestart/PrestartPanel";
import AudioHud from "./features/sound/AudioHud";
import { AnalyticsHud } from "./features/AnalyticsHud";
import { PremiumSidebar } from "./components/PremiumSidebar";
import NeonIsometricMaze from "./components/NeonIsometricMaze";

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
      
      {/* Premium Sidebar */}
      <PremiumSidebar />
      
      {/* Main Content - adjusted for sidebar */}
      <div className="ml-64 min-h-screen relative">
        {/* Logo */}
        <div className="fixed top-6 left-72 z-10">
          <div className="text-2xl font-black text-white">
            <span className="text-synth-violet">Per</span>day
          </div>
          <div className="text-xs text-synth-icy">Music</div>
        </div>
        
        <div className="p-8 pt-20">
          <PrestartPanel 
            onLockIn={handleLockIn}
            fadeOutMusic={fadeOutRef.current}
          />

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
      </div>
      
      {/* Neon Isometric Maze Footer */}
      <div className="fixed bottom-0 left-0 w-full h-32 -z-10">
        <NeonIsometricMaze />
      </div>
    </div>
  );
}
