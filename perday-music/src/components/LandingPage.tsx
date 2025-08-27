import { useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";
import GlassPanel from "./common/GlassPanel";

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  
  // Refs for animation elements
  const containerRef = useRef<HTMLDivElement>(null);
  const producerRef = useRef<HTMLDivElement>(null);
  const remoteRef = useRef<HTMLDivElement>(null);
  const couchRef = useRef<HTMLDivElement>(null);
  const deskRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const emailFormRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    // Initial setup - producer at desk
    gsap.set(producerRef.current, { 
      y: 0, 
      rotation: 0,
      scale: 1 
    });
    gsap.set(remoteRef.current, { 
      y: 0, 
      x: 0,
      rotation: 0 
    });

    // Timeline for the procrastination story
    const tl = gsap.timeline({ 
      delay: 1,
      onComplete: () => setShowEmailForm(true)
    });

    // Producer starts at desk, then slides down
    tl.to(producerRef.current, {
      y: 200,
      duration: 2,
      ease: "power2.inOut"
    })
    // Remote falls and lands in lap
    .to(remoteRef.current, {
      y: 180,
      x: 50,
      rotation: 15,
      duration: 1.5,
      ease: "bounce.out"
    }, "-=1.5")
    // Producer floats like feather to couch
    .to(producerRef.current, {
      y: 300,
      x: 100,
      rotation: -5,
      scale: 0.9,
      duration: 3,
      ease: "power1.out"
    }, "-=1")
    // Transform screen to theme
    .to(containerRef.current, {
      backgroundColor: "rgba(0, 0, 0, 0.95)",
      duration: 1,
      ease: "power2.inOut"
    }, "-=2")
    // Fade in title and tagline
    .fromTo(titleRef.current, {
      opacity: 0,
      y: 50
    }, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power2.out"
    }, "-=1")
    .fromTo(taglineRef.current, {
      opacity: 0,
      y: 30
    }, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power2.out"
    }, "-=0.5");

  }, { scope: containerRef });

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate email capture (replace with actual API call)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success("Welcome to the community! 🎵");
    setIsSubmitting(false);
    setEmail("");
    
    // Here you would typically redirect to the app or show next step
  };

  return (
    <div 
      ref={containerRef}
      className="relative min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black overflow-hidden"
    >
      {/* Animated Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Producer (paper cutout style) */}
        <div 
          ref={producerRef}
          className="absolute top-1/4 left-1/3 w-16 h-24 bg-gradient-to-b from-cyan-400 to-blue-600 rounded-lg opacity-80"
          style={{
            clipPath: "polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)"
          }}
        />
        
        {/* Remote control */}
        <div 
          ref={remoteRef}
          className="absolute top-1/3 left-1/2 w-8 h-4 bg-gray-800 rounded opacity-90"
        />
        
        {/* Couch */}
        <div 
          ref={couchRef}
          className="absolute bottom-1/4 right-1/4 w-32 h-16 bg-gradient-to-r from-brown-400 to-brown-600 rounded-lg opacity-60"
        />
        
        {/* Studio desk */}
        <div 
          ref={deskRef}
          className="absolute top-1/3 left-1/4 w-24 h-4 bg-gradient-to-r from-amber-600 to-amber-800 rounded opacity-70"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-8">
        <div className="text-center max-w-2xl">
          {/* Title */}
          <h1 
            ref={titleRef}
            className="text-6xl md:text-8xl font-black text-white mb-6 opacity-0"
          >
            <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              PERDAY
            </span>
            <br />
            <span className="text-white">MUSIC</span>
          </h1>

          {/* Tagline */}
          <p 
            ref={taglineRef}
            className="text-xl md:text-2xl text-cyan-200 mb-8 opacity-0"
          >
            Stop procrastinating. Start finishing. Start selling.
          </p>

          {/* Email Capture Form */}
          {showEmailForm && (
            <div 
              ref={emailFormRef}
              className="opacity-0 animate-in fade-in duration-1000"
            >
              <GlassPanel className="p-8 max-w-md mx-auto">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Join the Community
                </h2>
                <p className="text-cyan-200 mb-6">
                  Get early access to the producer's consistency engine. 
                  Coming soon.
                </p>
                
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-12 text-center text-lg bg-white/10 border-cyan-400/50 text-white placeholder:text-cyan-200/50"
                    required
                  />
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold text-lg"
                  >
                    {isSubmitting ? "Joining..." : "Get Early Access"}
                  </Button>
                </form>
                
                <div className="mt-6">
                  <Button
                    variant="outline"
                    className="w-full h-10 border-cyan-400/50 text-cyan-300"
                    onClick={() => {
                      // Navigate to learn more or demo
                      toast.info("Demo coming soon!");
                    }}
                  >
                    Learn More
                  </Button>
                </div>
              </GlassPanel>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
