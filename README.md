# THE NUKES — Song‑Per‑Day 365 (SPD365)

Gamify making a song every day. Open‑core app with optional Pro features under BSL.

## Getting Started
- Node 20+
- Install: `npm ci`
- Dev server: `npm run dev` (Vite)
- Build: `npm run build`
- Preview built site: `npm run preview`

## Tests
- Runner: Vitest (+ jsdom)
- Run all tests: `npm test`

## Open vs Pro
- Open core (MIT/Apache): app code at repo root (index.html, nukes-v2.js/css, adapters without secrets, tests, config)
- Pro (BSL 1.1): see `pro/` and `licenses/PRO-LICENSE.BSL`
  - Change Date auto‑convert to Apache‑2.0 per license
  - Do not commit secrets; keep keys in CI/hosting env vars

## CI/CD
- GitHub Actions: `.github/workflows/ci.yml` runs tests/build on push/PR; deploys `main` to Netlify (requires `NETLIFY_SITE_ID`, `NETLIFY_AUTH_TOKEN` secrets)
- Netlify: `netlify.toml` config (SPA redirects, caching, functions)

See STYLEGUIDE.md for philosophy and patterns; RELEASING.md for BSL Change Date stamping.
