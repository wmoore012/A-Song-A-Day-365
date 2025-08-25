import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";

// Fail loud: validate preconditions
function must<T>(value: T | null | undefined, msg: string): T {
  if (value == null) throw new Error(msg);
  return value;
}

/** Drives a silky countdown with GSAP and captures a single "Ready" moment. */
export function usePrestart(totalMs = 7 * 60_000) {
  // Validate input
  if (totalMs <= 0) {
    throw new Error(`Invalid totalMs: ${totalMs}. Must be > 0.`);
  }

  const [msLeft, setMsLeft] = useState(totalMs);
  const [readyAtMs, setReadyAtMs] = useState<number | null>(null);
  const [sealed, setSealed] = useState(false); // T-0 reached
  const paintT0 = useRef(performance.now());
  const tlRef = useRef<gsap.core.Tween | null>(null);

  // start ticking immediately (psyche-up)
  useEffect(() => {
    const obj = { v: totalMs };
    tlRef.current?.kill();
    
    // Respect reduced motion
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      // Skip animation, just count down
      const interval = setInterval(() => {
        obj.v = Math.max(0, obj.v - 100);
        setMsLeft(obj.v);
        if (obj.v <= 0) {
          setSealed(true);
          clearInterval(interval);
        }
      }, 100);
      return () => clearInterval(interval);
    }

    tlRef.current = gsap.to(obj, {
      v: 0,
      duration: totalMs / 1000,
      ease: "none",
      onUpdate: () => setMsLeft(obj.v),
      onComplete: () => setSealed(true),
    });
    return () => tlRef.current?.kill();
  }, [totalMs]);

  const tapReady = () => {
    if (readyAtMs != null) return;
    // how long from first paint did it take to press Ready?
    const elapsed = performance.now() - paintT0.current;
    setReadyAtMs(elapsed);
  };

  const mmss = useMemo(() => {
    const s = Math.max(0, Math.ceil(msLeft / 1000));
    return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  }, [msLeft]);

  return { msLeft, mmss, readyAtMs, sealed, tapReady };
}
