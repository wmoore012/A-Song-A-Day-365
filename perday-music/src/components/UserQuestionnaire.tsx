import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Calendar } from './ui/calendar';
import { Settings } from 'lucide-react';

interface UserQuestionnaireProps {
  onComplete: (data: { name: string; collaborators: string; sessionDate?: Date }) => void;
}

export default function UserQuestionnaire({ onComplete }: UserQuestionnaireProps) {
  const [name, setName] = useState('');
  const [collaborators, setCollaborators] = useState('');
  const [date, setDate] = useState<Date | undefined>(new Date());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onComplete({
        name: name.trim(),
        collaborators: collaborators.trim(),
        sessionDate: date
      });
    }
  };

  return (
    <Card className="w-full max-w-md bg-gradient-to-br from-magenta-900/20 via-cyan-900/20 to-purple-900/20 backdrop-blur-xl ring-1 ring-cyan-400/30">
      <CardHeader>
        <div className="flex items-center justify-center gap-2 mb-2">
          <Settings className="h-5 w-5 text-cyan-300" />
          <CardTitle className="text-synth-white">Welcome to Perday Music 365</CardTitle>
        </div>
        <CardDescription className="text-synth-icy/70 text-center">
          Let's get you set up for your creative session
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-synth-white">What's your name?</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="bg-black/40 border-cyan-400/40 text-synth-white placeholder:text-synth-icy/50"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="collaborators" className="text-synth-white">Any collaborators today?</Label>
            <Select value={collaborators} onValueChange={setCollaborators}>
              <SelectTrigger className="bg-black/40 border-cyan-400/40 text-synth-white">
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent className="bg-black/90 border-cyan-400/40">
                <SelectItem value="solo">Solo session</SelectItem>
                <SelectItem value="duo">Duo collaboration</SelectItem>
                <SelectItem value="group">Group session</SelectItem>
                <SelectItem value="remote">Remote collaboration</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-synth-white">Session Date (for allnighters/backdating)</Label>
            <div className="bg-black/40 border border-cyan-400/40 rounded-lg p-3">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-lg border-0 bg-transparent text-synth-white"
              />
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-magenta-500 via-cyan-400 to-purple-600 hover:from-magenta-600 hover:via-cyan-500 hover:to-purple-700 text-synth-white"
            disabled={!name.trim()}
          >
            Let's Get Started
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
