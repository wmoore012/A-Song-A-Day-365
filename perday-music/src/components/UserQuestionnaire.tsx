import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Calendar } from './ui/calendar';
import { Checkbox } from './ui/checkbox';
import { Settings, Users, UserPlus } from 'lucide-react';

interface UserQuestionnaireProps {
  onComplete: (data: { name: string; collaborators: string; sessionDate?: Date }) => void;
}

export default function UserQuestionnaire({ onComplete }: UserQuestionnaireProps) {
  const [name, setName] = useState('');
  const [collaborators, setCollaborators] = useState('');
  const [isRemote, setIsRemote] = useState(false);
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

  // Mock frequent collaborators (in real app, this would come from database)
  const frequentCollaborators = [
    { id: 1, name: "Alex Chen", email: "alex@example.com", lastSession: "2 days ago" },
    { id: 2, name: "Sam Rivera", email: "sam@example.com", lastSession: "1 week ago" },
    { id: 3, name: "Jordan Kim", email: "jordan@example.com", lastSession: "3 days ago" }
  ];

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
            <Label htmlFor="collaborators" className="text-synth-white flex items-center gap-2">
              <Users className="w-4 h-4" />
              Any collaborators today?
            </Label>
            <Select value={collaborators} onValueChange={setCollaborators}>
              <SelectTrigger className="bg-black/40 border-cyan-400/40 text-synth-white">
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent className="bg-black/90 border-cyan-400/40">
                <SelectItem value="solo">Solo session</SelectItem>
                <SelectItem value="duo">Duo collaboration</SelectItem>
                <SelectItem value="group">Group session</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Remote/In-person checkbox for duo collaboration */}
          {collaborators === 'duo' && (
            <div className="space-y-3 p-4 bg-white/5 rounded-lg border border-cyan-400/20">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="remote" 
                  checked={isRemote} 
                  onCheckedChange={(checked) => setIsRemote(checked as boolean)}
                  className="border-cyan-400/40 data-[state=checked]:bg-cyan-400 data-[state=checked]:border-cyan-400"
                />
                <Label htmlFor="remote" className="text-synth-white text-sm">
                  Remote collaboration
                </Label>
              </div>
              
              {isRemote && (
                <div className="space-y-3">
                  <Label className="text-synth-white text-sm">Frequent collaborators:</Label>
                  <div className="space-y-2">
                    {frequentCollaborators.map((collab) => (
                      <div key={collab.id} className="flex items-center justify-between p-2 bg-white/5 rounded border border-white/10">
                        <div>
                          <div className="text-synth-white text-sm font-medium">{collab.name}</div>
                          <div className="text-synth-icy/60 text-xs">{collab.lastSession}</div>
                        </div>
                        <Button 
                          size="sm" 
                          className="bg-cyan-500 hover:bg-cyan-600 text-white"
                          onClick={() => {
                            // In real app, this would send invite email
                            alert(`Invite sent to ${collab.name} (${collab.email})`);
                          }}
                        >
                          <UserPlus className="w-3 h-3 mr-1" />
                          Invite
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="pt-2 border-t border-white/10">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full border-cyan-400/40 text-cyan-300 hover:bg-cyan-400/10"
                      onClick={() => {
                        const email = prompt("Enter collaborator's email:");
                        if (email) {
                          alert(`Invite sent to ${email}`);
                        }
                      }}
                    >
                      <UserPlus className="w-3 h-3 mr-1" />
                      Invite New Person
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

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
