import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Volume2, Play, Pause, SkipBack, SkipForward, Music, Settings } from 'lucide-react';
import { Label } from './ui/label';

interface AudioControlsProps {
  onVolumeChange: (volume: number) => void;
  currentVolume: number;
  enableStudioVibes?: boolean;
}

export default function AudioControls({ onVolumeChange, currentVolume, enableStudioVibes = false }: AudioControlsProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState('Perday Music 365 - Your Playlist');
  const [isOpen, setIsOpen] = useState(false);
  const [currentPlaylist, setCurrentPlaylist] = useState('default');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Playlists - only Studio Vibes should be available after cookup starts
  const playlists = {
    default: {
      name: 'Perday Music 365',
      description: 'Your main playlist for focus',
      url: 'https://music.youtube.com/playlist?list=PLl-ShioB5kapLuMhLMqdyx_gKX_MBiXeb&si=By4_9iaE7SmeA8Kj'
    },
    'studio-vibes': {
      name: 'Studio Vibes',
      description: 'Chill beats for focus (available after cookup)',
      url: 'https://music.youtube.com/playlist?list=PLl-ShioB5kapLuMhLMqdyx_gKX_MBiXeb&si=By4_9iaE7SmeA8Kj'
    },
    'focus-mate': {
      name: 'FocusMate',
      description: 'Upbeat energy for productivity',
      url: 'https://music.youtube.com/playlist?list=PLl-ShioB5kapLuMhLMqdyx_gKX_MBiXeb&si=By4_9iaE7SmeA8Kj'
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = currentVolume;
    }
  }, [currentVolume]);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const nextTrack = () => {
    // For now, just cycle through playlist names
    const playlistNames = Object.keys(playlists);
    const currentIndex = playlistNames.indexOf(currentPlaylist);
    const nextIndex = (currentIndex + 1) % playlistNames.length;
    const nextPlaylist = playlistNames[nextIndex];
    setCurrentPlaylist(nextPlaylist);
    setCurrentTrack(playlists[nextPlaylist].name);
  };

  const previousTrack = () => {
    const playlistNames = Object.keys(playlists);
    const currentIndex = playlistNames.indexOf(currentPlaylist);
    const prevIndex = currentIndex === 0 ? playlistNames.length - 1 : currentIndex - 1;
    const prevPlaylist = playlistNames[prevIndex];
    setCurrentPlaylist(prevPlaylist);
    setCurrentTrack(playlists[prevPlaylist].name);
  };

  return (
    <>
      {/* Now Playing Display */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-xl border border-cyan-400/40 rounded-full px-4 py-2 z-50">
        <div className="flex items-center gap-3 text-synth-white text-sm">
          <Music className="h-4 w-4 text-cyan-300" />
          <span className="text-cyan-300">Now Playing:</span>
          <span className="text-synth-white">{currentTrack}</span>
        </div>
      </div>

      {/* Audio Controls */}
      <div className="fixed top-4 right-4 flex items-center gap-3 z-50">
        {/* Volume Slider */}
        <div className="flex items-center gap-2 bg-black/80 backdrop-blur-xl border border-cyan-400/40 rounded-full px-3 py-2">
          <Volume2 className="h-4 w-4 text-cyan-300" />
          <Slider
            value={[currentVolume * 100]}
            onValueChange={([value]) => onVolumeChange(value / 100)}
            max={100}
            step={5}
            className="w-20"
          />
        </div>

        {/* Play/Pause Button */}
        <Button
          variant="outline"
          size="icon"
          onClick={togglePlayPause}
          className="bg-black/80 border-cyan-400/40 text-cyan-300 hover:bg-cyan-400/20"
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>

        {/* Audio Settings Sheet */}
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
                Control your background music and sound effects
              </SheetDescription>
            </SheetHeader>
            
            <div className="space-y-6 mt-6">
              {/* Playlist Selection */}
              <div className="space-y-3">
                <h3 className="text-synth-white font-medium">Select Playlist</h3>
                <div className="space-y-2">
                  {Object.entries(playlists).map(([id, playlist]) => (
                    <Button
                      key={id}
                      variant={currentPlaylist === id ? "default" : "outline"}
                      onClick={() => {
                        setCurrentPlaylist(id);
                        setCurrentTrack(playlist.name);
                      }}
                      className={`w-full justify-start ${
                        currentPlaylist === id 
                          ? 'bg-gradient-to-r from-magenta-500 via-cyan-400 to-purple-600' 
                          : 'bg-black/40 border-cyan-400/40 text-cyan-300 hover:bg-cyan-400/20'
                      }`}
                    >
                      {playlist.name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Volume Controls */}
              <div className="space-y-3">
                <h3 className="text-synth-white font-medium">Volume Levels</h3>
                <div className="space-y-4">
                  <div>
                    <Label className="text-synth-white text-sm">Background Music</Label>
                    <Slider
                      value={[currentVolume * 100]}
                      onValueChange={([value]) => onVolumeChange(value / 100)}
                      max={100}
                      step={5}
                      className="w-full mt-2"
                    />
                    <div className="text-xs text-synth-icy/70 text-center mt-1">
                      {Math.round(currentVolume * 100)}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-3">
                <h3 className="text-synth-white font-medium">Quick Actions</h3>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={previousTrack} className="flex-1 border-cyan-400/40 text-cyan-300 hover:bg-cyan-400/20">
                    <SkipBack className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  <Button variant="outline" onClick={nextTrack} className="flex-1 border-cyan-400/40 text-cyan-300 hover:bg-cyan-400/20">
                    <SkipForward className="h-4 w-4 mr-2" />
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src="/api/audio/studio-vibes" // This would be your actual audio source
        onEnded={nextTrack}
        preload="metadata"
      />
    </>
  );
}
