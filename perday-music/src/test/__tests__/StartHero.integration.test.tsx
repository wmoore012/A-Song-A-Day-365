import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FlowState } from '../../types'; // Added FlowState import

// ── IMPORTANT: StartHero must accept a prop `fadeOutRef: React.MutableRefObject<() => void>`
// If it doesn't yet, add `fadeOutRef` to StartHero's props and pass it down to AudioHud/Controls
import StartHero from '../../components/StartHero';

// Mock the Zustand store used by StartHero so we can control state + capture dispatch calls
vi.mock('../../store/store', () => {
  const dispatch = vi.fn();
  return {
    useAppStore: () => ({
      session: {
        state: FlowState.PRE_START, // Use the actual enum value
        readyPressed: false,
        multiplierPenalty: false,
        target: '',
        durationMin: 0,
      },
      settings: {
        userName: 'Will',
        collaborators: '',
        defaultDuration: 14,
        defaultMultiplier: 1.0,
        soundEnabled: true,
        volume: 0.5,
      },
      dispatch,
      setSettings: vi.fn(),
    }),
  };
});

// Keep the prestart timer deterministic (no 7-minute wait)
vi.mock('../features/prestart/usePrestart', () => ({
  usePrestart: () => ({ mmss: '06:59', msLeft: 419000, sealed: false, readyAtMs: null, tapReady: vi.fn() }),
}));

// Villain just a no-op in tests
vi.mock('../features/fx/useVillainAnnounce', () => ({
  useVillainAnnounce: () => ({ villainNudge: vi.fn() }),
}));

// GSAP is mocked globally in setup.ts - no need for local mock

describe('StartHero → audio fade on Ready (integration smoke)', () => {
  let fadeSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fadeSpy = vi.fn();
  });

  it('clicking Ready calls fadeOutRef.current exactly once', async () => {
    const fadeOutRef = { current: fadeSpy };

    render(<StartHero fadeOutRef={fadeOutRef as React.MutableRefObject<() => void>} />);

    // We don't assert every pixel — just the critical path: the Ready button exists…
    const readyBtn = await screen.findByRole('button', { name: /ready/i });
    expect(readyBtn).toBeInTheDocument();

    // …and clicking it triggers audio fade (our micro-celebration kick-off)
    fireEvent.click(readyBtn);

    expect(fadeSpy).toHaveBeenCalledTimes(1);
  });
});

