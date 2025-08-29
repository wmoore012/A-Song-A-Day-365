import { useDemoMode } from '../hooks/useDemoMode';
import { Button } from './ui/button';
import { useAppStore } from '../store/store';

export default function DemoRibbon() {
  const { isDemoMode, disableDemoMode, resetDemoData } = useDemoMode();
  const { dispatch } = useAppStore();
  
  if (!isDemoMode) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-black/80 backdrop-blur-xl border border-amber-400/40 rounded-xl p-4 text-amber-200 shadow-xl">
      <div className="font-bold mb-2">🎯 Demo Mode</div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={resetDemoData} className="border-amber-300/50 text-amber-200">
          Reset data
        </Button>
        <Button variant="outline" onClick={() => disableDemoMode()} className="border-amber-300/50 text-amber-200">
          Turn off
        </Button>
        <Button onClick={() => dispatch({ type: "START_QUESTIONNAIRE" })}>
          Start demo session
        </Button>
      </div>
      <div className="text-xs mt-2 text-white/70">
        Want to save progress? <a href="/signup" className="underline">Create an account</a>.
      </div>
    </div>
  );
}
