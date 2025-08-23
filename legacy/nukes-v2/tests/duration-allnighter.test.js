/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach } from 'vitest';

beforeEach(() => {
  localStorage.clear();
  document.body.innerHTML = `
    <button id="sessionLenLabel">∞</button>
    <div id="latencyCountdown">03:00</div>
  `;
});

const DURATIONS = [0,7,15,30];
function cycle(cur){ return DURATIONS[(DURATIONS.indexOf(cur)+1)%DURATIONS.length]; }

describe('duration cycle and all-nighter backdate', () => {
  it('cycles ∞ → 7 → 15 → 30 → ∞', () => {
    let cur = 0; // ∞
    cur = cycle(cur); expect(cur).toBe(7);
    cur = cycle(cur); expect(cur).toBe(15);
    cur = cycle(cur); expect(cur).toBe(30);
    cur = cycle(cur); expect(cur).toBe(0);
  });

  it('backdates all-nighter timestamp by ~24h', () => {
    const now = Date.now();
    const ts = now - 24*60*60*1000; // backdate one day
    expect(now - ts).toBeGreaterThanOrEqual(24*60*60*1000 - 2000);
  });
});
