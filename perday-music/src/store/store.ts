import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import localforage from "localforage";

// Guard window access at module level
const prefersReduced =
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export type Phase = "prestart" | "lockin" | "wrap";
export type Grade = "A" | "B" | "C";

type SessionState = {
  phase: Phase;
  // 7:00 prestart
  prestartTotalMs: number;
  prestartReadyAtMs: number | null; // how long you waited before tapping Ready
  // current lock-in timer (e.g., 7, 14, 21 mins in ms)
  lockinTotalMs: number;
  // analytics
  grades: number[];      // 0..100
  latencies: number[];   // ms between page paint and Start
  streak: number;
  freezes: number;
};

type SettingsState = {
  motionOk: boolean;         // from prefers-reduced-motion or UI toggle
  soundEnabled: boolean;     // gated by "Enable Sound"
  playlistId?: string;
};

type Actions = {
  setPhase: (p: Phase) => void;
  setSoundEnabled: (v: boolean) => void;
  markReadyAt: (msElapsed: number) => void;
  pushGrade: (v: number) => void;
  pushLatency: (ms: number) => void;
  setLockinLength: (ms: number) => void;
  incStreak: () => void;
  decFreeze: () => void;
  incFreeze: () => void;
  resetPrestart: () => void;
};

export const useAppStore = create<SessionState & SettingsState & Actions>()(
  persist(
    (set, get) => ({
      phase: "prestart",
      prestartTotalMs: 7 * 60_000,
      prestartReadyAtMs: null,
      lockinTotalMs: 7 * 60_000,
      grades: [],
      latencies: [],
      streak: 0,
      freezes: 0,
      motionOk: !prefersReduced,
      soundEnabled: false,

      setPhase: (p) => set({ phase: p }),
      setSoundEnabled: (v) => set({ soundEnabled: v }),
      markReadyAt: (msElapsed) => set({ prestartReadyAtMs: msElapsed }),
      pushGrade: (v) => set({ grades: [...get().grades, v].slice(-60) }),
      pushLatency: (ms) => set({ latencies: [...get().latencies, ms].slice(-120) }),
      setLockinLength: (ms) => set({ lockinTotalMs: ms }),
      incStreak: () => set({ streak: get().streak + 1 }),
      decFreeze: () => set({ freezes: Math.max(0, get().freezes - 1) }),
      incFreeze: () => set({ freezes: get().freezes + 1 }),
      resetPrestart: () => set({ prestartReadyAtMs: null, phase: "prestart" }),
    }),
    {
      name: "perday-store",
      storage: createJSONStorage(() => localforage),
      version: 1,
      migrate: (state) => state as SessionState & SettingsState & Actions,
    }
  )
);
