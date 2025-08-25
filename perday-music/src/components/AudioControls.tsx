import { useEffect, useRef, useState } from 'react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Volume2, Play, Pause, SkipBack, SkipForward, Music, Settings } from 'lucide-react';
import { Label } from './ui/label';

declare global {
  interface Window {
    YT?: {
      Player: new (el: HTMLElement, cfg: any) => any;
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

type Props = {
  onVolumeChange: (v: number) => void;
  currentVolume: number;               // 0.0 - 1.0 (we'll map to 0..100)
  playlistId?: string;                 // YouTube playlist ID (NOT YT Music)
};

export default function AudioControls({
  onVolumeChange,
  currentVolume,
  playlistId = 'PLP4CSgl7K7or84AAhr7zlLN2DM2i4nEiP' // example: Lofi Girl playlist
}: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackName, setCurrentTrackName] = useState('Perday Music 365');
  const [isOpen, setIsOpen] = useState(false);

  const playerRef = useRef<any>(null);
  const mountRef = useRef<HTMLDivElement>(null);

  // Load & init YouTube IFrame API
  useEffect(() => {
    if (typeof window === 'undefined') return;
    let canceled = false;

    const init = () => {
      if (canceled || !mountRef.current || !window.YT?.Player) return;
      playerRef.current = new window.YT.Player(mountRef.current, {
        height: '0',
        width: '0',
        playerVars: {
          // playlist mode:
          listType: 'playlist',
          list: playlistId,
          autoplay: 0,
          controls: 0,
          origin: window.location.origin,
        },
        events: {
          onReady: (e: any) => {
            e.target.setVolume(Math.round(currentVolume * 100));
          },
          onStateChange: (e: any) => {
            // 1 = playing, 2 = paused, 0 = ended
            setIsPlaying(e.data === 1);
            const data = playerRef.current?.getVideoData?.();
            if (data?.title) setCurrentTrackName(data.title);
          },
        },
      });
    };

    if (!window.YT?.Player) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
      window.onYouTubeIframeAPIReady = init;
    } else {
      init();
    }

    return () => {
      canceled = true;
      try {
        playerRef.current?.destroy?.();
      } catch {}
    };
  }, [playlistId]);

  // keep volume in sync
  useEffect(() => {
    const vol0to100 = Math.round(currentVolume * 100);
    playerRef.current?.setVolume?.(vol0to100);
  }, [currentVolume]);

  const playPause = () => {
    if (!playerRef.current) return;
    // Must be triggered by a user gesture for browsers to allow sound
    if (isPlaying) playerRef.current.pauseVideo();
    else playerRef.current.playVideo();
  };

  const next = () => playerRef.current?.nextVideo?.();
  const prev = () => playerRef.current?.previousVideo?.();

  return (
    <>
      {/* Now Playing */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-xl border border-cyan-400/40 rounded-full px-4 py-2 z-50">
        <div className="flex items-center gap-3 text-synth-white text-sm">
          <Music className="h-4 w-4 text-cyan-300" />
          <span className="text-cyan-300">Now Playing:</span>
          <span className="text-synth-white">{currentTrackName}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="fixed top-4 right-4 flex items-center gap-3 z-50">
        <div className="flex items-center gap-2 bg-black/80 backdrop-blur-xl border border-cyan-400/40 rounded-full px-3 py-2">
          <Volume2 className="h-4 w-4 text-cyan-300" />
          <Slider
            value={[Math.round(currentVolume * 100)]}
            onValueChange={([v]) => onVolumeChange((v ?? 0) / 100)}
            max={100}
            step={5}
            className="w-20"
          />
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={playPause}
          className="bg-black/80 border-cyan-400/40 text-cyan-300 hover:bg-cyan-400/20"
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="bg-black/80 border-cyan-400/40 text-cyan-300 hover:bg-cyan-400/20">
              <Settings className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent className="bg-black/95 border-cyan-400/30 text-synth-white w-[400px]">
            <SheetHeader>
              <SheetTitle className="text-synth-white flex items-center gap-2">
                <Music className="h-5 w-5" />
                Audio Settings
              </SheetTitle>
              <SheetDescription className="text-synth-icy/70">
                Control YouTube playlist playback
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-6 mt-6">
              <div className="flex gap-2">
                <Button variant="outline" onClick={prev} className="flex-1 border-cyan-400/40 text-cyan-300 hover:bg-cyan-400/20">
                  <SkipBack className="h-4 w-4 mr-2" /> Previous
                </Button>
                <Button variant="outline" onClick={next} className="flex-1 border-cyan-400/40 text-cyan-300 hover:bg-cyan-400/20">
                  <SkipForward className="h-4 w-4 mr-2" /> Next
                </Button>
              </div>
              <div>
                <Label className="text-synth-white text-sm">Volume</Label>
                <Slider
                  value={[Math.round(currentVolume * 100)]}
                  onValueChange={([v]) => onVolumeChange((v ?? 0) / 100)}
                  max={100}
                  step={5}
                  className="w-full mt-2"
                />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Hidden IFrame mount (YouTube player lives here) */}
      <div ref={mountRef} aria-hidden />
    </>
  );
}
