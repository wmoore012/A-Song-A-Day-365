import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useGSAP } from "@gsap/react";
import GlassPanel from "./common/GlassPanel";
import { Button } from "./ui/button";
import { Music, Zap, Users, Target, Clock, Trophy } from "lucide-react";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

interface FeatureCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const features: FeatureCard[] = [
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

export default function FeaturesPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const [activeSection, setActiveSection] = useState("hero");
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  // Navigation setup
  useGSAP(() => {
    if (!containerRef.current || import.meta.env.VITEST) return;

    // Create navigation links
    const sections = gsap.utils.toArray('[data-section]');
    const navLinks = gsap.utils.toArray('[data-nav]');

    sections.forEach((section, i) => {
      const link = navLinks[i] as HTMLElement;
      if (!link) return;

      ScrollTrigger.create({
        trigger: section as Element,
        start: "top center",
        end: "bottom center",
        onToggle: (self) => {
          if (self.isActive) {
            setActiveSection(link.getAttribute('data-nav') || '');
          }
        }
      });

      // Smooth scroll on nav click
      link.addEventListener('click', (e: Event) => {
        e.preventDefault();
        gsap.to(window, {
          duration: 1,
          scrollTo: { y: section as Element, offsetY: 80 },
          ease: "power2.inOut"
        });
      });
    });
  }, { scope: containerRef });

  // Hero section animation
  useGSAP(() => {
    if (!containerRef.current || import.meta.env.VITEST) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#hero",
        start: "top top",
        end: "bottom top",
        scrub: 1
      }
    });

    tl.fromTo("#hero-title", 
      { y: 0, opacity: 1 },
      { y: -100, opacity: 0 }
    ).fromTo("#hero-subtitle",
      { y: 0, opacity: 1 },
      { y: -50, opacity: 0 }
    );
  }, { scope: containerRef });

  // Sticky statements animation
  useGSAP(() => {
    if (!containerRef.current || import.meta.env.VITEST) return;

    const statements = gsap.utils.toArray('.sticky-statement');
    
    statements.forEach((el) => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el as Element,
          start: 'bottom 70%',
          end: 'bottom center',
          scrub: 1
        }
      });
      
      tl.to(el as Element, { opacity: 0, yPercent: -10 });
    });
  }, { scope: containerRef });

  // Card gallery animation
  useGSAP(() => {
    if (!containerRef.current || import.meta.env.VITEST) return;

    const cards = gsap.utils.toArray('.feature-card');
    
    cards.forEach((card, i) => {
      gsap.fromTo(card as Element,
        { 
          scale: 0, 
          opacity: 0, 
          y: 100,
          rotationY: 45
        },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          rotationY: 0,
          duration: 0.8,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: card as Element,
            start: "top 80%",
            end: "top 20%",
            toggleActions: "play none reverse none"
          },
          delay: i * 0.1
        }
      );
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative min-h-screen bg-black">
      {/* Navigation */}
      <nav ref={navRef} className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-white">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                PERDAY
              </span>
              <span className="text-white"> MUSIC</span>
            </div>
            
            <div className="flex items-center space-x-8">
              {['hero', 'features', 'gallery', 'statements'].map((section) => (
                <button
                  key={section}
                  data-nav={section}
                  onClick={() => {
                    const element = document.getElementById(section);
                    if (element) {
                      gsap.to(window, {
                        duration: 1,
                        scrollTo: { y: element, offsetY: 80 },
                        ease: "power2.inOut"
                      });
                    }
                  }}
                  className={`text-sm font-medium transition-colors ${
                    activeSection === section 
                      ? 'text-cyan-400' 
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" data-section="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20" />
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <h1 id="hero-title" className="text-6xl md:text-8xl font-black text-white mb-6">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              PERDAY
            </span>
            <br />
            <span className="text-white">MUSIC</span>
          </h1>
          <p id="hero-subtitle" className="text-xl md:text-2xl text-cyan-200 mb-8 max-w-3xl mx-auto">
            The ultimate productivity gamification platform for music producers. 
            Transform your creative workflow with structured sessions, gamified progress tracking, 
            and a community-driven approach to consistent music production.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold text-lg px-8 py-4"
              onClick={() => {
                const element = document.getElementById('features');
                if (element) {
                  gsap.to(window, {
                    duration: 1,
                    scrollTo: { y: element, offsetY: 80 },
                    ease: "power2.inOut"
                  });
                }
              }}
            >
              Start Your Journey
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-cyan-400/50 text-cyan-300 font-semibold text-lg px-8 py-4"
              onClick={() => {
                const element = document.getElementById('gallery');
                if (element) {
                  gsap.to(window, {
                    duration: 1,
                    scrollTo: { y: element, offsetY: 80 },
                    ease: "power2.inOut"
                  });
                }
              }}
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Sticky Statements */}
      <section className="relative bg-gradient-to-b from-purple-900 via-blue-900 to-cyan-900">
        <div className="sticky-statement min-h-screen flex items-center justify-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white text-center max-w-4xl mx-auto px-6">
            Stop procrastinating. Start finishing. Start selling.
          </h1>
        </div>
        <div className="sticky-statement min-h-screen flex items-center justify-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white text-center max-w-4xl mx-auto px-6">
            Transform your studio time into a game.
          </h1>
        </div>
        <div className="sticky-statement min-h-screen flex items-center justify-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white text-center max-w-4xl mx-auto px-6">
            Join the community of consistent producers.
          </h1>
        </div>
      </section>

      {/* Features Gallery */}
      <section id="gallery" data-section="gallery" className="min-h-screen bg-black py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Everything You Need
            </h2>
            <p className="text-xl text-cyan-200 max-w-3xl mx-auto">
              Discover the features that will revolutionize your music production workflow
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <GlassPanel
                key={feature.id}
                className={`feature-card cursor-pointer transition-all duration-300 hover:scale-105 ${
                  selectedCard === feature.id ? 'ring-2 ring-cyan-400' : ''
                }`}
                onClick={() => setSelectedCard(selectedCard === feature.id ? null : feature.id)}
              >
                <div className="p-8 text-center">
                  <div className={`w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center text-white`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-cyan-200 leading-relaxed">{feature.description}</p>
                </div>
              </GlassPanel>
            ))}
          </div>
        </div>
      </section>

      {/* Features Detail Section */}
      <section id="features" data-section="features" className="min-h-screen bg-gradient-to-br from-black via-purple-900/20 to-blue-900/20 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              How It Works
            </h2>
            <p className="text-xl text-cyan-200 max-w-3xl mx-auto">
              Simple, powerful, and designed specifically for music producers
            </p>
          </div>
          
          <div className="space-y-32">
            {/* Feature 1 */}
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1">
                <GlassPanel className="p-8">
                  <h3 className="text-3xl font-bold text-white mb-6">Daily Consistency Engine</h3>
                  <p className="text-cyan-200 text-lg leading-relaxed mb-6">
                    Set your daily goal and let our system guide you through focused, timeboxed sessions. 
                    Track your progress with visual feedback and celebrate every win.
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-white font-medium">25-minute focus blocks</span>
                  </div>
                </GlassPanel>
              </div>
              <div className="flex-1">
                <div className="w-full h-64 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-2xl border border-white/10"></div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
              <div className="flex-1">
                <GlassPanel className="p-8">
                  <h3 className="text-3xl font-bold text-white mb-6">Live Multipliers & Scoring</h3>
                  <p className="text-cyan-200 text-lg leading-relaxed mb-6">
                    Watch your score multiply in real-time as you maintain focus. 
                    Earn bonus points for consistency and unlock achievements.
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                    <span className="text-white font-medium">Real-time scoring system</span>
                  </div>
                </GlassPanel>
              </div>
              <div className="flex-1">
                <div className="w-full h-64 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl border border-white/10"></div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1">
                <GlassPanel className="p-8">
                  <h3 className="text-3xl font-bold text-white mb-6">Producer Community</h3>
                  <p className="text-cyan-200 text-lg leading-relaxed mb-6">
                    Connect with like-minded producers who understand the struggle. 
                    Share wins, get feedback, and stay accountable together.
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-white font-medium">Real accountability partners</span>
                  </div>
                </GlassPanel>
              </div>
              <div className="flex-1">
                <div className="w-full h-64 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl border border-white/10"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
