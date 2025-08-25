import HeroSection from './HeroSection';
import ContentSection from './ContentSection';

export default function ScrollDemoPage() {
  const features = [
    'Structured Creative Sessions',
    'Gamified Progress Tracking',
    'Community-Driven Motivation',
    'Advanced Analytics Dashboard',
    'Audio Integration System',
    'Customizable Workflows'
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section with Parallax */}
      <HeroSection />

      {/* Content Sections with Scroll Animations */}
      <ContentSection
        title="Why Choose Perday Music 365?"
        description="Transform your music production workflow with our comprehensive platform designed specifically for producers who want to create consistently while staying motivated and organized."
        features={features}
        className="bg-gradient-to-b from-black to-synth-violet/10"
      />

      <ContentSection
        title="Advanced Features"
        description="Our platform includes cutting-edge features designed to enhance your creative process and keep you motivated throughout your music production journey."
        features={[
          'Real-time Session Tracking',
          'Villain Notification System',
          'Preparation Phase Timer',
          'Audio Playlist Integration',
          'Progress Visualization',
          'Community Challenges'
        ]}
        className="bg-gradient-to-b from-synth-violet/10 to-black"
      />

      <ContentSection
        title="Success Stories"
        description="Join thousands of producers who have transformed their creative workflow and achieved consistent production goals with our gamification platform."
        features={[
          'Daily Beat Production',
          'Album Completion Goals',
          'Skill Development Tracking',
          'Collaborative Projects',
          'Live Performance Prep',
          'Studio Time Optimization'
        ]}
        className="bg-gradient-to-b from-black to-synth-magenta/10"
      />

      {/* Footer */}
      <footer className="py-16 px-4 bg-gradient-to-t from-synth-violet/20 to-transparent">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Music Production?</h3>
          <p className="text-xl text-cyan-300/80 mb-8 max-w-2xl mx-auto">
            Join the Perday Music 365 community and start building the creative habits that lead to consistent success.
          </p>
          <button className="px-12 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-xl rounded-xl shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105">
            Start Your Free Trial
          </button>
        </div>
      </footer>
    </div>
  );
}
