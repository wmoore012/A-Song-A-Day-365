# Pro Setup (Internal)

This document describes how to build, run, and operate the Pro (closed‑core) experience.

## Overview
- Pro modules: `pro/` (private repo or private package). Do not publish publicly.
- Gating: Set `window.__PRO__ = true` (inline in HTML before module boot) or via `VITE_PRO=1` + define in build.
- Runtime imports: `pro-loader.js` imports `pro/*` when `__PRO__` is truthy.

## Build
```bash
# Install deps
npm i

# OSS preview
npm run dev

# Pro build (example)
VITE_PRO=1 npm run build
```

In `index.html` head for production:
```html
<script>window.__PRO__ = true;</script>
```

## Villain announcer (framed GIFs)
- Function: `rotateVillainAnnounce(kind, { pool, frameSrc, durationMs })` in `pro/analytics-hud.js`.
- Default: uses an internal rotating pool if `pool` is not provided.
- To use curated pools (preferred):
```js
import { rotateVillainAnnounce } from './pro/analytics-hud.js';
rotateVillainAnnounce('done', {
  pool: [
    'https://media.giphy.com/media/…/giphy.gif',
    'https://media.giphy.com/media/…/giphy.gif'
  ],
  frameSrc: 'pro/video/TC - 35mm_MATTE.png',
  durationMs: 2200
});
```

## GIPHY option (Pro)
- Helper: `giphySearch(query, { apiKey, limit, rating })` in `giphy.js`.
- Example:
```js
import { giphySearch } from './giphy.js';
const pool = await giphySearch('villain+taunt', { apiKey: 'YOUR_KEY', limit: 8 });
rotateVillainAnnounce('start', { pool, frameSrc: 'pro/video/TC - VIEWFINDER 235 - BLACK.png' });
```
- Gate the chooser UI with a “Use GIPHY” button and a big blue “Just go with Default” button:
  - On Default: auto‑select curated pools; slide up (collapse) the chooser.
  - On GIPHY: fetch with `giphySearch`, preview thumbs, apply on select.

## Typed villain messages
- Global flag in `nukes-v2.js`: `const TYPED_BOT_MESSAGES = true;`
- Applies to all bot outputs. Set false to revert to instant printing.

## Locker
- Add container in the page: `<section id="lockerSection"></section>`.
- Call `mountLocker(items)` from `pro/locker.js`:
```js
import { mountLocker } from './pro/locker.js';
mountLocker([
  { title:'Rare Drop', gif:'https://media.giphy.com/media/…/giphy.gif' },
  { title:'Award', gif:'https://media.giphy.com/media/…/giphy.gif' }
]);
```
- “Go to locker” CTA triggers smooth scroll via `smoothScrollTo('#lockerSection')`.

## Assets
- Store frames/overlays in `pro/video/` and serve from private CDN or private storage. Avoid embedding in public builds.
- Video overlays run as crossfaded screen‑blend loops; set `window.toggleFx(true)` to enable.

## License enforcement
- Distribute Pro under `LICENSE-commercial.txt`.
- Do not publish `pro/` code or assets in public repos.
- Keep API keys and CDN tokens in environment variables.