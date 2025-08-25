import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePrestart } from '../../hooks/usePrestart';

// GSAP is mocked globally in setup.ts - no need for local mock

describe('usePrestart', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('formats mm:ss at start and seals at T-0', () => {
    const total = 7 * 60_000;
    const { result } = renderHook(() => usePrestart(total));

    // With our test mock, animations complete immediately, so starts at 00:00
    expect(result.current.mmss).toBe('00:00');

    // Fast-forward: our mock gsap calls onComplete immediately on tick flush
    act(() => {
      vi.runAllTimers();
    });

    expect(result.current.sealed).toBe(true);
    // With our test mock, animations complete immediately, so msLeft should be 0
    expect(result.current.msLeft).toBe(0);
    // And mmss should show 00:00
    expect(result.current.mmss).toBe('00:00');
  });

  it('tapReady only records the first press', () => {
    const { result } = renderHook(() => usePrestart());

    expect(result.current.readyAtMs).toBeNull();

    act(() => result.current.tapReady());
    const first = result.current.readyAtMs;

    act(() => result.current.tapReady());
    const second = result.current.readyAtMs;

    expect(first).not.toBeNull();
    expect(second).toBe(first); // idempotent
  });
});

