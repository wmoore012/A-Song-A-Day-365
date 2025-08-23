import { useEffect, useRef, useState } from "react";

declare global { 
  interface Window { 
    YT?: any; 
    onYouTubeIframeAPIReady?: () => void 
  } 
}

export default function AudioHud({ fadeOutRef }: { fadeOutRef: React.MutableRefObject<() => void> }) {
  const [armed, setArmed] = useState(false);
  const musicRef = useRef<HTMLDivElement>(null);
  const noiseRef = useRef<HTMLDivElement>(null);
  const m = useRef<any>(null); 
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
          try { m.current.pauseVideo(); } catch {} 
          clearInterval(id); 
        }
        try { m.current.setVolume(v); } catch {}
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
    return () => { try { m.current?.destroy(); n.current?.destroy(); } catch {} };
  }, [armed]);

  return (
    <section className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-5">
      <div className="text-sm opacity-80">Music & Room Tone</div>
      {!armed && <button className="mt-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 font-bold" onClick={() => setArmed(true)}>Enable Sound</button>}
      <div className="sr-only" ref={musicRef} aria-hidden />
      <div className="sr-only" ref={noiseRef} aria-hidden />
      <div className="text-xs opacity-60 mt-2">Autoplay requires a click (browser policy).</div>
    </section>
  );
}
