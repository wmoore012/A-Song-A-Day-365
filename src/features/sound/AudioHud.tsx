import { useRef, useEffect } from "react";
import { useAppStore } from "@/store/store";

// Fail loud: validate preconditions
function must<T>(value: T | null | undefined, msg: string): T {
  if (value == null) throw new Error(msg);
  return value;
}

export default function AudioHud({ 
  fadeOutRef 
}: { 
  fadeOutRef: React.MutableRefObject<() => void>;
}) {
  // Validate props
  if (!fadeOutRef) {
    throw new Error("AudioHud: fadeOutRef is required");
  }

  const { soundEnabled, setSoundEnabled } = useAppStore((s: any) => ({
    soundEnabled: s.soundEnabled,
    setSoundEnabled: s.setSoundEnabled
  }));

  const audioRef = useRef<HTMLAudioElement>(null);

  // Set up fade out function
  useEffect(() => {
    fadeOutRef.current = () => {
      if (!audioRef.current) return;
      const audio = audioRef.current;
      audio.volume = Math.max(0, audio.volume - 0.1);
      if (audio.volume <= 0) {
        audio.pause();
      } else {
        setTimeout(() => fadeOutRef.current(), 100);
      }
    };
  }, [fadeOutRef]);

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
    if (audioRef.current) {
      if (soundEnabled) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(() => {
          // User gesture required for autoplay
          console.log("Audio play requires user gesture");
        });
      }
    }
  };

  return (
    <div 
      className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-5"
      data-testid="audio-hud"
    >
      <div className="text-sm opacity-80 mb-3">Focus Audio</div>
      
      <button
        onClick={toggleSound}
        className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 font-medium transition-colors"
        data-testid="sound-toggle"
        aria-label={soundEnabled ? "Disable sound" : "Enable sound"}
      >
        {soundEnabled ? "🔊 Sound On" : "🔇 Sound Off"}
      </button>

      {soundEnabled && (
        <audio
          ref={audioRef}
          loop
          preload="none"
          className="hidden"
        >
          {/* Add your audio source here */}
          <source src="/audio/focus.mp3" type="audio/mpeg" />
        </audio>
      )}
    </div>
  );
}