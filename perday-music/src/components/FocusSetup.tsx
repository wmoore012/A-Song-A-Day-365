import { useState } from 'react';
import { useAppStore } from '../store/store';
import { FlowState } from '../types';
import { Button } from './ui/button';
import { Target, Clock, ArrowLeft, Play } from 'lucide-react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import GlassPanel from './common/GlassPanel';

export default function FocusSetup() {
  const { session, dispatch } = useAppStore();
  const [target, setTarget] = useState(session.target || '');
  const [duration, setDuration] = useState(session.durationMin || 25);

  // Only render if we're in the correct state
  if (session.state !== FlowState.FOCUS_SETUP) {
    return null;
  }

  const handleBack = () => {
    dispatch({ type: 'BACK' });
  };

  const handleTargetChange = (value: string) => {
    setTarget(value);
    if (value.trim()) {
      dispatch({ type: 'SET_TARGET', payload: value.trim() });
    }
  };

  const handleDurationChange = (value: number) => {
    setDuration(value);
    if (value > 0) {
      dispatch({ type: 'SET_DURATION', payload: value });
    }
  };

  const handleStartFocus = () => {
    if (target.trim() && duration > 0) {
      dispatch({ type: 'START_FOCUS' });
    }
  };

  const canStart = target.trim() && duration > 0;

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <GlassPanel className="bg-gradient-to-br from-magenta-900/20 via-cyan-900/20 to-purple-900/20 p-8 max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-synth-white mb-2">Focus Setup</h1>
          <p className="text-synth-icy/70">
            Set your target and duration, then start your focused session
          </p>
        </div>

        <div className="space-y-6 mb-8">
          {/* Set Target */}
          <div className="space-y-3">
            <Label className="text-synth-white text-lg font-semibold flex items-center gap-2">
              <Target className="h-5 w-5" />
              Set Target
            </Label>
            <div className="flex gap-3">
              <Input
                value={target}
                onChange={(e) => handleTargetChange(e.target.value)}
                placeholder="What are you working on today?"
                className="flex-1 bg-black/40 border-cyan-400/40 text-synth-white placeholder:text-synth-icy/50"
              />
            </div>
            {session.target && (
              <div className="text-sm text-cyan-300 bg-cyan-400/10 p-3 rounded-lg">
                ✅ Target set: <strong>{session.target}</strong>
              </div>
            )}
          </div>

          {/* Set Duration */}
          <div className="space-y-3">
            <Label className="text-synth-white text-lg font-semibold flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Set Duration (max 5 hours)
            </Label>
            <div className="flex gap-3">
              <Input
                type="number"
                value={duration}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0;
                  // Cap at 5 hours (300 minutes)
                  const cappedValue = Math.min(value, 300);
                  handleDurationChange(cappedValue);
                }}
                min="1"
                max="300"
                className="flex-1 bg-black/40 border-cyan-400/40 text-synth-white"
              />
              <span className="text-synth-white self-center">minutes</span>
            </div>
            {session.durationMin && (
              <div className="text-sm text-cyan-300 bg-cyan-400/10 p-3 rounded-lg">
                ✅ Duration set: <strong>{session.durationMin} minutes</strong>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Button
            variant="outline"
            onClick={handleBack}
            className="border-cyan-400/40 text-cyan-300 hover:bg-cyan-400/20 px-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <Button
            onClick={handleStartFocus}
            disabled={!canStart}
            className="bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500 text-synth-white px-8 text-lg font-semibold"
          >
            <Play className="h-4 w-4 mr-2" />
            Start Focus
          </Button>
        </div>

        {/* Status */}
        {canStart && (
          <div className="mt-6 text-center">
            <div className="text-sm text-synth-amber bg-synth-amber/10 p-3 rounded-lg">
              🚀 Ready to start! Target: <strong>{target}</strong> | Duration: <strong>{duration} minutes</strong>
            </div>
          </div>
        )}
      </GlassPanel>
    </div>
  );
}
