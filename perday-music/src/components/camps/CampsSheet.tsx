"use client";

import { useEffect, useRef, useState } from "react";
import {
  DockSheet,
  DockSheetContent,
  DockSheetDescription,
  DockSheetHeader,
  DockSheetTitle,
} from "../ui/dock-sheet";

import { ExternalLink } from "lucide-react";

type Props = { open: boolean; onOpenChange: (v: boolean) => void };

export default function CampsSheet({ open, onOpenChange }: Props) {
  const [tab, setTab] = useState<"eventbrite" | "cal" | "focusmate">("eventbrite");

  return (
    <DockSheet open={open} onOpenChange={onOpenChange}>
      <DockSheetContent className="bg-black/95 border-cyan-400/30 text-white w-[720px]">
        <DockSheetHeader>
          <DockSheetTitle className="text-cyan-300">Camps</DockSheetTitle>
          <DockSheetDescription className="text-white/60">
            3-day commitments where everyone cooks together. Pick an embed to start scheduling now.
          </DockSheetDescription>
        </DockSheetHeader>

        <div className="mt-6">
          <div className="flex gap-2 mb-4">
            <button onClick={() => setTab("eventbrite")} className={`px-3 py-2 rounded ${tab==="eventbrite"?"bg-white/15":"bg-white/5"}`}>Eventbrite</button>
            <button onClick={() => setTab("cal")} className={`px-3 py-2 rounded ${tab==="cal"?"bg-white/15":"bg-white/5"}`}>Cal.com</button>
            <button onClick={() => setTab("focusmate")} className={`px-3 py-2 rounded ${tab==="focusmate"?"bg-white/15":"bg-white/5"}`}>Focusmate</button>
          </div>

          {tab === "eventbrite" && <EventbriteEmbed eventId={import.meta.env.VITE_EVENTBRITE_EVENT_ID || "YOUR_EVENT_ID"} />}
          {tab === "cal" && <CalComEmbed url={import.meta.env.VITE_CAL_URL || "https://cal.com/yourteam/camp"} />}
          {tab === "focusmate" && <FocusmateBlurb />}
        </div>
      </DockSheetContent>
    </DockSheet>
  );
}

function EventbriteEmbed({ eventId }: { eventId: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || !eventId) return;
    const id = "eb-widgets";
    if (!document.getElementById(id)) {
      const s = document.createElement("script");
      s.id = id;
      s.src = "https://www.eventbrite.com/static/widgets/eb_widgets.js";
      document.body.appendChild(s);
      s.onload = () => render();
    } else {
      render();
    }

    function render() {
      const w = (window as Window & { EBWidgets?: { createWidget: (config: unknown) => void } }).EBWidgets;
      if (!w) return;
      w.createWidget({
        widgetType: "checkout",
        eventId,
        iframeContainerId: "eventbrite-widget-container",
        iframeContainerHeight: 680,
      });
    }
  }, [eventId]);

  return (
    <div className="space-y-3">
      <div id="eventbrite-widget-container" ref={ref} className="w-full min-h-[680px] rounded-lg overflow-hidden border border-white/10 bg-white/5" />
      <p className="text-xs text-white/40">
        Uses Eventbrite Embedded Checkout. Configure your event ID in env. (See Eventbrite embedded widget docs.) 
      </p>
    </div>
  );
}

function CalComEmbed({ url }: { url: string }) {
  return (
    <div className="space-y-3">
      <iframe
        src={url}
        title="Cal.com"
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        allow="payment *; fullscreen"
        className="w-full h-[680px] rounded-lg border border-white/10"
      />
      <p className="text-xs text-white/40">
        Cal.com embed shown via iframe or their React SDK (@calcom/embed-react).
      </p>
    </div>
  );
}

function FocusmateBlurb() {
  return (
    <div className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-3">
      <p className="text-white/80">
        Want instant "body-double" accountability? Use Focusmate's{" "}
        <strong>Focus Now</strong> to get paired and start right away, or schedule sessions on their platform.
      </p>
      <div className="flex gap-2">
        <a
          className="px-4 py-2 rounded bg-white/10 hover:bg-white/15 inline-flex items-center gap-2"
          href="https://www.focusmate.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Open Focusmate <ExternalLink className="w-4 h-4" />
        </a>
      </div>
      <p className="text-xs text-white/45">
        Focusmate pairs you with a partner for live, virtual coworking sessions; "Focus Now" connects you immediately. 
      </p>
    </div>
  );
}
