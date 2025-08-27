import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { X, Save, Trash2 } from "lucide-react";
import { cn } from "../lib/utils";

export type NotepadHandle = { open: () => void; close: () => void };

type Props = {
  className?: string;
  onSave?: (text: string) => void;
};

const Notepad = forwardRef<NotepadHandle, Props>(function Notepad({ className, onSave }, ref) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useImperativeHandle(ref, () => ({
    open: () => {
      setOpen(true);
      setTimeout(() => textareaRef.current?.focus(), 50);
    },
    close: () => setOpen(false),
  }));

  if (!open) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[60]">
      <div
        className={cn(
          "w-[420px] max-h-[70vh] flex flex-col rounded-2xl border border-white/10",
          "bg-white/6 backdrop-blur-xl shadow-2xl overflow-hidden",
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <div className="text-sm font-semibold text-white/80">Notepad</div>
          <button
            className="p-1 rounded-md hover:bg-white/10 text-white/70"
            onClick={() => setOpen(false)}
            aria-label="Close Notepad"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content (scrolls) */}
        <div className="p-3 overflow-auto min-h-[180px] max-h-[46vh]">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Jot ideas, todos, mix notes…"
            className="w-full h-[36vh] resize-none bg-transparent outline-none text-white/90 placeholder:text-white/40 leading-relaxed"
          />
        </div>

        {/* Footer (sticky & tidy) */}
        <div className="flex items-center justify-between gap-2 px-3 py-3 border-t border-white/10 bg-black/25">
          <button
            className="px-3 py-2 text-sm rounded-lg bg-white/10 hover:bg-white/15 text-white/80 flex items-center gap-2"
            onClick={() => setValue("")}
          >
            <Trash2 className="w-4 h-4" /> Clear
          </button>
          <button
            className="px-3 py-2 text-sm rounded-lg bg-cyan-500/90 hover:bg-cyan-400 text-black font-semibold flex items-center gap-2"
            onClick={() => onSave?.(value)}
          >
            <Save className="w-4 h-4" /> Save
          </button>
        </div>
      </div>
    </div>
  );
});

export default Notepad;
