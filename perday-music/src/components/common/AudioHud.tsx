import { useEffect, useRef, useState } from "react";
import { Volume2, Music, AudioWaveform } from 'lucide-react';

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
    <div className="fixed bottom-6 left-6 z-50 flex gap-3">
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
        <>
          <button
            className="px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white hover:bg-white/15 transition"
            onClick={() => {
              try {
                const s = music.current?.getPlayerState?.();
                if (s === 1) music.current?.pauseVideo?.();
                else music.current?.playVideo?.();
              } catch {}
            }}
            aria-label="Toggle Music"
            title="Toggle Music"
          >
            <Music className="w-5 h-5" />
          </button>
          
          <button
            className="px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white hover:bg-white/15 transition"
            onClick={() => {
              try {
                const s = noise.current?.getPlayerState?.();
                if (s === 1) noise.current?.pauseVideo?.();
                else noise.current?.playVideo?.();
              } catch {}
            }}
            aria-label="Toggle White Noise"
            title="Toggle White Noise"
          >
            <AudioWaveform className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Keep players in the tree (1×1 visible to API), but non-interactive */}
      <div className="absolute w-px h-px -m-px overflow-hidden p-0 border-0 pointer-events-none" ref={musicRef} aria-hidden />
      <div className="absolute w-px h-px -m-px overflow-hidden p-0 border-0 pointer-events-none" ref={noiseRef} aria-hidden />
    </div>
  );
}
