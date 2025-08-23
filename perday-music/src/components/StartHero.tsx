import { useSessionStore } from '../state/store';
import { FlowState } from '../state/types';
import { useVillainAnnounce } from '../features/fx/useVillainAnnounce';
import { usePrestart } from '../features/prestart/usePrestart';
import { useState, useEffect } from 'react';
import MultiplierBar from './MultiplierBar';
import { Button } from './ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from './ui/tooltip';
import { Calendar } from './ui/calendar';

export default function StartHero() {
  const { session, dispatch } = useSessionStore();
  const { mmss } = usePrestart();
  const { villainNudge } = useVillainAnnounce();
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [target, setTarget] = useState('');
  const [duration, setDuration] = useState(25);
  const [multiplier, setMultiplier] = useState(1.0);
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Timer effect to decrease multiplier by 10% every 30 seconds after timer starts
  useEffect(() => {
    if (!session.readyPressed || mmss === "07:00") return;
    
    const interval = setInterval(() => {
      setMultiplier(prev => Math.max(0.5, prev - 0.1)); // Don't go below 0.5x
    }, 30000); // 30 seconds
    
    return () => clearInterval(interval);
  }, [session.readyPressed, mmss]);

  const handleAction = (action: any) => {
    try {
      setError(null);
      dispatch(action);
      
      // Special handling for READY action
      if (action.type === 'READY') {
        setMultiplier(1.5); // Boost to 1.5x when Ready is pressed
        villainNudge('First baby step locked. 🔒✨');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleTimerZero = () => {
    handleAction({ type: 'TIMER_ZERO' });
  };

  // Auto-advance timer at T-0
  if (mmss === '00:00' && session.state === FlowState.PRE_START) {
    setTimeout(handleTimerZero, 100);
  }

  const renderError = () => {
    if (!error) return null;
    return (
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50">
        {error}
      </div>
    );
  };

  switch (session.state) {
    case FlowState.PRE_START:
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-black">
          {renderError()}
          <div className="rounded-2xl bg-black/40 backdrop-blur-xl ring-1 ring-synth-icy/30 p-8 max-w-md w-full text-center shadow-2xl">
            <div className="text-xl font-bold text-synth-white mb-2">
              7-minute Pre-Start to get your mind right.
            </div>
            <div className="text-sm text-synth-amber/90 mb-6">
              This is the EASY step. We'll start the timer for you if you don't do anything!
            </div>
            
            <div className={`text-8xl font-black tabular-nums mb-8 font-mono ${mmss === "00:00" ? "text-synth-amber animate-amberPulse" : "text-synth-white"}`}>
              {mmss}
            </div>
            
            {/* Multiplier Bar */}
            <div className="mb-6">
              <MultiplierBar 
                currentMultiplier={multiplier}
                maxMultiplier={2.0}
                isActive={session.readyPressed}
              />
            </div>
            
            <div className="space-y-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="lg"
                    className="w-full h-14 text-lg font-bold bg-gradient-to-r from-synth-amber to-synth-amberLight hover:from-synth-amberLight hover:to-synth-amber text-synth-white shadow-lg hover:shadow-[0_10px_24px_rgba(255,176,32,0.4)] transition-all duration-300 transform hover:scale-[1.02] animate-amberGlow"
                    onClick={() => handleAction({ type: 'READY' })}
                    disabled={session.readyPressed}
                  >
                    ⚡ Ready (Power up your Multiplier)
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Tap this to power up your multiplier before the timer starts!</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full h-14 text-lg font-bold border-synth-violet/40 hover:border-synth-violet/60 text-synth-violet hover:bg-synth-violet/10 transition-all duration-300"
                    onClick={handleTimerZero}
                  >
                    🚀 Start Now (Skip Pre-Start)
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Skip the 7-minute warmup and start immediately</p>
                </TooltipContent>
              </Tooltip>
              
              {/* Test villain button */}
              <Button
                variant="secondary"
                size="default"
                className="w-full bg-synth-magenta/20 hover:bg-synth-magenta/30 border-synth-magenta/40 hover:border-synth-magenta/60"
                onClick={() => villainNudge('🧪 TEST: Villain system is working!')}
              >
                🧪 Test Villain System
              </Button>
            </div>
            
            {session.readyPressed && (
              <div className="mt-6 text-synth-amber text-sm font-medium">
                ✅ Ready! Multiplier boosted.
              </div>
            )}
          </div>
        </div>
      );

    case FlowState.LOCK_IN:
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-black">
          {renderError()}
          <div className="rounded-2xl bg-black/40 backdrop-blur-xl ring-1 ring-synth-icy/30 p-8 max-w-md w-full text-center shadow-2xl">
            <h2 className="text-2xl font-bold text-synth-white mb-6">Lock-In your lane</h2>
            <div className="grid grid-cols-2 gap-4">
              {['Beat', 'Bars', 'Mix', 'Practice'].map(type => (
                <Button
                  key={type}
                  size="lg"
                  className="h-14 bg-gradient-to-r from-synth-violet to-synth-magenta hover:from-synth-magenta hover:to-synth-violet text-synth-white font-bold shadow-lg hover:shadow-[0_8px_20px_rgba(108,26,237,0.3)] transition-all duration-300 transform hover:scale-[1.02]"
                  onClick={() => handleAction({ type: 'PICK_TYPE', payload: type })}
                >
                  {type}
                </Button>
              ))}
            </div>
            {session.multiplierPenalty && (
              <div className="mt-6 text-red-400 text-sm">
                ⚠️ Skipped Pre-Start - Multiplier penalized
              </div>
            )}
          </div>
        </div>
      );

    case FlowState.FOCUS_SETUP:
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-black">
          {renderError()}
          <div className="rounded-2xl bg-black/40 backdrop-blur-xl ring-1 ring-synth-icy/30 p-8 max-w-md w-full text-center shadow-2xl">
            <h2 className="text-2xl font-bold text-synth-white mb-6">Focus Setup</h2>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-synth-icy text-sm font-medium mb-2">Target</label>
                <input
                  type="text"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  placeholder="What are you working on?"
                  className="w-full px-4 py-2 rounded-lg bg-synth-violet/20 border border-synth-violet/40 text-synth-white placeholder-synth-icy/60 focus:outline-none focus:ring-2 focus:ring-synth-violet/60"
                />
              </div>
              
              <div>
                <label className="block text-synth-icy text-sm font-medium mb-2">Duration (minutes)</label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full px-4 py-2 rounded-lg bg-synth-violet/20 border border-synth-violet/40 text-synth-white focus:outline-none focus:ring-2 focus:ring-synth-violet/60"
                >
                  <option value={30}>30 minutes</option>
                  <option value={60}>1 hour</option>
                  <option value={90}>1 hour 30 minutes</option>
                  <option value={120}>2 hours</option>
                  <option value={180}>3 hours</option>
                  <option value={240}>4 hours</option>
                  <option value={300}>5 hours</option>
                  <option value={360}>6 hours</option>
                  <option value={420}>7 hours</option>
                  <option value={480}>8 hours</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-3">
              <Button
                size="lg"
                className="w-full h-14 bg-gradient-to-r from-synth-amber to-synth-amberLight hover:from-synth-amberLight hover:to-synth-amber text-synth-white font-bold shadow-lg hover:shadow-[0_8px_20px_rgba(255,176,32,0.4)] transition-all duration-300"
                onClick={() => handleAction({ type: 'SET_TARGET', payload: target })}
                disabled={!target}
              >
                Set Target
              </Button>
              <Button
                size="lg"
                className="w-full h-14 bg-gradient-to-r from-synth-amber to-synth-amberLight hover:from-synth-amberLight hover:to-synth-amber text-synth-white font-bold shadow-lg hover:shadow-[0_8px_20px_rgba(255,176,32,0.4)] transition-all duration-300"
                onClick={() => handleAction({ type: 'SET_DURATION', payload: duration })}
              >
                Set Duration
              </Button>
              <Button
                size="lg"
                className="w-full h-14 bg-gradient-to-r from-synth-violet to-synth-magenta hover:from-synth-magenta hover:to-synth-violet text-synth-white font-bold shadow-lg hover:shadow-[0_8px_20px_rgba(108,26,237,0.3)] transition-all duration-300"
                onClick={() => handleAction({ type: 'START_FOCUS' })}
                disabled={!target || !duration}
              >
                Start Focus
              </Button>
              <Button
                variant="outline"
                size="default"
                className="w-full bg-synth-icy/10 hover:bg-synth-icy/20 border-synth-icy/30 hover:border-synth-icy/50 text-synth-icy"
                onClick={() => handleAction({ type: 'BACK' })}
              >
                Back
              </Button>
            </div>
          </div>
        </div>
      );

    case FlowState.FOCUS_RUNNING:
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-black">
          {renderError()}
          <div className="rounded-2xl bg-black/40 backdrop-blur-xl ring-1 ring-synth-icy/30 p-8 max-w-md w-full text-center shadow-2xl">
            <h2 className="text-2xl font-bold text-synth-white mb-6">Focus Running</h2>
            <div className="text-synth-amber text-4xl font-mono mb-6">
              {session.target}
            </div>
            <div className="text-synth-icy text-lg mb-8">
              {session.durationMin} minutes
            </div>
            
            <div className="space-y-3">
              <Button
                size="lg"
                className="w-full h-14 bg-gradient-to-r from-synth-violet to-synth-magenta hover:from-synth-magenta hover:to-synth-violet text-synth-white font-bold shadow-lg hover:shadow-[0_8px_20px_rgba(108,26,237,0.3)] transition-all duration-300"
                onClick={() => handleAction({ type: 'PAUSE' })}
              >
                Pause
              </Button>
              <Button
                size="lg"
                className="w-full h-14 bg-gradient-to-r from-synth-amber to-synth-amberLight hover:from-synth-amberLight hover:to-synth-amber text-synth-white font-bold shadow-lg hover:shadow-[0_8px_20px_rgba(255,176,32,0.4)] transition-all duration-300"
                onClick={() => handleAction({ type: 'END_FOCUS' })}
              >
                End
              </Button>
              <div>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add a note..."
                  className="w-full px-4 py-2 rounded-lg bg-synth-violet/20 border border-synth-violet/40 text-synth-white placeholder-synth-icy/60 focus:outline-none focus:ring-2 focus:ring-synth-violet/60 mb-2"
                />
                <Button
                  variant="outline"
                  size="default"
                  className="w-full bg-synth-icy/10 hover:bg-synth-icy/20 border-synth-icy/30 hover:border-synth-icy/50 text-synth-icy"
                  onClick={() => {
                    if (note.trim()) {
                      handleAction({ type: 'ADD_NOTE', payload: note });
                      setNote('');
                    }
                  }}
                >
                  Add Note
                </Button>
              </div>
            </div>
          </div>
        </div>
      );

    case FlowState.CHECKPOINT:
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-black">
          {renderError()}
          <div className="rounded-2xl bg-black/40 backdrop-blur-xl ring-1 ring-synth-icy/30 p-8 max-w-md w-full text-center shadow-2xl">
            <h2 className="text-2xl font-bold text-synth-white mb-6">Checkpoint</h2>
            <div className="text-synth-icy text-lg mb-8">
              How did it go? Attach proof or skip.
            </div>
            
            <div className="space-y-3">
              <Button
                size="lg"
                className="w-full h-14 bg-gradient-to-r from-synth-violet to-synth-magenta hover:from-synth-magenta hover:to-synth-violet text-synth-white font-bold shadow-lg hover:shadow-[0_8px_20px_rgba(108,26,237,0.3)] transition-all duration-300"
                onClick={() => handleAction({ type: 'ATTACH_PROOF', payload: 'proof-attached' })}
              >
                Attach Proof
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full h-14 bg-synth-amber/20 hover:bg-synth-amber/30 border-synth-amber/40 hover:border-synth-amber/60 text-synth-amber font-bold transition-all duration-300"
                onClick={() => handleAction({ type: 'SKIP_CHECKPOINT' })}
              >
                Skip
              </Button>
              <Button
                variant="outline"
                size="default"
                className="w-full bg-synth-icy/10 hover:bg-synth-icy/20 border-synth-icy/30 hover:border-synth-icy/50 text-synth-icy"
                onClick={() => handleAction({ type: 'BACK' })}
              >
                Back
              </Button>
            </div>
          </div>
        </div>
      );

    case FlowState.SELF_RATE:
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-black">
          {renderError()}
          <div className="rounded-2xl bg-black/40 backdrop-blur-xl ring-1 ring-synth-icy/30 p-8 max-w-md w-full text-center shadow-2xl">
            <h2 className="text-2xl font-bold text-synth-white mb-6">Rate Your Session</h2>
            <div className="text-synth-icy text-lg mb-8">
              How did you perform?
            </div>
            
            <div className="space-y-3">
              {[
                { label: 'Underhit', value: 1, color: 'from-red-500 to-red-600' },
                { label: 'Hit', value: 2, color: 'from-synth-amber to-synth-amberLight' },
                { label: 'Overhit', value: 3, color: 'from-green-500 to-green-600' }
              ].map(({ label, value, color }) => (
                <Button
                  key={value}
                  size="lg"
                  className={`w-full h-14 bg-gradient-to-r ${color} hover:from-synth-amber hover:to-synth-amberLight text-synth-white font-bold shadow-lg transition-all duration-300 transform hover:scale-[1.02]`}
                  onClick={() => handleAction({ type: 'RATE_SESSION', payload: value })}
                >
                  {label}
                </Button>
              ))}
              <Button
                variant="outline"
                size="default"
                className="w-full bg-synth-icy/10 hover:bg-synth-icy/20 border-synth-icy/30 hover:border-synth-icy/50 text-synth-icy"
                onClick={() => handleAction({ type: 'CONTINUE' })}
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
      );

    case FlowState.RECAP:
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-black">
          {renderError()}
          <div className="rounded-2xl bg-black/40 backdrop-blur-xl ring-1 ring-synth-icy/30 p-8 max-w-lg w-full text-center shadow-2xl">
            <h2 className="text-2xl font-bold text-synth-white mb-6">Session Recap</h2>
            
            {/* Calendar for session date */}
            <div className="mb-6">
              <div className="text-synth-icy text-sm font-medium mb-3">Session Date</div>
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border border-synth-icy/30 bg-synth-violet/10 text-synth-white"
                  classNames={{
                    day_selected: "bg-synth-amber text-synth-white hover:bg-synth-amberLight focus:bg-synth-amber",
                    day_today: "bg-synth-violet/30 text-synth-amber",
                    head_cell: "text-synth-icy",
                    nav_button: "text-synth-icy hover:text-synth-white",
                    caption: "text-synth-white font-medium"
                  }}
                />
              </div>
            </div>
            
            <div className="text-synth-icy text-lg mb-8">
              Save your progress or discard?
            </div>
            
            <div className="space-y-3">
              <Button
                size="lg"
                className="w-full h-14 bg-gradient-to-r from-synth-amber to-synth-amberLight hover:from-synth-amberLight hover:to-synth-amber text-synth-white font-bold shadow-lg hover:shadow-[0_8px_20px_rgba(255,176,32,0.4)] transition-all duration-300"
                onClick={() => handleAction({ type: 'SAVE_SUMMARY' })}
              >
                Save Summary
              </Button>
              <Button
                size="lg"
                variant="destructive"
                className="w-full h-14 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-synth-white font-bold shadow-lg transition-all duration-300"
                onClick={() => handleAction({ type: 'DISCARD' })}
              >
                Discard
              </Button>
            </div>
          </div>
        </div>
      );

    case FlowState.REWARD_GATE:
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-black">
          {renderError()}
          <div className="rounded-2xl bg-black/40 backdrop-blur-xl ring-1 ring-synth-icy/30 p-8 max-w-md w-full text-center shadow-2xl">
            <h2 className="text-2xl font-bold text-synth-white mb-6">Claim Your Reward</h2>
            <div className="text-synth-icy text-lg mb-8">
              Great job! Claim your reward or continue.
            </div>
            
            <div className="space-y-3">
              <Button
                size="lg"
                className="w-full h-14 bg-gradient-to-r from-synth-amber to-synth-amberLight hover:from-synth-amberLight hover:to-synth-amber text-synth-white font-bold shadow-lg hover:shadow-[0_8px_20px_rgba(255,176,32,0.4)] transition-all duration-300"
                onClick={() => handleAction({ type: 'CLAIM_AWARD' })}
              >
                Claim Award
              </Button>
              <Button
                size="lg"
                className="w-full h-14 bg-gradient-to-r from-synth-violet to-synth-magenta hover:from-synth-magenta hover:to-synth-violet text-synth-white font-bold shadow-lg hover:shadow-[0_8px_20px_rgba(108,26,237,0.3)] transition-all duration-300"
                onClick={() => handleAction({ type: 'CONTINUE' })}
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
      );

    default:
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-black">
          <div className="text-synth-white text-xl">Unknown state: {session.state}</div>
        </div>
      );
  }
}
