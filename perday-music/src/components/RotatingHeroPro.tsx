import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { Observer } from "gsap/Observer";
import { useGSAP } from "@gsap/react";
import ScribbleX from "./ScribbleX";

gsap.registerPlugin(Observer);

type RotatingHeroProProps = {
  items: string[];        // use [[X]] where you want the scribble
  intervalMs?: number;    // autoplay interval
  className?: string;
};

export default function RotatingHeroPro({
  items,
  intervalMs = 3800,
  className = "",
}: RotatingHeroProProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const obsRef = useRef<Observer | null>(null);
  const timerRef = useRef<number | null>(null);
  const [i, setI] = useState(0);
  
  // Motion guards following standards
  const reduced = typeof window !== "undefined" &&
                  window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  const inTest = import.meta.env.VITEST;

  const show = (idx: number, dir: 1 | -1) => {
    if (!textRef.current || reduced || inTest) return;
    const el = textRef.current;
    const tl = gsap.timeline({ defaults: { duration: 0.22, ease: "power2.out" } });
    tl.to(el, { y: dir * -8, opacity: 0 })
      .set(el, { y: dir * 8 })
      .to(el, { y: 0, opacity: 1 });
    setI(idx);
  };

  const step = (delta: number) => {
    const dir: 1 | -1 = delta > 0 ? 1 : -1;
    const next = (i + dir + items.length) % items.length;
    show(next, dir);
  };

  const startAutoplay = () => {
    if (reduced || inTest) return;
    stopAutoplay();
    timerRef.current = window.setInterval(() => step(1), intervalMs);
  };
  
  const stopAutoplay = () => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = null;
  };

  useEffect(() => {
    startAutoplay();
    return stopAutoplay;
  }, [intervalMs, items.length, reduced, inTest]);

  useGSAP(() => {
    const box = boxRef.current;
    if (!box || reduced || inTest) return;

    const create = () => {
      obsRef.current?.kill();
      obsRef.current = Observer.create({
        target: box,
        type: "wheel,touch,pointer",
        onChange: (self) => {
          // sum deltas and use a small threshold to step by 1 item
          const d = Math.abs(self.deltaY) > Math.abs(self.deltaX) ? self.deltaY : self.deltaX;
          if (Math.abs(d) > 6) {
            step(d);
          }
        },
        onDrag: (self) => {
          if (Math.abs(self.deltaX) > 8) step(self.deltaX);
        },
        wheelSpeed: 1,
        tolerance: 4,
        preventDefault: true,
        onEnable: () => box.classList.add("cursor-grab"),
        onDisable: () => box.classList.remove("cursor-grab"),
      });
    };

    // create on hover; destroy on leave (so page scroll is normal when not hovered)
    const onEnter = () => {
      stopAutoplay();
      create();
    };
    const onLeave = () => {
      obsRef.current?.kill();
      obsRef.current = null;
      startAutoplay();
    };

    box.addEventListener("mouseenter", onEnter);
    box.addEventListener("mouseleave", onLeave);
    return () => {
      box.removeEventListener("mouseenter", onEnter);
      box.removeEventListener("mouseleave", onLeave);
      obsRef.current?.kill();
    };
  }, { scope: boxRef, dependencies: [items.length, intervalMs, reduced, inTest] });

  const renderPhrase = (s: string) => {
    const parts = s.split("[[X]]");
    return (
      <>
        {parts.map((p, idx) => (
          <span key={idx} className="align-baseline">
            {p}
            {idx < parts.length - 1 ? (
              <ScribbleX width={42} stroke={7} className="text-red-500 inline-block" />
            ) : null}
          </span>
        ))}
      </>
    );
  };

  const current = useMemo(() => items[i] ?? "", [i, items]);

  return (
    <div
      ref={boxRef}
      className={`select-none ${className}`}
      aria-live="polite"
      role="region"
      aria-label="Rotating creative goals"
    >
      <div ref={textRef} className="text-sm opacity-80">
        {renderPhrase(current)}
      </div>
    </div>
  );
}
