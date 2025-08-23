import { useRef } from "react";
import PrestartPanel from "@/features/prestart/PrestartPanel";
import AudioHud from "@/features/sound/AudioHud";
import PageVisibilityBadge from "@/ui/PageVisibilityBadge";
import { AnalyticsHud } from "@/features/AnalyticsHud";
import { useAppStore } from "@/store/store";
import "./index.css";

export default function App() {
  const fadeRef = useRef<() => void>(() => {});
  const { phase, setPhase } = useAppStore((s: any) => ({
    phase: s.phase, 
    setPhase: s.setPhase
  }));

  // fake sample data for HUD (replace with your LS hydrator)
  const sampleGrades = [60, 62, 68, 70, 65, 71, 73, 75, 78, 77, 79, 80, 82, 84];
  const sampleLatencies = [5600, 4800, 7200, 5100, 3900, 4100, 4500, 3600, 5400, 6000, 3800, 3400, 3000, 2800];

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0b0b0d] via-[#121224] to-[#1a132e] text-white">
      <PageVisibilityBadge />

      <header className="sticky top-0 z-40 backdrop-blur bg-black/30 border-b border-white/10">
        <div className="max-w-6xl mx-auto flex items-center justify-between p-3">
          <h1 className="font-extrabold tracking-wide">Perday Music <span className="opacity-70">+1</span></h1>
          <div className="text-sm opacity-80">
            {phase === "prestart" ? "Tip: One hook. One bounce. Next." : 
             phase === "lockin" ? "LOCKED 🔒" : "Phase: " + phase}
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-4 grid md:grid-cols-2 gap-4">
        <PrestartPanel
          fadeOutMusic={() => fadeRef.current?.()}
          onLockIn={() => { 
            setPhase("lockin"); 
            console.log("Locked in!");
          }}
        />
        <AudioHud fadeOutRef={fadeRef} />

        <div className="md:col-span-2">
          <AnalyticsHud grades={sampleGrades} latencies={sampleLatencies} />
        </div>
      </div>
    </main>
  );
}
