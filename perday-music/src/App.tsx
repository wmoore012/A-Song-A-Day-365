
import { useAppStore } from "./store/store";
import { FlowState } from "./types";
import { useRef, useState } from "react";
import DashboardLayout from "./components/DashboardLayout";
import ShaderBackground from "./components/ShaderBackground";
import { Volume2 } from 'lucide-react';
import DemoModeToggle from "./components/DemoModeToggle";

import FrostedGalleryLoop from "./components/FrostedGalleryLoop";


import UserQuestionnaire from "./components/UserQuestionnaire";
import StartHero from "./components/StartHero";
import LockInMenu from "./components/LockInMenu";
import FocusSetup from "./components/FocusSetup";
import FocusRunning from "./components/FocusRunning";
import ScrollDemoPage from "./components/ScrollDemoPage";
import VillainDisplay from "./components/VillainDisplay";

import Dashboard from "./components/Dashboard";
import ScribbleX from "./components/ScribbleX";
import LandingPage from "./components/LandingPage";

import { AnalyticsHud } from "./components/common/AnalyticsHud";
import AudioHud from "./components/common/AudioHud";

import { usePrestart } from "./hooks/usePrestart";
import { useStartupScript } from "./hooks/useStartupScript";
import { _fxEmit } from "./hooks/useVillainAnnounce";


export default function App() {
  const { session, dispatch, settings } = useAppStore();
  const fadeOutRef = useRef<() => void>(() => {});

  // Initialize villain monitoring system
  const userName = settings.userName || "Producer";
  useStartupScript(userName);

  // Gate on hydration to avoid flicker
  // Temporarily disabled to debug blank screen issue
  // if (!_hydrated) {
  //   return (
  //     <main className="relative min-h-screen bg-black flex items-center justify-center">
  //       <div className="text-white text-xl">Loading...</div>
  //     </main>
  //   );
  // }

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

                  {/* Global Components - Always Available */}
                  <DemoModeToggle />
                  <VillainDisplay />
                  <AudioHud fadeOutRef={fadeOutRef} />

                  {/* Landing Page for New Users */}
                  {session.state === FlowState.VAULT_CLOSED && !settings.userName && (
                    <LandingPage />
                  )}

                  {/* Welcome Screen for Returning Users */}
                  {session.state === FlowState.VAULT_CLOSED && settings.userName && (
                    <div className="flex items-center justify-center min-h-screen p-8">
                      <WelcomeScreen />
                    </div>
                  )}

                  {/* Demo pages rendered for full-screen experience */}
                  {session.state === FlowState.SCROLL_DEMO && (
                    <ScrollDemoPage />
                  )}

                  {/* Other flow states rendered when not in demo mode */}
                  {session.state !== FlowState.VAULT_CLOSED &&
                   session.state !== FlowState.SCROLL_DEMO && (
                    <>
                      {/* Main Dashboard */}
                      <DashboardLayout>
                        {/* Analytics HUD */}
                        <AnalyticsHud grades={[]} latencies={[]} />

                        {/* Sequential Flow Content */}
                    {session.state === FlowState.DASHBOARD && (
                      <Dashboard />
                    )}

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
                    {![FlowState.DASHBOARD, FlowState.QUESTIONNAIRE, FlowState.PREPARATION, FlowState.PRE_START, FlowState.LOCK_IN, FlowState.FOCUS_SETUP, FlowState.FOCUS_RUNNING].includes(session.state) && (
                      <div className="flex items-center justify-center min-h-screen">
                        <div className="text-white text-2xl">State: {session.state}</div>
                      </div>
                    )}
                  </DashboardLayout>
                </>
              )}
    </ShaderBackground>
  );
}

// Welcome Screen Component
function WelcomeScreen() {
  const { dispatch } = useAppStore();
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);

  const [showSoundNotification, setShowSoundNotification] = useState(false);

  const handleEnableSound = () => {
    setSoundEnabled(true);
    setShowSoundNotification(true);
    // Trigger villain message about sound being enabled
    _fxEmit('villain-nudge', { msg: "Sound enabled! Now let's get you producing..." });
    
    // Auto-hide the notification after 1 second
    setTimeout(() => {
      setShowSoundNotification(false);
    }, 1000);
  };

  return (
    <div className="text-center space-y-8 max-w-2xl relative">
              <div className="space-y-6">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-black leading-tight">
              Get locked in. Make <span className="text-synth-amber"><ScribbleX /></span> beats a day.
            </h1>
          </div>
        <p className="text-xl text-cyan-300/80 max-w-3xl mx-auto">
          Perday Music 365 turns your studio time into a game: timeboxed cookups, live multipliers, and a squad that only talks when you're on a break (or after you stack). Points for focus. Heat for effort. Streaks for consistency.
        </p>
        <p className="text-lg text-white/60 max-w-2xl mx-auto">
          Cook up. Level up. Every day.
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
                <Volume2 className="w-5 h-5 mr-2" />
                Enable Sound
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {showSoundNotification && (
              <div className="p-4 bg-green-500/20 backdrop-blur-sm border border-green-400/30 rounded-xl animate-fade-in">
                <p className="text-green-300 font-medium">✅ Sound Enabled</p>
                <p className="text-white/70 text-sm">Background music and audio feedback active</p>
              </div>
            )}
            
                         <div className="grid grid-cols-2 gap-4">
               <button
                 onClick={() => dispatch({ type: "START_QUESTIONNAIRE" })}
                 className="px-6 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold rounded-xl shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105"
               >
                 Write X Songs Per Day
               </button>
               <button
                 onClick={() => dispatch({ type: "START_QUESTIONNAIRE" })}
                 className="px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 text-white font-bold rounded-xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
               >
                 Produce X Songs Per Day
               </button>
               <button
                 onClick={() => dispatch({ type: "START_QUESTIONNAIRE" })}
                 className="px-6 py-4 bg-gradient-to-r from-pink-500 to-red-600 hover:from-pink-400 hover:to-red-500 text-white font-bold rounded-xl shadow-2xl hover:shadow-pink-500/25 transition-all duration-300 transform hover:scale-105"
               >
                 Make X Riffs Per Day
               </button>
               <button
                 onClick={() => dispatch({ type: "START_QUESTIONNAIRE" })}
                 className="px-6 py-4 bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-400 hover:to-orange-500 text-white font-bold rounded-xl shadow-2xl hover:shadow-red-500/25 transition-all duration-300 transform hover:scale-105"
               >
                 Do X Mixes Per Day
               </button>
             </div>
          </div>
        )}



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

             {/* Learn More Button */}
             <button
               onClick={() => dispatch({ type: "SCROLL_DEMO" })}
               className="px-6 py-3 border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black font-semibold text-base rounded-lg transition-all duration-300 hover:shadow-cyan-400/25"
             >
               Learn More
             </button>

             {/* Join Beta Waitlist Button */}
             <button
               onClick={() => window.open('https://discord.gg/your-server', '_blank')}
               className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-semibold text-base rounded-lg transition-all duration-300 hover:shadow-green-500/25"
             >
               Join Beta Waitlist
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
            <FrostedGalleryLoop />
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
        <p className="text-xs text-white/40">
          © 2025 Made by Will Moore
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
