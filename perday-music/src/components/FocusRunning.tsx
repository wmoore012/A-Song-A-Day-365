import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../store/store';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Pause, Target, Clock, MessageSquare, Square, Music, Users } from 'lucide-react';
import { toast } from 'sonner';
import MultiplierBar from './MultiplierBar';
import GlassPanel from './common/GlassPanel';

export default function FocusRunning() {
  const { session, dispatch } = useAppStore();
  const [timeRemaining, setTimeRemaining] = useState((session.durationMin || 25) * 60);
  const [isPaused, setIsPaused] = useState(false);
  const [note, setNote] = useState('');
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  useEffect(() => {
    // Reduce villain messages when focus starts
    // reduceVillainMessages(); // This line was removed as per the new_code
  }, []); // Removed reduceVillainMessages from dependency array

  useEffect(() => {
    if (!isPaused && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            dispatch({ type: 'END_FOCUS' });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused, timeRemaining, dispatch]);

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleEndFocus = () => {
    dispatch({ type: 'END_FOCUS' });
  };

  const handleAddNote = () => {
    if (note.trim()) {
      dispatch({ type: 'ADD_NOTE', payload: note.trim() });
      setNote('');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <GlassPanel className="bg-gradient-to-br from-magenta-900/20 via-cyan-900/20 to-purple-900/20 p-8 max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-synth-white mb-2">Focus Session</h1>
          <p className="text-synth-icy/70">Stay focused, stay productive</p>
        </div>

        {/* Session Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-black/20 p-4 rounded-lg border border-cyan-400/30">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-5 w-5 text-cyan-300" />
              <Label className="text-synth-white font-semibold">Target</Label>
            </div>
            <p className="text-synth-white">{session.target}</p>
          </div>
          
          <div className="bg-black/20 p-4 rounded-lg border border-cyan-400/30">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-cyan-300" />
              <Label className="text-synth-white font-semibold">Duration</Label>
            </div>
            <p className="text-synth-white">{session.durationMin} minutes</p>
          </div>
        </div>

        {/* Timer */}
        <div className="text-center mb-8">
          <div className="text-8xl font-black tabular-nums font-mono text-synth-white mb-4">
            {formatTime(timeRemaining)}
          </div>
        </div>

        {/* Time Remaining Bar */}
        <div className="mb-8">
          <MultiplierBar 
            multiplier={timeRemaining / (session.durationMin! * 60)}
            className="time-remaining-bar"
            isTimeRemaining={true}
          />
        </div>

        {/* Studio Vibes and Focusmate */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button
            className="px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white hover:bg-white/15 transition relative group"
            onClick={() => {
              window.open('https://www.youtube.com/playlist?list=PLrAXtmRdnEQy4qtr5qFJUYgI6wvWXqLh', '_blank');
              toast.success('Studio vibes playlist opened!');
            }}
            title="Visual inspiration videos - watch on mute on your second screen"
          >
                              <Music className="w-5 h-5 mr-2" />
                  Studio Vibes
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black/90 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
              Visual inspiration videos - watch on mute on your second screen
            </div>
          </button>
          <button
            className="px-4 py-3 rounded-xl bg-blue-500/80 border border-blue-400/50 text-white hover:bg-blue-400/90 transition relative group"
            onClick={() => {
              window.open('https://www.focusmate.com/', '_blank');
              toast.success('Focusmate opened!');
            }}
            title="Get paired with an accountability partner for virtual coworking"
          >
                              <Users className="w-5 h-5 mr-2" />
                  Focusmate
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black/90 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
              Get paired with an accountability partner for virtual coworking
            </div>
          </button>
        </div>

        {/* Notes */}
        <div className="mb-8">
          <Label className="text-synth-white font-semibold flex items-center gap-2 mb-3">
            <MessageSquare className="h-5 w-5" />
            Add Note
          </Label>
          <div className="flex gap-3">
            <Input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Capture your thoughts..."
              className="flex-1 bg-black/40 border-cyan-400/40 text-synth-white placeholder:text-synth-icy/50"
            />
            <Button
              onClick={handleAddNote}
              disabled={!note.trim()}
              className="bg-gradient-to-r from-magenta-500 to-cyan-400 hover:from-magenta-600 hover:to-cyan-500 text-synth-white"
            >
              Add
            </Button>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex gap-4 justify-center">
          <Button
            onClick={handlePause}
            variant="outline"
            className="border-cyan-400/40 text-cyan-300 hover:bg-cyan-400/20 px-8"
          >
            <Pause className="h-4 w-4 mr-2" />
            {isPaused ? 'Resume' : 'Pause'}
          </Button>
          
          <Button
            onClick={handleEndFocus}
            className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-synth-white px-8"
          >
            <Square className="h-4 w-4 mr-2" />
            End Session
          </Button>
        </div>
      </GlassPanel>
    </div>
  );
}
