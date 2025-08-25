
import { useAppStore } from "./store/store";
import { FlowState } from "./types";
import { useRef } from "react";
import DashboardLayout from "./components/DashboardLayout";
import ShaderBackground from "./components/ShaderBackground";
import VaultTransition from "./components/VaultTransition";

import UserQuestionnaire from "./components/UserQuestionnaire";
import StartHero from "./components/StartHero";
import LockInMenu from "./components/LockInMenu";
import FocusSetup from "./components/FocusSetup";
import FocusRunning from "./components/FocusRunning";
import ScrollDemoPage from "./components/ScrollDemoPage";
import ShaderShowcase from "./components/ShaderShowcase";
// import VillainDisplay from "./components/VillainDisplay"; // Temporarily disabled
import { AnalyticsHud } from "./components/common/AnalyticsHud";
import AudioHud from "./components/common/AudioHud";
import { usePrestart } from "./hooks/usePrestart";
// import { useStartupScript } from "./hooks/useStartupScript"; // Temporarily disabled

export default function App() {
  const { session, _hydrated, dispatch } = useAppStore();
  const fadeOutRef = useRef<() => void>(() => {});

  // Initialize villain monitoring system - TEMPORARILY DISABLED
  // const userName = settings.userName || "Producer";
  // useStartupScript(userName);

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
      {/* Reset button for debugging */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => dispatch({ type: "RESET" })}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold"
        >
          Reset App
        </button>
      </div>

      {/* Villain Display - TEMPORARILY DISABLED */}
      {/* <VillainDisplay /> */}

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

      {session.state === FlowState.SHADER_DEMO && (
        <ShaderShowcase />
      )}

      {/* Other flow states rendered when not in demo mode */}
      {session.state !== FlowState.VAULT_CLOSED && 
       session.state !== FlowState.SCROLL_DEMO && 
       session.state !== FlowState.SHADER_DEMO && (
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
  return (
    <div className="text-center space-y-8 max-w-2xl">
      <div className="space-y-4">
        <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
          Perday Music 365
        </h1>
        <p className="text-xl text-cyan-300/80">
          The ultimate productivity gamification platform for music producers
        </p>
        <p className="text-lg text-white/60 max-w-lg mx-auto">
          Transform your creative workflow with structured sessions, gamified progress tracking,
          and a community-driven approach to consistent music production.
        </p>
      </div>

      <div className="space-y-4">
        <button
          onClick={onEnter}
          className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-lg rounded-xl shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105"
        >
          Enter Your Studio
        </button>

        <button
          onClick={() => dispatch({ type: "SCROLL_DEMO" })}
          className="px-6 py-3 border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black font-semibold text-base rounded-lg transition-all duration-300 hover:shadow-cyan-400/25"
        >
          View Scroll Demo
        </button>

        <button
          onClick={() => dispatch({ type: "SHADER_DEMO" })}
          className="px-6 py-3 border-2 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-black font-semibold text-base rounded-lg transition-all duration-300 hover:shadow-purple-400/25"
        >
          View Shader Demo
        </button>

        <p className="text-sm text-white/40">
          Takes ~2 minutes to set up, then you're ready to produce
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
