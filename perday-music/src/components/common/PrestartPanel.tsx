import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useAppStore } from "../../store/store";
import { usePrestart } from "../../hooks/usePrestart";
import RotatingHero from "./RotatingHero";
import { StartCtaOverlay } from "./StartCtaOverlay";
import { useVillainAnnounce } from "../../hooks/useVillainAnnounce";
import MultiplierBar from "../MultiplierBar";
import confetti from 'canvas-confetti';
import UserQuestionnaire from "../UserQuestionnaire";
import LockInTips from "../LockInTips";
import { Zap, Rocket, Music, Users, Target } from 'lucide-react';

gsap.registerPlugin(useGSAP);

export default function PrestartPanel({
  onLockIn,
  fadeOutMusic, // supply from AudioHud
}: {
  onLockIn: () => void;
  fadeOutMusic?: () => void;
}) {
  const prestartTotalMs = useAppStore((s) => s.prestartTotalMs);
  const setPhase = useAppStore((s) => s.setPhase);
  const markReadyAt = useAppStore((s) => s.markReadyAt);
  const motionOk = useAppStore((s) => s.motionOk);
  const setSettings = useAppStore((s) => s.setSettings);
  const [timerStarted, setTimerStarted] = useState(false);
  const { mmss, readyAtMs, sealed, tapReady, msLeft } = usePrestart(timerStarted ? prestartTotalMs : 0);
  const cardRef = useRef<HTMLDivElement>(null);
  const { villainNudge } = useVillainAnnounce();

  // entrance
  useGSAP(() => {
    if (!motionOk || !cardRef.current) return;
    gsap.fromTo(cardRef.current, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: .45, ease: "power2.out" });
  }, [motionOk]);

  // celebrate Ready micro-step
  useEffect(() => {
    if (readyAtMs == null) return;
    markReadyAt(readyAtMs);
    villainNudge("Ready! Your multiplier is powered up!");
    
    // Throw confetti for the micro-win!
    if (motionOk && !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [readyAtMs, markReadyAt, villainNudge, motionOk]);

  // nudge when timer gets low
  useEffect(() => {
    if (readyAtMs != null) return; // already ready
    if (msLeft <= 60000 && msLeft > 59000) { // around 1 minute left
      villainNudge("1 minute left! Ready to power up your multiplier?");
    }
  }, [msLeft, readyAtMs, villainNudge]);

  // auto lock-in at T-0
  useEffect(() => {
    if (!sealed) return;
    // missed Ready? nudge a little shade
    if (readyAtMs == null) {
      villainNudge("Missed the Ready button? No worries, we're starting anyway!");
    }
    fadeOutMusic?.();
    setPhase("lockin");
    onLockIn();
  }, [sealed, readyAtMs, fadeOutMusic, setPhase, onLockIn, villainNudge]);

  const handleStartTimer = () => {
    setTimerStarted(true);
    villainNudge("Timer started! Now power up your multiplier!");
    
    // Throw confetti for starting the challenge!
    if (motionOk && !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.6 }
      });
    }
  };

  const handleStartNow = () => {
    fadeOutMusic?.();
    setPhase("lockin");
    onLockIn();
  };

  return (
    <>
      {timerStarted && <LockInTips />}
      <div className="min-h-screen flex items-center justify-center p-4">
        <div ref={cardRef} className="rounded-2xl bg-black/40 backdrop-blur-xl ring-1 ring-synth-icy/30 p-8 max-w-md w-full text-center shadow-2xl" data-testid="prestart-panel">
          <div className="text-xl font-bold text-synth-white mb-2">7-minute Pre-Start Challenge</div>
          <div className="text-sm text-synth-amber/90 mb-6">
            This isn't the actual start! It's just the pre-start to get your mind right. 
            Click the timer to begin your 7-minute challenge!
          </div>

          {!timerStarted ? (
            <div className="space-y-6">
              <div className="text-8xl font-black tabular-nums mb-8 font-mono text-synth-white">07:00</div>
              <button
                className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 font-extrabold shadow-lg hover:shadow-[0_10px_24px_rgba(34,197,94,0.4)] transition-all duration-300 text-lg transform hover:scale-[1.02]"
                onClick={handleStartTimer}
              >
                <Target className="w-5 h-5 mr-2" />
                Start 7-Minute Timer
              </button>
              <div className="text-sm text-synth-icy/70">
                Take the challenge! One step closer to making a beat a day and achieving your dreams!
              </div>
            </div>
          ) : (
            <>
              <div className={`text-8xl font-black tabular-nums mb-8 font-mono ${
                mmss === "00:00" ? "text-synth-amber animate-amberPulse" : 
                msLeft > prestartTotalMs * 0.8 ? "text-green-400" : "text-synth-white"
              }`}>{mmss}</div>

              {/* Multiplier Bar - shows during preparation */}
              <div className="mb-6">
                <MultiplierBar 
                  multiplier={readyAtMs != null ? 2.0 : 1.0} 
                  className="justify-center"
                />
              </div>

              {/* Studio Vibes Playlist and Focusmate */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  className="px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white hover:bg-white/15 transition relative group"
                  onClick={() => {
                    // In real app, this would open studio vibes playlist
                    villainNudge("Studio vibes playlist loaded!");
                  }}
                  title="Visual inspiration videos - watch on mute on your second screen"
                >
                  <Music className="w-5 h-5 mr-2" />
                  Studio Vibes
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black/90 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                    Visual inspiration videos - watch on mute on your second screen
                  </div>
                </button>
                <button
                  className="px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white hover:bg-white/15 transition relative group"
                  onClick={() => {
                    window.open('https://www.focusmate.com/', '_blank');
                  }}
                  title="Get paired with an accountability partner for virtual coworking"
                >
                  <Users className="w-5 h-5 mr-2" />
                  Focusmate
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black/90 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                    Get paired with an accountability partner for virtual coworking
                  </div>
                </button>
              </div>

              {/* Questionnaire Section */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-synth-white mb-4">Session Setup (Fill out while waiting)</h3>
                <UserQuestionnaire 
                  onComplete={(data) => {
                    setSettings({ userName: data.name, collaborators: data.collaborators });
                    villainNudge("Session setup complete!");
                  }}
                />
              </div>

              <div className="space-y-4">
                {readyAtMs == null ? (
                  <button
                    className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-synth-amber to-synth-amberLight hover:from-synth-amberLight hover:to-synth-amber font-extrabold shadow-lg hover:shadow-[0_10px_24px_rgba(255,176,32,0.4)] transition-all duration-300 text-lg transform hover:scale-[1.02] border-2 border-synth-amber/50 hover:border-synth-amber animate-amberPulse"
                    onClick={tapReady}
                  >
                    <Zap className="w-5 h-5 mr-2" />
                    Ready (Power up your Multiplier)
                  </button>
                ) : (
                  <button
                    className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500 font-extrabold shadow-lg hover:shadow-[0_10px_24px_rgba(34,197,94,0.4)] transition-all duration-300 text-lg transform hover:scale-[1.02] border-2 border-green-400/50 hover:border-green-400"
                    onClick={handleStartNow}
                  >
                    <Target className="w-5 h-5 mr-2" />
                    Start Now & Protect Your Multiplier
                  </button>
                )}
                <button
                  className="w-full px-6 py-4 rounded-xl bg-synth-violet/20 hover:bg-synth-violet/30 font-bold text-lg border border-synth-violet/40 hover:border-synth-violet/60 transition-all duration-300 hover:shadow-[0_8px_20px_rgba(108,26,237,0.3)]"
                  onClick={handleStartNow}
                >
                  <Rocket className="w-5 h-5 mr-2" />
                  Start Now (Skip Pre-Start)
                </button>
              </div>
            </>
          )}

          <div className="mt-6">
            <RotatingHero
              items={[
                "Tap Ready to power up your Multiplier—feel that first win.",
                "No fluff. One hook. One bounce. Next.",
                "We auto-start at T-0—doing is the default.",
              ]}
              intervalMs={3800}
            />
          </div>
        </div>
      </div>

      {/* "Hey! This is cool but…" sticky CTA while exploring */}
      <StartCtaOverlay
        visible={readyAtMs == null}
        onClick={tapReady}
      />
    </>
  );
}
