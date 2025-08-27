import { useAppStore } from "../store/store";
import { useDemoMode } from "../hooks/useDemoMode";
import { setDemoConfig, IntentType } from "../utils/demoMode";

const intents = [
  { 
    label: "Write X Songs Per Day", 
    intent: "songs" as IntentType,
    gradient: "from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500"
  },
  { 
    label: "Produce X Songs Per Day", 
    intent: "produce" as IntentType,
    gradient: "from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500"
  },
  { 
    label: "Make X Riffs Per Day", 
    intent: "riffs" as IntentType,
    gradient: "from-pink-500 to-red-600 hover:from-pink-400 hover:to-red-500"
  },
  { 
    label: "Do X Mixes Per Day", 
    intent: "mixes" as IntentType,
    gradient: "from-red-500 to-orange-600 hover:from-red-400 hover:to-orange-500"
  },
];

export default function IntentButtons() {
  const { dispatch } = useAppStore();
  const { enableDemoMode } = useDemoMode();

  const handleIntentClick = (intent: IntentType) => {
    // Set demo config with intent and default X count
    setDemoConfig({ intent, xCount: 3 });
    
    // Enable demo mode and go to dashboard
    enableDemoMode();
    dispatch({ type: "GO_TO_DASHBOARD" });
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {intents.map(({ label, intent, gradient }) => (
        <button
          key={intent}
          onClick={() => handleIntentClick(intent)}
          className={`px-6 py-4 bg-gradient-to-r ${gradient} text-white font-bold rounded-xl shadow-2xl transition-all duration-300 transform hover:scale-105 focus:ring-2 focus:ring-cyan-400 focus:outline-none`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
