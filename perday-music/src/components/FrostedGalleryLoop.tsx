import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import GlassPanel from "./common/GlassPanel";
import { Music, Zap, Users, Target, Clock, Trophy } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

interface FeatureCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const demoFeatures: FeatureCard[] = [
  {
    id: "daily-consistency",
    title: "Daily Consistency Engine",
    description: "Transform your studio time into a game with timeboxed sessions, live multipliers, and streak tracking.",
    icon: <Target className="w-8 h-8" />,
    color: "from-cyan-500 to-blue-600"
  },
  {
    id: "live-multipliers",
    title: "Live Multipliers",
    description: "Real-time scoring that rewards focus and effort. Stack points, earn heat, build streaks.",
    icon: <Zap className="w-8 h-8" />,
    color: "from-purple-500 to-pink-600"
  },
  {
    id: "community-squad",
    title: "Producer Squad",
    description: "A community that only talks when you're on break or after you stack. Real accountability.",
    icon: <Users className="w-8 h-8" />,
    color: "from-green-500 to-emerald-600"
  },
  {
    id: "timeboxed-sessions",
    title: "Timeboxed Sessions",
    description: "Structured 25-minute focus blocks with built-in breaks. No more endless scrolling.",
    icon: <Clock className="w-8 h-8" />,
    color: "from-orange-500 to-red-600"
  },
  {
    id: "progress-tracking",
    title: "Progress Tracking",
    description: "Visual analytics showing your consistency, productivity trends, and growth over time.",
    icon: <Trophy className="w-8 h-8" />,
    color: "from-yellow-500 to-amber-600"
  },
  {
    id: "music-focus",
    title: "Music-First Design",
    description: "Built specifically for producers. Background music, audio feedback, and studio vibes.",
    icon: <Music className="w-8 h-8" />,
    color: "from-indigo-500 to-purple-600"
  }
];

export default function FrostedGalleryLoop() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!root.current || import.meta.env.VITEST) return;

    const items = gsap.utils.toArray<HTMLElement>(".pg-card");
    // initial state
    gsap.set(items, { xPercent: 400, opacity: 0, scale: 0.9 });

    // build "seamless loop" timeline (inspired by GreenSock's technique)
    const spacing = 0.12; // stagger spacing
    const raw = gsap.timeline({ paused: true });
    items.concat(items).concat(items).forEach((item, i) => {
      const tl = gsap.timeline();
      tl.fromTo(item, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35, yoyo: true, repeat: 1, ease: "power1.in", immediateRender: false })
        .fromTo(item, { xPercent: 400 }, { xPercent: -400, duration: 1, ease: "none", immediateRender: false }, 0);
      raw.add(tl, i * spacing);
    });

    const cycle = spacing * items.length;
    const loop = gsap.timeline({ paused: true, repeat: -1 })
      .fromTo(raw, { time: cycle / 2 }, { time: "+=" + cycle, duration: cycle, ease: "none" });

    // scroll drives playhead
    const playhead = { v: 0 };
    const scrub = gsap.to(playhead, {
      v: 0,
      duration: 0.4,
      ease: "power3",
      paused: true,
                    onUpdate: () => {
                loop.time(gsap.utils.wrap(0, loop.duration(), playhead.v));
              },
    });

    const st = ScrollTrigger.create({
      trigger: root.current,
      pin: true,
      start: "top top",
      end: "+=2500",
      scrub: false,
      onUpdate: (self) => {
        const offset = (self.progress + Math.floor(self.progress)) * loop.duration();
        scrub.vars.v = offset;
        scrub.invalidate().restart();
      },
    });

    // click-to-zoom
    items.forEach((el) => {
      el.addEventListener("click", () => {
        const isOpen = el.classList.toggle("pg-open");
        if (isOpen) {
          gsap.to(el, { scale: 1.1, boxShadow: "0 20px 80px rgba(0,255,255,0.15)", duration: 0.25 });
        } else {
          gsap.to(el, { scale: 1, boxShadow: "0 0 0 rgba(0,0,0,0)", duration: 0.2 });
        }
      });
    });

    return () => {
      st.kill();
      loop.kill();
    };
  }, { scope: root });

  return (
    <div ref={root} className="relative h-screen overflow-hidden bg-black">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Everything You Need
          </h2>
          <p className="text-xl text-cyan-200 max-w-3xl mx-auto">
            Discover the features that will revolutionize your music production workflow
          </p>
        </div>
      </div>
      
      <ul className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-96">
        {demoFeatures.map((feature) => (
          <li
            key={feature.id}
            className="pg-card absolute inset-0 cursor-pointer transition-all duration-300"
            role="button"
            aria-label={feature.title}
          >
            <GlassPanel className="h-full p-6 hover:scale-105 transition-transform duration-300">
              <div className="text-center h-full flex flex-col justify-center">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center text-white`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-cyan-200 text-sm leading-relaxed">{feature.description}</p>
              </div>
            </GlassPanel>
          </li>
        ))}
      </ul>
    </div>
  );
}
