import { useEffect, useRef, useState } from "react";

/** --- YouTube loader (single-flight, callback-safe) --- */
let ytReadyPromise: Promise<void> | null = null;
const ytReadyResolvers: Array<() => void> = [];

function loadYouTubeAPI(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.YT?.Player) return Promise.resolve();

  if (!ytReadyPromise) {
    ytReadyPromise = new Promise<void>((resolve) => {
      ytReadyResolvers.push(resolve);

      // Inject once
      if (!document.querySelector<HTMLScriptElement>('script[src="https://www.youtube.com/iframe_api"]')) {
        const s = document.createElement("script");
        s.src = "https://www.youtube.com/iframe_api";
        s.async = true;
        document.head.appendChild(s);
      }

      // Chain any existing callback instead of clobbering
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        prev?.();
        ytReadyResolvers.splice(0).forEach((r) => r());
      };
    });
  }
  return ytReadyPromise;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type YTPlayer = any;

async function createPlayer(container: HTMLElement, videoId: string, { autoplay, loop }: { autoplay: 0 | 1; loop?: 0 | 1 }): Promise<YTPlayer> {
  await loadYouTubeAPI();
  if (!window.YT?.Player) throw new Error('YouTube API not available');
  return new window.YT.Player(container, {
    videoId,
    playerVars: {
      autoplay,
      controls: 0,
      rel: 0,
      modestbranding: 1,
      iv_load_policy: 3,
      disablekb: 1,
      fs: 0,
      playsinline: 1,
      origin: window.location.origin,
      ...(loop ? { loop: 1, playlist: videoId } : {}),
    },
    events: {
      onReady: (ev: { target: YTPlayer }) => {
        try {
          ev.target.setVolume(15);
          if (autoplay) ev.target.playVideo();
        } catch { /* ignore */ }
      },
      onError: () => { /* toast or telemetry if you want */ },
    },
  });
}

function fadeVolume(player: YTPlayer | null | undefined, to: number, ms = 600) {
  if (!player) return;
  try {
    const start = performance.now();
    const from = Math.max(0, Math.min(100, player.getVolume?.() ?? 15));
    const step = (t: number) => {
      const k = Math.min(1, (t - start) / ms);
      const val = Math.round(from + (to - from) * k);
      player.setVolume(val);
      if (k < 1) requestAnimationFrame(step);
      else if (to === 0) player.pauseVideo?.();
    };
    requestAnimationFrame(step);
  } catch { /* ignore */ }
}

declare global {
  interface Window {
    YT?: { Player: new (el: HTMLElement, cfg: any) => YTPlayer };
    onYouTubeIframeAPIReady?: () => void;
  }
}

export default function AudioHud({ fadeOutRef }: { fadeOutRef: React.MutableRefObject<() => void> }) {
  const [armed, setArmed] = useState(false);
  const musicRef = useRef<HTMLDivElement>(null);
  const noiseRef = useRef<HTMLDivElement>(null);
  const music = useRef<YTPlayer | null>(null);
  const noise = useRef<YTPlayer | null>(null);

  // expose fadeOut
  useEffect(() => {
    fadeOutRef.current = () => {
      fadeVolume(music.current, 0, 800);
      fadeVolume(noise.current, 0, 800);
    };
  }, [fadeOutRef]);

  useEffect(() => {
    let cancelled = false;
    if (!armed) return;

    (async () => {
      try {
        if (musicRef.current && !music.current) {
          music.current = await createPlayer(musicRef.current, "b0wbCtrGjXA", { autoplay: 1 });
          if (cancelled) music.current?.destroy?.();
        }
        if (noiseRef.current && !noise.current) {
          // loop requires playlist=videoId
          noise.current = await createPlayer(noiseRef.current, "xdJ58r0k340", { autoplay: 0, loop: 1 });
          if (cancelled) noise.current?.destroy?.();
        }
      } catch { /* ignore */ }
    })();

    return () => {
      cancelled = true;
      try { music.current?.destroy?.(); } catch {}
      try { noise.current?.destroy?.(); } catch {}
      music.current = null;
      noise.current = null;
    };
  }, [armed]);

  return (
    <section className="rounded-2xl bg-gradient-to-br from-synth-violet/10 to-synth-aqua/10 ring-1 ring-synth-icy/30 p-8 shadow-2xl backdrop-blur-sm border border-synth-icy/20 z-20">
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
              <div className="text-xs text-synth-icy">vol ~15%</div>
            </div>
            <button
              className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-synth-violet to-synth-magenta hover:from-synth-magenta hover:to-synth-violet font-bold shadow-lg hover:shadow-[0_8px_20px_rgba(108,26,237,0.4)] transition-all duration-300 transform hover:scale-[1.02]"
              onClick={() => {
                try {
                  const s = music.current?.getPlayerState?.();
                  if (s === 1) music.current?.pauseVideo?.();
                  else music.current?.playVideo?.();
                } catch {}
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
              <div className="text-xs text-synth-icy">vol ~15%</div>
            </div>
            <button
              className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-synth-aqua to-synth-icy hover:from-synth-icy hover:to-synth-aqua font-bold shadow-lg hover:shadow-[0_8px_20px_rgba(85,203,220,0.4)] transition-all duration-300 transform hover:scale-[1.02]"
              onClick={() => {
                try {
                  const s = noise.current?.getPlayerState?.();
                  if (s === 1) noise.current?.pauseVideo?.();
                  else noise.current?.playVideo?.();
                } catch {}
              }}
            >
              ⏯️ Toggle White Noise
            </button>
          </div>
        </div>
      )}

      {/* Keep players in the tree (1×1 visible to API), but non-interactive */}
      <div className="absolute w-px h-px -m-px overflow-hidden p-0 border-0 pointer-events-none" ref={musicRef} aria-hidden />
      <div className="absolute w-px h-px -m-px overflow-hidden p-0 border-0 pointer-events-none" ref={noiseRef} aria-hidden />
      <div className="text-xs opacity-60 mt-4">Autoplay requires a click (browser policy).</div>
    </section>
  );
}
