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

See [LICENSE](./LICENSE) for details.