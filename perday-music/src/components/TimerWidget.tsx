import { useEffect, useMemo, useRef, useState } from "react";
import { Play, Pause, Square, Plus, Minus } from "lucide-react";
import { useAppStore } from "../store/store";
import { FlowState } from "../types";
import confetti from 'canvas-confetti';

type Mode = "idle" | "running" | "paused";

export default function TimerWidget() {
  const { session, settings, dispatch } = useAppStore();
  const defaultMinutes = settings?.defaultDuration ?? 25;

  // Render state (ALWAYS mounted — just switches visuals)
  const [mode, setMode] = useState<Mode>("idle");
  const [secondsLeft, setSecondsLeft] = useState(defaultMinutes * 60);

  // keep defaultMinutes changes in sync without resetting during an active run
  useEffect(() => {
    if (mode === "idle") setSecondsLeft(defaultMinutes * 60);
  }, [defaultMinutes, mode]);

  // Pause timer when dashboard is revealed
  useEffect(() => {
    if (session.state === FlowState.DASHBOARD && mode === "running") {
      setMode("paused");
    }
  }, [session.state, mode]);

  // simple interval tick when running
  const intervalRef = useRef<number | null>(null);
  useEffect(() => {
    if (mode !== "running") {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      intervalRef.current = null;
      return;
    }
    intervalRef.current = window.setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          // stop at 0
          window.clearInterval(intervalRef.current!);
          intervalRef.current = null;
          setMode("paused");
          dispatch({ type: "END_FOCUS" });
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [mode, dispatch]);

  const mmss = useMemo(() => {
    const m = Math.floor(secondsLeft / 60).toString().padStart(2, "0");
    const s = Math.floor(secondsLeft % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }, [secondsLeft]);

  // actions
  const start = () => {
    setMode("running");
    
    // Throw confetti for starting the challenge!
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };
  
  const pause = () => {
    setMode("paused");
  };
  
  const resume = () => {
    setMode("running");
  };
  
  const reset = () => {
    setMode("idle");
    setSecondsLeft(defaultMinutes * 60);
  };
  
  const addMinute = () => setSecondsLeft((s) => s + 60);
  const removeMinute = () => setSecondsLeft((s) => Math.max(0, s - 60));

  // styles switch: idle (light glass) vs running/paused (dark)
  const isDark = mode !== "idle";

  return (
    <div
      className={`relative rounded-2xl border backdrop-blur-xl p-6 w-full
      ${isDark
        ? "bg-black/70 border-white/15 shadow-[0_0_40px_rgba(0,255,255,0.12)]"
        : "bg-white/8 border-white/20"} 
      `}
      style={{ zIndex: 10 }} // keep above docks/tooltips but below background
      aria-label="Session timer"
    >
      {/* time */}
      <div className="flex items-end justify-between">
        <div className="flex-1">
          <div className={`font-black tracking-tight leading-none
            ${isDark ? "text-white" : "text-cyan-100"}
            text-6xl md:text-7xl`}>
            {mmss}
          </div>
          <div className={`mt-2 text-sm ${isDark ? "text-white/60" : "text-cyan-200/80"}`}>
            {mode === "idle" && "Ready to lock in"}
            {mode === "running" && "Focus mode — go get it"}
            {mode === "paused" && "Paused"}
          </div>
        </div>

        {/* idle controls */}
        {mode === "idle" && (
          <button
            onClick={start}
            className="ml-6 inline-flex items-center gap-2 px-5 py-3 rounded-xl
              bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold
              shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition"
          >
            <Play className="w-5 h-5" /> Start Timer Now
          </button>
        )}

        {/* running/paused controls (dark set) */}
        {mode !== "idle" && (
          <div className="ml-6 flex items-center gap-2">
            {mode === "running" ? (
              <button
                onClick={pause}
                className="px-3 py-2 rounded-lg bg-white/10 border border-white/15 text-white hover:bg-white/15"
              >
                <Pause className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={resume}
                className="px-3 py-2 rounded-lg bg-white/10 border border-white/15 text-white hover:bg-white/15"
              >
                <Play className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={reset}
              className="px-3 py-2 rounded-lg bg-white/10 border border-white/15 text-white hover:bg-white/15"
            >
              <Square className="w-5 h-5" />
            </button>
            <button
              onClick={addMinute}
              className="px-3 py-2 rounded-lg bg-white/10 border border-white/15 text-white hover:bg-white/15"
              title="+1 min"
            >
              <Plus className="w-5 h-5" />
            </button>
            <button
              onClick={removeMinute}
              className="px-3 py-2 rounded-lg bg-white/10 border border-white/15 text-white hover:bg-white/15"
              title="-1 min"
            >
              <Minus className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
