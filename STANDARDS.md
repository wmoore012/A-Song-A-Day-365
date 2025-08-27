Totally—here’s a clean, copy-pasteable STANDARDS.md that captures what we fixed, what to avoid, and the right way to wire things going forward. Drop this in your repo root as STANDARDS.md.

⸻

Perday Frontend Standards

Why this exists

We hit classic “AI-bloat” problems: too many abstractions, duplicated mocks, animation code fighting tests, store hydration gates that never open, and Tailwind v3 vs v4 mismatches. This doc shows what we removed, what we keep, and exactly how to build and test so things stay fast, stable, and shippable.

⸻

Golden Rules
	1.	Prefer minimal, robust code over flashy abstractions. Micro-motion only; no elaborate timelines in prod or tests.
	2.	One source of truth for mocks. If you need to mock GSAP (or anything), do it once in src/test/setup.ts.
	3.	Never block the UI behind hydration. Show a shell that becomes “real” when hydrated; tests can bypass via store mock.
	4.	Keep legacy code quarantined. Legacy tests must not break CI for the app.
	5.	Stick to Tailwind v4 conventions. Use @import "tailwindcss"; not the v3 @tailwind base/components/utilities.
	6.	Forward your refs. Any component that passes ref (Radix + shadcn/ui) must use React.forwardRef.
	7.	Respect reduced motion + test environments. Skip animations when prefers-reduced-motion or running in tests.

⸻

What we removed (AI bloat detox)
	•	❌ Multiple GSAP mocks scattered across tests → ✅ a single complete mock in src/test/setup.ts.
	•	❌ Split-text/variant timelines everywhere → ✅ one optional micro-motion on the logo, guarded by reduced-motion + test env.
	•	❌ Tailwind v3 directives in a v4 build → ✅ @import "tailwindcss"; + fixed tailwind.config.
	•	❌ “Hydration forever” spinner → ✅ store hydration that resolves, plus tests that can force _hydrated: true.
	•	❌ Function components receiving ref without forwarding → ✅ React.forwardRef on controls (e.g., Button).
	•	❌ CI running DOM tests accidentally in Node environment / legacy suite mixed in → ✅ CI test globs + jsdom default, and legacy excluded.

⸻

Folder Hygiene
	•	perday-music/src/** – production app (tests must pass)
	•	legacy/** – experiments + old suites (quarantined; CI must not fail on these)

⸻

Motion / GSAP

Production usage
	•	Only micro-motion (e.g., logo fade/scale). Nothing blocking navigation or hydration.
	•	Always guard:

if (import.meta.env.VITEST || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
  return; // skip animations in tests and reduced-motion
}

Test mock (single source of truth)

Put this (or equivalent) once in src/test/setup.ts:

vi.mock('gsap', () => {
  const makeTween = () => ({ kill: vi.fn(), play: vi.fn().mockReturnThis() });
  const to = vi.fn(() => makeTween());
  const from = vi.fn(() => makeTween());
  const fromTo = vi.fn(() => makeTween());
  const timeline = vi.fn(() => {
    const tl: any = makeTween();
    tl.to = vi.fn().mockReturnValue(tl);
    tl.from = vi.fn().mockReturnValue(tl);
    tl.fromTo = vi.fn().mockReturnValue(tl);
    tl.set = vi.fn().mockReturnValue(tl);
    tl.add = vi.fn().mockReturnValue(tl);
    tl.killTweensOf = vi.fn();
    tl.kill = vi.fn();
    return tl;
  });
  const registerPlugin = vi.fn();
  const killTweensOf = vi.fn();
  return { gsap: { to, from, fromTo, set: vi.fn(), timeline, registerPlugin, killTweensOf } };
});

Do not re-mock GSAP inside individual test files.

⸻

Tailwind v4

src/styles/index.css

@import "tailwindcss";

/* (Your custom vars/animations here) */

html, body, #root { height: 100%; }
body { background: #0b0b0d; color: #f5f5f7; }
@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; }
}

tailwind.config.ts

import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: { /* your synth palette */ },
      // keyframes/animation if you want Tailwind-driven motion
    },
  },
  plugins: [animate],
} satisfies Config;


⸻

Ref Forwarding (Radix/shadcn)

Buttons, inputs, etc. must forward refs or Radix will warn and break some behaviors.

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp ref={ref} className={cn("...base classes...", className)} {...props} />;
  }
);
Button.displayName = "Button";


⸻

State & Hydration (Zustand)
	•	Persist via localforage. Use onRehydrateStorage to toggle _hydrated so the app leaves “Loading…”.
	•	UI should render a minimal shell immediately; do not block the entire app on hydration.

Test strategy
	•	For app-level tests, mock the store and set _hydrated: true:

vi.mock('@/store/store', () => ({
  useAppStore: () => ({
    session: { state: "PRE_START", readyPressed: false },
    settings: { /* defaults */ },
    _hydrated: true,
    dispatch: vi.fn(),
    setSettings: vi.fn(),
  }),
}));


⸻

Test Environment (Vitest)
	•	Default to jsdom for DOM tests.
	•	One global setup file with all the platform shims (matchMedia, ResizeObserver, echarts stub, localforage if needed, GSAP mock).
	•	Stable selectors: prefer data-testid over class names.
	•	Use fake timers only where deterministic (e.g., countdowns), otherwise waitFor.

vitest.config.ts (example)

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['src/test/setup.ts'],
    include: ['perday-music/src/**/*.test.ts?(x)'],
    exclude: ['legacy/**', 'node_modules/**', 'dist/**'],
  },
});

src/test/setup.ts essentials

/// <reference types="vitest/globals" />
import '@testing-library/jest-dom';
import { vi } from 'vitest';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((q: string) => ({
    matches: false, media: q, onchange: null,
    addListener: vi.fn(), removeListener: vi.fn(),
    addEventListener: vi.fn(), removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

(globalThis as any).ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(), unobserve: vi.fn(), disconnect: vi.fn(),
}));

vi.mock('echarts-for-react', () => ({ default: () => null }));

// Put the GSAP mock from the Motion section here.
// Optionally mock localforage here if you truly need it for unit tests.
// Prefer mocking the store instead for app-level tests.


⸻

CI / GitHub Actions
	•	A lockfile is required in CI (package-lock.json if you use npm). Commit it.
	•	Use npm ci (never npm install) in CI.
	•	Run selective tests for the app; quarantine legacy:
	•	Option A: separate workflows
	•	Option B: two vitest runs with different include globs

Minimal Node workflow

name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npx vitest --run --silent --include "perday-music/src/**/*.test.ts?(x)"

If you keep legacy tests, run them in a separate job and do not mark them required for merge.

⸻

Branch Protection (solo dev)
	•	✅ Recommended: “Require a pull request before merging” with approvals = 1 (self-approve).
	•	✅ “Dismiss stale approvals” = on (prevents accidental merges after last-minute changes).
	•	❌ Status checks required: optional while you’re stabilizing; turn on once CI is green consistently.

⸻

Path Aliases (so imports resolve in CI)

tsconfig.json

{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] }
  }
}

vite.config.ts

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
});


⸻

Debugging Order-of-Operations (when something breaks)
	1.	Tailwind: if UI is black/white → ensure @import "tailwindcss"; and correct content globs.
	2.	Refs: if Radix warns “Function components cannot be given refs” → add forwardRef.
	3.	Hydration: if app stuck on “Loading…” → ensure _hydrated flips; in tests, mock store with _hydrated: true.
	4.	Motion: if tests throw tl.fromTo is not a function or killTweensOf not a function → fix the single GSAP mock.
	5.	Legacy: if CI fails with window is not defined from old suites → exclude legacy tests from the app job.
	6.	CI npm: if CI says “lock file not found” → commit package-lock.json and use npm ci.

⸻

Anti-patterns we removed → Replacements
	•	Many animation variants / split-text → One micro-motion, opt-in.
	•	Multiple scattered mocks → One authoritative setup.ts.
	•	Blocking hydration gates → Immediate shell + non-blocking hydration; tests can force hydrated store.
	•	Function components with refs → React.forwardRef.
	•	Flaky class-based queries → data-testid selectors.

⸻

Example Snippets

PerdayLogo (micro-motion with guards)

useGSAP(() => {
  if (import.meta.env.VITEST || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
  const tl = gsap.timeline();
  tl.fromTo(logoRef.current, { opacity: 0, y: -30, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.6 });
}, { scope: logoRef, dependencies: [] });

usePrestart (countdown shape)

export function usePrestart(totalMs = 7 * 60_000) {
  const [msLeft, setMsLeft] = useState(totalMs);
  const [sealed, setSealed] = useState(false);
  const tlRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const obj = { v: totalMs };
    tlRef.current?.kill();
    tlRef.current = gsap.to(obj, {
      v: 0, duration: totalMs / 1000, ease: "none",
      onUpdate: () => setMsLeft(obj.v),
      onComplete: () => setSealed(true),
    });
    return () => tlRef.current?.kill();
  }, [totalMs]);

  const mmss = useMemo(() => {
    const s = Math.max(0, Math.ceil(msLeft / 1000));
    return `${String(Math.floor(s/60)).padStart(2, '0')}:${String(s%60).padStart(2, '0')}`;
  }, [msLeft]);

  return { msLeft, mmss, sealed };
}


⸻

Security Guidelines

Authentication & Session Management
	•	Never simulate login in production code. Use real OAuth providers (Supabase, NextAuth) or secure Netlify Functions.
	•	Store session tokens in HttpOnly cookies, not localStorage. This prevents XSS-based token theft.
	•	Implement proper CSRF protection for forms and API calls.
	•	Rate limit authentication endpoints to prevent brute force attacks.

Data Sanitization & Rendering
	•	Never use dangerouslySetInnerHTML with user data unless sanitized with DOMPurify.
	•	React automatically escapes text content - leverage this instead of raw HTML.
	•	Validate and sanitize all user inputs before processing or storing.
	•	Cap input sizes and implement proper parsing for user-generated content.

Content Security Policy (CSP)
	•	Use moderate CSP headers that allow inline styles but lock down scripts.
	•	Whitelist only necessary external domains (YouTube for iframe API, Supabase for API calls).
	•	Block frame-ancestors to prevent clickjacking attacks.
	•	Enable HSTS, X-Content-Type-Options, and other security headers.

API Security
	•	Never expose service role keys or secrets in client-side code.
	•	Use environment variables for sensitive configuration.
	•	Implement proper CORS policies - allow only your origin, not wildcards.
	•	Validate all API inputs server-side, even if client-side validation exists.

Storage Security
	•	localStorage is readable by any script - store only non-sensitive data.
	•	Implement size caps for user-generated content (notes, uploads).
	•	Use secure, signed URLs for private file access.
	•	Prefer server-side storage for sensitive user data.

Dependency Security
	•	Run npm audit monthly to check for known vulnerabilities.
	•	Keep React, Vite, GSAP, and other dependencies updated.
	•	Use package-lock.json in CI to ensure consistent dependency versions.
	•	Monitor security advisories for critical dependencies.

⸻

Legacy Quarantine Policy
	•	Keep legacy code/tests under legacy/** (or the existing legacy folder).
	•	CI for the app must ignore legacy. You can run legacy in a separate, non-required workflow.

⸻

When you need to dig via git
	•	Use git bisect on app tests only to pinpoint regressions.
	•	If the culprit is broad, trial-restore one file from the last good commit on a scratch branch (git restore --source=<good> -- <path>). If it helps, keep; if not, undo with git restore --source=HEAD -- <path>.
