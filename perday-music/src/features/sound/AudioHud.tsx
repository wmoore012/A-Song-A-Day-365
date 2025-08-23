import { useEffect, useRef, useState } from "react";

declare global { 
  interface Window { 
    YT?: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Player: new (element: HTMLElement, config: any) => any;
    }; 
    onYouTubeIframeAPIReady?: () => void 
  } 
}

export default function AudioHud({ fadeOutRef }: { fadeOutRef: React.MutableRefObject<() => void> }) {
  const [armed, setArmed] = useState(false);
  const musicRef = useRef<HTMLDivElement>(null);
  const noiseRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const m = useRef<any>(null); 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const n = useRef<any>(null);

  // expose fadeOut
  useEffect(() => {
    fadeOutRef.current = () => {
      if (!m.current) return;
      let v = 15; 
      const id = setInterval(() => {
        v -= 3; 
        if (v <= 0) { 
          v = 0; 
          try { m.current.pauseVideo(); } catch { /* YouTube API error */ } 
          clearInterval(id); 
        }
        try { m.current.setVolume(v); } catch { /* YouTube API error */ }
      }, 120);
    };
  }, [fadeOutRef]);

  useEffect(() => {
    if (!armed) return;
    const ensure = () => {
      if (!window.YT?.Player) return;
      if (musicRef.current && !m.current) {
        m.current = new window.YT.Player(musicRef.current, {
          videoId: "b0wbCtrGjXA", 
          playerVars: { autoplay: 1, controls: 0, rel: 0, modestbranding: 1 },
          events: { onReady: () => m.current?.setVolume(15) }
        });
      }
      if (noiseRef.current && !n.current) {
        n.current = new window.YT.Player(noiseRef.current, {
          videoId: "xdJ58r0k340", 
          playerVars: { autoplay: 0, controls: 0, rel: 0, modestbranding: 1, loop: 1 },
          events: { onReady: () => n.current?.setVolume(15) }
        });
      }
    };
    if (!window.YT) { 
      const s = document.createElement("script"); 
      s.src = "https://www.youtube.com/iframe_api"; 
      document.head.appendChild(s); 
      window.onYouTubeIframeAPIReady = ensure; 
    }
    else ensure();
    return () => { try { m.current?.destroy(); n.current?.destroy(); } catch { /* YouTube API error */ } };
  }, [armed]);

  return (
    <section className="rounded-2xl bg-gradient-to-br from-synth-violet/10 to-synth-aqua/10 ring-1 ring-synth-icy/30 p-8 shadow-2xl backdrop-blur-sm border border-synth-icy/20">
      <div className="text-xl font-bold text-synth-white mb-6 flex items-center">
        <span className="text-2xl mr-3">🎵</span>
        Music & Room Tone
      </div>
      
      {!armed ? (
        <div className="text-center">
          <div className="text-sm text-synth-icy/80 mb-4">Enable sound to get the full experience</div>
          <button 
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-synth-violet to-synth-magenta hover:from-synth-magenta hover:to-synth-violet font-bold shadow-lg hover:shadow-[0_8px_20px_rgba(108,26,237,0.4)] transition-all duration-300" 
            onClick={() => setArmed(true)}
          >
            🔊 Enable Sound
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-synth-violet/20 to-synth-magenta/10 rounded-xl p-4 border border-synth-violet/30">
            <div className="flex items-center justify-between mb-3">
              <span className="text-lg font-semibold text-synth-white flex items-center">
                <span className="text-2xl mr-2">🎵</span>
                Music
              </span>
              <div className="text-xs text-synth-icy">vol 15%</div>
            </div>
            <button 
              className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-synth-violet to-synth-magenta hover:from-synth-magenta hover:to-synth-violet font-bold shadow-lg hover:shadow-[0_8px_20px_rgba(108,26,237,0.4)] transition-all duration-300 transform hover:scale-[1.02]"
              onClick={() => {
                try { 
                  if (m.current?.getPlayerState() === 1) {
                    m.current?.pauseVideo();
                  } else {
                    m.current?.playVideo();
                  }
                } catch { /* YouTube API error */ }
              }}
            >
              ⏯️ Toggle Music
            </button>
          </div>
          
          <div className="bg-gradient-to-r from-synth-aqua/20 to-synth-icy/10 rounded-xl p-4 border border-synth-aqua/30">
            <div className="flex items-center justify-between mb-3">
              <span className="text-lg font-semibold text-synth-white flex items-center">
                <span className="text-2xl mr-2">🌊</span>
                White Noise
              </span>
              <div className="text-xs text-synth-icy">vol 15%</div>
            </div>
            <button 
              className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-synth-aqua to-synth-icy hover:from-synth-icy hover:to-synth-aqua font-bold shadow-lg hover:shadow-[0_8px_20px_rgba(85,203,220,0.4)] transition-all duration-300 transform hover:scale-[1.02]"
              onClick={() => {
                try { 
                  if (n.current?.getPlayerState() === 1) {
                    n.current?.pauseVideo();
                  } else {
                    n.current?.playVideo();
                  }
                } catch { /* YouTube API error */ }
              }}
            >
              ⏯️ Toggle White Noise
            </button>
          </div>
        </div>
      )}
      
      <div className="sr-only" ref={musicRef} aria-hidden />
      <div className="sr-only" ref={noiseRef} aria-hidden />
      <div className="text-xs opacity-60 mt-4">Autoplay requires a click (browser policy).</div>
    </section>
  );
}
