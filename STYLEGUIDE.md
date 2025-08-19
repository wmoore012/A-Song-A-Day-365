# SPD365 Style Guide

Philosophy: Think hard. Fail loudly. No silent fallbacks.

- Errors: If a required DOM element or precondition is missing in dev, throw an Error or render an obvious error state. Avoid silent returns for required flows.
- Tests: Use Vitest + jsdom. Keep tests deterministic and focused. Avoid real timers and network. Prefer pure functions or DOM with test IDs.
- Accessibility: Honor ARIA patterns (e.g., tabs use role=tablist/tab/tabpanel; keep aria-selected synced). Respect prefers-reduced-motion.
- Structure: Open core under MIT/Apache in root. Proprietary features live under /pro/** and are closed source. Never commit secrets.
- CSS: Use clear class hooks. Prefer semantic names. Avoid magic selectors. Support reduced motion in CSS, not JS.
- JS: Small modules. Explicit helpers like must(selector) to assert critical elements. Keep feature toggles persisted in localStorage with narrow keys.
- CI/CD: GitHub Actions runs test+build on push/PR; deploy main to Netlify. No environment secrets in repo.
