# Perday Music Migration Requirements

## Overview
Migrate from vanilla JS to React + Vite + Tailwind + GSAP + shadcn/ui while maintaining the core "Ready → Lock-In → Wrap → Log → Stack wins" flow.

## ✅ Foundation (COMPLETED)
- [x] React + Vite + TypeScript scaffold
- [x] Tailwind v4 with @tailwindcss/vite plugin
- [x] ESM __dirname resolution in vite.config.ts
- [x] Fail-loudly error overlay in main.tsx
- [x] React 18.3.1 for stability
- [x] Basic App.tsx with working Tailwind classes

## 🚀 Core Modules to Implement

### 1. Global Store (Zustand + IndexedDB)
**File:** `src/store/store.ts`

**Requirements:**
- Session state (phase, prestart, lockin, wrap)
- Settings (motion, sound, playlist)
- Actions (setPhase, markReadyAt, pushGrade, etc.)
- Persist to IndexedDB via localforage
- SSR-safe window guards

**Pitfalls to Avoid:**
- ❌ Don't access `window` without guards
- ❌ Don't forget to handle migration between store versions
- ❌ Don't store sensitive data in localStorage

**Bulletproofing:**
- Use `typeof window !== 'undefined'` guards
- Add version migration logic
- Implement proper TypeScript types

**Code:**
```typescript
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import localforage from "localforage";

export type Phase = "prestart" | "lockin" | "wrap";
export type Grade = "A" | "B" | "C";

type SessionState = {
  phase: Phase;
  prestartTotalMs: number;
  prestartReadyAtMs: number | null;
  lockinTotalMs: number;
  grades: number[];
  latencies: number[];
  streak: number;
  freezes: number;
};

type SettingsState = {
  motionOk: boolean;
  soundEnabled: boolean;
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
      motionOk: typeof window !== 'undefined' ? !window.matchMedia?.("(prefers-reduced-motion: reduce)").matches : true,
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
      migrate: (state, _v) => state as any,
    }
  )
);
```

### 2. Scoring System
**File:** `src/features/scoring/scoring.ts`

**Requirements:**
- Session multiplier calculation
- Ready boost, no-ready penalty, grade adjustment
- Clamp between 0.6-2.0 range
- Pure functions for testability

**Pitfalls to Avoid:**
- ❌ Don't make multiplier too complex
- ❌ Don't forget edge cases (null readyAtMs)
- ❌ Don't hardcode magic numbers

**Bulletproofing:**
- Add comprehensive tests
- Use TypeScript for type safety
- Document the multiplier formula

**Code:**
```typescript
import type { Grade } from "@/store/store";

const clamp = (lo: number, hi: number, x: number) => Math.max(lo, Math.min(hi, x));

export function sessionMultiplier(opts: {
  readyAtMs: number | null;
  prestartTotalMs: number;
  wrapGrade: Grade;
}): number {
  const base = 1.0;
  const noReadyPenalty = -0.25;
  const earlyBoostMax = 0.25;
  const lateBoostMin = 0.05;

  let boost = 0;
  if (opts.readyAtMs == null) {
    boost += noReadyPenalty;
  } else {
    const t = Math.min(Math.max(opts.readyAtMs, 0), opts.prestartTotalMs);
    const progress = 1 - t / opts.prestartTotalMs;
    boost += lateBoostMin + (earlyBoostMax - lateBoostMin) * progress;
  }

  const gradeAdj = ({ A: +0.1, B: 0, C: -0.1 } as const)[opts.wrapGrade];
  return clamp(0.6, 2.0, base + boost + gradeAdj);
}

export function sessionScore(basePoints: number, mult: number) {
  return Math.round(basePoints * mult);
}
```

### 3. Pre-Start System (7:00 countdown)
**Files:** 
- `src/features/prestart/usePrestart.ts`
- `src/features/prestart/PrestartPanel.tsx`

**Requirements:**
- GSAP-driven countdown timer
- Ready button with latency capture
- Auto lock-in at T-0
- Rotating hero messages
- Start CTA overlay

**Pitfalls to Avoid:**
- ❌ Don't use setInterval for countdown (janky)
- ❌ Don't forget to clean up GSAP timelines
- ❌ Don't ignore reduced-motion preferences

**Bulletproofing:**
- Use GSAP tween for smooth countdown
- Proper cleanup in useEffect
- Respect prefers-reduced-motion

**Code:**
```typescript
// usePrestart.ts
import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";

export function usePrestart(totalMs = 7 * 60_000) {
  const [msLeft, setMsLeft] = useState(totalMs);
  const [readyAtMs, setReadyAtMs] = useState<number | null>(null);
  const [sealed, setSealed] = useState(false);
  const paintT0 = useRef(performance.now());
  const tlRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const obj = { v: totalMs };
    tlRef.current?.kill();
    tlRef.current = gsap.to(obj, {
      v: 0,
      duration: totalMs / 1000,
      ease: "none",
      onUpdate: () => setMsLeft(obj.v),
      onComplete: () => setSealed(true),
    });
    return () => tlRef.current?.kill();
  }, [totalMs]);

  const tapReady = () => {
    if (readyAtMs != null) return;
    const elapsed = performance.now() - paintT0.current;
    setReadyAtMs(elapsed);
  };

  const mmss = useMemo(() => {
    const s = Math.max(0, Math.ceil(msLeft / 1000));
    return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  }, [msLeft]);

  return { msLeft, mmss, readyAtMs, sealed, tapReady };
}
```

### 4. Audio System (YouTube + fade)
**Files:**
- `src/features/sound/useStartGateAudio.ts`
- `src/features/sound/AudioHud.tsx`

**Requirements:**
- YouTube IFrame API integration
- Playlist support with fallback
- Volume fade on start
- White noise toggle
- Autoplay policy compliance

**Pitfalls to Avoid:**
- ❌ Don't forget user gesture requirement
- ❌ Don't leave players mounted without cleanup
- ❌ Don't ignore reduced-motion for fades

**Bulletproofing:**
- Gate behind user click
- Proper cleanup on unmount
- Handle API loading errors

### 5. FX Overlays (Villain announcements)
**Files:**
- `src/features/fx/useVillainAnnounce.ts`
- `src/features/fx/FxOverlays.tsx`

**Requirements:**
- GIF announcements with frame overlays
- Confetti canvas
- Toast notifications
- GSAP animations with reduced-motion support

**Pitfalls to Avoid:**
- ❌ Don't use useGSAP without proper cleanup
- ❌ Don't forget accessibility (aria-live)
- ❌ Don't block UI during animations

**Bulletproofing:**
- Use gsap.context() for cleanup
- Portal to body for z-index
- Respect prefers-reduced-motion

### 6. Analytics HUD (ECharts)
**File:** `src/features/AnalyticsHud.tsx`

**Requirements:**
- Line chart for grades
- Bar chart for latencies
- Gauge for multiplier
- Calendar heatmap
- Responsive design

**Pitfalls to Avoid:**
- ❌ Don't forget to dispose ECharts instances
- ❌ Don't ignore resize events
- ❌ Don't use too many data points

**Bulletproofing:**
- Use echarts-for-react wrapper
- Handle window resize
- Lazy load for performance

### 7. UI Components
**Files:**
- `src/ui/StartCtaOverlay.tsx`
- `src/ui/PageVisibilityBadge.tsx`
- `src/ui/RotatingHero.tsx`

**Requirements:**
- Sand-dissolve animations
- Page visibility detection
- Rotating text with GSAP
- Accessibility compliance

**Pitfalls to Avoid:**
- ❌ Don't forget keyboard navigation
- ❌ Don't ignore screen readers
- ❌ Don't use too many animations

**Bulletproofing:**
- Proper ARIA labels
- Focus management
- Reduced-motion alternatives

## 🧪 Testing Strategy
- Unit tests for scoring functions
- Integration tests for store persistence
- E2E tests for core user flows
- Accessibility testing with axe-core

## 🚀 Deployment Checklist
- [ ] Build optimization
- [ ] Environment variables
- [ ] Netlify function setup
- [ ] Performance monitoring
- [ ] Error tracking

## 📋 Migration Order
1. Store + persistence
2. Pre-start system
3. Audio integration
4. FX overlays
5. Analytics HUD
6. UI polish
7. Testing
8. Deployment

## 🎯 Success Criteria
- [ ] All existing functionality preserved
- [ ] Performance improved
- [ ] Code maintainability increased
- [ ] Accessibility compliance
- [ ] Mobile responsiveness
- [ ] Error handling robust
