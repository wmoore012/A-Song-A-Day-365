import { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { useAppStore } from '../store/store';
import { Save, FileText, X } from 'lucide-react';

interface Note {
  id: string;
  text: string;
  timestamp: Date;
  sessionId?: string;
}

const Notepad = forwardRef<{ open: () => void }, {}>((_, ref) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { session } = useAppStore();

  useImperativeHandle(ref, () => ({
    open: () => setIsOpen(true)
  }));

  // Load notes from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('perday-notes');
    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes));
      } catch (e) {
        console.error('Failed to load notes:', e);
      }
    }
  }, []);

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    localStorage.setItem('perday-notes', JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    if (!currentNote.trim()) return;

    const newNote: Note = {
      id: Date.now().toString(),
      text: currentNote.trim(),
      timestamp: new Date(),
      sessionId: session.state
    };

    setNotes(prev => [newNote, ...prev]);
    setCurrentNote('');
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addNote();
    }
  };

  if (!isOpen) {
    return null; // Don't render the button since it's controlled by GlassNavigationDock
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 h-96 bg-black/90 border border-cyan-400/50 rounded-xl shadow-lg shadow-cyan-400/30">
      <div className="flex items-center justify-between p-4 border-b border-cyan-400/30">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-cyan-300" />
          <span className="text-cyan-300 font-semibold">Notepad</span>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white/60 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 h-64 overflow-y-auto space-y-3">
        {notes.length === 0 ? (
          <p className="text-white/40 text-sm text-center mt-8">
            No notes yet. Start writing your ideas!
          </p>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className="bg-white/5 border border-white/10 rounded-lg p-3"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-white text-sm flex-1">{note.text}</p>
                <button
                  onClick={() => deleteNote(note.id)}
                  className="text-white/40 hover:text-white/80 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
              <p className="text-white/30 text-xs mt-2">
                {note.timestamp.toLocaleTimeString()}
              </p>
            </div>
          ))
        )}
      </div>

      <div className="p-4 border-t border-cyan-400/30">
        <div className="flex gap-2">
          <textarea
            value={currentNote}
            onChange={(e) => setCurrentNote(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Write your ideas here..."
            className="flex-1 bg-white/10 border border-cyan-400/30 rounded-lg px-3 py-2 text-white placeholder:text-white/50 text-sm resize-none"
            rows={2}
          />
          <button
            onClick={addNote}
            disabled={!currentNote.trim()}
            className="px-3 py-2 bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-500/50 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            <Save className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
});

export default Notepad;
