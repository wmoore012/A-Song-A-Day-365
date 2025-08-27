import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";
import GlassPanel from "./common/GlassPanel";
import { useAppStore } from "../store/store";
import { useDemoMode } from "../hooks/useDemoMode";

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { dispatch } = useAppStore();
  const { enableDemoMode } = useDemoMode();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate email capture (replace with actual API call)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSuccess(true);
    setIsSubmitting(false);
    
    // Here you would typically send to your email service
    console.log("Email captured:", email);
  };

  const handleTryDemo = () => {
    enableDemoMode();
    dispatch({ type: "GO_TO_DASHBOARD" });
  };

  if (isSuccess) {
    return (
      <GlassPanel className="p-6 max-w-md mx-auto bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-400/30">
        <div className="text-center space-y-4">
          <div className="text-4xl">🎉</div>
          <h3 className="text-xl font-bold text-white">You're in!</h3>
          <p className="text-cyan-200/80">
            We'll email you updates and early access.
          </p>
          <Button
            onClick={handleTryDemo}
            className="w-full h-12 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-semibold rounded-xl"
          >
            Jump into the demo
          </Button>
        </div>
      </GlassPanel>
    );
  }

  return (
    <GlassPanel className="p-6 max-w-md mx-auto">
      <div className="text-center space-y-4">
        <div className="text-sm text-white/80">
          Join <span className="font-bold text-cyan-300">1,247</span> producers. No spam.
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            type="email"
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-12 text-center bg-black/40 border-cyan-400/50 text-white placeholder:text-cyan-200/50 focus:border-cyan-400"
            required
          />
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-semibold rounded-xl"
          >
            {isSubmitting ? "Joining..." : "Get early access"}
          </Button>
        </form>
      </div>
    </GlassPanel>
  );
}
