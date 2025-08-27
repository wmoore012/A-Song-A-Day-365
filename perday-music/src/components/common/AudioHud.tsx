import { useEffect, useRef, useState } from "react";
import { Volume2, Music, AudioWaveform } from 'lucide-react';
import { loadYouTubeAPI } from '../../lib/youtube';

// Remove duplicate YTPlayer type - use centralized types from youtube.d.ts
async function createPlayer(container: HTMLElement, videoId: string, { autoplay, loop }: { autoplay: 0 | 1; loop?: 0 | 1 }): Promise<YT.Player> {
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
      onReady: (ev: { target: YT.Player }) => {
        try {
          ev.target.setVolume(15);
          if (autoplay) ev.target.playVideo();
        } catch (error) {
    console.warn('Audio operation failed:', error);
  }
      },
      onError: () => { /* toast or telemetry if you want */ },
    },
  });
}

function fadeVolume(player: YT.Player | null | undefined, to: number, ms = 600) {
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
  } catch (error) {
    console.warn('Audio operation failed:', error);
  }
}

// YT types declared in src/types/youtube.d.ts

export default function AudioHud({ fadeOutRef }: { fadeOutRef: React.MutableRefObject<() => void> }) {
  const [armed, setArmed] = useState(false);
  const musicRef = useRef<HTMLDivElement>(null);
  const noiseRef = useRef<HTMLDivElement>(null);
  const music = useRef<YT.Player | null>(null);
  const noise = useRef<YT.Player | null>(null);

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
      } catch (error) {
    console.warn('Audio operation failed:', error);
  }
    })();

    return () => {
      cancelled = true;
      try { music.current?.destroy?.(); } catch (error) {
        console.warn('Music player cleanup failed:', error);
      }
      try { noise.current?.destroy?.(); } catch (error) {
        console.warn('Noise player cleanup failed:', error);
      }
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
              } catch (error) {
                console.warn('Player control failed:', error);
              }
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
              } catch (error) {
                console.warn('Player control failed:', error);
              }
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
