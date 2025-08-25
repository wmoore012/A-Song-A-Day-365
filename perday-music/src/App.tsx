

import { useAppStore } from "./store/store";
import { FlowState } from "./types";
import { useRef } from "react";
import StartHero from "./components/StartHero";
import LockInMenu from "./components/LockInMenu";
import FocusSetup from "./components/FocusSetup";
import FocusRunning from "./components/FocusRunning";
import { AnalyticsHud } from "./components/common/AnalyticsHud";
import AudioHud from "./components/common/AudioHud";
import TestStore from "./components/TestStore";

export default function App() {
  const { session, _hydrated } = useAppStore();
  const fadeOutRef = useRef<() => void>(() => {});
  
  // Gate on hydration to avoid flicker
  if (!_hydrated) {
    return (
      <main className="relative min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </main>
    );
  }

  return (
    <main data-testid="app-main" className="relative min-h-screen bg-black isolate">
      {/* Test component to verify store */}
      <TestStore />

      {/* FX/UI layers that don't block clicks */}
      <div className="pointer-events-none fixed inset-0 z-40">
        {/* FxOverlays would go here */}
      </div>

      {/* Main content - only one panel renders at a time */}
      <div className="pointer-events-auto relative z-10">
        {session.state === FlowState.PRE_START && <StartHero fadeOutRef={fadeOutRef} />}
        {session.state === FlowState.LOCK_IN && <LockInMenu />}
        {session.state === FlowState.FOCUS_SETUP && <FocusSetup />}
        {session.state === FlowState.FOCUS_RUNNING && <FocusRunning />}
        {/* Add other states as needed */}
      </div>

      {/* HUD layers - always visible */}
      <div className="fixed bottom-4 right-4 z-30">
        <AudioHud fadeOutRef={fadeOutRef} />
      </div>
      <div className="fixed left-4 bottom-4 z-30">
        <AnalyticsHud
          grades={[85, 92, 78, 88, 95, 82, 90]}
          latencies={[1200, 800, 1500, 1100, 900, 1300, 1000]}
        />
      </div>
    </main>
  );
}
