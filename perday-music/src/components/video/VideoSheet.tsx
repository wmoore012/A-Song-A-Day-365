"use client";

import { useEffect, useRef, useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "../ui/sheet";
import { ExternalLink } from "lucide-react";

// Jitsi Meet API types
interface JitsiMeetExternalAPI {
  dispose(): void;
  executeCommand(command: string, ...args: unknown[]): void;
  addEventListener(event: string, handler: (data: unknown) => void): void;
  removeEventListener(event: string, handler: (data: unknown) => void): void;
}

interface JitsiMeetExternalAPIConstructor {
  new (domain: string, options: {
    roomName: string;
    parentNode?: HTMLElement;
    configOverwrite?: Record<string, unknown>;
    interfaceConfigOverwrite?: Record<string, unknown>;
    width?: string | number;
    height?: string | number;
  }): JitsiMeetExternalAPI;
}

declare global {
  interface Window {
    JitsiMeetExternalAPI?: JitsiMeetExternalAPIConstructor;
  }
}

type Props = { open: boolean; onOpenChange: (v: boolean) => void };

export default function VideoSheet({ open, onOpenChange }: Props) {
  const [provider, setProvider] = useState<"whereby" | "jitsi">("jitsi");
  const [roomName, setRoomName] = useState("perday-camp-room");
  const jitsiRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<JitsiMeetExternalAPI | null>(null);

  // Lazy-load Jitsi API and mount when provider === 'jitsi'
  useEffect(() => {
    if (!open || provider !== "jitsi") return;

    const ensureScript = () =>
      new Promise<void>((resolve) => {
        if (window.JitsiMeetExternalAPI) return resolve();
        const s = document.createElement("script");
        s.src = "https://meet.jit.si/external_api.js";
        s.onload = () => resolve();
        document.body.appendChild(s);
      });

    let disposed = false;
    ensureScript().then(() => {
      if (disposed || !jitsiRef.current) return;
      const JitsiMeetExternalAPI = window.JitsiMeetExternalAPI;
      if (!JitsiMeetExternalAPI) {
        console.error('Jitsi Meet API not loaded');
        return;
      }
      apiRef.current = new JitsiMeetExternalAPI("meet.jit.si", {
        roomName,
        parentNode: jitsiRef.current,
        width: "100%",
        height: 520,
        configOverwrite: {
          startWithAudioMuted: false,
          startWithVideoMuted: false,
          disableThirdPartyRequests: true,
          enableWelcomePage: false,
          prejoinPageEnabled: true
        },
        interfaceConfigOverwrite: { MOBILE_APP_PROMO: false },
      });
    });

    return () => {
      disposed = true;
      apiRef.current?.dispose?.();
      apiRef.current = null;
    };
  }, [open, provider, roomName]);

  const wherebyRoom = `https://whereby.com/${roomName}?embed`; // NOTE: whitelist your domain in Whereby Embedded.

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="bg-black/95 border-cyan-400/30 text-white w-[720px]">
        <SheetHeader>
          <SheetTitle className="text-cyan-300">Video Rooms</SheetTitle>
          <SheetDescription className="text-white/60">
            Video unlocks on breaks or after you stack—keep the cookup sacred.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {/* Provider toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setProvider("jitsi")}
              className={`px-3 py-2 rounded ${provider==="jitsi" ? "bg-white/15" : "bg-white/5"}`}
            >
              Jitsi (instant)
            </button>
            <button
              onClick={() => setProvider("whereby")}
              className={`px-3 py-2 rounded ${provider==="whereby" ? "bg-white/15" : "bg-white/5"}`}
            >
              Whereby (embed)
            </button>

            <a
              href="https://www.focusmate.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto inline-flex items-center gap-1 px-3 py-2 rounded bg-white/10 hover:bg-white/15"
              title="Open Focusmate"
            >
              Focusmate <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Room name control */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-white/60">Room:</span>
            <input
              className="bg-white/5 border border-white/10 rounded px-2 py-1"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
            />
          </div>

          {/* Provider UIs */}
          {provider === "jitsi" ? (
            <div ref={jitsiRef} className="w-full rounded-lg overflow-hidden border border-white/10" />
          ) : (
            <div className="w-full rounded-lg overflow-hidden border border-white/10">
              <iframe
                title="Whereby"
                src={wherebyRoom}
                allow="camera; microphone; fullscreen; display-capture; autoplay; clipboard-write"
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                className="w-full h-[520px]"
              />
              <p className="text-xs text-white/40 px-2 py-2">
                Whereby embed requires your site domain to be whitelisted in Whereby Embedded settings.
              </p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
