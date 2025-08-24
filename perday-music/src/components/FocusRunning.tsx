import { useState, useRef, useEffect } from 'react';
import { useSessionStore } from '../state/store';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Clock, Target, MessageSquare, Pause, Square } from 'lucide-react';
import MultiplierBar from './MultiplierBar';

export default function FocusRunning() {
  const { session, dispatch } = useSessionStore();
  const [timeRemaining, setTimeRemaining] = useState((session.durationMin || 25) * 60);
  const [isPaused, setIsPaused] = useState(false);
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState<string[]>([]);
  const intervalRef = useRef<number | undefined>(undefined);

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

  const progress = ((session.durationMin! * 60 - timeRemaining) / (session.durationMin! * 60)) * 100;

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-8">
      <div className="bg-gradient-to-br from-magenta-900/20 via-cyan-900/20 to-purple-900/20 backdrop-blur-xl ring-1 ring-cyan-400/30 rounded-2xl p-8 max-w-2xl w-full">
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
          
          {/* Progress Bar */}
          <div className="w-full bg-black/30 rounded-full h-3 mb-4">
            <div 
              className="bg-gradient-to-r from-cyan-400 to-magenta-500 h-3 rounded-full transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <p className="text-synth-icy/70">
            {Math.round(progress)}% complete
          </p>
        </div>

        {/* Multiplier Bar */}
        <div className="mb-8">
          <MultiplierBar 
            multiplier={1.5}
          />
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
      </div>
    </div>
  );
}
