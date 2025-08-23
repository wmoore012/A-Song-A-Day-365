import { useState } from 'react';
import { Button } from './ui/button';
import { Moon, Sun, Monitor } from 'lucide-react';

type Theme = 'dark' | 'light' | 'system';

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState<Theme>('dark');

  const themes = [
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'dark', icon: Moon, label: 'Dark' },
    { value: 'system', icon: Monitor, label: 'System' }
  ];

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    
    // Apply theme to document
    document.documentElement.classList.remove('light', 'dark');
    
    if (newTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      document.documentElement.classList.add(systemTheme);
    } else {
      document.documentElement.classList.add(newTheme);
    }
  };

  return (
    <div className="flex items-center gap-2 p-2 bg-synth-violet/10 rounded-lg border border-synth-violet/20">
      {themes.map(({ value, icon: Icon, label }) => (
        <Button
          key={value}
          variant={theme === value ? 'default' : 'ghost'}
          size="sm"
          className={`h-8 px-2 ${
            theme === value 
              ? 'bg-synth-amber text-synth-white' 
              : 'text-synth-icy hover:text-synth-white hover:bg-synth-violet/20'
          }`}
          onClick={() => handleThemeChange(value as Theme)}
        >
          <Icon className="h-4 w-4" />
          <span className="sr-only">{label}</span>
        </Button>
      ))}
    </div>
  );
}
