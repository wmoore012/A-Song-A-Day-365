import { useEffect, useMemo, useRef, forwardRef, useImperativeHandle } from "react";
import { gsap } from "gsap";

type ScribbleXProps = {
  size?: number;          // px
  tiltDeg?: number;       // slight hand slant
  strokeWidth?: number;
  repeatMs?: number;
  underline?: boolean;
  className?: string;
};

export type ScribbleXHandle = {
  redraw: () => void;
};

const ScribbleX = forwardRef<ScribbleXHandle, ScribbleXProps>(function ScribbleX(
  {
    size = 88,
    tiltDeg = -12,
    strokeWidth = 6,
    repeatMs = 5000,
    underline = true,
    className = "",
  },
  ref
) {
  const lineA = useRef<SVGPathElement | null>(null);
  const lineB = useRef<SVGPathElement | null>(null);
  const underlinePath = useRef<SVGPathElement | null>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const container = useRef<HTMLDivElement | null>(null);

  const paths = useMemo(() => {
    // Slightly imperfect paths for hand-written feel
    return {
      a: "M 12 18 C 24 6, 60 20, 76 8",    // up-stroke
      b: "M 14 72 C 30 56, 56 72, 80 58",  // opposite stroke
      u: "M 10 88 C 34 92, 58 86, 82 92",  // underline
    };
  }, []);

  useImperativeHandle(ref, () => ({
    redraw: () => {
      if (!tl.current) return;
      tl.current.restart();
    }
  }));

  useEffect(() => {
    // Skip in test environment
    const isTest = import.meta?.env?.MODE === 'test';
    if (isTest) return;

    const all: SVGPathElement[] = [lineA.current!, lineB.current!].filter(Boolean) as any;
    if (underline && underlinePath.current) all.push(underlinePath.current);

    // prep strokes
    all.forEach((p) => {
      if (p && typeof p.getTotalLength === 'function') {
        const len = p.getTotalLength();
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len, opacity: 1 });
      }
    });

    const timeline = gsap.timeline({ paused: true });
    timeline
      .to(lineA.current, { strokeDashoffset: 0, duration: 0.27, ease: "power2.out" })
      .to(lineB.current, { strokeDashoffset: 0, duration: 0.27, ease: "power2.out" }, "+=0.06");

    if (underline && underlinePath.current) {
      timeline.to(underlinePath.current, { strokeDashoffset: 0, duration: 0.36, ease: "power2.out" }, "+=0.05");
    }

    // tiny wobble to sell the hand vibe
    timeline.to(
      container.current,
      { rotate: tiltDeg + 2, yoyo: true, repeat: 1, duration: 0.15, ease: "power1.inOut" },
      0
    );

    tl.current = timeline;
    timeline.play();

    // interval replay
    const id = setInterval(() => timeline.restart(), repeatMs);
    return () => {
      clearInterval(id);
      timeline.kill();
    };
  }, [tiltDeg, underline, repeatMs]);

  return (
    <div
      ref={container}
      className={className}
      style={{ width: size, height: size, transform: `rotate(${tiltDeg}deg)` }}
    >
      <svg viewBox="0 0 96 96" width={size} height={size}>
        <path ref={lineA} d={paths.a} fill="none" stroke="#ff3355" strokeWidth={strokeWidth} strokeLinecap="round" />
        <path ref={lineB} d={paths.b} fill="none" stroke="#ff3355" strokeWidth={strokeWidth} strokeLinecap="round" />
        {underline && (
          <path ref={underlinePath} d={paths.u} fill="none" stroke="#ff3355" strokeWidth={Math.max(3, strokeWidth - 2)} strokeLinecap="round" />
        )}
      </svg>
    </div>
  );
});

export default ScribbleX;
