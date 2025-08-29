# Song-Per-Day-365

A gamified daily music production app for rap & R&B producers.

## Apps

### 🚀 Perday Music (React) - **Current**
The new React + TypeScript app with modern tooling and enhanced UX.

```bash
cd perday-music
npm install
npm run dev
```

**Features:**
- 7-minute Pre-Start countdown with Ready gate
- GSAP animations with reduced motion support
- YouTube audio integration with fade-out
- ECharts analytics HUD
- Progressive disclosure UI
- Persistent state with Zustand + localforage

### 📁 Legacy App (Vanilla JS)
The original vanilla JavaScript implementation preserved for reference.

```bash
cd legacy/nukes-v2
# Open index.html in browser
```

**Features:**
- All original functionality preserved
- GSAP animations and effects
- YouTube integration
- Notion logging
- Villain system

## Migration

The project has been migrated from vanilla JavaScript to React + TypeScript with the following improvements:

- **Better UX**: Progressive disclosure, micro-celebrations, cleaner flow
- **Modern Stack**: React, TypeScript, Vite, Tailwind CSS v4
- **Enhanced Animations**: GSAP with React hooks, reduced motion support
- **Persistent State**: Zustand store with IndexedDB persistence
- **Better Architecture**: Modular components, type safety, better testing

## Development

### New App (React)
```bash
cd perday-music
npm install
npm run dev
```

### Legacy App
```bash
cd legacy/nukes-v2
# Open index.html in browser
```

## Documentation

- [Migration Requirements](./docs/perday-migration.md) - Detailed migration plan
- [Architecture](./docs/architecture.md) - System design
- [Contributing](./docs/CONTRIBUTING.md) - Development guidelines

## License

This project uses a dual-licensing approach:

- **Core Application**: GPL-3.0 (open source) - Everything in `perday-music/src/**` and root level files
- **Pro Features**: Proprietary (closed source) - Everything in `/pro/**` folders

### Core Application (GPL-3.0)
The main application code is licensed under GPL-3.0, which means:
- ✅ Free to use, modify, and distribute
- ✅ Must share source code when distributing
- ✅ Derivative works must also be GPL-3.0
- ✅ Commercial use allowed with GPL-3.0 compliance

### Pro Features (Proprietary)
Pro features in `/pro/**` folders are proprietary and closed source:
- ❌ Not included in GPL-3.0 license
- ❌ Source code not shared
- ❌ Commercial licensing required for use
- ✅ Excluded from git via .gitignore

See [LICENSE](./LICENSE) for full GPL-3.0 license text.

