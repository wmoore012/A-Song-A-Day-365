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
    <section className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-6">
      <div className="text-lg font-semibold text-white/90 mb-4">🎵 Music & Room Tone</div>
      
      {!armed ? (
        <div className="text-center">
          <div className="text-sm text-white/60 mb-4">Enable sound to get the full experience</div>
          <button 
            className="px-6 py-3 rounded-xl bg-[#7c5cff] hover:bg-[#8e77ff] font-bold shadow hover:shadow-[0_8px_20px_rgba(124,92,255,.25)] transition" 
            onClick={() => setArmed(true)}
          >
            🔊 Enable Sound
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">🎵 Music</span>
            <button 
              className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-xs font-medium"
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
              ⏯️ Toggle
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">🌊 White Noise</span>
            <button 
              className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-xs font-medium"
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
              ⏯️ Toggle
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
