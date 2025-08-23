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
import { Checkbox } from './ui/checkbox';
import AtomOrbit from './AtomOrbit';
import LiquidGlassButton from './LiquidGlassButton';
import VaultTransition from './VaultTransition';
import PerdayLogo from './PerdayLogo';
import HeatButtons from './HeatButtons';
import ThemeSwitcher from './ThemeSwitcher';
import GearCarousel from './GearCarousel';
import SongInfoDialog from './SongInfoDialog';

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
  const [allNighter, setAllNighter] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [showVault, setShowVault] = useState(false);

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
                size="default"
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-synth-amber to-synth-amberLight hover:from-synth-amberLight hover:to-synth-amber text-synth-white shadow-lg hover:shadow-[0_8px_20px_rgba(255,176,32,0.4)] transition-all duration-300 transform hover:scale-[1.02] animate-amberGlow rounded-2xl"
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
                size="default"
                className="w-full h-12 text-base font-semibold border-synth-violet/40 hover:border-synth-violet/60 text-synth-violet hover:bg-synth-violet/10 transition-all duration-300 rounded-2xl"
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
        <div className="min-h-screen bg-black p-4">
          {renderError()}
          
          <div className="max-w-4xl mx-auto">
            {/* Setup Form */}
            <div className="bg-synth-violet/20 backdrop-blur-xl border border-synth-violet/40 rounded-2xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-synth-white mb-6 text-center">Focus Setup</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
              
              {/* All Nighter Checkbox */}
              <div className="flex items-center justify-center space-x-2 mb-6">
                <Checkbox
                  id="allNighter"
                  checked={allNighter}
                  onCheckedChange={(checked) => setAllNighter(checked as boolean)}
                  className="border-synth-amber/40 data-[state=checked]:bg-synth-amber data-[state=checked]:border-synth-amber"
                />
                <label
                  htmlFor="allNighter"
                  className="text-sm font-medium text-synth-icy cursor-pointer"
                >
                  🌙 All Nighter (backdate by 24h)
                </label>
              </div>
              
              <div className="flex gap-4 justify-center">
                <Button
                  size="default"
                  className="h-11 px-6 bg-gradient-to-r from-synth-amber to-synth-amberLight hover:from-synth-amberLight hover:to-synth-amber text-synth-white font-semibold shadow-lg hover:shadow-[0_6px_16px_rgba(255,176,32,0.4)] transition-all duration-300 rounded-2xl"
                  onClick={() => handleAction({ type: 'SET_TARGET', payload: target })}
                  disabled={!target}
                >
                  Set Target
                </Button>
                <Button
                  size="default"
                  className="h-11 px-6 bg-gradient-to-r from-synth-amber to-synth-amberLight hover:from-synth-amberLight hover:to-synth-amber text-synth-white font-semibold shadow-lg hover:shadow-[0_6px_16px_rgba(255,176,32,0.4)] transition-all duration-300 rounded-2xl"
                  onClick={() => handleAction({ type: 'SET_DURATION', payload: duration })}
                >
                  Set Duration
                </Button>
                <Button
                  size="default"
                  className="h-11 px-6 bg-gradient-to-r from-synth-violet to-synth-magenta hover:from-synth-magenta hover:to-synth-violet text-synth-white font-semibold shadow-lg hover:shadow-[0_6px_16px_rgba(108,26,237,0.3)] transition-all duration-300 rounded-2xl"
                  onClick={() => handleAction({ type: 'START_FOCUS' })}
                  disabled={!target || !duration}
                >
                  Start Focus
                </Button>
                <Button
                  variant="outline"
                  size="default"
                  className="h-11 px-6 bg-synth-icy/10 hover:bg-synth-icy/20 border-synth-icy/30 hover:border-synth-icy/50 text-synth-icy rounded-2xl"
                  onClick={() => handleAction({ type: 'BACK' })}
                >
                  Back
                </Button>
              </div>
            </div>
            
            {/* Gear Carousel */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-synth-white text-center mb-4">Studio Gear</h3>
              <GearCarousel />
            </div>
          </div>
        </div>
      );

    case FlowState.FOCUS_RUNNING:
      return (
        <div className="min-h-screen bg-black p-4">
          {renderError()}
          
          {/* Header with Theme Switcher */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-center flex-1">
              <h2 className="text-2xl font-bold text-synth-white">Focus Running</h2>
              <div className="text-synth-amber text-4xl font-mono mb-2">
                {session.target}
              </div>
              <div className="text-synth-icy text-lg">
                {session.durationMin} minutes
              </div>
            </div>
            <ThemeSwitcher />
          </div>
          
          {/* Main Content */}
          <div className="max-w-4xl mx-auto">
            {/* Control Buttons */}
            <div className="flex gap-4 mb-8 justify-center">
              <Button
                size="default"
                className="h-11 px-6 bg-gradient-to-r from-synth-violet to-synth-magenta hover:from-synth-magenta hover:to-synth-violet text-synth-white font-semibold shadow-lg hover:shadow-[0_6px_16px_rgba(108,26,237,0.3)] transition-all duration-300 rounded-2xl"
                onClick={() => handleAction({ type: 'PAUSE' })}
              >
                Pause
              </Button>
              <Button
                size="default"
                className="h-11 px-6 bg-gradient-to-r from-synth-amber to-synth-amberLight hover:from-synth-amberLight hover:to-synth-amber text-synth-white font-semibold shadow-lg hover:shadow-[0_6px_16px_rgba(255,176,32,0.4)] transition-all duration-300 rounded-2xl"
                onClick={() => handleAction({ type: 'END_FOCUS' })}
              >
                End
              </Button>
            </div>
            
            {/* Heat Buttons */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-synth-white text-center mb-4">Keep the Energy Flowing! 🔥</h3>
              <HeatButtons />
            </div>
            
            {/* Notes Section */}
            <div className="bg-synth-violet/20 backdrop-blur-xl border border-synth-violet/40 rounded-2xl p-6 mb-8">
              <h4 className="text-lg font-semibold text-synth-white mb-4">Session Notes</h4>
              <div className="flex gap-4">
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add a note..."
                  className="flex-1 px-4 py-2 rounded-lg bg-synth-violet/20 border border-synth-violet/40 text-synth-white placeholder-synth-icy/60 focus:outline-none focus:ring-2 focus:ring-synth-violet/60"
                />
                <Button
                  variant="outline"
                  size="default"
                  className="bg-synth-icy/10 hover:bg-synth-icy/20 border-synth-icy/30 hover:border-synth-icy/50 text-synth-icy"
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
            
            {/* Song Info Dialog */}
            <div className="text-center">
              <SongInfoDialog />
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
                size="default"
                className="w-full h-11 bg-gradient-to-r from-synth-violet to-synth-magenta hover:from-synth-magenta hover:to-synth-violet text-synth-white font-semibold shadow-lg hover:shadow-[0_6px_16px_rgba(108,26,237,0.3)] transition-all duration-300 rounded-2xl"
                onClick={() => handleAction({ type: 'ATTACH_PROOF', payload: 'proof-attached' })}
              >
                Attach Proof
              </Button>
              <Button
                size="default"
                variant="outline"
                className="w-full h-11 bg-synth-amber/20 hover:bg-synth-amber/30 border-synth-amber/40 hover:border-synth-amber/60 text-synth-amber font-semibold transition-all duration-300 rounded-2xl"
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
                  size="default"
                  className={`w-full h-11 bg-gradient-to-r ${color} hover:from-synth-amber hover:to-synth-amberLight text-synth-white font-semibold shadow-lg transition-all duration-300 transform hover:scale-[1.02] rounded-2xl`}
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
                size="default"
                className="w-full h-11 bg-gradient-to-r from-synth-amber to-synth-amberLight hover:from-synth-amberLight hover:to-synth-amber text-synth-white font-semibold shadow-lg hover:shadow-[0_6px_16px_rgba(255,176,32,0.4)] transition-all duration-300 rounded-2xl"
                onClick={() => handleAction({ type: 'SAVE_SUMMARY' })}
              >
                Save Summary
              </Button>
              <Button
                size="default"
                variant="destructive"
                className="w-full h-11 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-synth-white font-semibold shadow-lg transition-all duration-300 rounded-2xl"
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
                size="default"
                className="w-full h-11 bg-gradient-to-r from-synth-amber to-synth-amberLight hover:from-synth-amberLight hover:to-synth-amber text-synth-white font-semibold shadow-lg hover:shadow-[0_6px_16px_rgba(255,176,32,0.4)] transition-all duration-300 rounded-2xl"
                onClick={() => handleAction({ type: 'CLAIM_AWARD' })}
              >
                Claim Award
              </Button>
              <Button
                size="default"
                className="w-full h-11 bg-gradient-to-r from-synth-amber to-synth-amberLight hover:from-synth-amberLight hover:to-synth-amber text-synth-white font-semibold shadow-lg hover:shadow-[0_6px_16px_rgba(255,176,32,0.4)] transition-all duration-300 rounded-2xl"
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
