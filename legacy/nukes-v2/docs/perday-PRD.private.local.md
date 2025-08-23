# Perday: Music — Product Requirements (PRIVATE, DO NOT COMMIT)

This file is intentionally ignored by git via .gitignore. Do not commit.

Paste the PRD content here. Sensitive notes and language guidelines apply.
# Perday: Music

Gamified daily music production for rap & R&B producers—finish a beat every day and track your creative streak.

### TL;DR

Perday: Music turns daily beat-making into a game for rap and R&B producers, featuring a one-tap Cookup flow, motivational streak counters, lightweight self-grading, and direct Notion portfolio syncing. The product uses interactive ECharts, engaging GSAP animations, and a mobile-friendly HUD to encourage consistent creative practice. Its core value is simple: producers get in, make something, and track real progress, with their session history ready to share from Notion.

---

## Goals

### Business Goals

* Hit 100 DAU (daily active users) within 2 months of soft launch.

* MVP demo ready within 4 weeks (including live Notion sync and analytics).

* Ensure 95%+ reliability on Notion sync (write success rate, queue fail-safety).

* Deliver a visually-polished, portfolio-worthy product (standalone project demo).

* Collect feedback from at least 10 notable mentors/A&Rs during the MVP.

### User Goals

* Start a new Cookup session with a single tap (‘Ready’ gate) and minimal distractions.

* Maintain a daily streak for habit-building motivation.

* Review past sessions, grades, and notes easily via in-app HUD and synced Notion table.

* Self-grade sessions with lightweight, quick interactions.

* Pause streaks when needed (Freeze) for life-events, without penalty.

### Non-Goals

* No music asset marketplace or beat selling features for MVP.

* No machine learning or automated grading in v1.

* No paid upgrade path, monetization, or in-app purchases included at launch.

---

## User Stories

### Primary Persona: Rap & R&B Producer

* As a producer, I want to start a session with a single tap, so that I’m not distracted by complex forms.

* As a producer, I want instant visual feedback on my daily streak, so that I feel motivated to keep making music.

* As a producer, I want to lightly grade my work at the end of each session, so that I can track my improvement over time.

* As a producer, I want my session notes and grades saved to Notion, so that I have a portable, shareable portfolio.

* As a producer, I want to pause my streak for life events, so that the habit stays flexible and forgiving.

### Secondary Persona: Mentor / A&R

* As a mentor/A&R, I want to view a producer’s portfolio/history, so that I can see their consistency and growth.

* As a mentor/A&R, I want producers to share a live Notion link, so that I can review their work conveniently without exporting files.

* As a mentor/A&R, I want to give feedback on session notes, so that I can encourage and guide producers’ development.

---

## Functional Requirements

* **Cookup Flow** (Priority: Highest)

  * Ready Gate: One-tap start button to launch daily session.

  * Multiplier: Increasing XP or visual reward for consecutive streaks.

* **Streaks & Freeze** (Priority: High)

  * Streak Calendar: Visual tracker for session consistency.

  * Freeze/Skip Gate: Allow users to temporarily “pause” their streak (limited uses).

* **Grading & Notes** (Priority: High)

  * Lightweight Grading: 1–5 tap scale and text notes at session end.

  * Self Grade Dialog: Responsive UI for quick grade entry.

* **Notion Integration & Queueing** (Priority: High)

  * Notion Session Sync: Write session data (date, grade, notes) to user’s Notion database.

  * Queue & Retry-After: Local queue with retry and 429 error handling for Notion API rate limits.

* **ECharts HUD** (Priority: Medium)

  * Progress Visualization: Line/bar charts for streaks, grades, and completion rates.

  * Responsive Design: Works smoothly on mobile and desktop.

* **GSAP Animations** (Priority: Medium)

  * Kinetic Animations: Animations to celebrate streaks or session wins.

  * Villain Dock: Animated “villain” mascot for feedback and reminders.

* **Tracking & Analytics** (Priority: High)

  * User Events: Log key user actions (start, ready, complete, grade, Notion sync status, streak).

  * HUD for analytics review.

---

## User Experience

**Entry Point & First-Time User Experience**

* User lands on perday.netlify.app (or dedicated domain).

* Welcoming splash screen introduces Perday’s mission, and prompts for Google/Notion authentication (if not previously set up).

* Optional onboarding walkthrough: short tutorial overlay (can be skipped) highlights Cookup, streaks, and Notion sync—clear and concise, with reduced-motion toggle.

* After onboarding, user lands directly at the Ready gate.

**Core Experience**

* **Step 1: Ready Gate**

  * User sees “Ready?” button with streak, XP/multiplier, and today’s date.

  * Minimal friction: tap starts session, animations play (GSAP), Cookup in progress.

  * Error handling: If Notion isn’t linked, prompt appears with link instructions.

* **Step 2: Cookup Session**

  * Timer, music preview widget (YouTube/iFrame as needed), and notes field displayed.

  * Session duration can be default/flexible (e.g., 30 min recommended).

  * HUD shows streak progress and cheering “villain” mascot.

* **Step 3: End & Grade**

  * At session end (user-initiated or timer), grade prompt appears: 1–5 quick tap plus notes (optional).

  * All data validated (required fields), clear feedback for missing items.

  * Submission triggers Notion write; HUD and animation show success/failure.

* **Step 4: Review & Share**

  * Producer sees ECharts summary: streak graph, grade history.

  * All sessions reviewable and shareable via Notion portfolio link.

  * Option to “Freeze” upcoming session (user-limited) if needed for real-life flexibility.

**Advanced Features & Edge Cases**

* If Notion API rate limit (429), session is queued locally and retried automatically.

* If session cannot submit due to offline, show clear “Queued” state and sync on next launch.

* Power-users: toggle reduced-motion, export HUD data to CSV, or link multiple Notion tables.

**UI/UX Highlights**

* High-contrast color scheme and large tap targets for mobile-first design.

* Accessibility options: reduced-motion toggle, ARIA labels, keyboard navigation.

* Responsive layout for mobile and desktop, Touch/Pointer support.

* Progressive enhancement: all interactions degrade gracefully.

* Minimal, fast, and distraction-free interface with bold feedback and celebration moments.

---

## Narrative

After years of making beats sporadically, Jay—a rising rap/R&B producer—struggled to build a steady creative habit. Every time Jay sat down to work, distractions or decision fatigue would get in the way. There was no real sense of progress, just a random folder filled with unfinished sessions.

Enter Perday: Music. On the first day, Jay lands on a no-fuss, single-tap “Ready” button. Instantly, Jay is in Cookup mode—no forms or complexities, just a timer, a streak counter, and a playful “villain” cheering them on. Jay breezes through a 30-minute session, enters a lightweight grade with a few notes, and ends the day feeling accomplished.

The next morning, Jay returns. Perday celebrates the new streak, animates the progress, and shows an updated progress chart. Jay’s sessions, grades, and thoughts automatically sync to Notion—building a living portfolio that can be shared directly with friends, collaborators, or even an A&R mentor. Over a few weeks, Jay sees the streak grow, finds pride in consistency, and watches as those scattershot files become a visible timeline of skill and dedication.

When it’s time for a real demo or a meeting, Jay just shares the Notion link and gets instant credibility. Perday doesn’t just help Jay finish music—it transforms daily practice into an achievement worth showing off.

---

## Success Metrics

### User-Centric Metrics

* DAU/WAU growth and retention

* Average streak length per user

* Net Promoter Score (NPS) from in-app feedback

### Business Metrics

* MVP launch within 4-week deadline

* Portfolio-quality demo delivered

* At least 10 mentor/A&R feedback sessions completed

### Technical Metrics

* 

> 95% Notion write reliability (no user-facing data loss)

* <2% retry-queued sessions (minimize rate-limit friction)

* 

> 99% app uptime during launch

### Tracking Plan

* session_start

* ready_tap

* cookup_complete

* grade_submit

* streak_change

* notion_write_success

* notion_write_fail

* freeze_invoke

* hud_view

* portfolio_share

---

## Technical Considerations

### Technical Needs

* Frontend: React (Vite, TypeScript), Tailwind CSS v4 for styling, shadcn/ui for component primitives.

* Animations: GSAP for React/Kinetic feedback.

* Data Viz: echarts-for-react for HUD stats.

* Backend/serverless: Netlify Functions for Notion API mediation; IndexedDB/localStorage for offline session queue.

* API integration: Notion API for portfolio sync, analytics SDK (e.g., PostHog/GA).

### Integration Points

* Notion API: Write ops with idempotency, local queue, and Retry-After handling for 429s.

* YouTube IFrame: Audio widget preview inside Cookup UI.

* Analytics: Frontend event tracking provider.

* Netlify: Hosting, deploy preview environment, function endpoints.

### Data Storage & Privacy

* Notion as the primary database: User connects personal Notion, tables store (session_date, grade, notes, streak, client_id).

* Local queue: IndexedDB/localStorage to cache unsynced sessions.

* Idempotency: Use client-generated IDs to prevent duplication.

* Minimal PII: Only session meta (not tracks/audio), user auth for Notion handled securely.

* Compliance: No payment or sensitive/tax data handled.

### Scalability & Performance

* MVP expects <1,000 DAU at launch. All heavy libs lazy-loaded.

* Performance budgets enforced for <2s page load, GSAP and HUD animations debounced on mobile.

* 99%+ uptime goal on Netlify/functions.

### Potential Challenges

* Notion API rate limiting (429s): mitigated via local queue, retries, exponential backoff.

* Browser audio autoplay restrictions: Preview limited to user action only.

* GSAP/animation memory leaks: Strict cleanup on component unmount.

* ECharts performance: Limit/aggregate large data sets for HUD on underpowered devices.

---

## Milestones & Sequencing

### Project Estimate

**Recommended:** Medium (2–4 weeks) for polished MVP + portfolio demo.

### Team Size & Composition

* Extra-small: 1 full-stack developer (handles product, engineering, simple UI).

* Small Team: 1 developer + 1 designer (optional, for polish and brand).

* **Lean startup**: 1–2 people full-cycle; rapid iterative builds; external feedback for design and Q/A.

### Suggested Phases

**Scaffold (1 week)**

* Key Deliverables: Project repo, live deploy (Netlify), frontend scaffolding, Notion API wiring, analytics events.

* Dependencies: Notion developer access, domain setup.

**MVP (2–3 weeks)**

* Key Deliverables: Core Cookup flow, streaks/grades, Notion queue/retry, GSAP and ECharts integration, all success/error states, accessibility and performance.

* Dependencies: Shadcn/ui, echarts-for-react, GSAP, Netlify Functions.

**Polish/Portfolio (1 week)**

* Key Deliverables: Design audit, advanced animations, HUD refinement, Notion share flow, launch/portfolio materials.

* Dependencies: External QA/mentor feedback.
