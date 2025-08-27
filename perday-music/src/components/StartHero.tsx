import { useEffect, useMemo, useRef, useState } from "react";
import { FlowState } from "../types";
import { useAppStore } from "../store/store";
import { usePrestart } from "../hooks/usePrestart";
import { useVillainAnnounce } from "../hooks/useVillainAnnounce";
import confetti from 'canvas-confetti';
import { gsap } from "gsap";

import AtomOrbit from "./AtomOrbit";
import MultiplierBar from "./MultiplierBar";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Tooltip, TooltipTrigger, TooltipContent } from "./ui/tooltip";
import UserQuestionnaire from "./UserQuestionnaire";
import { Settings as SettingsIcon } from "lucide-react";
import { toast } from "sonner";
import GlassPanel from "./common/GlassPanel";

import SpinningLogo from "./SpinningLogo";

/** Overlay FSM so only ONE overlay can ever mount at a time */
type Overlay = "none" | "questionnaire" | "setup";

interface StartHeroProps {
  fadeOutRef: React.MutableRefObject<() => void>;
}

const phrases = [
  "Lock in.",
  "Stack points.",
  "Ship music."
];

export default function StartHero({ fadeOutRef }: StartHeroProps) {
  const { session, dispatch, settings, setSettings } = useAppStore();
  const { villainNudge } = useVillainAnnounce();

  // --- Prestart countdown (7 min default) - MANUAL START
  const [timerStarted, setTimerStarted] = useState(false);
  const { mmss, sealed, tapReady } = usePrestart(timerStarted ? 7 * 60_000 : 0);

  // --- UI state
  const [overlay, setOverlay] = useState<Overlay>("none");
  const [multiplier, setMultiplier] = useState(settings.defaultMultiplier ?? 1.0);

  // --- Rotating phrases
  const [phraseIndex, setPhraseIndex] = useState(0);
  const labelRef = useRef<HTMLDivElement | null>(null);

  // --- One-shot autostart at T-0 while in PRE_START
  const firedT0Ref = useRef(false);
  useEffect(() => {
    if (session.state === FlowState.PRE_START && sealed && !firedT0Ref.current) {
      firedT0Ref.current = true;
      dispatch({ type: "TIMER_ZERO" });
    }
    // reset guard when leaving/entering prestart
    if (session.state !== FlowState.PRE_START) firedT0Ref.current = false;
  }, [sealed, session.state, dispatch]);

  // --- Multiplier decay AFTER READY (every 30s)
  useEffect(() => {
    if (!session.readyPressed) return;
    const id = setInterval(() => {
      setMultiplier((m) => Math.max(0.5, +(m - 0.1).toFixed(2)));
    }, 30_000);
    return () => clearInterval(id);
  }, [session.readyPressed]);

  // --- Rotating phrases effect
  useEffect(() => {
    const id = setInterval(() => {
      setPhraseIndex((i) => (i + 1) % phrases.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    // flip animation for phrases
    if (labelRef.current) {
      gsap.fromTo(
        labelRef.current,
        { rotateX: -90, opacity: 0, y: 8 },
        { rotateX: 0, opacity: 1, y: 0, duration: 0.4, ease: "back.out(1.5)" }
      );
    }
    // phrase changed
  }, [phraseIndex]);

  // --- Events
  const onStartTimer = () => {
    setTimerStarted(true);
    villainNudge("Timer started! Now power up your multiplier!");
    
    // Throw confetti for starting the challenge!
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const onReady = () => {
    if (session.readyPressed) return; // idempotent
    dispatch({ type: "READY" });
    setMultiplier(1.5);
    tapReady(); // records time-to-ready for scoring
    villainNudge("First baby step locked. 🔒✨");
    try {
      fadeOutRef.current?.();
    } catch (error) {
      console.warn("Fade out failed:", error);
    }
  };

  const onSkipPrestart = () => dispatch({ type: "TIMER_ZERO" });

  const userName = settings.userName || "Producer";
  const avatarSeed = useMemo(() => encodeURIComponent(userName), [userName]);

  // ---------------- Render by state ----------------
  switch (session.state) {
    case FlowState.PRE_START:
      return (
        <div className="relative isolate min-h-screen flex items-center justify-center p-4 bg-black">
          {/* Visual background (non-interactive, behind everything) */}
          <div className="absolute inset-0 -z-10 pointer-events-none opacity-20" aria-hidden="true">
            <AtomOrbit />
          </div>

          {/* Logo -> /features */}
          <div className="absolute top-6 left-6 z-20">
            <SpinningLogo />
          </div>

          {/* Top-right controls */}
          <div className="absolute top-6 right-6 z-20 flex items-center gap-3">
            <Avatar className="h-10 w-10 border-2 border-cyan-400/40">
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`} />
              <AvatarFallback className="bg-gradient-to-r from-magenta-500 to-cyan-400 text-white font-bold">
                {userName[0] ?? "P"}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Main card */}
          <GlassPanel className="relative z-10 bg-gradient-to-br from-magenta-900/20 via-cyan-900/20 to-purple-900/20 p-8 max-w-md w-full text-center shadow-2xl">
            <div className="text-xl font-bold text-white mb-2">
              {`Welcome back, ${userName}!`}
            </div>
            <div className="text-lg font-semibold text-synth-white mb-2">7-minute Pre-Start to get your mind right.</div>
            <div className="text-sm text-amber-300/90 mb-6">
              Ready the sooner you start the higher your multiplier
            </div>

            {!timerStarted ? (
              <div className="space-y-6">
                <div className="text-8xl font-black tabular-nums mb-8 font-mono text-white">07:00</div>
                <Button
                  size="lg"
                  className="w-full h-12 text-base font-semibold bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white rounded-2xl"
                  onClick={onStartTimer}
                >
                  🎯 Start 7-Minute Timer
                </Button>
                <div className="text-sm text-cyan-200/70">
                  Take the challenge! One step closer to making a beat a day!
                </div>
              </div>
            ) : (
              <>
                <div className={`text-8xl font-black tabular-nums mb-8 font-mono ${sealed ? "text-amber-300" : "text-white"}`}>
                  {mmss}
                </div>

                <div className="mb-6">
                  <MultiplierBar multiplier={multiplier} />
                </div>

                <div className="space-y-3 mt-4">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="lg"
                        className="w-full h-12 text-base font-semibold bg-gradient-to-r from-magenta-500 via-cyan-400 to-purple-600 text-white rounded-2xl"
                        onClick={onReady}
                        disabled={session.readyPressed}
                      >
                        ⚡ Ready — Celebrate the first step
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Locks your multiplier before T-0</p></TooltipContent>
                  </Tooltip>

                  <Button
                    variant="outline"
                    className="w-full h-12 border-cyan-400/60 text-cyan-300 rounded-2xl"
                    onClick={onSkipPrestart}
                  >
                    🚀 Start Now (Skip Pre-Start)
                  </Button>
                </div>
              </>
            )}

            {session.readyPressed && (
              <div className="mt-6 text-amber-300 text-sm font-medium animate-pulse">
                🎉 Congratulations! You took the first step! Multiplier locked and boosted! 🚀
              </div>
            )}
          </GlassPanel>

          {/* Overlays (mutually exclusive) */}
          {overlay === "questionnaire" && (
            <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center">
              <div className="relative">
                <div className="absolute -top-4 -right-4">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 bg-black/40 border-cyan-400/40 text-cyan-300 hover:bg-cyan-400/20 rounded-full"
                    onClick={() => setOverlay("none")}
                  >
                    <SettingsIcon className="h-4 w-4" />
                  </Button>
                </div>
                <UserQuestionnaire
                  onComplete={(data: { name: string; collaborators: string }) => {
                    setSettings({ userName: data.name, collaborators: data.collaborators });
                    toast.success(`Welcome back, ${data.name}! Let's cook.`);
                    setOverlay("none");
                  }}
                />
              </div>
            </div>
          )}
        </div>
      );

    case FlowState.LOCK_IN:
      return (
        <div className="relative isolate min-h-screen p-4 bg-black">
          <div className="absolute inset-0 -z-10 pointer-events-none opacity-20" aria-hidden="true">
            <AtomOrbit />
          </div>
          
          {/* Logo -> /features */}
          <div className="absolute top-6 left-6 z-20">
            <SpinningLogo />
          </div>

          <GlassPanel className="mx-auto max-w-md bg-black/40 ring-cyan-300/30 p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-6">Lock-In your lane</h2>
            <p className="text-cyan-200/80">Cook. Wrap. Log. & Stack MORE wins!</p>
          </GlassPanel>
        </div>
      );

    default:
      return (
        <div className="min-h-screen flex items-center justify-center bg-black">
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold text-white">Session Complete</h2>
            <p className="text-cyan-200/80 text-lg">
              Great work! What would you like to do next?
            </p>
            <div className="space-y-4">
              <Button
                onClick={() => dispatch({ type: "RESET" })}
                className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white rounded-2xl"
              >
                Start New Session
              </Button>
            </div>
          </div>
        </div>
      );
  }
}
