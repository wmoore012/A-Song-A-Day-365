import { IntentType, setDemoConfig } from "../utils/demoMode";
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://ukwilqyclvgeeqrwsety.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key-here';
const supabase = createClient(supabaseUrl, supabaseKey);

const intents = [
  {
    label: "Write 1 Song Per Day",
    displayLabel: "🎵 Write <span class='font-permanent-marker text-3xl italic'>1</span> Song Per Day ✨",
    intent: "songs" as IntentType,
    gradient: "from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500"
  },
  {
    label: "Produce 1 Song Per Day",
    displayLabel: "🎧 Produce <span class='font-permanent-marker text-3xl italic'>1</span> Song Per Day 🚀",
    intent: "produce" as IntentType,
    gradient: "from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500"
  },
  {
    label: "Make 1 Riff Per Day",
    displayLabel: "🎸 Make <span class='font-permanent-marker text-3xl italic'>1</span> Riff Per Day 🔥",
    intent: "riffs" as IntentType,
    gradient: "from-pink-500 to-red-600 hover:from-pink-400 hover:to-red-500"
  },
  {
    label: "Do 1 Mix Per Day",
    displayLabel: "🎚️ Do <span class='font-permanent-marker text-3xl italic'>1</span> Mix Per Day ⚡",
    intent: "mixes" as IntentType,
    gradient: "from-red-500 to-orange-600 hover:from-red-400 hover:to-orange-500"
  },
];

export default function IntentButtons() {
  const handleIntentClick = async (intent: IntentType) => {
    try {
      // Store the user's intent choice first
      setDemoConfig({ intent });

      // Sign in with Google OAuth
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (error) {
        console.error('OAuth error:', error);
        // Fallback to manual redirect if OAuth fails
        const oauthUrl = `${supabaseUrl}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(window.location.origin + '/dashboard')}`;
        window.location.href = oauthUrl;
        return;
      }

      // If successful, data.url will contain the OAuth URL
      if (data?.url) {
        window.location.href = data.url;
      }

    } catch (error) {
      console.error('OAuth setup error:', error);
      // Fallback to manual redirect
      const oauthUrl = `${supabaseUrl}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(window.location.origin + '/dashboard')}`;
      window.location.href = oauthUrl;
    }
  };

  return (
    <div className="grid grid-cols-2 gap-6">
      {intents.map(({ displayLabel, intent, gradient }, index) => (
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
