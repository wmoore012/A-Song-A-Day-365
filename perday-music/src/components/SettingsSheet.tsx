import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from './ui/sheet';
import { Settings, Volume2, Clock, Target, Bell } from 'lucide-react';
import { gsap } from 'gsap';

interface SettingsData {
  defaultDuration: number;
  defaultMultiplier: number;
  autoStartTimer: boolean;
  soundEnabled: boolean;
  volume: number;
  notifications: boolean;
  accountabilityEmail: string;
}

interface SettingsSheetProps {
  onSave: (settings: SettingsData) => void;
  currentSettings: SettingsData;
}

export default function SettingsSheet({ onSave, currentSettings }: SettingsSheetProps) {
  const [settings, setSettings] = useState<SettingsData>(currentSettings);
  const [isOpen, setIsOpen] = useState(false);
  const gearRef = useRef<HTMLDivElement>(null);
  
  // Gear spinning animation
  const spinGears = () => {
    if (!gearRef.current) return;
    
    const randomSpins = Math.floor(Math.random() * 4) + 4; // 4-7 spins
    const totalRotation = randomSpins * 360;
    
    gsap.to(gearRef.current, {
      rotation: totalRotation,
      duration: 2,
      ease: "power2.out",
      onComplete: () => {
        // Reset to 0 for next animation
        gsap.set(gearRef.current, { rotation: 0 });
      }
    });
  };

  const handleSave = () => {
    onSave(settings);
    setIsOpen(false);
  };

  const resetToDefaults = () => {
    const defaults: SettingsData = {
      defaultDuration: 25,
      defaultMultiplier: 1.5,
      autoStartTimer: true,
      soundEnabled: true,
      volume: 0.7,
      notifications: true,
      accountabilityEmail: '',
    };
    setSettings(defaults);
    
    // Spin the gears when resetting to defaults
    spinGears();
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="bg-black/40 border-cyan-400/40 text-cyan-300 hover:bg-cyan-400/20">
          <div ref={gearRef}>
            <Settings className="h-4 w-4" />
          </div>
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-black/95 border-cyan-400/30 text-synth-white w-[400px]">
        <SheetHeader>
          <SheetTitle className="text-synth-white flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Session Settings
          </SheetTitle>
          <SheetDescription className="text-synth-icy/70">
            Customize your default session preferences
          </SheetDescription>
        </SheetHeader>
        
        <div className="space-y-6 mt-6">
          {/* Default Duration */}
          <div className="space-y-3">
            <Label className="text-synth-white flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Default Duration (minutes)
            </Label>
            <Select value={settings.defaultDuration.toString()} onValueChange={(value) => setSettings(prev => ({ ...prev, defaultDuration: parseInt(value) }))}>
              <SelectTrigger className="bg-black/40 border-cyan-400/40 text-synth-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-black/90 border-cyan-400/40">
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="25">25 minutes</SelectItem>
                <SelectItem value="45">45 minutes</SelectItem>
                <SelectItem value="60">60 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Default Multiplier */}
          <div className="space-y-3">
            <Label className="text-synth-white flex items-center gap-2">
              <Target className="h-4 w-4" />
              Default Multiplier
            </Label>
            <Select value={settings.defaultMultiplier.toString()} onValueChange={(value) => setSettings(prev => ({ ...prev, defaultMultiplier: parseFloat(value) }))}>
              <SelectTrigger className="bg-black/40 border-cyan-400/40 text-synth-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-black/90 border-cyan-400/40">
                <SelectItem value="1.0">1.0x (Normal)</SelectItem>
                <SelectItem value="1.5">1.5x (Boosted)</SelectItem>
                <SelectItem value="2.0">2.0x (Super)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Volume Control */}
          <div className="space-y-3">
            <Label className="text-synth-white flex items-center gap-2">
              <Volume2 className="h-4 w-4" />
              Background Music Volume
            </Label>
            <Slider
              value={[settings.volume * 100]}
              onValueChange={([value]) => setSettings(prev => ({ ...prev, volume: value / 100 }))}
              max={100}
              step={5}
              className="w-full"
            />
            <div className="text-xs text-synth-icy/70 text-center">
              {Math.round(settings.volume * 100)}%
            </div>
          </div>

          {/* Accountability Email */}
          <div className="space-y-3">
            <Label className="text-synth-white flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Accountability Email
            </Label>
            <Input
              value={settings.accountabilityEmail}
              onChange={(e) => setSettings(prev => ({ ...prev, accountabilityEmail: e.target.value }))}
              placeholder="your@email.com"
              className="bg-black/40 border-cyan-400/40 text-synth-white placeholder:text-synth-icy/50"
            />
            <p className="text-xs text-synth-icy/70">
              Get notified about your progress and achievements
            </p>
          </div>

          {/* Switches */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-synth-white">Auto-start timer</Label>
              <Switch
                checked={settings.autoStartTimer}
                onCheckedChange={(checked: boolean) => setSettings(prev => ({ ...prev, autoStartTimer: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-synth-white">Sound effects</Label>
              <Switch
                checked={settings.soundEnabled}
                onCheckedChange={(checked: boolean) => setSettings(prev => ({ ...prev, soundEnabled: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-synth-white">Notifications</Label>
              <Switch
                checked={settings.notifications}
                onCheckedChange={(checked: boolean) => setSettings(prev => ({ ...prev, notifications: checked }))}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <Button variant="outline" onClick={resetToDefaults} className="flex-1 border-cyan-400/40 text-cyan-300 hover:bg-cyan-400/20">
            Reset to Defaults
          </Button>
          <Button onClick={handleSave} className="flex-1 bg-gradient-to-r from-magenta-500 via-cyan-400 to-purple-600 hover:from-magenta-600 hover:via-cyan-500 hover:to-purple-700">
            Save Settings
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
