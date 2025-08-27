import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from './ui/sheet';
import { Settings, Volume2, Target, Clock, Bell } from 'lucide-react';
import { useAppStore } from '../store/store';

interface SettingsData {
  defaultDuration: number;
  defaultMultiplier: number;
  autoStartTimer: boolean;
  soundEnabled: boolean;
  volume: number;
  notifications: boolean;
  accountabilityEmail: string;
  userName?: string;
  collaborators?: string;
}

interface SettingsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (settings: SettingsData) => void;
  currentSettings: SettingsData;
  onResetAll?: () => void;
}

export default function SettingsSheet({ open, onOpenChange, onSave, currentSettings, onResetAll }: SettingsSheetProps) {
  const { setSettings } = useAppStore();
  const [settings, setLocalSettings] = useState<SettingsData>(currentSettings);

  const spinGears = () => {
    // Animation placeholder for future implementation
  };

  const handleSave = () => {
    setSettings(settings); // Use the store's setSettings
    onSave(settings);
    onOpenChange(false);
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
      userName: '',
      collaborators: ''
    };
    setLocalSettings(defaults);
    
    // Spin the gears when resetting to defaults
    spinGears();
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="bg-black/95 border-cyan-400/30 text-synth-white w-[400px] z-[100]">
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
            <Select value={settings.defaultDuration.toString()} onValueChange={(value) => setLocalSettings(prev => ({ ...prev, defaultDuration: parseInt(value) }))}>
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
            <Select value={settings.defaultMultiplier.toString()} onValueChange={(value) => setLocalSettings(prev => ({ ...prev, defaultMultiplier: parseFloat(value) }))}>
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
              onValueChange={([value]) => setLocalSettings(prev => ({ ...prev, volume: value / 100 }))}
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
              onChange={(e) => setLocalSettings(prev => ({ ...prev, accountabilityEmail: e.target.value }))}
              placeholder="your@email.com"
              className="bg-black/40 border-cyan-400/40 text-synth-white placeholder:text-synth-icy/50"
            />
            <p className="text-xs text-synth-icy/70">
              Send an email to this person everytime you finish a session!
            </p>
          </div>

          {/* Switches */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-synth-white">Auto-start timer</Label>
              <Switch
                checked={settings.autoStartTimer}
                onCheckedChange={(checked: boolean) => setLocalSettings(prev => ({ ...prev, autoStartTimer: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-synth-white">Sound effects</Label>
              <Switch
                checked={settings.soundEnabled}
                onCheckedChange={(checked: boolean) => setLocalSettings(prev => ({ ...prev, soundEnabled: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-synth-white">Notifications</Label>
              <Switch
                checked={settings.notifications}
                onCheckedChange={(checked: boolean) => setLocalSettings(prev => ({ ...prev, notifications: checked }))}
              />
            </div>
          </div>
        </div>

        <div className="space-y-3 mt-8">
          <div className="flex gap-3">
            <Button variant="outline" onClick={resetToDefaults} className="flex-1 border-cyan-400/40 text-cyan-300 hover:bg-cyan-400/20">
              Reset to Defaults
            </Button>
            <Button onClick={handleSave} className="flex-1 bg-gradient-to-r from-magenta-500 via-cyan-400 to-purple-600 hover:from-magenta-600 hover:via-cyan-500 hover:to-purple-700">
              Save Settings
            </Button>
          </div>
          
          {typeof onResetAll === 'function' && (
            <Button 
              variant="outline" 
              onClick={onResetAll} 
              className="w-full border-red-400/40 text-red-300 hover:bg-red-400/20"
            >
              🗑️ Reset Everything (Start Fresh)
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
