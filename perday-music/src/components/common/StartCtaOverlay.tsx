import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export function StartCtaOverlay({ visible, onClick }: { visible: boolean; onClick: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const hourRef = useRef<SVGSVGElement>(null);
  const [mounted, setMounted] = useState(false);

  useGSAP(() => {
    if (!visible) return;
    setMounted(true);
    if (!rootRef.current) return;
    gsap.fromTo(rootRef.current, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: .3, ease: "power2.out" });
    if (hourRef.current) gsap.to(hourRef.current, { rotate: 6, yoyo: true, repeat: -1, duration: .6, ease: "power1.inOut", transformOrigin: "50% 60%" });
  }, [visible]);

  // sand dissolve when hiding
  useEffect(() => {
    if (!mounted || visible || !textRef.current) return;
    const el = textRef.current;
    const chars = Array.from(el.textContent || "");
    el.textContent = "";
    chars.forEach((ch) => { const s = document.createElement("span"); s.textContent = ch; el.appendChild(s); });
    gsap.to(el.querySelectorAll("span"), {
      opacity: 0, y: -8, duration: .38, ease: "power1.in",
      stagger: { each: .013, from: "random" },
      onComplete: () => setMounted(false)
    });
  }, [visible, mounted]);

  if (!visible || !mounted) return null;

  return (
    <div ref={rootRef}
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-2xl bg-black/60 backdrop-blur px-4 py-3 ring-1 ring-white/15 shadow-lg">
      <svg ref={hourRef} width="28" height="28" viewBox="0 0 24 24" aria-hidden className="opacity-90">
        <path fill="#f5f5f7" d="M6 2h12v2l-3.5 4 3.5 4v2H6v-2l3.5-4L6 4V2zm2 18h8v2H8v-2z"/>
      </svg>
      <div ref={textRef} className="font-extrabold tracking-wide">Hey! This is cool but…</div>
      <button onClick={onClick} className="px-3 py-2 rounded-xl bg-[#7c5cff] hover:bg-[#8e77ff] text-sm font-black">
        Let's Start Your Cookup!
      </button>
    </div>
  );
}
