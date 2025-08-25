
import { useAppStore } from "./store/store";
import { FlowState } from "./types";
import { useRef, useState } from "react";
import DashboardLayout from "./components/DashboardLayout";
import ShaderBackground from "./components/ShaderBackground";
import VaultTransition from "./components/VaultTransition";

import UserQuestionnaire from "./components/UserQuestionnaire";
import StartHero from "./components/StartHero";
import LockInMenu from "./components/LockInMenu";
import FocusSetup from "./components/FocusSetup";
import FocusRunning from "./components/FocusRunning";
import ScrollDemoPage from "./components/ScrollDemoPage";
import VillainDisplay from "./components/VillainDisplay";
import FeaturesShowcase from "./components/FeaturesShowcase";
import { AnalyticsHud } from "./components/common/AnalyticsHud";
import AudioHud from "./components/common/AudioHud";
import { usePrestart } from "./hooks/usePrestart";
import { useStartupScript } from "./hooks/useStartupScript";
import { _fxEmit } from "./hooks/useVillainAnnounce";


export default function App() {
  const { session, _hydrated, dispatch, settings } = useAppStore();
  const fadeOutRef = useRef<() => void>(() => {});

  // Initialize villain monitoring system
  const userName = settings.userName || "Producer";
  useStartupScript(userName);

  // Gate on hydration to avoid flicker
  if (!_hydrated) {
    return (
      <main className="relative min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </main>
    );
  }

  // Handle questionnaire completion
  const handleQuestionnaireComplete = (data: { name: string; collaborators: string; sessionDate?: Date }) => {
    // Handle allnighter backdating logic
    if (data.sessionDate) {
      const today = new Date();
      const selectedDate = new Date(data.sessionDate);
      const timeDiff = today.getTime() - selectedDate.getTime();
      const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));

      // If they selected a past date (allnighter), we can use this for backdating
      if (daysDiff > 0) {
        console.log(`Allnighter detected! Backdating ${daysDiff} days for session`);
        // TODO: Implement backdating logic in store
      }
    }

    dispatch({ type: "COMPLETE_QUESTIONNAIRE", payload: data });
  };

  // Handle preparation completion
  const handlePreparationComplete = () => {
    dispatch({ type: "COMPLETE_PREPARATION" });
  };

          return (
          <ShaderBackground data-testid="app-main">

                  {/* Villain Display */}
            <VillainDisplay />

            {/* Settings Gear - Bottom Left (only after welcome screen) */}
            {session.state !== FlowState.VAULT_CLOSED && (
              <div className="fixed bottom-4 left-4 z-50">
                <button
                  onClick={() => dispatch({ type: "RESET" })}
                  className="p-3 text-cyan-400 hover:text-cyan-300 transition-colors bg-black/20 backdrop-blur-sm rounded-full border border-cyan-400/30"
                  aria-label="Settings"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>
            )}

            {/* Show beautiful WelcomeScreen directly - no vault transition */}
            <div className="flex items-center justify-center min-h-screen p-8">
              <WelcomeScreen onEnter={() => {
                console.log('App: WelcomeScreen onEnter called, going directly to questionnaire');
                dispatch({ type: "START_QUESTIONNAIRE" });
              }} />
            </div>

      {/* Demo pages rendered for full-screen experience */}
      {session.state === FlowState.SCROLL_DEMO && (
        <ScrollDemoPage />
      )}

                   {/* Other flow states rendered when not in demo mode */}
             {session.state !== FlowState.VAULT_CLOSED &&
              session.state !== FlowState.SCROLL_DEMO && (
        <VaultTransition 
          isOpen={true}
          onTransitionComplete={() => {
            console.log('Vault transition complete');
          }}
        >
          {/* Main Dashboard */}
          <DashboardLayout>
            {/* Analytics HUD */}
            <AnalyticsHud grades={[]} latencies={[]} />

            {/* Audio HUD */}
            <AudioHud fadeOutRef={fadeOutRef} />

            {/* Sequential Flow Content */}
            {session.state === FlowState.QUESTIONNAIRE && (
              <div className="flex items-center justify-center min-h-screen p-4">
                <UserQuestionnaire onComplete={handleQuestionnaireComplete} />
              </div>
            )}

            {session.state === FlowState.PREPARATION && (
              <PreparationPhase onComplete={handlePreparationComplete} />
            )}

            {session.state === FlowState.PRE_START && (
              <StartHero fadeOutRef={fadeOutRef} />
            )}

            {session.state === FlowState.LOCK_IN && (
              <LockInMenu />
            )}

            {session.state === FlowState.FOCUS_SETUP && (
              <FocusSetup />
            )}

            {session.state === FlowState.FOCUS_RUNNING && (
              <FocusRunning />
            )}

            {/* Default fallback */}
            {![FlowState.QUESTIONNAIRE, FlowState.PREPARATION, FlowState.PRE_START, FlowState.LOCK_IN, FlowState.FOCUS_SETUP, FlowState.FOCUS_RUNNING].includes(session.state) && (
              <div className="flex items-center justify-center min-h-screen">
                <div className="text-white text-2xl">State: {session.state}</div>
              </div>
            )}
          </DashboardLayout>
        </VaultTransition>
      )}
    </ShaderBackground>
  );
}

// Welcome Screen Component
function WelcomeScreen({ onEnter }: { onEnter: () => void }) {
  const { dispatch } = useAppStore();
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);

  const handleEnableSound = () => {
    setSoundEnabled(true);
    // Trigger villain message about sound being enabled
    _fxEmit('villain-nudge', { msg: "Sound enabled! Now let's get you producing..." });
  };

  return (
    <div className="text-center space-y-8 max-w-2xl relative">
      <div className="space-y-4">
        <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
          Perday Music 365™
        </h1>
        <p className="text-xl text-cyan-300/80">
          Built for producers, by producers
        </p>
        <p className="text-lg text-white/60 max-w-lg mx-auto">
          This isn't another corporate productivity app. It's a community-driven platform 
          built by music producers who understand the creative struggle.
        </p>
      </div>

      <div className="space-y-6">
        {/* Sound Enable Section */}
        {!soundEnabled ? (
          <div className="space-y-4">
            <div className="p-6 bg-black/20 backdrop-blur-sm border border-cyan-400/30 rounded-xl">
              <h3 className="text-lg font-semibold text-cyan-300 mb-2">Enable Sound</h3>
              <p className="text-white/70 mb-4">
                Get the full experience with background music and audio feedback
              </p>
              <button
                onClick={handleEnableSound}
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-lg rounded-xl shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105"
              >
                🎵 Enable Sound
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-green-500/20 backdrop-blur-sm border border-green-400/30 rounded-xl">
              <p className="text-green-300 font-medium">✅ Sound Enabled</p>
              <p className="text-white/70 text-sm">Background music and audio feedback active</p>
            </div>
            
            <button
              onClick={onEnter}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-lg rounded-xl shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105"
            >
              Enter Your Studio
            </button>
          </div>
        )}

        {/* Demo Button - Always visible */}
        <div className="space-y-3">
          <button
            onClick={() => dispatch({ type: "SCROLL_DEMO" })}
            className="px-6 py-3 border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black font-semibold text-base rounded-lg transition-all duration-300 hover:shadow-cyan-400/25"
          >
            View Scroll Demo
          </button>
        </div>

        <p className="text-sm text-white/40">
          Takes ~2 minutes to set up, then you're ready to produce
        </p>

        {/* Timer Display */}
        <div className="relative">
          <div className="text-4xl font-mono font-black text-gray-600/30 tabular-nums">
            07:00
          </div>
          <div className="text-lg text-white/40 mt-2">
            Ready to Cook Up?
          </div>
        </div>

        {/* Features Button */}
        <button
          onClick={() => setShowFeatures(true)}
          className="px-6 py-3 border-2 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-black font-semibold text-base rounded-lg transition-all duration-300 hover:shadow-purple-400/25"
        >
          See What's Inside
        </button>
      </div>

      {/* Features Modal */}
      {showFeatures && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-black/95 border border-cyan-400/30 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">What's Inside</h2>
              <button
                onClick={() => setShowFeatures(false)}
                className="text-white/60 hover:text-white"
              >
                ✕
              </button>
            </div>
            <FeaturesShowcase />
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
        <p className="text-xs text-white/40">
          © 2024 Made by Will Moore
        </p>
      </div>
    </div>
  );
}

// Preparation Phase Component
function PreparationPhase({ onComplete }: { onComplete: () => void }) {
  const { mmss, msLeft } = usePrestart(7 * 60 * 1000); // 7 minutes

  // Auto-complete when timer reaches zero
  if (msLeft <= 0) {
    onComplete();
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-8">
      <div className="text-center space-y-8 max-w-2xl">
        <div className="space-y-4">
          <h2 className="text-4xl font-bold text-synth-white">Preparation Phase</h2>
          <p className="text-xl text-cyan-300/80">
            Get your mind right. Set up your workspace. Load your samples.
          </p>
        </div>

        <div className="space-y-4">
          <div className="text-8xl font-mono font-black text-synth-amber tabular-nums">
            {mmss}
          </div>
          <p className="text-lg text-white/60">
            Time remaining to prepare your creative environment
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={onComplete}
            className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold text-lg rounded-xl shadow-2xl hover:shadow-green-500/25 transition-all duration-300"
          >
            I'm Ready Now
          </button>
          <p className="text-sm text-white/40">
            We'll automatically advance when the timer hits zero
          </p>
        </div>
      </div>
    </div>
  );
}
