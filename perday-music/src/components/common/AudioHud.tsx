import { useEffect, useState } from "react";
import { Volume2 } from 'lucide-react';
import AudioControls from '../AudioControls';
import AudioVisualizer from '../AudioVisualizer';

export default function AudioHud({ fadeOutRef }: { fadeOutRef: React.MutableRefObject<() => void> }) {
  const [armed, setArmed] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [isPlaying, setIsPlaying] = useState(false);

  // expose fadeOut
  useEffect(() => {
    fadeOutRef.current = () => {
      // Fade out will be handled by AudioControls
      setIsPlaying(false);
    };
  }, [fadeOutRef]);

  // Don't auto-start music - let user control it manually
  useEffect(() => {
    if (!armed) {
      setIsPlaying(false);
    }
  }, [armed]);

  return (
    <>
      {/* Audio Controls - Shows when armed */}
      {armed && (
        <AudioControls
          currentVolume={volume}
          onVolumeChange={setVolume}
          playlistId="PLl-ShioB5kapLuMhLMqdyx_gKX_MBiXeb"
        />
      )}

      {/* Audio Visualizer - Shows when playing */}
      {armed && isPlaying && (
        <div className="fixed bottom-6 right-6 z-50">
          <AudioVisualizer isActive={true} size="medium" />
        </div>
      )}

      {/* Enable Sound Button */}
      <div className="fixed bottom-6 left-6 z-50">
        {!armed ? (
          <button
            className="px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white hover:bg-white/15 transition"
            onClick={() => setArmed(true)}
            aria-label="Enable Sound"
            title="Enable Sound"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        ) : (
          <button
            className="px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white hover:bg-white/15 transition"
            onClick={() => setArmed(false)}
            aria-label="Disable Sound"
            title="Disable Sound"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        )}
      </div>
    </>
  );
}
