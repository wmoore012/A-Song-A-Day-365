import { useState } from 'react';
import { Settings, BookOpen, Package, User } from 'lucide-react';
import ProfileAvatar from './ProfileAvatar';
import { useAppStore } from '../store/store';
import SettingsSheet from './SettingsSheet';
import { toast } from 'sonner';

export default function GlassNavigationDock() {
  const { settings, setSettings } = useAppStore();
  const [showSettings, setShowSettings] = useState(false);

  const navItems = [
    {
      icon: User,
      label: 'Profile',
      action: () => toast.info('Profile management coming soon!'),
      color: 'hover:bg-blue-500/20 hover:border-blue-400/50'
    },
    {
      icon: BookOpen,
      label: 'Notepad',
      action: () => toast.info('Notepad opens automatically in sessions!'),
      color: 'hover:bg-green-500/20 hover:border-green-400/50'
    },
    {
      icon: Package,
      label: 'Inventory',
      action: () => toast.info('Inventory system coming soon!'),
      color: 'hover:bg-purple-500/20 hover:border-purple-400/50'
    },
    {
      icon: Settings,
      label: 'Settings',
      action: () => setShowSettings(true),
      color: 'hover:bg-cyan-500/20 hover:border-cyan-400/50'
    }
  ];

  return (
    <>
      <div className="fixed bottom-6 left-6 z-50">
        <div className="flex items-end gap-3">
          {/* Profile Avatar */}
          <div className="mb-2">
            <ProfileAvatar size="md" />
          </div>

          {/* Glass Navigation Dock */}
          <div className="flex flex-col gap-2">
            {navItems.map((item, index) => (
              <button
                key={item.label}
                onClick={item.action}
                className={`
                  group relative p-3 rounded-2xl
                  bg-gradient-to-br from-white/15 via-white/8 to-white/5
                  border border-white/20
                  backdrop-blur-xl
                  shadow-2xl shadow-black/50
                  hover:shadow-3xl hover:shadow-black/60
                  transition-all duration-300 ease-out
                  hover:scale-105 hover:-translate-y-1
                  ${item.color}
                  before:absolute before:inset-0 before:rounded-2xl
                  before:bg-gradient-to-br before:from-white/20 before:to-transparent
                  before:opacity-0 before:transition-opacity before:duration-300
                  hover:before:opacity-100
                  after:absolute after:inset-0 after:rounded-2xl
                  after:bg-gradient-to-t after:from-black/20 after:to-transparent
                  after:pointer-events-none
                `}
                style={{
                  animationDelay: `${index * 100}ms`
                }}
                title={item.label}
                aria-label={item.label}
              >
                <item.icon className="w-5 h-5 text-white relative z-10 drop-shadow-lg" />

                {/* Tooltip */}
                <div className="absolute left-full ml-3 px-3 py-2 bg-black/90 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-20 shadow-xl border border-white/10">
                  {item.label}
                  <div className="absolute right-full top-1/2 -translate-y-1/2 w-2 h-2 bg-black/90 border-l border-t border-white/10 transform rotate-45"></div>
                </div>

                {/* Subtle glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl scale-110"></div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Settings Sheet */}
      {showSettings && (
        <SettingsSheet
          currentSettings={settings}
          onSave={(newSettings) => {
            setSettings(newSettings);
            setShowSettings(false);
            toast.success('Settings saved successfully!');
          }}
          onResetAll={() => {
            setSettings({
              defaultDuration: 25,
              defaultMultiplier: 1.5,
              autoStartTimer: true,
              soundEnabled: true,
              volume: 0.15,
              notifications: true,
              accountabilityEmail: '',
              userName: settings.userName || '',
              collaborators: '',
              defaultPlaylist: 'PLl-ShioB5kapLuMhLMqdyx_gKX_MBiXeb'
            });
            setShowSettings(false);
            toast.success('Settings reset to defaults!');
          }}
        />
      )}
    </>
  );
}
