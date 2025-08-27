import { Play } from "lucide-react";
import { useAppStore } from "../store/store";

export default function SessionTimerDock() {
  const { settings, dispatch } = useAppStore();
  const minutes = settings?.defaultDuration ?? 25;

  return (
    <div className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-xl p-4 flex items-center justify-between">
      <div>
        <div className="text-xs uppercase tracking-wide text-white/60">Timer</div>
        <div className="text-2xl font-bold text-white tabular-nums">
          {String(minutes).padStart(2, "0")}:00
        </div>
      </div>
      <button
        onClick={() => dispatch({ type: "START_QUESTIONNAIRE" })}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-cyan-400/40 text-cyan-300 hover:bg-cyan-400/10 transition"
      >
        <Play className="w-4 h-4" /> Start
      </button>
    </div>
  );
}
