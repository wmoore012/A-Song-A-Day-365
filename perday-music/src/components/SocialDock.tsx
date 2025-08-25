"use client";

import { useState } from "react";
import { MessageCircle, Video, CalendarDays } from "lucide-react";
import { useAppStore } from "../store/store";
import { canUseSocial, reasonWhenBlocked } from "../lib/socialGuard";
import CampsSheet from "./camps/CampsSheet";
import VideoSheet from "./video/VideoSheet";
import VillainChat from "./VillainChat";
import { toast } from "sonner";

export default function SocialDock() {
  const { session } = useAppStore();
  const [panel, setPanel] = useState<"video" | "camps" | "villain" | null>(null);

  const guard = (fn: () => void) => {
    if (!canUseSocial(session.state)) {
      toast(reasonWhenBlocked(session.state));
      return;
    }
    fn();
  };

  return (
    <>
      <div className="fixed right-6 bottom-6 z-[2000] flex gap-3">
        {/* Villain Chat */}
        <button
          onClick={() => guard(() => setPanel(panel === "villain" ? null : "villain"))}
          className="px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white hover:bg-white/15 transition"
          aria-label="Villain Chat"
          title="Chat with the villain (unlocks on breaks / after stack)"
        >
          <MessageCircle className="w-5 h-5" />
        </button>

        {/* Video (Whereby/Jitsi inside a Sheet) */}
        <button
          onClick={() => guard(() => setPanel("video"))}
          className="px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white hover:bg-white/15 transition"
          aria-label="Open Video"
          title="Video (unlocks on breaks / after stack)"
        >
          <Video className="w-5 h-5" />
        </button>

        {/* Camps (Eventbrite / Cal.com / Focusmate) */}
        <button
          onClick={() => guard(() => setPanel("camps"))}
          className="px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white hover:bg-white/15 transition"
          aria-label="Camps"
          title="Camps (scheduling & signups)"
        >
          <CalendarDays className="w-5 h-5" />
        </button>
      </div>

      <VideoSheet open={panel === "video"} onOpenChange={(v) => setPanel(v ? "video" : null)} />

      <CampsSheet open={panel === "camps"} onOpenChange={(v) => setPanel(v ? "camps" : null)} />

      {panel === "villain" && <VillainChat />}
    </>
  );
}
