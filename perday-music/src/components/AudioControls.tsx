import { useEffect, useRef, useState } from 'react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Volume2, Play, Pause, SkipBack, SkipForward, Music, Settings } from 'lucide-react';

type YTPlayer = any; // keep simple, or import proper typings

interface AudioControlsProps {
  currentVolume: number;
  onVolumeChange: (v: number) => void;
  playlistId?: string; // YouTube playlist id (not YT Music)
}

export default function AudioControls({ 
  currentVolume, 
  onVolumeChange, 
  playlistId = 'PLl-ShioB5kapLuMhLMqdyx_gKX_MBiXeb' 
}: AudioControlsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackTitle, setTrackTitle] = useState<string>('Perday Music 365');
  const playerRef = useRef<YTPlayer | null>(null);
  const hostRef = useRef<HTMLDivElement>(null);

  // Load IFrame API once and build the player on first open/interaction
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if ((window as any).YT?.Player) return; // already loaded

    const s = document.createElement('script');
    s.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(s);
  }, []);

  // Create player on first open or first play click (user gesture => autoplay allowed)
  const ensurePlayer = () => {
    if (playerRef.current || !(window as any).YT?.Player || !hostRef.current) return;
    playerRef.current = new (window as any).YT.Player(hostRef.current, {
      width: 320,
      height: 180,
      playerVars: {
        modestbranding: 1,
        rel: 0,
        playsinline: 1,
        listType: 'playlist',
        list: playlistId,
      },
      events: {
        onReady: (e: any) => {
          e.target.setVolume(Math.round(currentVolume * 100));
          const vd = e.target.getVideoData?.();
          if (vd?.title) setTrackTitle(vd.title);
        },
        onStateChange: (e: any) => {
          // 1=playing, 2=paused, 0=ended
          setIsPlaying(e.data === 1);
          const vd = e.target.getVideoData?.();
          if (vd?.title) setTrackTitle(vd.title);
        },
      },
    });
  };

  // keep volume in sync
  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.setVolume?.(Math.round(currentVolume * 100));
    }
  }, [currentVolume]);

  const playPause = async () => {
    ensurePlayer();
    const p = playerRef.current;
    if (!p) return;
    if (isPlaying) p.pauseVideo?.();
    else p.playVideo?.();
  };
  const next = () => playerRef.current?.nextVideo?.();
  const prev = () => playerRef.current?.previousVideo?.();

  return (
    <>
      {/* Now Playing */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-40 bg-black/80 border border-cyan-400/40 backdrop-blur-xl rounded-full px-4 py-2">
        <div className="flex items-center gap-2 text-sm">
          <Music className="h-4 w-4 text-cyan-300" />
          <span className="text-cyan-300">Now Playing:</span>
          <span className="text-synth-white">{trackTitle}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="fixed top-4 right-4 z-40 flex items-center gap-3">
        <div className="flex items-center gap-2 bg-black/80 border border-cyan-400/40 rounded-full px-3 py-2">
          <Volume2 className="h-4 w-4 text-cyan-300" />
          <Slider value={[currentVolume * 100]} onValueChange={([v]) => onVolumeChange(v / 100)} max={100} step={5} className="w-20" />
        </div>

        <Button variant="outline" size="icon" className="bg-black/80 border-cyan-400/40 text-cyan-300 hover:bg-cyan-400/20" onClick={playPause}>
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>

        <Sheet open={isOpen} onOpenChange={(o) => { setIsOpen(o); if (o) ensurePlayer(); }}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="bg-black/80 border-cyan-400/40 text-cyan-300 hover:bg-cyan-400/20">
              <Settings className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent className="bg-black/95 border-cyan-400/30 text-synth-white w-[420px]">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2 text-synth-white">
                <Music className="h-5 w-5" /> Audio Settings
              </SheetTitle>
              <SheetDescription className="text-synth-icy/70">Control embedded YouTube playlist</SheetDescription>
            </SheetHeader>

            <div className="mt-6 space-y-6">
              <div className="rounded-xl overflow-hidden border border-cyan-400/30 bg-black/40">
                {/* YouTube iFrame will mount here */}
                <div ref={hostRef} className="w-full aspect-video" />
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 border-cyan-400/40 text-cyan-300" onClick={prev}>
                  <SkipBack className="h-4 w-4 mr-2" /> Previous
                </Button>
                <Button variant="outline" className="flex-1 border-cyan-400/40 text-cyan-300" onClick={next}>
                  <SkipForward className="h-4 w-4 mr-2" /> Next
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
