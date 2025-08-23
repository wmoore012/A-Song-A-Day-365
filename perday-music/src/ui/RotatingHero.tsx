import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export default function RotatingHero({ items, intervalMs = 3600 }: { items: string[]; intervalMs?: number }) {
  const [i, setI] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = setInterval(() => {
      if (!ref.current) return;
      gsap.to(ref.current, { 
        opacity: 0, 
        y: -6, 
        duration: .18, 
        ease: "power1.in", 
        onComplete: () => {
          setI(v => (v + 1) % items.length);
          gsap.fromTo(ref.current!, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: .24, ease: "power2.out" });
        }
      });
    }, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs, items.length]);

  return <div ref={ref} className="text-sm opacity-80">{items[i]}</div>;
}
