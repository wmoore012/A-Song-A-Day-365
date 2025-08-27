import { useMemo, useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Slider } from "./ui/slider";
import { Switch } from "./ui/switch";
import { Check, ChevronLeft, ChevronRight, Coffee, Headphones, ListChecks, Moon, Target, Timer, Volume2, X } from "lucide-react";

export type SessionPlan = {
  goal: string;
  minutes: number; // 15..120
  mood: "chill" | "focused" | "amped";
  distractions?: {
    phoneAway: boolean;
    dndOn: boolean;
    tabsClosed: boolean;
  };
  audio?: {
    enabled: boolean;
    volume: number; // 0..100
    playlistId?: string; // YouTube playlist id
  };
  notifications?: {
    breakReminders: boolean;
    halfTimeBell: boolean;
    endBell: boolean;
  };
};

interface Props {
  defaultMinutes?: number;
  defaultPlaylistId?: string;
  onClose?: () => void;
  onStart: (plan: SessionPlan) => void;
}

export function SessionKickoff({
  defaultMinutes = 25,
  defaultPlaylistId,
  onClose,
  onStart,
}: Props) {
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState("");
  const [minutes, setMinutes] = useState(defaultMinutes);
  const [mood, setMood] = useState<SessionPlan["mood"]>("focused");

  // advanced
  const [advOpen, setAdvOpen] = useState(false);
  const [phoneAway, setPhoneAway] = useState(true);
  const [dndOn, setDndOn] = useState(true);
  const [tabsClosed, setTabsClosed] = useState(true);

  const [audioOn, setAudioOn] = useState(false);
  const [volume, setVolume] = useState(40);
  const [playlistId, setPlaylistId] = useState(defaultPlaylistId || "PLl-ShioB5kapLuMhLMqdyx_gKX_MBiXeb");

  const [breakReminders, setBreakReminders] = useState(true);
  const [halfTimeBell, setHalfTimeBell] = useState(false);
  const [endBell, setEndBell] = useState(true);

  const canNext = useMemo(() => {
    if (step === 0) return goal.trim().length >= 4;
    if (step === 1) return minutes >= 15 && minutes <= 120;
    return true;
  }, [goal, minutes, step]);

  const next = () => setStep((s) => Math.min(s + 1, 2));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const start = () => {
    const plan: SessionPlan = {
      goal: goal.trim(),
      minutes,
      mood,
      distractions: { phoneAway, dndOn, tabsClosed },
      audio: { enabled: audioOn, volume, playlistId },
      notifications: { breakReminders, halfTimeBell, endBell },
    };
    onStart(plan);
  };

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-black/70 backdrop-blur-sm p-4">
      <Card className="w-full max-w-2xl bg-black/60 border-white/15 backdrop-blur-xl">
        <CardContent className="p-6">
          {/* header */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-white/60">Session Kickoff</div>
            <Button size="icon" variant="ghost" onClick={onClose} className="text-white/60 hover:text-white">
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* progress */}
          <div className="mt-4 flex items-center gap-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className={`h-1 flex-1 rounded ${i <= step ? "bg-cyan-400" : "bg-white/15"}`} />
            ))}
          </div>

          {/* steps */}
          <div className="mt-6 min-h-[220px]">
            {step === 0 && (
              <div>
                <div className="flex items-center gap-2 text-cyan-300"><Target className="w-5 h-5" /><span className="font-semibold">What's your focus goal?</span></div>
                <input
                  autoFocus
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="e.g., Finish verse 2 and export rough mix"
                  className="mt-3 w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
                <p className="mt-2 text-xs text-white/50">Tip: make it specific and doable in one sitting.</p>
              </div>
            )}
            {step === 1 && (
              <div>
                <div className="flex items-center gap-2 text-cyan-300"><Timer className="w-5 h-5" /><span className="font-semibold">How long are we locking in?</span></div>
                <div className="mt-4 flex items-center gap-3">
                  <Slider value={[minutes]} min={15} max={120} step={5} className="flex-1" onValueChange={([v]) => setMinutes(v)} />
                  <div className="w-16 text-right font-semibold text-white">{minutes}m</div>
                </div>
                <div className="mt-3 flex gap-2 text-xs text-white/60">
                  {[25, 45, 60, 90].map((m) => (
                    <button key={m} onClick={() => setMinutes(m)} className={`px-2.5 py-1 rounded border ${minutes===m?"border-cyan-400 text-cyan-300":"border-white/10 text-white/60 hover:text-white"}`}>{m}m</button>
                  ))}
                </div>
              </div>
            )}
            {step === 2 && (
              <div>
                <div className="flex items-center gap-2 text-cyan-300"><Moon className="w-5 h-5" /><span className="font-semibold">Set the vibe</span></div>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {[
                    {k:"chill",label:"Chill"},
                    {k:"focused",label:"Focused"},
                    {k:"amped",label:"Amped"}
                  ].map(({k,label}) => (
                    <button key={k} onClick={() => setMood(k as SessionPlan["mood"])} className={`rounded-lg p-3 text-sm border bg-white/5 hover:bg-white/10 ${mood===k?"border-cyan-400 text-cyan-300":"border-white/10 text-white/80"}`}>{label}</button>
                  ))}
                </div>

                {/* Advanced toggle */}
                <button onClick={() => setAdvOpen((v) => !v)} className="mt-6 inline-flex items-center gap-2 text-xs text-white/70 hover:text-white">
                  <ListChecks className="w-4 h-4" /> Advanced options
                </button>

                {advOpen && (
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                      <div className="flex items-center gap-2 text-white/80 font-medium"><Check className="w-4 h-4 text-green-400"/> Distraction check</div>
                      <div className="mt-3 space-y-3 text-sm">
                        <label className="flex items-center justify-between">Phone away <Switch checked={phoneAway} onCheckedChange={setPhoneAway} /></label>
                        <label className="flex items-center justify-between">Do Not Disturb on <Switch checked={dndOn} onCheckedChange={setDndOn} /></label>
                        <label className="flex items-center justify-between">Close extra tabs <Switch checked={tabsClosed} onCheckedChange={setTabsClosed} /></label>
                      </div>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                      <div className="flex items-center gap-2 text-white/80 font-medium"><Headphones className="w-4 h-4 text-cyan-300"/> Soundtrack</div>
                      <div className="mt-3 space-y-3 text-sm">
                        <label className="flex items-center justify-between">Enable audio <Switch checked={audioOn} onCheckedChange={setAudioOn} /></label>
                        <div className={`grid grid-cols-[1fr_auto] items-center gap-2 ${audioOn?"opacity-100":"opacity-50 pointer-events-none"}`}>
                          <input value={playlistId} onChange={(e)=>setPlaylistId(e.target.value)} className="rounded bg-black/40 border border-white/10 px-2 py-1 text-xs" placeholder="YouTube Playlist ID"/>
                          <div className="flex items-center gap-2 text-xs"><Volume2 className="w-3 h-3"/> {volume}</div>
                          <div className="col-span-2"><Slider value={[volume]} onValueChange={([v])=>setVolume(v)} max={100} step={5}/></div>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-white/5 p-4 md:col-span-2">
                      <div className="flex items-center gap-2 text-white/80 font-medium"><Coffee className="w-4 h-4 text-amber-300"/> Reminders</div>
                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                        <label className="flex items-center justify-between">Break reminders <Switch checked={breakReminders} onCheckedChange={setBreakReminders} /></label>
                        <label className="flex items-center justify-between">Half-time bell <Switch checked={halfTimeBell} onCheckedChange={setHalfTimeBell} /></label>
                        <label className="flex items-center justify-between">End bell <Switch checked={endBell} onCheckedChange={setEndBell} /></label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* footer */}
          <div className="mt-6 flex items-center justify-between">
            <Button variant="ghost" disabled={step===0} onClick={prev} className="text-white/80"><ChevronLeft className="w-4 h-4 mr-1"/>Back</Button>
            {step < 2 ? (
              <Button onClick={next} disabled={!canNext} className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white">
                Next <ChevronRight className="w-4 h-4 ml-1"/>
              </Button>
            ) : (
              <Button onClick={start} className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white">
                Start Session <Check className="w-4 h-4 ml-2"/>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
