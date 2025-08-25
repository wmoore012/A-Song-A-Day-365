import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const features = [
  {
    id: 1,
    title: "Structured Creative Sessions",
    description: "Transform your creative workflow with timed, focused sessions that keep you in the zone. No more endless scrolling or getting lost in the sauce.",
    icon: "🎯",
    color: "from-cyan-400 to-blue-500"
  },
  {
    id: 2,
    title: "Gamified Progress Tracking", 
    description: "Level up your music production with points, streaks, and achievements. Watch your skills grow as you build consistent habits.",
    icon: "🏆",
    color: "from-purple-400 to-pink-500"
  },
  {
    id: 3,
    title: "Community-Driven Motivation",
    description: "Connect with fellow producers, share your progress, and compete on genre-specific challenges. Because every beat doesn't take the same time to make!",
    icon: "🔥",
    color: "from-orange-400 to-red-500"
  },
  {
    id: 4,
    title: "Advanced Analytics Dashboard",
    description: "Deep insights into your creative patterns, productivity peaks, and areas for growth. Data-driven decisions for your music career.",
    icon: "📊",
    color: "from-green-400 to-emerald-500"
  },
  {
    id: 5,
    title: "Audio Integration System",
    description: "Seamless background music and audio feedback that adapts to your workflow. Curated playlists to keep you inspired and focused.",
    icon: "🎵",
    color: "from-indigo-400 to-purple-500"
  },
  {
    id: 6,
    title: "Customizable Workflows",
    description: "Build the perfect creative environment for your style. From trap to techno, customize everything to match your vibe.",
    icon: "⚙️",
    color: "from-yellow-400 to-orange-500"
  }
];

export default function FeaturesShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentFeature, setCurrentFeature] = useState(0);


  useGSAP(() => {
    if (!containerRef.current) return;

    const prefersReduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (import.meta?.env?.MODE === 'test' || prefersReduce) return;

    const ctx = gsap.context(() => {
      // Initial animation
      gsap.fromTo(containerRef.current, 
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }
      );

      // Feature cards animation
      const cards = containerRef.current?.querySelectorAll('.feature-card') || [];
      gsap.fromTo(cards,
        { opacity: 0, y: 100, scale: 0.9 },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1, 
          duration: 0.8, 
          stagger: 0.1, 
          ease: 'back.out(1.7)',
          delay: 0.3
        }
      );

      // Progress bar animation
      const progressBar = containerRef.current?.querySelector('.progress-bar');
      if (progressBar) {
        gsap.fromTo(progressBar,
          { width: '0%' },
          { width: '100%', duration: 2, ease: 'power2.out', delay: 0.5 }
        );
      }

    }, containerRef);

    return () => ctx.revert();
  }, []);

  const nextFeature = () => {
    setCurrentFeature((prev) => (prev + 1) % features.length);
  };

  const prevFeature = () => {
    setCurrentFeature((prev) => (prev - 1 + features.length) % features.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextFeature();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const currentFeatureData = features[currentFeature];

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-8">
      <div ref={containerRef} className="max-w-6xl w-full">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-6">
            Built for Producers, by Producers
          </h1>
          <p className="text-xl text-cyan-300/80 max-w-3xl mx-auto">
            This isn't another corporate productivity app. It's a community-driven platform 
            built by music producers who understand the creative struggle.
          </p>
        </div>

        {/* Main Feature Display */}
        <div className="relative mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Feature Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="text-6xl mb-4">{currentFeatureData.icon}</div>
                <h2 className="text-4xl md:text-5xl font-bold text-white">
                  {currentFeatureData.title}
                </h2>
                <p className="text-lg text-white/70 leading-relaxed">
                  {currentFeatureData.description}
                </p>
              </div>

              {/* Navigation */}
              <div className="flex items-center gap-4">
                <button
                  onClick={prevFeature}
                  className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  ←
                </button>
                <div className="flex gap-2">
                  {features.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentFeature(index)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        index === currentFeature 
                          ? 'bg-cyan-400 scale-125' 
                          : 'bg-white/30 hover:bg-white/50'
                      }`}
                    />
                  ))}
                </div>
                <button
                  onClick={nextFeature}
                  className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  →
                </button>
              </div>
            </div>

            {/* Visual Element */}
            <div className="relative">
              <div className={`w-full h-96 rounded-2xl bg-gradient-to-br ${currentFeatureData.color} p-8 flex items-center justify-center`}>
                <div className="text-8xl">{currentFeatureData.icon}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-white/10 rounded-full h-1 mb-8">
          <div 
            className="progress-bar h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full transition-all duration-500"
            style={{ width: `${((currentFeature + 1) / features.length) * 100}%` }}
          />
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className={`feature-card p-6 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                index === currentFeature
                  ? 'border-cyan-400 bg-cyan-400/10 scale-105'
                  : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10'
              }`}
              onClick={() => setCurrentFeature(index)}
            >
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-white/60 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 space-y-6">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white">
              Ready to Level Up Your Production?
            </h3>
            <p className="text-white/70">
              Join 80 beta users and be part of the producer revolution
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-lg rounded-xl shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105">
              Join Beta Waitlist
            </button>
            <button className="px-6 py-3 border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black font-semibold rounded-lg transition-all duration-300">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
