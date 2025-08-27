import { Button } from "./ui/button";
import { toast } from "sonner";

import { useAppStore } from "../store/store";
import { useDemoMode } from "../hooks/useDemoMode";
import WaitlistForm from "./WaitlistForm";
import IntentButtons from "./IntentButtons";
import Logo from "./Logo";
import { Clock, Zap, Users, ExternalLink } from "lucide-react";

export default function LandingPage() {
  const { dispatch } = useAppStore();
  const { isDemoMode } = useDemoMode();

  const handleTryDemo = () => {
    // Use the store's enableDemoMode method instead of dispatching
    const { enableDemoMode } = useDemoMode();
    enableDemoMode();
    dispatch({ type: "GO_TO_DASHBOARD" });
  };

  const handleRecruiterTour = () => {
    // TODO: Implement recruiter tour page
    toast.info("Recruiter tour coming soon! For now, try the interactive demo.");
    handleTryDemo();
  };

  return (
    <div className="relative min-h-screen p-8">
      {/* Logo in top left */}
      <div className="absolute top-8 left-8 z-10">
        <Logo />
      </div>
      
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-8 max-w-4xl relative">
          
          {/* Hero Section */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-black leading-tight">
                We Help You Make <span className="underline">1</span> Beat Per Day
              </h1>
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                <span className="text-cyan-300">Stop procrastinating. Start finishing. Start selling.</span>
              </h2>
            </div>

            {/* Scannable Bullets */}
            <ul className="mt-6 text-cyan-100/90 space-y-3 max-w-2xl mx-auto">
              <li className="flex items-center justify-center gap-3">
                <Clock className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                <span><span className="font-semibold text-white">55-minute lock-ins.</span> A simple timer to help you focus.</span>
              </li>
              <li className="flex items-center justify-center gap-3">
                <Zap className="w-5 h-5 text-purple-400 flex-shrink-0" />
                <span><span className="font-semibold text-white">Score goes up.</span> Stay locked and watch your points climb.</span>
              </li>
              <li className="flex items-center justify-center gap-3">
                <Users className="w-5 h-5 text-pink-400 flex-shrink-0" />
                <span><span className="font-semibold text-white">Accountability.</span> Squad talks before and after the time runs out.</span>
              </li>
            </ul>
          </div>

          {/* Primary CTAs */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={handleTryDemo}
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-lg rounded-xl shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105 focus:ring-2 focus:ring-cyan-400"
              >
                🎯 Try Interactive Demo
              </Button>

              <Button
                onClick={handleRecruiterTour}
                variant="outline"
                className="px-6 py-4 border-cyan-400/60 text-cyan-300 hover:bg-cyan-400/20 font-semibold rounded-xl focus:ring-2 focus:ring-cyan-400"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                60-sec Product Tour
              </Button>
            </div>

            {/* Email Capture - Secondary CTA */}
            <WaitlistForm />

            {/* Intent Buttons */}
            <div className="space-y-4">
              <p className="text-sm text-white/60">Or choose your focus:</p>
              <IntentButtons />
            </div>
          </div>

          {/* Demo Mode Indicator */}
          {isDemoMode && (
            <div className="mt-6 p-4 bg-amber-500/20 backdrop-blur-sm border border-amber-400/30 rounded-xl">
              <p className="text-amber-300 font-medium">🎯 Demo Mode Active</p>
              <p className="text-white/70 text-sm">You're seeing the full app experience with sample data</p>
            </div>
          )}

          {/* Footer */}
          <div className="space-y-2">
            <p className="text-sm text-white/40">
              Takes ~2 minutes to set up, then you're ready to produce
            </p>
            <p className="text-xs text-white/30">
              For recruiters: <button 
                onClick={handleRecruiterTour}
                className="text-cyan-400 hover:text-cyan-300 underline"
              >
                View product one-pager →
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
