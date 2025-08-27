import { useAppStore } from "../store/store";
import { useDemoMode } from "../hooks/useDemoMode";
import { setDemoConfig, IntentType } from "../utils/demoMode";

const intents = [
  { 
    label: "Write X Songs Per Day", 
    displayLabel: "🎵 Write <span className='underline'>X</span> Songs Per Day ✨",
    intent: "songs" as IntentType,
    gradient: "from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500"
  },
  { 
    label: "Produce X Songs Per Day", 
    displayLabel: "🎧 Produce <span className='underline'>X</span> Songs Per Day 🚀",
    intent: "produce" as IntentType,
    gradient: "from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500"
  },
  { 
    label: "Make X Riffs Per Day", 
    displayLabel: "🎸 Make <span className='underline'>X</span> Riffs Per Day 🔥",
    intent: "riffs" as IntentType,
    gradient: "from-pink-500 to-red-600 hover:from-pink-400 hover:to-red-500"
  },
  { 
    label: "Do X Mixes Per Day", 
    displayLabel: "🎚️ Do <span className='underline'>X</span> Mixes Per Day ⚡",
    intent: "mixes" as IntentType,
    gradient: "from-red-500 to-orange-600 hover:from-red-400 hover:to-orange-500"
  },
];

export default function IntentButtons() {
  const { dispatch } = useAppStore();
  const { enableDemoMode } = useDemoMode();

  const handleIntentClick = (intent: IntentType) => {
    // Redirect to Supabase OAuth
    const oauthUrl = 'https://ukwilqyclvgeeqrwsety.supabase.co/auth/v1/callback';
    window.location.href = oauthUrl;
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {intents.map(({ label, displayLabel, intent, gradient }, index) => (
        <button
          key={intent}
          onClick={() => handleIntentClick(intent)}
          className={`px-6 py-4 bg-white/10 backdrop-blur-xl border border-white/20 text-white font-bold rounded-xl shadow-2xl transition-all duration-500 transform hover:scale-110 hover:bg-white/15 hover:border-white/30 focus:ring-2 focus:ring-cyan-400/50 focus:outline-none relative overflow-hidden group animate-pulse hover:animate-none`}
          style={{ animationDelay: `${index * 200}ms` }}
        >
          <span dangerouslySetInnerHTML={{ __html: displayLabel }} />
          
          {/* Fun gradient overlay */}
          <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-20 transition-all duration-500 rounded-xl`} />
          
          {/* Sparkle effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute top-2 left-2 w-1 h-1 bg-yellow-300 rounded-full animate-ping" style={{ animationDelay: '0ms' }} />
            <div className="absolute top-3 right-3 w-1 h-1 bg-cyan-300 rounded-full animate-ping" style={{ animationDelay: '200ms' }} />
            <div className="absolute bottom-2 left-1/2 w-1 h-1 bg-pink-300 rounded-full animate-ping" style={{ animationDelay: '400ms' }} />
          </div>
          
          {/* Bounce effect on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </button>
      ))}
    </div>
  );
}
