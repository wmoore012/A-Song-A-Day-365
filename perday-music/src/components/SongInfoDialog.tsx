import { useState } from 'react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Music, Save, X } from 'lucide-react';

interface SongInfo {
  title: string;
  artist: string;
  genre: string;
  bpm: number;
  key: string;
  mood: string;
  notes: string;
  recordingDate: string;
  duration: string;
  tempo: string;
  timeSignature: string;
  instruments: string;
  producer: string;
  engineer: string;
  studio: string;
  tags: string;
}

export default function SongInfoDialog() {
  const [open, setOpen] = useState(false);
  const [songInfo, setSongInfo] = useState<SongInfo>({
    title: '',
    artist: '',
    genre: '',
    bpm: 120,
    key: '',
    mood: '',
    notes: '',
    recordingDate: new Date().toISOString().split('T')[0],
    duration: '',
    tempo: '',
    timeSignature: '',
    instruments: '',
    producer: '',
    engineer: '',
    studio: '',
    tags: ''
  });

  const handleInputChange = (field: keyof SongInfo, value: string | number) => {
    setSongInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Here you would typically save to your state management or API
    console.log('Song info saved:', songInfo);
    setOpen(false);
    // Reset form
    setSongInfo({
      title: '',
      artist: '',
      genre: '',
      bpm: 120,
      key: '',
      mood: '',
      notes: '',
      recordingDate: new Date().toISOString().split('T')[0],
      duration: '',
      tempo: '',
      timeSignature: '',
      instruments: '',
      producer: '',
      engineer: '',
      studio: '',
      tags: ''
    });
  };

  const genres = ['Hip Hop', 'R&B', 'Pop', 'Rock', 'Electronic', 'Jazz', 'Classical', 'Country', 'Folk', 'Blues', 'Reggae', 'Latin', 'Metal', 'Punk', 'Indie', 'Alternative'];
  const keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const moods = ['Energetic', 'Chill', 'Dark', 'Uplifting', 'Melancholic', 'Aggressive', 'Smooth', 'Intense', 'Peaceful', 'Chaotic', 'Romantic', 'Mysterious'];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-synth-amber/20 hover:bg-synth-amber/30 border-synth-amber/40 hover:border-synth-amber/60 text-synth-amber">
          <Music className="h-4 w-4 mr-2" />
          Add Song Info
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto bg-synth-violet/10 border-synth-violet/40 text-synth-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-synth-white flex items-center gap-2">
            <Music className="h-6 w-6 text-synth-amber" />
            Song Information
          </DialogTitle>
          <DialogDescription className="text-synth-icy">
            Enter comprehensive details about your track. This helps with organization and future reference.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-synth-icy">Title *</Label>
              <Input
                id="title"
                value={songInfo.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="bg-synth-violet/20 border-synth-violet/40 text-synth-white focus:border-synth-amber/60"
                placeholder="Song title"
              />
            </div>
            
            <div>
              <Label htmlFor="artist" className="text-synth-icy">Artist *</Label>
              <Input
                id="artist"
                value={songInfo.artist}
                onChange={(e) => handleInputChange('artist', e.target.value)}
                className="bg-synth-violet/20 border-synth-violet/40 text-synth-white focus:border-synth-amber/60"
                placeholder="Artist name"
              />
            </div>
            
            <div>
              <Label htmlFor="genre" className="text-synth-icy">Genre</Label>
              <select
                id="genre"
                value={songInfo.genre}
                onChange={(e) => handleInputChange('genre', e.target.value)}
                className="w-full px-3 py-2 bg-synth-violet/20 border border-synth-violet/40 text-synth-white rounded-md focus:outline-none focus:ring-2 focus:ring-synth-amber/60"
              >
                <option value="">Select genre</option>
                {genres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>
            
            <div>
              <Label htmlFor="bpm" className="text-synth-icy">BPM</Label>
              <Input
                id="bpm"
                type="number"
                value={songInfo.bpm}
                onChange={(e) => handleInputChange('bpm', parseInt(e.target.value) || 120)}
                className="bg-synth-violet/20 border-synth-violet/40 text-synth-white focus:border-synth-amber/60"
                min="60"
                max="200"
              />
            </div>
          </div>
          
          {/* Musical Details */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="key" className="text-synth-icy">Key</Label>
              <select
                id="key"
                value={songInfo.key}
                onChange={(e) => handleInputChange('key', e.target.value)}
                className="w-full px-3 py-2 bg-synth-violet/20 border border-synth-violet/40 text-synth-white rounded-md focus:outline-none focus:ring-2 focus:ring-synth-amber/60"
              >
                <option value="">Select key</option>
                {keys.map(key => (
                  <option key={key} value={key}>{key}</option>
                ))}
              </select>
            </div>
            
            <div>
              <Label htmlFor="mood" className="text-synth-icy">Mood</Label>
              <select
                id="mood"
                value={songInfo.mood}
                onChange={(e) => handleInputChange('mood', e.target.value)}
                className="w-full px-3 py-2 bg-synth-violet/20 border border-synth-violet/40 text-synth-white rounded-md focus:outline-none focus:ring-2 focus:ring-synth-amber/60"
              >
                <option value="">Select mood</option>
                {moods.map(mood => (
                  <option key={mood} value={mood}>{mood}</option>
                ))}
              </select>
            </div>
            
            <div>
              <Label htmlFor="timeSignature" className="text-synth-icy">Time Signature</Label>
              <Input
                id="timeSignature"
                value={songInfo.timeSignature}
                onChange={(e) => handleInputChange('timeSignature', e.target.value)}
                className="bg-synth-violet/20 border-synth-violet/40 text-synth-white focus:border-synth-amber/60"
                placeholder="4/4, 3/4, 6/8..."
              />
            </div>
            
            <div>
              <Label htmlFor="duration" className="text-synth-icy">Duration</Label>
              <Input
                id="duration"
                value={songInfo.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                className="bg-synth-violet/20 border-synth-violet/40 text-synth-white focus:border-synth-amber/60"
                placeholder="3:45"
              />
            </div>
          </div>
          
          {/* Technical Details */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="instruments" className="text-synth-icy">Instruments</Label>
              <Input
                id="instruments"
                value={songInfo.instruments}
                onChange={(e) => handleInputChange('instruments', e.target.value)}
                className="bg-synth-violet/20 border-synth-violet/40 text-synth-white focus:border-synth-amber/60"
                placeholder="Drums, Bass, Guitar, Synth..."
              />
            </div>
            
            <div>
              <Label htmlFor="producer" className="text-synth-icy">Producer</Label>
              <Input
                id="producer"
                value={songInfo.producer}
                onChange={(e) => handleInputChange('producer', e.target.value)}
                className="bg-synth-violet/20 border-synth-violet/40 text-synth-white focus:border-synth-amber/60"
                placeholder="Producer name"
              />
            </div>
            
            <div>
              <Label htmlFor="engineer" className="text-synth-icy">Engineer</Label>
              <Input
                id="engineer"
                value={songInfo.engineer}
                onChange={(e) => handleInputChange('engineer', e.target.value)}
                className="bg-synth-violet/20 border-synth-violet/40 text-synth-white focus:border-synth-amber/60"
                placeholder="Engineer name"
              />
            </div>
            
            <div>
              <Label htmlFor="studio" className="text-synth-icy">Studio</Label>
              <Input
                id="studio"
                value={songInfo.studio}
                onChange={(e) => handleInputChange('studio', e.target.value)}
                className="bg-synth-violet/20 border-synth-violet/40 text-synth-white focus:border-synth-amber/60"
                placeholder="Studio name"
              />
            </div>
          </div>
          
          {/* Additional Info */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="recordingDate" className="text-synth-icy">Recording Date</Label>
              <Input
                id="recordingDate"
                type="date"
                value={songInfo.recordingDate}
                onChange={(e) => handleInputChange('recordingDate', e.target.value)}
                className="bg-synth-violet/20 border-synth-violet/40 text-synth-white focus:border-synth-amber/60"
              />
            </div>
            
            <div>
              <Label htmlFor="tempo" className="text-synth-icy">Tempo Description</Label>
              <Input
                id="tempo"
                value={songInfo.tempo}
                onChange={(e) => handleInputChange('tempo', e.target.value)}
                className="bg-synth-violet/20 border-synth-violet/40 text-synth-white focus:border-synth-amber/60"
                placeholder="Fast, Slow, Medium..."
              />
            </div>
            
            <div>
              <Label htmlFor="tags" className="text-synth-icy">Tags</Label>
              <Input
                id="tags"
                value={songInfo.tags}
                onChange={(e) => handleInputChange('tags', e.target.value)}
                className="bg-synth-violet/20 border-synth-violet/40 text-synth-white focus:border-synth-amber/60"
                placeholder="summer, upbeat, featured..."
              />
            </div>
          </div>
        </div>
        
        {/* Notes Section - Full Width */}
        <div className="space-y-2">
          <Label htmlFor="notes" className="text-synth-icy">Notes</Label>
          <Textarea
            id="notes"
            value={songInfo.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            className="bg-synth-violet/20 border-synth-violet/40 text-synth-white focus:border-synth-amber/60 min-h-[100px]"
            placeholder="Additional notes about the song, production process, or anything else..."
          />
        </div>
        
        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="border-synth-icy/40 text-synth-icy hover:bg-synth-icy/20"
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!songInfo.title || !songInfo.artist}
            className="bg-synth-amber/20 hover:bg-synth-amber/30 border-synth-amber/40 hover:border-synth-amber/60 text-synth-amber"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Song Info
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
