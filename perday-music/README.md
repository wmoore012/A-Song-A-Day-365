# Perday Music

Gamified daily music production for rap & R&B producers—finish a beat every day and track your creative streak.

## Features

- **7-minute Pre-Start**: Get your mind right with a countdown timer
- **Ready Gate**: Tap "Ready" to power up your multiplier
- **Audio Integration**: YouTube music and white noise with smooth fade-out
- **Analytics HUD**: ECharts visualization of grades and latency
- **Page Visibility**: Smart pause when tab is hidden (no auto-fail)
- **Progressive Disclosure**: Clean UI that doesn't overwhelm

## Tech Stack

- **React + TypeScript + Vite**
- **Tailwind CSS v4** with custom brand colors
- **GSAP** for smooth animations (respects reduced motion)
- **Zustand** + **localforage** for persistent state
- **ECharts** for data visualization
- **YouTube IFrame API** for audio

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Legacy App

The original vanilla JavaScript app is preserved in `../legacy/nukes-v2/`. To run it:

1. Navigate to the legacy directory
2. Open `index.html` in a browser
3. All original functionality is preserved

## Project Structure

```
src/
├── features/
│   ├── prestart/     # 7-minute countdown logic
│   ├── scoring/      # Multiplier calculations
│   ├── sound/        # Audio HUD & YouTube integration
│   └── AnalyticsHud.tsx
├── store/
│   └── store.ts      # Zustand store with persistence
├── ui/
│   ├── RotatingHero.tsx
│   ├── StartCtaOverlay.tsx
│   └── PageVisibilityBadge.tsx
└── App.tsx
```

## Design Philosophy

- **Simple but engaging**: Complex animations that feel simple
- **Progressive disclosure**: Don't overwhelm with choices upfront
- **Micro-celebrations**: Small wins matter (Ready tap, streak increases)
- **Accessibility first**: Respects `prefers-reduced-motion`
- **Mobile-friendly**: Responsive design with touch-friendly targets

## Next Steps

- [ ] Lock-in timer panel
- [ ] Villain announcement system
- [ ] Notion integration
- [ ] City/weather integration
- [ ] Settings panel
- [ ] Tests
