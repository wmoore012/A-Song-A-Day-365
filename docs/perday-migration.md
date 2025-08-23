# Perday Music — Migration Requirements (Agent‑Ready) v1.2

> **Scope:** This document tells the next AI agent exactly what to build, in what order, and how to bulletproof it. Keep the *format and tone* below. Do **not** delete legacy “villain” scripts; only add modular wrappers.

---

## Brand
- **Name:** Perday (this edition: **Perday Music**)
- **Vibe:** bold, clean, urban; “**Cookup**” = daily session
- **Colors (CSS vars):**
  - `--brand-accent1: #6E56FF` (purple)
  - `--brand-accent2: #24E6B7` (mint)
  - `--brand-bg: #0b0b0d`, `--brand-fg: #f5f5f7`

## Tech stack
- **React + Vite (TypeScript)**
- **Tailwind v4** with `@tailwindcss/vite` plugin
- **shadcn/ui** for primitives (Sheet/Dialog/Button/etc.) — copy‑in, owner model
- **GSAP** + `@gsap/react` **useGSAP** hook for motion (respect `prefers-reduced-motion`)
- **ECharts** (`echarts-for-react`) for HUD visuals
- **Zustand** + **localforage** for a tiny persistent store
- **Netlify Functions** for Notion logging (server‑side env, 429‑aware backoff)

## Repository plan
- Preserve legacy site under **`legacy/nukes-v2/`** (no deletions; villain scripts remain)
- New app at **`perday-music/`** (Vite React TS)
- **README**: include how to open the legacy site and the new app

---

## Modules, acceptance criteria, pitfalls, bulletproofing

### 1) PerdayLogo (React + GSAP)
- **AC:** SVG logo animates on mount; hover micro‑tween; honors reduced motion
- **Pitfalls:** React Strict Mode double‑runs; unscoped tweens
- **Bulletproof:** use `useGSAP` with `gsap.context` for scoping + cleanup
```tsx
// src/components/PerdayLogo.tsx
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(useGSAP);
export default function PerdayLogo(){
  const svgRef = useRef<SVGSVGElement>(null);
  const badgeRef = useRef<SVGGElement>(null);
  useGSAP(()=>{
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    gsap.fromTo(svgRef.current,{opacity:0,y:10},{opacity:1,y:0,duration:.6,ease:"power2.out"});
    gsap.fromTo(badgeRef.current,{scale:.6,rotate:-10,transformOrigin:"36px 36px"},{scale:1,rotate:0,duration:.7,ease:"elastic.out(1,.5)",delay:.1});
  },[]);
  return (
    <svg ref={svgRef} viewBox="0 0 340 120" role="img" aria-label="Perday +1">
      <defs><linearGradient id="g1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#6E56FF"/><stop offset="1" stopColor="#24E6B7"/></linearGradient></defs>
      <rect x="6" y="18" rx="24" width="240" height="84" fill="url(#g1)" opacity=".95"/>
      <text x="26" y="78" fill="#0b0b0d" style={{font:"800 42px/1 system-ui, Inter, sans-serif"}}>PERDAY</text>
      <g ref={badgeRef} transform="translate(260,8)"><circle cx="36" cy="36" r="34" fill="#0b0b0d" stroke="#fff" strokeWidth="4"/><text x="15" y="44" fill="#fff" style={{font:"800 28px/1 system-ui"}}>+1</text></g>
    </svg>
  );
}
```

### 2) Start Gate (7:00 Pre‑Start + latency capture)
- **AC:** visible 7:00 countdown; **Ready** tap records latency; **T‑0 autostart** applies lighter multiplier; **Start** fades music; **Finish** triggers Notion POST
- **Pitfalls:** `setInterval` drift; missing cleanup; autoplay blocked
- **Bulletproof:** drive time with GSAP tween or `requestAnimationFrame`; one explicit **Enable Sound** gesture
```ts
// src/features/prestart/usePrestart.ts
import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
export function usePrestart(totalMs=7*60_000){
  const [msLeft,setMsLeft]=useState(totalMs);
  const [readyAtMs,setReadyAtMs]=useState<number|null>(null);
  const [sealed,setSealed]=useState(false); // T‑0
  const paintT0=useRef(performance.now()); const tween=useRef<gsap.core.Tween|null>(null);
  useEffect(()=>{ const obj={v:totalMs}; tween.current?.kill(); tween.current=gsap.to(obj,{v:0,duration:totalMs/1000,ease:"none",onUpdate:()=>setMsLeft(obj.v),onComplete:()=>setSealed(true)}); return()=>tween.current?.kill(); },[totalMs]);
  const tapReady=()=>{ if(readyAtMs!=null) return; setReadyAtMs(performance.now()-paintT0.current); };
  const mmss=useMemo(()=>{ const s=Math.max(0,Math.ceil(msLeft/1000)); return `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`; },[msLeft]);
  return { msLeft, mmss, readyAtMs, sealed, tapReady };
}
```

### 3) Audio Gate (YouTube IFrame API)
- **AC:** **Enable Sound** mounts players; music at ~15% volume; **Start** smoothly fades out; reduced‑motion shortens fade
- **Pitfalls:** creating players before gesture; hidden iframes via `display:none`; CSP
- **Bulletproof:** load IFrame API **after click**; mount offscreen (not `display:none`); set `origin`; wrap calls in try/catch
```ts
// src/hooks/useStartGateAudio.ts (excerpt)
export function useStartGateAudio({ playlistId, videoId, noiseVideoId }={}){
  /* expose: enable(), fadeOutMusic(ms), toggleNoise(); mount refs for two <div>s; create YT.Player only after enable() */
}
```

### 4) HUD (ECharts)
- **AC:** streak line, latency bar, multiplier gauge, calendar heatmap
- **Pitfalls:** resize leaks; SSR mismatch
- **Bulletproof:** use `echarts-for-react` wrapper (auto dispose/resize); mount client‑side only
```tsx
// src/features/AnalyticsHud.tsx
export default function AnalyticsHud({ grades, latencies }){/* setOption; style heights; grid; tooltips */}
```

### 5) City/Weather + Spy Map
- **AC:** Nominatim search (≤1 rps; UA header); Open‑Meteo `timezone=auto`; Leaflet tile **non‑interactive**
- **Pitfalls:** rate limiting; missing UA; scroll traps
- **Bulletproof:** throttle; UA string; `pointer-events:none`; controls disabled

### 6) Villain system (modular; **never delete**)
- **AC:** rule‑based replies first; optional LLM via OpenRouter; overlays, toasts, confetti
- **Pitfalls:** copy hard‑coded; tight coupling; ignore reduced‑motion
- **Bulletproof:** export `useVillainAnnounce()` + `<FxOverlays/>`; keep lines in JSON; type‑safe interface
```ts
// fx/useVillainAnnounce.ts → announce({gif,frameSrc,durationMs}) & confetti()
// fx/FxOverlays.tsx → GSAP entry/exit; canvas confetti; reduced‑motion aware
```

### 7) Tactical Menu (GSAP)
- **AC:** sticky menu; burger morph; overlay scale‑in; staggered links; opens City/Settings sheets
- **Pitfalls:** scroll‑jacking; poor focus management
- **Bulletproof:** animate overlay only; trap focus in sheets; `prefers-reduced-motion` fallback

### 8) Notion logging (Netlify Function)
- **AC:** POST body includes: `day_index, streak_after, freezes, freeze_used, latency_ms, grade, title, weather snapshot`  
- **Pitfalls:** missing env; silent failures; 429 loops
- **Bulletproof:** read **Retry‑After** seconds on HTTP 429 and backoff with jitter; queue offline; visible toast on fail

### 9) Tiny Store + Scoring (Zustand)
- **AC:** persist `phase, prestartReadyAtMs, lockinTotalMs, grades[], latencies[], streak, freezes, settings` to IndexedDB
- **Pitfalls:** schema drift; unbounded arrays
- **Bulletproof:** `persist(createJSONStorage(()=>localforage))`; `.slice(-N)` ring buffers; versioned `migrate`

### 10) Tests & Fail loudly
- **AC:** Vitest unit tests for timer math, storage, multiplier curve, function payload; DOM tests for prestart → lock‑in → wrap
- **Pitfalls:** swallowed async errors
- **Bulletproof:** explicit error banners when CDN/library missing; CI dependency review

---

## Tailwind (v4) setup
- Add `@tailwindcss/vite` plugin in `vite.config.ts`
- Content globs: `['./index.html','./src/**/*.{ts,tsx}']`
- Design tokens in `:root` (brand vars)

## Execution plan
1. Reorg repo (`legacy/nukes-v2/`), add README pointers
2. Scaffold `perday-music/` (React TS) + Tailwind plugin + shadcn/ui init
3. Implement **PerdayLogo**, **Pre‑Start** (7:00), **Audio Gate**, **Tactical Menu**
4. Wire **Spy Map + Weather**
5. Build **HUD** (ECharts)
6. Port **villain overlays** (hook + component); keep existing line packs
7. Ship **Notion** function + env + Retry‑After backoff + offline queue
8. Tests, CI; dependency review; deploy

## Data, settings, and assets migration
- Keep localStorage/IndexedDB keys: grades, latencies, streak, freezes, city, music/noise ids, vibes url, villain config, hints, emails
- Hydrate into Zustand store on load; persist on change
- Move open‑core villain lines to JSON in `packages/core/`; keep Pro lines private in `packages/pro/`
- Hints: continue reading `config/hints.json` if no user overrides
- Assets: copy from `Assets/` → `/src/assets` or `/public` (case‑match filenames)

## Settings UI (must‑haves)
- **City** sheet: input + geolocate; 1 rps to Nominatim; UA header
- **Music/Noise** ids: validate on blur
- **Villain builder:** subject/presenting/age/hair/beard/tone/nonHuman; preview emoji; save to store
- **Hints textarea; emails list; tone slider**
- **A11y:** focus traps inside sheets/dialogs; respect reduced‑motion

## Testing checklist
- Timer mm:ss and T‑0 autostart
- Audio gate: `enable()` builds players; `fadeOutMusic()` pauses; noise toggle
- Villain announce/toast; confetti cleanup
- HUD charts render & dispose on unmount
- Notion POST shape; Retry‑After backoff path

## Deployment notes
- **Netlify**: publish built Vite app; set `NOTION_TOKEN`, `NOTION_DATABASE_ID` as env
- **Functions**: `services/netlify/functions/notion.ts` (bundled with esbuild). Handle 429 via Retry‑After + jitter

## Risks & mitigations
- **CDN blocks** → bundle local copies or graceful fallbacks
- **Autoplay restrictions** → explicit **Enable Sound** gesture before creating players
- **Motion sensitivity** → global `prefers-reduced-motion` guards
- **Notion schema/rate limits** → config‑driven properties; Retry‑After aware queue
 - **Licensing (closed features)** → keep closed‑source code fully separate; do not publish; if/when licensing, prefer BSL for closed modules and MIT for open‑core
 - **Language/policy** → never include sensitive or medicalized terms in code, configs, commits, or docs

---

## Install commands (once)
```bash
pnpm add gsap @gsap/react zustand localforage echarts echarts-for-react
pnpm dlx shadcn@latest init
pnpm dlx shadcn@latest add button card sheet dialog sonner
```

## References (for agent)
- GSAP in React: `useGSAP`/`gsap.context` patterns (scoped tweens, cleanup). 
- Tailwind v4 + official Vite plugin setup.
- ECharts React wrapper (`echarts-for-react`).
- YouTube IFrame Player API & autoplay behavior (user gesture / `autoplay` param). 
- Open‑Meteo `timezone=auto` parameter. 
- Notion now sends **Retry‑After** on rate‑limited responses—honor it. 
---

**Reminder:** Keep villain scripts modular; never delete. All animation respects reduced motion. If an external script fails, surface a visible error and keep the primary **Start Cookup** CTA usable.
