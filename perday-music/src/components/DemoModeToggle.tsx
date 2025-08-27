
import { Switch } from './ui/switch';
import { useDemoMode } from '../hooks/useDemoMode';
import { Badge } from './ui/badge';

export default function DemoModeToggle() {
  const { isDemoMode, enableDemoMode, disableDemoMode } = useDemoMode();

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-3 bg-black/20 backdrop-blur-md rounded-lg px-4 py-2 border border-white/10">
      <div className="flex items-center gap-2">
        <Switch
          checked={isDemoMode}
          onCheckedChange={(checked) => {
            if (checked) {
              enableDemoMode();
            } else {
              disableDemoMode();
            }
          }}
        />
        <span className="text-sm font-medium text-white">
          Demo Mode
        </span>
      </div>
      
      {isDemoMode && (
        <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
          DEMO
        </Badge>
      )}
    </div>
  );
}
