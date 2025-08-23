import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";

/** Drives a silky countdown with GSAP and captures a single "Ready" moment. */
export function usePrestart(totalMs = 7 * 60_000) {
  const [msLeft, setMsLeft] = useState(totalMs);
  const [readyAtMs, setReadyAtMs] = useState<number | null>(null);
  const [sealed, setSealed] = useState(false); // T-0 reached
  const paintT0 = useRef(performance.now());
  const tlRef = useRef<gsap.core.Tween | null>(null);

  // start ticking immediately (psyche-up)
  useEffect(() => {
    const obj = { v: totalMs };
    tlRef.current?.kill();
    tlRef.current = gsap.to(obj, {
      v: 0,
      duration: totalMs / 1000,
      ease: "none",
      onUpdate: () => setMsLeft(obj.v),
      onComplete: () => setSealed(true),
    });
    return () => {
      tlRef.current?.kill();
    };
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
