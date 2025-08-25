import { useEffect, useMemo, useRef, useState } from "react";
import { FlowState } from "../types";
import { useAppStore } from "../store/store";
import { usePrestart } from "../hooks/usePrestart";
import { useVillainAnnounce } from "../hooks/useVillainAnnounce";

import PerdayLogo from "./PerdayLogo";
import AtomOrbit from "./AtomOrbit";
import MultiplierBar from "./MultiplierBar";
import SettingsSheet from "./SettingsSheet";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Tooltip, TooltipTrigger, TooltipContent } from "./ui/tooltip";
import VaultTransition from "./VaultTransition";
import UserQuestionnaire from "./UserQuestionnaire";
import { Settings } from "lucide-react";
import { toast } from "sonner";

/** Overlay FSM so only ONE overlay can ever mount at a time */
type Overlay = "none" | "vault" | "questionnaire" | "setup";

interface StartHeroProps {
  fadeOutRef: React.MutableRefObject<() => void>;
}

export default function StartHero({ fadeOutRef }: StartHeroProps) {
  const { session, dispatch, settings, setSettings } = useAppStore();
  const { villainNudge } = useVillainAnnounce();

  // --- Prestart countdown (7 min default)
  const { mmss, sealed, tapReady } = usePrestart(7 * 60_000);

  // --- UI state
  const [overlay, setOverlay] = useState<Overlay>("none");
  const [multiplier, setMultiplier] = useState(settings.defaultMultiplier ?? 1.0);
  const [soundArmed, setSoundArmed] = useState<boolean>(settings.soundEnabled ?? false);

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

  // --- Events
  const onReady = () => {
    if (session.readyPressed) return; // idempotent
    dispatch({ type: "READY" });
    setMultiplier(1.5);
    tapReady(); // records time-to-ready for scoring
    villainNudge("First baby step locked. 🔒✨");
    try { fadeOutRef.current?.(); } catch {}
  };

  const onSkipPrestart = () => dispatch({ type: "TIMER_ZERO" });

  const onEnableSound = () => {
    setSoundArmed(true);
    setSettings({ soundEnabled: true });
    toast.success("🎵 Studio audio enabled");
    // celebrate with vault transition once sound is allowed
    setTimeout(() => setOverlay("vault"), 600);
  };

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

          {/* Top-left brand */}
          <div className="absolute top-6 left-6 z-20">
            <PerdayLogo size={56} />
          </div>

          {/* Top-right controls */}
          <div className="absolute top-6 right-6 z-20 flex items-center gap-3">
            <SettingsSheet
              currentSettings={settings}
              onSave={(s: any) => setSettings(s)}
              onResetAll={() => {
                setSettings({}); // Assuming setSettings handles reset
                toast.success("Reset complete. Clean slate. 🔁");
              }}
            />
            <Avatar className="h-10 w-10 border-2 border-cyan-400/40">
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`} />
              <AvatarFallback className="bg-gradient-to-r from-magenta-500 to-cyan-400 text-white font-bold">
                {userName[0] ?? "P"}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* HUD (z-20) */}
          <div className="fixed bottom-4 right-4 z-20">
            {/* AudioHud is no longer a direct child of StartHero, so it's removed here */}
            {/* <AudioHud fadeOutRef={fadeOutRef} /> */}
          </div>

          {/* Main card */}
          <div className="relative z-10 rounded-2xl bg-gradient-to-br from-magenta-900/20 via-cyan-900/20 to-purple-900/20 backdrop-blur-xl ring-1 ring-cyan-400/30 p-8 max-w-md w-full text-center shadow-2xl">
            <div className="text-xl font-bold text-white mb-2">
              {`Welcome back, ${userName}!`}
            </div>
            <div className="text-lg font-semibold text-synth-white mb-2">7-minute Pre-Start to get your mind right.</div>
            <div className="text-sm text-amber-300/90 mb-6">
              Lock-In is your lane. Hit <b>Ready</b> to power up. At T-0 we go either way.
            </div>

            <div className={`text-8xl font-black tabular-nums mb-8 font-mono ${sealed ? "text-amber-300" : "text-white"}`}>
              {mmss}
            </div>

            <div className="mb-6">
              <MultiplierBar multiplier={multiplier} />
            </div>

            {!soundArmed ? (
              <Button
                size="lg"
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-synth-amber to-synth-amberLight text-black rounded-2xl"
                onClick={onEnableSound}
              >
                🔊 Enable Sound
              </Button>
            ) : (
              <div className="text-amber-300 text-sm mb-4">Sound armed. Welcome to the lab. 🧪</div>
            )}

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

            {session.readyPressed && (
              <div className="mt-6 text-amber-300 text-sm font-medium">
                ✅ Ready locked. Multiplier boosted.
              </div>
            )}
          </div>

          {/* Overlays (mutually exclusive) */}
          {overlay === "vault" && (
            <VaultTransition
              isOpen
              onTransitionComplete={() => setOverlay("questionnaire")}
            >
              <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-6xl font-bold text-amber-300 mb-8">VAULT ACCESSED</h1>
                  <p className="text-2xl text-cyan-100">Welcome to your creative space</p>
                </div>
              </div>
            </VaultTransition>
          )}

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
                    <Settings className="h-4 w-4" />
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
          <div className="mx-auto max-w-md rounded-2xl bg-black/40 backdrop-blur-xl ring-1 ring-cyan-300/30 p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-6">Lock-In your lane</h2>
            <p className="text-cyan-200/80">Cook. Wrap. Log. & Stack MORE wins!</p>
          </div>
        </div>
      );

    default:
      return (
        <div className="min-h-screen flex items-center justify-center bg-black">
          <div className="text-white">State: {session.state}</div>
        </div>
      );
  }
}
