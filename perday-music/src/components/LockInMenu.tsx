import { useAppStore } from '../store/store';
import { FlowState } from '../types';
import { Button } from './ui/button';
import { Target, Clock, ArrowLeft, Music, Zap } from 'lucide-react';

export default function LockInMenu() {
  const { session, dispatch } = useAppStore();

  // Only render if we're in the correct state
  if (session.state !== FlowState.LOCK_IN) {
    return null;
  }

  const handleBack = () => {
    dispatch({ type: 'BACK' });
  };

  const handlePickType = (type: string) => {
    dispatch({ type: 'PICK_TYPE', payload: type });
  };

  const sessionTypes = [
    { id: 'production', label: 'Production', icon: Music, description: 'Beat making, mixing, mastering' },
    { id: 'writing', label: 'Writing', icon: Target, description: 'Lyrics, melodies, chord progressions' },
    { id: 'practice', label: 'Practice', icon: Clock, description: 'Instrument practice, technique work' },
    { id: 'collaboration', label: 'Collaboration', icon: Zap, description: 'Working with other artists' }
  ];

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-8">
      <div className="bg-gradient-to-br from-magenta-900/20 via-cyan-900/20 to-purple-900/20 backdrop-blur-xl ring-1 ring-cyan-400/30 rounded-2xl p-8 max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-synth-white mb-2">Lock-In Your Lane</h1>
          <p className="text-synth-icy/70">
            {session.multiplierPenalty 
              ? "You didn't press Ready in time - your multiplier is penalized!"
              : "Choose your creative focus for this session"
            }
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {sessionTypes.map((sessionType) => {
            const Icon = sessionType.icon;
            return (
              <Button
                key={sessionType.id}
                onClick={() => handlePickType(sessionType.id)}
                className="h-24 p-4 bg-gradient-to-r from-magenta-500/20 to-cyan-400/20 border-magenta-400/40 hover:border-magenta-300/60 text-magenta-300 hover:bg-magenta-500/30 transition-all duration-300 rounded-2xl flex flex-col items-center justify-center gap-2"
              >
                <Icon className="h-8 w-8" />
                <div className="text-center">
                  <div className="font-bold text-lg">{sessionType.label}</div>
                  <div className="text-xs text-synth-icy/70">{sessionType.description}</div>
                </div>
              </Button>
            );
          })}
        </div>

        {/* Back Button */}
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={handleBack}
            className="border-cyan-400/40 text-cyan-300 hover:bg-cyan-400/20 px-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Pre-Start
          </Button>
        </div>
      </div>
    </div>
  );
}
