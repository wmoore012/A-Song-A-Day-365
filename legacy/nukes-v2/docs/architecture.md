# Architecture

## Overview
- `index.html`, `nukes-v2.js/css`: UI shell, session loop, chat, small charts.
- `storage.js`: LS facade with clamping, safe JSON.
- `web-utils.js`: helpers (IDs, clamp, parser, multiplier calc).
- `pro-loader.js`: loads `pro/*` at runtime when gated.

## Pro modules (private)
- `pro/villain-lines.js`: personalities/scripts (closed).
- `pro/analytics-hud.js`: announcer/GIF frames + analytics HUD.
- `pro/fx-overlays.js`: cinematic overlays (crossfaded loops).
- `pro/locker.js`: award locker grid.

## Gating
- `window.__PRO__ = true` in production builds enables pro imports.
- OSS builds omit pro code and assets.

## Typed messages
- Flag: `TYPED_BOT_MESSAGES` at top of `nukes-v2.js`.
- Uses `typewriter.js` with caret + jitter.

## Events
- Start/Done/Low‑time/Award call the pro announcer to show framed GIFs.
- Reward close scrolls to `#lockerSection`.

## GIPHY (optional, pro)
- `giphy.js` wraps REST search; feed URLs to announcer pools.
- Keep SDK/API keys out of public builds.