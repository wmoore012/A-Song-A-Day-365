import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";

/**
 * Drives a silky countdown with GSAP and captures a single "Ready" moment.
 * - Skips heavy animation in SSR / test / reduced-motion
 * - Cleans up tween on unmount or totalMs change
 */
export function usePrestart(totalMs = 7 * 60_000) {
  const [msLeft, setMsLeft] = useState(totalMs);
  const [readyAtMs, setReadyAtMs] = useState<number | null>(null);
  const [sealed, setSealed] = useState(false); // T-0 reached
  const paintT0 = useRef(0);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  // mark first paint at mount (avoids SSR hazards)
  useEffect(() => {
    if (typeof performance !== 'undefined') {
      paintT0.current = performance.now();
    }
  }, []);

  // start ticking immediately (psyche-up)
  useEffect(() => {
    const isSSR = typeof window === 'undefined';
    const isTest = (import.meta as any)?.env?.MODE === 'test';
    const reduceMotion = !isSSR && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    // Kill any previous tween
    tweenRef.current?.kill();
    tweenRef.current = null;

    // No-animation path
    if (isSSR || isTest || reduceMotion || totalMs <= 0) {
      setMsLeft(0);
      setSealed(true);
      return;
    }

    const obj = { v: totalMs };
    setMsLeft(totalMs);
    setSealed(false);

    tweenRef.current = gsap.to(obj, {
      v: 0,
      duration: totalMs / 1000,
      ease: "none",
      onUpdate: () => setMsLeft(Math.max(0, obj.v)),
      onComplete: () => setSealed(true),
    });

    return () => {
      tweenRef.current?.kill();
      tweenRef.current = null;
    };
  }, [totalMs]);

  const tapReady = () => {
    if (readyAtMs != null) return;
    const now = typeof performance !== 'undefined' ? performance.now() : 0;
    setReadyAtMs(Math.max(0, now - paintT0.current));
  };

  const mmss = useMemo(() => {
    const s = Math.max(0, Math.ceil(msLeft / 1000));
    const mm = String(Math.floor(s / 60)).padStart(2, "0");
    const ss = String(s % 60).padStart(2, "0");
    return `${mm}:${ss}`;
  }, [msLeft]);

  return { msLeft, mmss, readyAtMs, sealed, tapReady };
}
