import { useAppStore } from '../store/store';
import { FlowState } from '../types';
import { Button } from './ui/button';
import { Play, BarChart3, Home, Trophy, Star } from 'lucide-react';
import GlassPanel from './common/GlassPanel';
import { toast } from 'sonner';

export default function SessionCompletion() {
  const { session, dispatch } = useAppStore();

  const handleStartNewSession = () => {
    dispatch({ type: "RESET" });
    toast.success("Starting fresh! Let's make another beat!");
  };

  const handleViewAnalytics = () => {
    toast.info("Analytics coming soon! Track your progress and streaks.");
  };

  const handleGoHome = () => {
    dispatch({ type: "GO_TO_DASHBOARD" });
  };

  const renderContent = () => {
    switch (session.state) {
      case FlowState.CHECKPOINT:
        return (
          <div className="text-center space-y-6">
            <div className="space-y-4">
              <Trophy className="w-16 h-16 text-amber-400 mx-auto" />
              <h2 className="text-3xl font-bold text-white">Session Complete!</h2>
              <p className="text-cyan-200/80 text-lg">
                Great work! You've finished your focus session.
              </p>
            </div>
            
            <div className="space-y-4">
              <Button
                onClick={handleStartNewSession}
                className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white rounded-2xl"
              >
                <Play className="w-5 h-5 mr-2" />
                Start New Session
              </Button>
              
              <Button
                onClick={handleViewAnalytics}
                variant="outline"
                className="w-full h-12 border-cyan-400/60 text-cyan-300 rounded-2xl"
              >
                <BarChart3 className="w-5 h-5 mr-2" />
                View Analytics (Coming Soon)
              </Button>
            </div>
          </div>
        );

      case FlowState.SELF_RATE:
        return (
          <div className="text-center space-y-6">
            <div className="space-y-4">
              <Star className="w-16 h-16 text-yellow-400 mx-auto" />
              <h2 className="text-3xl font-bold text-white">Rate Your Session</h2>
              <p className="text-cyan-200/80 text-lg">
                How did this session feel? Rate your focus and productivity.
              </p>
            </div>
            
            <div className="flex justify-center gap-4">
              {[1, 2, 3].map((rating) => (
                <Button
                  key={rating}
                  onClick={() => dispatch({ type: "RATE_SESSION", payload: rating as 1 | 2 | 3 })}
                  className="w-16 h-16 text-2xl font-bold bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white rounded-full"
                >
                  {rating}
                </Button>
              ))}
            </div>
            
            <Button
              onClick={() => dispatch({ type: "SKIP_CHECKPOINT" })}
              variant="outline"
              className="w-full h-12 border-cyan-400/60 text-cyan-300 rounded-2xl"
            >
              Skip Rating
            </Button>
          </div>
        );

      case FlowState.RECAP:
        return (
          <div className="text-center space-y-6">
            <div className="space-y-4">
              <BarChart3 className="w-16 h-16 text-green-400 mx-auto" />
              <h2 className="text-3xl font-bold text-white">Session Recap</h2>
              <p className="text-cyan-200/80 text-lg">
                Here's what you accomplished today.
              </p>
            </div>
            
            <div className="space-y-4">
              <Button
                onClick={() => dispatch({ type: "CONTINUE" })}
                className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white rounded-2xl"
              >
                Continue
              </Button>
            </div>
          </div>
        );

      case FlowState.REWARD_GATE:
        return (
          <div className="text-center space-y-6">
            <div className="space-y-4">
              <Trophy className="w-16 h-16 text-amber-400 mx-auto" />
              <h2 className="text-3xl font-bold text-white">Claim Your Reward!</h2>
              <p className="text-cyan-200/80 text-lg">
                You've earned points and progress for completing your session.
              </p>
            </div>
            
            <div className="space-y-4">
              <Button
                onClick={() => dispatch({ type: "CLAIM_AWARD" })}
                className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white rounded-2xl"
              >
                <Trophy className="w-5 h-5 mr-2" />
                Claim Reward
              </Button>
            </div>
          </div>
        );

      case FlowState.POST_ACTIONS:
        return (
          <div className="text-center space-y-6">
            <div className="space-y-4">
              <Home className="w-16 h-16 text-cyan-400 mx-auto" />
              <h2 className="text-3xl font-bold text-white">What's Next?</h2>
              <p className="text-cyan-200/80 text-lg">
                Choose your next action or take a break.
              </p>
            </div>
            
            <div className="space-y-4">
              <Button
                onClick={handleStartNewSession}
                className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white rounded-2xl"
              >
                <Play className="w-5 h-5 mr-2" />
                Start New Session
              </Button>
              
              <Button
                onClick={handleViewAnalytics}
                variant="outline"
                className="w-full h-12 border-cyan-400/60 text-cyan-300 rounded-2xl"
              >
                <BarChart3 className="w-5 h-5 mr-2" />
                View Analytics (Coming Soon)
              </Button>
              
              <Button
                onClick={handleGoHome}
                variant="outline"
                className="w-full h-12 border-white/20 text-white/70 rounded-2xl"
              >
                <Home className="w-5 h-5 mr-2" />
                Go to Dashboard
              </Button>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center space-y-6">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-white">Session Complete</h2>
              <p className="text-cyan-200/80 text-lg">
                Great work! What would you like to do next?
              </p>
            </div>
            
            <div className="space-y-4">
              <Button
                onClick={handleStartNewSession}
                className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white rounded-2xl"
              >
                <Play className="w-5 h-5 mr-2" />
                Start New Session
              </Button>
              
              <Button
                onClick={handleViewAnalytics}
                variant="outline"
                className="w-full h-12 border-cyan-400/60 text-cyan-300 rounded-2xl"
              >
                <BarChart3 className="w-5 h-5 mr-2" />
                View Analytics (Coming Soon)
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-8">
      <GlassPanel className="bg-gradient-to-br from-magenta-900/20 via-cyan-900/20 to-purple-900/20 p-8 max-w-2xl w-full">
        {renderContent()}
      </GlassPanel>
    </div>
  );
}
