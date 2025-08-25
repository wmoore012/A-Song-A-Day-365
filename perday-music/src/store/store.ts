import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import localforage from "localforage";
import { Action, FlowState, Session, Settings } from "../types";
import { transition } from "./transitions";

type AppState = {
  session: Session;
  settings: Settings;
  grades: number[];
  latencies: number[];
  streak: number;
  freezes: number;
  _hydrated: boolean;
  
  // Prestart properties
  prestartTotalMs: number;
  phase: string;
  readyAt: number | null;
  motionOk: boolean;
  
  dispatch: (a: Action) => void;
  setSettings: (p: Partial<Settings>) => void;
  markHydrated: () => void;
  
  // Prestart methods
  setPhase: (phase: string) => void;
  markReadyAt: (timestamp: number) => void;
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      session: { state: FlowState.VAULT_CLOSED, readyPressed: false, multiplierPenalty: false, preparationStartTime: undefined },
      settings: { 
        defaultDuration: 25, 
        defaultMultiplier: 1.5, 
        autoStartTimer: true, 
        soundEnabled: true, 
        volume: 0.7, 
        notifications: true, 
        accountabilityEmail: '',
        userName: '',
        collaborators: '',
        defaultPlaylist: 'PLl-ShioB5kapLuMhLMqdyx_gKX_MBiXeb'
      },
      grades: [],
      latencies: [],
      streak: 0,
      freezes: 0,
      _hydrated: false,
      
      // Prestart properties
      prestartTotalMs: 7 * 60 * 1000, // 7 minutes default
      phase: 'countdown',
      readyAt: null,
      motionOk: true,
      
      dispatch: (a) => set((s) => {
        if (a.type === "UPDATE_SETTINGS") {
          return { settings: { ...s.settings, ...a.payload } };
        }
        return { session: transition(s.session, a) };
      }),
      setSettings: (p) => set((s) => ({ settings: { ...s.settings, ...p } })),
      markHydrated: () => set({ _hydrated: true }),
      
      // Prestart methods
      setPhase: (phase) => set({ phase }),
      markReadyAt: (timestamp) => set({ readyAt: timestamp }),
    }),
    {
      name: "perday-app",
      storage: createJSONStorage(() => localforage),
      onRehydrateStorage: () => (state) => state?.markHydrated(),
      partialize: (s) => ({
        session: s.session,
        settings: s.settings,
        grades: s.grades,
        latencies: s.latencies,
        streak: s.streak,
        freezes: s.freezes,
        prestartTotalMs: s.prestartTotalMs,
        phase: s.phase,
        readyAt: s.readyAt,
        motionOk: s.motionOk,
      }),
    }
  )
);
