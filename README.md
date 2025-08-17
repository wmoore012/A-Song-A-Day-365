# THE NUKES — Song‑Per‑Day 365 (Public Overview)

Make one song a day. Ship it. Track your streak. Watch momentum grow.

This repo contains the public overview and developer docs. The production app ships in two flavors:

- Open preview (feature‑limited): Web UI shell, basic timers, non‑pro overlays disabled.
- Pro build (commercial, closed‑core): Cinematic FX, villain personalities/scripts, analytics HUD, award locker, and premium assets.

Links
- Docs for users: `docs/user_guide.md`
- Pro setup (team/internal): `docs/pro_setup.md`
- Architecture: `docs/architecture.md`
- Licensing: `docs/licensing.md`

## What it is

A daily practice engine for creatives. You’ll see:
- A tight session loop (start, ship, grade)
- Villain taunts (fun + motivating), with a typed neon “spy console” vibe
- Streak, heat‑checks, and lightweight analytics
- Optional ambient FX (white noise, vibes) and cinematic overlays (Pro)

If you’re a producer or songwriter who needs a push every single day, this is for you.

## Quick‑start (public preview)

1) Clone this repo and install dependencies.
```bash
npm i
npm run dev
```
2) Run tests
```bash
npm test
```
3) Build
```bash
npm run build && npm run preview
```

Pro features require a private build. See `docs/pro_setup.md`.

## Contributing

We welcome issues/feedback for the public preview UI and docs. Code contributions go through a separate process — see `CONTRIBUTING.md` if present, or open a discussion first.

## Demo

A public demo of the open preview is planned. The Pro experience (FX, personalities, HUD) is only available to licensed users.

© 2025 J. Smash. See `LICENSE-commercial.txt` for closed‑core terms and `docs/licensing.md` for details.
