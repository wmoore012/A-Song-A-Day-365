import { forwardRef, useImperativeHandle, useState } from "react";
import { X, FileText } from "lucide-react";
import { useAppStore } from "../store/store";

export type NotepadHandle = { open: () => void; close: () => void };

interface Note {
  id: string;
  text: string;
  timestamp: Date;
  sessionId: string;
}

type Props = {
  className?: string;
  onSave?: (text: string) => void;
};

const Notepad = forwardRef<NotepadHandle, Props>(function Notepad(_props, ref) {
  const { session } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);

  useImperativeHandle(ref, () => ({
    open: () => {
      setIsOpen(true);
    },
    close: () => setIsOpen(false),
  }));

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
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-50 px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white hover:bg-white/15 transition shadow-[0_0_12px_rgba(0,255,255,0.6)] hover:shadow-[0_0_24px_rgba(0,255,255,0.9)]"
        title="Open Notepad"
      >
        <FileText className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 left-6 z-50 w-80 max-h-[24rem] bg-black/90 border border-cyan-400/50 rounded-xl shadow-lg shadow-cyan-400/30 flex flex-col">
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

      <div className="p-4 flex-1 overflow-y-auto space-y-3">
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

      {/* Input area */}
      <div className="p-4 border-t border-cyan-400/30">
        <div className="flex gap-2">
          <textarea
            value={currentNote}
            onChange={(e) => setCurrentNote(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Write your ideas..."
            className="flex-1 bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder:text-white/40 resize-none"
            rows={2}
          />
          <button
            onClick={addNote}
            disabled={!currentNote.trim()}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-semibold rounded-lg transition-colors"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
});

export default Notepad;
