
import { useAppStore } from "./store/store";
import { FlowState } from "./types";
import { useRef, useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";
import ShaderBackground from "./components/ShaderBackground";
import { Volume2 } from 'lucide-react';
import DemoModeToggle from "./components/DemoModeToggle";




import UserQuestionnaire from "./components/UserQuestionnaire";
import StartHero from "./components/StartHero";
import LockInMenu from "./components/LockInMenu";
import FocusSetup from "./components/FocusSetup";
import FocusRunning from "./components/FocusRunning";
import ScrollDemoPage from "./components/ScrollDemoPage";
import SessionCompletion from "./components/SessionCompletion";
import VillainDisplay from "./components/VillainDisplay";

import Dashboard from "./components/Dashboard";
import ScribbleX from "./components/ScribbleX";
import LandingPage from "./components/LandingPage";
import FeaturesPage from "./components/FeaturesPage";

import { AnalyticsHud } from "./components/common/AnalyticsHud";
import AudioHud from "./components/common/AudioHud";

import { usePrestart } from "./hooks/usePrestart";
import { useStartupScript } from "./hooks/useStartupScript";
import { _fxEmit } from "./hooks/useVillainAnnounce";
import { enableDemoFromQuery } from "./utils/demoMode";

// Main App Component with Routing
export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

// App Content Component (existing logic)
function AppContent() {
  const { session, dispatch, settings } = useAppStore();
  const fadeOutRef = useRef<() => void>(() => {});

  // Initialize demo mode from URL parameters
  useEffect(() => {
    enableDemoFromQuery();
  }, []);

  // Initialize villain monitoring system
  const userName = settings.userName || "Producer";
  useStartupScript(userName);

  // Handle questionnaire completion
  const handleQuestionnaireComplete = (data: { name: string; collaborators: string; sessionDate?: Date; durationHours?: number; durationMinutes?: number }) => {
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

    // Calculate total duration in minutes
    const totalMinutes = (data.durationHours || 0) * 60 + (data.durationMinutes || 25);
    
    dispatch({ type: "COMPLETE_QUESTIONNAIRE", payload: data });
    // Set the duration in the session
    dispatch({ type: "SET_DURATION", payload: totalMinutes });
  };

  // Handle preparation completion
  const handlePreparationComplete = () => {
    dispatch({ type: "COMPLETE_PREPARATION" });
  };

  return (
    <ShaderBackground data-testid="app-main">
      {/* Debug info */}
      <div className="fixed top-0 left-0 z-50 bg-black/80 text-white p-2 text-xs">
        State: {session.state} | User: {settings.userName || 'none'}
        <button 
          onClick={() => {
            localStorage.clear();
            window.location.reload();
          }}
          className="ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded"
          title="Clear all stored data and reload"
        >
          Clear Data
        </button>
      </div>
      
      {/* Global Components - Always Available */}
      <DemoModeToggle />
      <VillainDisplay />
      <AudioHud fadeOutRef={fadeOutRef} />

      <Routes>
                 {/* Landing Page for New Users */}
         <Route path="/" element={
           !settings.userName ? (
             <LandingPage />
           ) : (
             <div className="flex items-center justify-center min-h-screen p-8">
               <WelcomeScreen />
             </div>
           )
         } />

        {/* Features Page */}
        <Route path="/features" element={<FeaturesPage />} />

        {/* Dashboard Route */}
        <Route path="/dashboard" element={
          <DashboardLayout>
            <Dashboard />
          </DashboardLayout>
        } />

        {/* Demo pages rendered for full-screen experience */}
        {session.state === FlowState.SCROLL_DEMO && (
          <ScrollDemoPage />
        )}

         {/* Main App Route - handles all flow states */}
         <Route path="/*" element={
           session.state !== FlowState.SCROLL_DEMO ? (
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

               {/* Session Completion States */}
               {[FlowState.CHECKPOINT, FlowState.SELF_RATE, FlowState.RECAP, FlowState.REWARD_GATE, FlowState.POST_ACTIONS].includes(session.state) && (
                 <SessionCompletion />
               )}
             </DashboardLayout>
           ) : null
         } />
      </Routes>
      
             {/* Fallback - always show something */}
       {!session.state && (
         <div className="flex items-center justify-center min-h-screen">
           <div className="text-center space-y-4">
             <h1 className="text-4xl font-bold text-white">Perday Music</h1>
             <p className="text-cyan-300">Loading...</p>
             <button
               onClick={() => dispatch({ type: "GO_TO_DASHBOARD" })}
               className="px-4 py-2 bg-cyan-500 text-white rounded"
             >
               Go to Dashboard
             </button>
           </div>
         </div>
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
              <div className="flex gap-3">
                <button
                  onClick={handleEnableSound}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-semibold rounded-lg transition-all duration-200"
                >
                  <Volume2 className="w-4 h-4 mr-2 inline" />
                  Enable Sound
                </button>
                <button
                  onClick={() => setSoundEnabled(false)}
                  className="px-4 py-2 border border-cyan-400/60 text-cyan-300 hover:bg-cyan-400/20 rounded-lg transition-all duration-200"
                >
                  Proceed with no sound
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Success notification */}
            {showSoundNotification && (
              <div className="p-4 bg-green-500/20 border border-green-400/50 rounded-xl animate-pulse">
                <p className="text-green-300 font-semibold">Sound enabled! 🎵</p>
              </div>
            )}

            {/* Main CTA */}
            <button
              onClick={() => dispatch({ type: "GO_TO_DASHBOARD" })}
              className="px-8 py-4 bg-gradient-to-r from-magenta-500 via-cyan-400 to-purple-600 hover:from-magenta-600 hover:via-cyan-500 hover:to-purple-700 text-white font-bold text-xl rounded-xl transition-all duration-300 transform hover:scale-105 shadow-2xl"
            >
              Start Your Session
            </button>

            {/* Secondary actions */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setShowFeatures(!showFeatures)}
                className="px-6 py-3 border border-white/30 text-white/80 hover:bg-white/10 rounded-lg transition-all duration-200"
              >
                {showFeatures ? 'Hide' : 'Show'} Features
              </button>
              <button
                onClick={() => dispatch({ type: "SCROLL_DEMO" })}
                className="px-6 py-3 border border-white/30 text-white/80 hover:bg-white/10 rounded-lg transition-all duration-200"
              >
                View Demo
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Features Preview */}
      {showFeatures && (
        <div className="mt-8 p-6 bg-black/20 backdrop-blur-sm border border-cyan-400/30 rounded-xl">
          <h3 className="text-lg font-semibold text-cyan-300 mb-4">What's Inside</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-white/80">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
              <span>55-minute lock-ins</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span>Live multipliers</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-magenta-400 rounded-full"></div>
              <span>Accountability squad</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
              <span>Progress tracking</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Preparation Phase Component
function PreparationPhase({ onComplete }: { onComplete: () => void }) {
  const { prestartTotalMs, phase } = useAppStore();
  const { msLeft } = usePrestart(prestartTotalMs);

  useEffect(() => {
    if (msLeft <= 0) {
      onComplete();
    }
  }, [msLeft, onComplete]);

  const progress = ((prestartTotalMs - msLeft) / prestartTotalMs) * 100;
  const minutes = Math.floor(msLeft / 60000);
  const seconds = Math.floor((msLeft % 60000) / 1000);

  return (
    <div className="flex items-center justify-center min-h-screen p-8">
      <div className="text-center space-y-8 max-w-2xl">
        <h2 className="text-4xl font-bold text-white mb-4">Preparation Phase</h2>
        <p className="text-xl text-cyan-300/80 mb-8">
          Get ready for your session. Clear your mind, set your intentions.
        </p>
        
        <div className="space-y-4">
          <div className="text-6xl font-mono text-white">
            {minutes}:{seconds.toString().padStart(2, '0')}
          </div>
          
          <div className="w-full bg-white/10 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-cyan-400 to-purple-600 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <p className="text-white/60">
          Phase: {phase}
        </p>
      </div>
    </div>
  );
}
