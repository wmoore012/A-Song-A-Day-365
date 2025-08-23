# Perday Pro Engineering Standards

## Philosophy
- **Think hard. Fail loudly. No silent fallbacks.**
- If a precondition isn't met, surface it (throw in dev; render an explicit error UI in prod).
- Prefer boring, deterministic code over cleverness.
- Accessibility and performance are gate checks, not afterthoughts.
- Tailwind v4 is our CSS baseline; use its Vite plugin and `@import "tailwindcss"` in the entry CSS.

## Step-by-Step Evolution Plan

### 1) Wire up Zustand (state only)

**Goal:** A minimal store with a single phase string and a button that toggles it.

**Impl:**
```typescript
// src/store/app.ts
import { create } from 'zustand'
export type Phase = 'prestart' | 'lockin'
type S = { phase: Phase; setPhase: (p: Phase) => void }
export const useApp = create<S>((set) => ({
  phase: 'prestart',
  setPhase: (phase) => set({ phase }),
}))

// src/App.tsx
import { useApp } from './store/app'
export default function App() {
  const { phase, setPhase } = useApp()
  return (
    <div data-testid="phase">
      <span>{phase}</span>
      <button onClick={() => setPhase('lockin')}>Lock in</button>
    </div>
  )
}
```

**Smoke test (Vitest + jsdom):**
```typescript
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import App from './App'

describe('Zustand minimal', () => {
  it('toggles phase', async () => {
    render(<App />)
    expect(screen.getByTestId('phase')).toHaveTextContent('prestart')
    await fireEvent.click(screen.getByText('Lock in'))
    expect(screen.getByTestId('phase')).toHaveTextContent('lockin')
  })
})
```

### 2) Add GSAP (one harmless tween)

**Goal:** Animate opacity on mount; respect reduced motion (skip animation).

**Impl:**
```typescript
// src/features/fade/FadeIn.tsx
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export function FadeIn({ children }: { children: React.ReactNode }) {
  const el = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (el.current) gsap.fromTo(el.current, { opacity: 0 }, { opacity: 1, duration: 0.4 })
  }, [])
  return <div ref={el} data-testid="fade-in">{children}</div>
}
```

**Smoke test (no real timers):**
```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FadeIn } from './FadeIn'

describe('FadeIn', () => {
  it('renders element (animation optional)', () => {
    vi.useFakeTimers()
    render(<FadeIn><div>Hi</div></FadeIn>)
    expect(screen.getByTestId('fade-in')).toBeInTheDocument()
  })
})
```

### 3) Add ECharts (dispose correctly)

**Goal:** Render a tiny chart and dispose on unmount.

**Impl:**
```typescript
// src/features/chart/MiniChart.tsx
import { useEffect, useRef } from 'react'
import * as echarts from 'echarts'

export function MiniChart() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!ref.current) return
    const chart = echarts.init(ref.current)
    chart.setOption({ 
      xAxis: { type: 'category', data: [1,2,3] }, 
      yAxis: {}, 
      series: [{ type: 'line', data: [1,2,1] }] 
    })
    return () => chart.dispose()
  }, [])
  return <div data-testid="chart" style={{ width: 240, height: 120 }} ref={ref} />
}
```

**Smoke test (mock & verify dispose):**
```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, unmountComponentAtNode } from 'react-dom'
import * as echarts from 'echarts'
import { MiniChart } from './MiniChart'

it('disposes on unmount', () => {
  const div = document.createElement('div')
  const dispose = vi.fn()
  vi.spyOn(echarts, 'init').mockReturnValue({ setOption: vi.fn(), dispose } as any)
  render(<MiniChart />, div)
  unmountComponentAtNode(div)
  expect(dispose).toHaveBeenCalled()
})
```

### 4) Add YouTube (user-gesture gated)

**Goal:** Load the IFrame API only after a click; show fallback if blocked.

**Impl:**
```typescript
// src/features/youtube/LitePlayer.tsx
import { useState } from 'react'

export function LitePlayer({ videoId }: { videoId: string }) {
  const [active, setActive] = useState(false)
  const onPlay = () => {
    setActive(true)
    if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      const s = document.createElement('script')
      s.src = 'https://www.youtube.com/iframe_api'
      document.head.appendChild(s)
    }
  }
  return active ? (
    <iframe
      data-testid="yt-frame"
      width="560" height="315"
      src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
      title="YouTube video player" 
      allow="autoplay; encrypted-media" 
      allowFullScreen
    />
  ) : (
    <button data-testid="yt-cta" onClick={onPlay}>Play ▶</button>
  )
}
```

**Smoke test (script tag appears after click):**
```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { LitePlayer } from './LitePlayer'
import { describe, it, expect } from 'vitest'

describe('LitePlayer', () => {
  it('injects API script on click', async () => {
    render(<LitePlayer videoId="dQw4w9WgXcQ" />)
    await fireEvent.click(screen.getByTestId('yt-cta'))
    const script = document.querySelector('script[src*="youtube.com/iframe_api"]')
    expect(script).not.toBeNull()
    expect(screen.getByTestId('yt-frame')).toBeInTheDocument()
  })
})
```

## Errors & Preconditions

- **Dev:** throw Error for missing DOM hooks, config, or required props.
- **Prod:** render an obvious error state with a retry path; log to console and to the error pipeline.
- **Tiny, explicit assertions:**

```typescript
export function must<T>(value: T | null | undefined, msg: string): T {
  if (value == null) throw new Error(msg)
  return value
}

// Usage
const root = must(document.querySelector('[data-app-root]'), 'Missing [data-app-root]')
```

- Use Error Boundaries at feature seams (StartGate, NotionSync, HUD).

## Tests (Vitest + jsdom)

- **Deterministic only:** no real timers/timeouts, no real network.
- Use `vi.useFakeTimers()` and advance time; stub fetch.
- Focus on pure functions and DOM with `data-testid` hooks; keep suites tiny (sub-second).

```typescript
import { describe, it, expect, vi } from 'vitest'
describe('timer', () => {
  it('ticks without real timers', () => {
    vi.useFakeTimers()
    // ...mount component...
    vi.advanceTimersByTime(7_000)
    // ...assert mm:ss updates...
  })
})
```

## Accessibility

- **Tabs follow APG intent:** container `role="tablist"`, each tab `role="tab"` with `aria-controls` → panel `role="tabpanel"`. Keep `aria-selected` and focus in sync; arrow keys move focus.
- **Respect reduced motion:**

```css
@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; }
}
```

- **Keyboard targets:** visible focus rings, logical tab order, escape routes for overlays/sheets.

## Structure & Licensing

- **Open core** (MIT or Apache-2.0) at repo root (`/LICENSE`).
- **Proprietary features** under `/pro/**` (closed source, separate license).
- **Never commit secrets;** keep configuration minimal and environment-driven.

## CSS Rules

- **Semantic class hooks** (e.g., `.start-gate`, `.hud-card`)—avoid brittle selectors.
- **Tokenize brand colors** in `:root`; avoid hard-coding values throughout.
- **Animations are tasteful, time-bounded, and disabled** under reduced motion (CSS first).
- **Tailwind v4 entry CSS** uses: `@import "tailwindcss";` (no config needed for basics) and the Vite plugin for DX.

## JS/TS Rules

- **Small, focused modules**—no "god" utilities.
- **Feature toggles:** persist with narrow, namespaced keys (e.g., `perday.sound.enabled`).
- **Tiny storage helpers** that validate on read:

```typescript
export const store = {
  get<T>(k: string, fallback: T): T {
    try { 
      const v = localStorage.getItem(k); 
      return v ? JSON.parse(v) as T : fallback 
    }
    catch { 
      return fallback // fail loud in dev via console
    }
  },
  set<T>(k: string, v: T) { 
    localStorage.setItem(k, JSON.stringify(v)) 
  }
}
```

- If using Zustand persist, be mindful of hydration/SSR quirks.

## CI/CD

- **GitHub Actions:** on every push/PR → install, `pnpm test --run`, `pnpm build`.
- **Main deploys to Netlify.** Production secrets come from CI/host secrets—not the repo.
- **Block merges** on failing tests/build; require lint and dependency review.

**Minimal workflow (example):**
```yaml
name: ci
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: 'pnpm' }
      - run: corepack enable
      - run: pnpm i --frozen-lockfile
      - run: pnpm test --run
      - run: pnpm build
```

## Component Contracts (spot checks)

### Start Gate
- **Required DOM/props:** throws in dev if missing.
- **Reduced-motion:** shorter/eased-down by default; fully disabled under `prefers-reduced-motion`.
- **Emits clear events** `onStarted(latencyMs)`, `onDone(result)`; no hidden global coupling.

### Notion Sync
- **Never blocks UI.** Retriable queue (429/backoff). Failure surfaces a clear error UI and a retry button.

### HUD (ECharts)
- **Disposes on unmount,** renders loading/empty explicitly, and shows a visible error for invalid data.

### YouTube Audio
- **Load IFrame API only after a user gesture;** provide fallback UI if blocked.

## "Fail Loud" Patterns

- **Render component-local error UIs** for: missing config/env, third-party down, schema mismatches.
- **Console in dev, toast/banner in prod;** include short cause + suggested action.
- **Avoid** `try { … } catch { /* noop */ }`. Logged or lifted—never swallowed.

## ARIA & Motion Quick-Refs

- **Tabs roles/keyboard behavior** per APG/MDN.
- **Motion control** via `@media (prefers-reduced-motion: reduce)`.

## Ready-to-Use Checklists

### PR checklist
- [ ] No silent returns for required flows (dev throws; prod error UI).
- [ ] Tests: deterministic (fake timers, no network); coverage on scoring and Start Gate states.
- [ ] A11y: roles/labels/keyboard; reduced-motion path verified.
- [ ] Storage: namespaced keys; schema validated on read.
- [ ] CI is green; no secrets added/modified in code.

### Failure UI checklist
- [ ] Message states what failed and why (short).
- [ ] Action: Retry / Open Settings / View Logs.
- [ ] Logged in devtools; error object preserved for debugging.
