import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";
import GlassPanel from "./common/GlassPanel";
import ScribbleX from "./ScribbleX";
import { useAppStore } from "../store/store";
import { useDemoMode } from "../hooks/useDemoMode";

export default function LandingPage() {
  const { dispatch } = useAppStore();
  const { isDemoMode } = useDemoMode();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);




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
    <div className="flex items-center justify-center min-h-screen p-8">
      <div className="text-center space-y-8 max-w-2xl relative">
      <div className="space-y-6">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-black leading-tight">
            Get locked in. Make <span className="text-synth-amber"><ScribbleX /></span> beats a day.
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            PERDAY<br />MUSIC<br />
            <span className="text-cyan-300">Stop procrastinating. Start finishing. Start selling.</span>
          </h2>
        </div>
        <p className="text-xl text-cyan-300/80 max-w-3xl mx-auto">
          Perday Music 365 turns your studio time into a game: timeboxed cookups, live multipliers, and a squad that only talks when you're on a break (or after you stack). Points for focus. Heat for effort. Streaks for consistency.
        </p>
        <p className="text-lg text-white/60 max-w-2xl mx-auto">
          Cook up. Level up. Every day.
        </p>
      </div>

      <div className="space-y-6">
        {/* Email Collection Form */}
        <GlassPanel className="p-6 max-w-md mx-auto">
          <h2 className="text-xl font-bold text-white mb-4">
            Join the Community
          </h2>
          <p className="text-cyan-200 mb-4 text-sm">
            Get early access to the producer's consistency engine.
          </p>
          
          <form onSubmit={handleEmailSubmit} className="space-y-3">
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-10 text-center bg-white/10 border-cyan-400/50 text-white placeholder:text-cyan-200/50"
              required
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-10 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold"
            >
              {isSubmitting ? "Joining..." : "Get Early Access"}
            </Button>
          </form>
        </GlassPanel>
        
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => dispatch({ type: "START_QUESTIONNAIRE" })}
            className="px-6 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold rounded-xl shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105"
          >
            Write X Songs Per Day
          </button>
          <button
            onClick={() => dispatch({ type: "START_QUESTIONNAIRE" })}
            className="px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 text-white font-bold rounded-xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
          >
            Produce X Songs Per Day
          </button>
          <button
            onClick={() => dispatch({ type: "START_QUESTIONNAIRE" })}
            className="px-6 py-4 bg-gradient-to-r from-pink-500 to-red-600 hover:from-pink-400 hover:to-red-500 text-white font-bold rounded-xl shadow-2xl hover:shadow-pink-500/25 transition-all duration-300 transform hover:scale-105"
          >
            Make X Riffs Per Day
          </button>
          <button
            onClick={() => dispatch({ type: "START_QUESTIONNAIRE" })}
            className="px-6 py-4 bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-400 hover:to-orange-500 text-white font-bold rounded-xl shadow-2xl hover:shadow-red-500/25 transition-all duration-300 transform hover:scale-105"
          >
            Do X Mixes Per Day
          </button>
        </div>
        
        {/* Demo Mode Access */}
        {isDemoMode && (
          <div className="mt-6">
            <button
              onClick={() => dispatch({ type: "GO_TO_DASHBOARD" })}
              className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold rounded-xl shadow-2xl hover:shadow-amber-500/25 transition-all duration-300 transform hover:scale-105"
            >
              🎯 Try Demo Dashboard
            </button>
            <p className="text-xs text-white/60 mt-2">
              Demo mode is active - see the full app experience
            </p>
          </div>
        )}
      </div>

        <p className="text-sm text-white/40">
          Takes ~2 minutes to set up, then you're ready to produce
        </p>
      </div>
    </div>
  );
}
