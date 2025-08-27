import { useEffect, useMemo, useRef, useState } from "react";
import { FlowState, type Settings as AppSettings } from "../types";
import { useAppStore } from "../store/store";
import { usePrestart } from "../hooks/usePrestart";
import { useVillainAnnounce } from "../hooks/useVillainAnnounce";


import AtomOrbit from "./AtomOrbit";
import MultiplierBar from "./MultiplierBar";
import SettingsSheet from "./SettingsSheet";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Tooltip, TooltipTrigger, TooltipContent } from "./ui/tooltip";
import UserQuestionnaire from "./UserQuestionnaire";
import { Settings as SettingsIcon } from "lucide-react";
import { toast } from "sonner";
import GlassPanel from "./common/GlassPanel";

/** Overlay FSM so only ONE overlay can ever mount at a time */
type Overlay = "none" | "questionnaire" | "setup";

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

          {/* Top-left brand - removed to avoid duplication with sidebar */}

          {/* Top-right controls */}
          <div className="absolute top-6 right-6 z-20 flex items-center gap-3">
            <SettingsSheet
              currentSettings={settings}
              onSave={(s: AppSettings) => setSettings(s)}
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
          <GlassPanel className="relative z-10 bg-gradient-to-br from-magenta-900/20 via-cyan-900/20 to-purple-900/20 p-8 max-w-md w-full text-center shadow-2xl">
            <div className="text-xl font-bold text-white mb-2">
              {`Welcome back, ${userName}!`}
            </div>
            <div className="text-lg font-semibold text-synth-white mb-2">7-minute Pre-Start to get your mind right.</div>
            <div className="text-sm text-amber-300/90 mb-6">
              Ready the sooner you start the higher your multiplier
            </div>

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

            {session.readyPressed && (
              <div className="mt-6 text-amber-300 text-sm font-medium">
                ✅ Ready locked. Multiplier boosted.
              </div>
            )}
          </GlassPanel>

          {/* Overlays (mutually exclusive) */}
          {/* Vault overlay removed - no longer needed */}

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
          <GlassPanel className="mx-auto max-w-md bg-black/40 ring-cyan-300/30 p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-6">Lock-In your lane</h2>
            <p className="text-cyan-200/80">Cook. Wrap. Log. & Stack MORE wins!</p>
          </GlassPanel>
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
