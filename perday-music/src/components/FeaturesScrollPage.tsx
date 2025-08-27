import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export default function FeaturesScrollPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string>("one");

  useGSAP(() => {
    if (!rootRef.current || import.meta.env.VITEST) return;

    // nav highlighting + smooth scroll
    const links = gsap.utils.toArray<HTMLAnchorElement>("nav a");
    links.forEach((a) => {
      const target = document.querySelector(a.getAttribute("href")!) as Element;
      if (!target) return;

      ScrollTrigger.create({
        trigger: target,
        start: "top center",
        end: "bottom center",
        onToggle: (self) => self.isActive && setActive(a.hash.replace("#", "")),
      });

      a.addEventListener("click", (e) => {
        e.preventDefault();
        gsap.to(window, {
          duration: 1,
          scrollTo: { y: target, offsetY: 80 },
          ease: "power2.inOut",
          overwrite: "auto",
        });
      });
    });

    // RED panel line
    gsap.from(".line-1", {
      scrollTrigger: {
        trigger: ".line-1",
        scrub: true,
        start: "top bottom",
        end: "top top",
      },
      scaleX: 0,
      transformOrigin: "left center",
      ease: "none",
    });

    // ORANGE panel pinned line
    gsap.from(".line-2", {
      scrollTrigger: {
        trigger: ".orange",
        scrub: true,
        pin: true,
        start: "top top",
        end: "+=100%",
      },
      scaleX: 0,
      transformOrigin: "left center",
      ease: "none",
    });

    // GREEN panel pinned timeline (line + flair spin)
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".green",
        scrub: true,
        pin: true,
        start: "top top",
        end: "+=100%",
      },
    });
    tl.from(".line-3", { scaleX: 0, transformOrigin: "left center", ease: "none" }, 0)
      .to(".flair-3", { rotation: 360 }, 0);

    // Night → dusk background shift (via CSS variables)
    gsap.to(":root", {
      scrollTrigger: { trigger: "#two", start: "top bottom", end: "bottom top", scrub: true },
      onUpdate: (self) => {
        const t = self.progress; // 0..1
        document.documentElement.style.setProperty("--skyA", `${Math.round(12 + t * 30)}%`);
        document.documentElement.style.setProperty("--skyB", `${Math.round(6 + t * 65)}%`);
      },
    });
  }, { scope: rootRef });

  return (
    <div ref={rootRef} className="relative bg-black text-white">
      {/* Top Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-black/40 backdrop-blur border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-3 flex gap-6">
          {["one","two","three","four","five"].map(id => (
            <a
              key={id}
              href={`#${id}`}
              className={`text-sm font-medium transition-colors ${active===id ? "text-cyan-400" : "text-white/60 hover:text-white"}`}
              data-nav={id}
            >
              {id}
            </a>
          ))}
        </div>
      </nav>

      {/* Panels */}
      <section id="one" className="min-h-screen flex items-center justify-center pt-24">
        <div className="max-w-3xl text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-black">Navigation links with smooth scrolling</h1>
          <p className="text-cyan-300/80">
            ScrollTrigger stays synced while you jump around the page.
          </p>
          <div className="text-white/60">Scroll down ↓</div>
        </div>
      </section>

      <section id="two" className="panel red min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-black/30 to-black/60">
        <div className="line-cont w-4/5 max-w-[60ch] p-2 rounded-xl bg-white/5 border border-white/10">
          <span className="line line-1 block h-2 bg-amber-400 rounded"></span>
        </div>
      </section>

      <section id="three" className="panel orange min-h-screen flex items-center justify-center">
        <div className="line-cont w-4/5 max-w-[60ch] p-2 rounded-xl bg-white/5 border border-white/10">
          <span className="line line-2 block h-2 bg-cyan-300 rounded"></span>
        </div>
        <p className="sr-only">Pinned; scrubbed 100% viewport.</p>
      </section>

      <section id="four" className="panel green min-h-screen flex flex-col items-center justify-center gap-6">
        <div className="line-cont w-4/5 max-w-[60ch] p-2 rounded-xl bg-white/5 border border-white/10">
          <span className="line line-3 block h-2 bg-pink-300 rounded"></span>
        </div>
        <div className="flair-3 w-20 h-20 rounded-full border border-white/20 backdrop-blur-xl bg-white/5"></div>
      </section>

      <section id="five" className="panel min-h-screen flex items-center justify-center">
        <div className="text-4xl md:text-6xl font-black">DONE!</div>
      </section>
    </div>
  );
}
