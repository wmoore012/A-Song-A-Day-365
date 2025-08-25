import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";

/** Drives a silky countdown with GSAP and captures a single "Ready" moment. */
export function usePrestart(totalMs = 7 * 60_000) {
  console.log('usePrestart called with totalMs:', totalMs);
  const [msLeft, setMsLeft] = useState(totalMs);
  const [readyAtMs, setReadyAtMs] = useState<number | null>(null);
  const [sealed, setSealed] = useState(false); // T-0 reached
  const paintT0 = useRef(0);
  const tlRef = useRef<gsap.core.Tween | null>(null);

  // mark first paint at mount (avoids SSR hazards)
  useEffect(() => {
    paintT0.current = performance.now();
  }, []);

  // start ticking immediately (psyche-up)
  useEffect(() => {
    console.log('useEffect in usePrestart running, totalMs:', totalMs);
    const obj = { v: totalMs };
    console.log('Created obj:', obj);
    tlRef.current?.kill();
    console.log('About to call gsap.to with obj:', obj);
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
    setReadyAtMs(Math.max(0, performance.now() - paintT0.current));
  };

  const mmss = useMemo(() => {
    const s = Math.max(0, Math.ceil(msLeft / 1000));
    return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  }, [msLeft]);

  return { msLeft, mmss, readyAtMs, sealed, tapReady };
}
