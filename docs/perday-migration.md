# Perday Music — Migration Requirements (React + Vite + Tailwind + GSAP)

## Brand
- Name: Perday (this edition: Perday Music)
- Vibe: bold, clean, urban; “Cookup” is the daily session term
- Colors (CSS vars):
  - `--brand-accent1: #6E56FF` (purple)
  - `--brand-accent2: #24E6B7` (mint)
  - `--brand-bg: #0b0b0d`, `--brand-fg: #f5f5f7`

## Tech stack
- React + Vite (TypeScript)
- Tailwind v4 with `@tailwindcss/vite` plugin
- shadcn/ui for primitives (Sheet/Dialog/Button/etc.) — copy-in, owner model
- GSAP + `@gsap/react` useGSAP hook for motion
- ECharts (or echarts-for-react) for HUD visuals
- Netlify Functions (Notion logging)

## Repository plan
- Preserve vanilla app under `legacy/nukes-v2/` (no deletions; villain scripts remain)
- New app at `perday-music/` (Vite React TS)
- README: document how to open legacy index and new app

## Modules, acceptance criteria, pitfalls, bulletproofing

### 1) PerdayLogo (React + GSAP)
- AC: SVG logo animates on mount; hover micro-tween; respects reduced motion
- Pitfalls: double-running animations in React Strict Mode; untracked refs
- Bulletproof: use `useGSAP` with `gsap.context` to scope and cleanup

```tsx
// src/components/PerdayLogo.tsx
import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
gsap.registerPlugin(useGSAP);
export default function PerdayLogo(){
  const svgRef = useRef<SVGSVGElement>(null);
  const badgeRef = useRef<SVGGElement>(null);
  useGSAP(()=>{
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    gsap.fromTo(svgRef.current,{opacity:0,y:10},{opacity:1,y:0,duration:.6,ease:'power2.out'});
    gsap.fromTo(badgeRef.current,{scale:.6,rotate:-10,transformOrigin:'36px 36px'},{scale:1,rotate:0,duration:.7,ease:'elastic.out(1,.5)',delay:.1});
  },[]);
  return (
    <svg ref={svgRef} viewBox="0 0 340 120" role="img" aria-label="Perday +1">
      <defs><linearGradient id="g1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#6E56FF"/><stop offset="1" stopColor="#24E6B7"/></linearGradient></defs>
      <rect x="6" y="18" rx="24" width="240" height="84" fill="url(#g1)" opacity=".95"/>
      <text x="26" y="78" fill="#0b0b0d" style={{font:'800 42px/1 system-ui, Inter, sans-serif'}}>PERDAY</text>
      <g ref={badgeRef} transform="translate(260,8)"><circle cx="36" cy="36" r="34" fill="#0b0b0d" stroke="#fff" strokeWidth="4"/><text x="15" y="44" fill="#fff" style={{font:'800 28px/1 system-ui'}}>+1</text></g>
    </svg>
  );
}
```

### 2) Start Gate (7:00 + latency)
- AC: visible countdown, Start captures latency, fade music, Done triggers Notion POST
- Pitfalls: setInterval drift; missing cleanup; blocking audio autoplay
- Bulletproof: GSAP-driven value tween or requestAnimationFrame; single Enable Sound gesture

```ts
// src/hooks/useStartFlow.ts
export function useStartFlow(totalMs=7*60_000){ /* tween ms value w/ GSAP; returns {started, start, mmss, latencyMs} */ }
```

### 3) Audio Gate (YouTube IFrame API)
- AC: Enable Sound creates players; playlist preferred, single fallback; fade-out on Start; reduced-motion skips ramp
- Pitfalls: creating players before gesture; hiding via display:none; CSP blocking the API
- Bulletproof: load API only after click, mount offscreen (not display:none), origin set, try/catch guards

```ts
// src/hooks/useStartGateAudio.ts (excerpt)
export function useStartGateAudio({ playlistId, videoId, noiseVideoId }={}): { enableSound, fadeOutMusic, toggleNoise, mounts... }{ /* … */ }
```

### 4) HUD (ECharts)
- AC: streak line, latency bar, multiplier gauge, calendar heatmap
- Pitfalls: resize leaks, SSR mismatch
- Bulletproof: use `echarts-for-react` (auto dispose/resize); mount client-side only

```tsx
// src/features/AnalyticsHud.tsx
export default function AnalyticsHud({ grades, latencies }){ /* setOption; style height; grid */ }
```

### 5) City/Weather + Spy Map
- AC: Nominatim search (1 rps; UA header); Open‑Meteo current (timezone=auto); non‑interactive Leaflet tile
- Pitfalls: rate limiting, missing UA, interactive scroll traps
- Bulletproof: throttle requests; UA string; CSS `pointer-events:none`; disabled controls

### 6) Villain system (modular; never delete)
- AC: rule-based replies first; optional LLM via OpenRouter; announce overlays, toasts, confetti
- Pitfalls: hard-coding copy; coupling to UI; missing reduced-motion respect
- Bulletproof: export `useVillainAnnounce()` hook + `<FxOverlays/>`; keep lines in JSON; type-safe interface

```ts
// fx/useVillainAnnounce.ts: announce({gif, frameSrc, durationMs}) & confetti()
// fx/FxOverlays.tsx: GSAP entry/exit; canvas confetti; reduced-motion aware
```

### 7) Tactical Menu (GSAP)
- AC: sticky menu with burger morph, overlay scale-in, staggered links; anchors scroll; open City/Settings sheets
- Pitfalls: scrolljacking; focus traps
- Bulletproof: animate only overlay; keep focusable elements reachable; `prefers-reduced-motion` fallback

### 8) Notion logging (Function)
- AC: POST with day_index, streak, freezes, freeze_used, latency_ms, grade, title, weather snapshot
- Pitfalls: missing env; silent failure
- Bulletproof: retries/backoff; visible toast on fail; CI dependency-review

### 9) Tests & Fail loudly
- AC: unit tests for timer math, storage, villain mute, Notion function shape; DOM tests for prestart → reveal
- Pitfalls: hidden failures in async; swallowing errors
- Bulletproof: Vitest + jsdom; explicit error banners on critical CDN/library missing

## Tailwind (v4) setup
- `@tailwindcss/vite` plugin in `vite.config.ts`
- Content: `['./index.html','./src/**/*.{ts,tsx}']`
- Design tokens in `:root` CSS

## Execution plan
1. Reorg repo: `legacy/nukes-v2/`; add README pointers
2. Scaffold `perday-music/` (React TS) with Tailwind plugin + shadcn/ui init
3. Add `PerdayLogo`, Start Gate (GSAP), Audio Gate, Tactical Menu (Sheet/links)
4. Wire Spy Map + Weather
5. HUD charts (ECharts)
6. Villain overlays (hook + component); preserve existing line packs
7. Notion function (Netlify); env & retry
8. Tests, CI; dependency review; deploy

## Risks & mitigations
- CDN blocks → bundle local copies or graceful fallbacks
- Autoplay restrictions → explicit Enable Sound gesture
- Motion sensitivity → prefer‑reduced‑motion guards
- Notion schema drift → config-driven properties; integration shared with DB

---
This document is the source of truth for the migration. Keep villain scripts modular; do not delete them — only add modular hooks/wrappers.
