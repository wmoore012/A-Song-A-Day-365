import { useState } from "react";
import { Settings, BookOpen, Package, User, Volume2 } from "lucide-react";
import { useAppStore } from "../store/store";
import { toast } from "sonner";

// shadcn/ui (Radix) primitives render in a portal -> no overlap issues
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "./ui/tooltip";

import SettingsSheet from "./SettingsSheet";

// Notepad control (unchanged)
let notepadRef: { open: () => void } | null = null;
export const setNotepadRef = (ref: { open: () => void } | null) => {
  notepadRef = ref;
};

export default function GlassNavigationDock() {
  const { settings, setSettings } = useAppStore();
  const [musicOpen, setMusicOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const navItems = [
    {
      icon: User,
      label: "Profile",
      onClick: () => toast.info("Profile management coming soon!"),
      hoverColor: "hover:bg-blue-500/20 hover:border-blue-400/50",
    },
    {
      icon: BookOpen,
      label: "Notepad",
      onClick: () => (notepadRef ? notepadRef.open() : toast.info("Notepad opens automatically in sessions!")),
      hoverColor: "hover:bg-green-500/20 hover:border-green-400/50",
    },
    {
      icon: Package,
      label: "Inventory",
      onClick: () => toast.info("Inventory system coming soon!"),
      hoverColor: "hover:bg-purple-500/20 hover:border-purple-400/50",
    },
    {
      icon: Settings,
      label: "Settings",
      onClick: () => setSettingsOpen(true),
      hoverColor: "hover:bg-cyan-500/20 hover:border-cyan-400/50",
    },
  ] as const;

  return (
    <>
      {/* isolate => own stacking context; pointer-events auto only for the cluster */}
      <div className="fixed bottom-6 left-6 z-[70] isolate pointer-events-none">
        <div className="flex items-end gap-3 pointer-events-auto">
          {/* Main vertical dock */}
          <TooltipProvider>
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Tooltip key={item.label}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={item.onClick}
                      className={[
                        "relative p-3 rounded-2xl",
                        "bg-gradient-to-br from-white/15 via-white/8 to-white/5",
                        "border border-white/20 backdrop-blur-xl",
                        "shadow-2xl shadow-black/50 transition-all duration-200 ease-out",
                        // Remove scale transform to avoid stacking-context fights; use subtle translate + ring instead
                        "hover:-translate-y-0.5 hover:ring-1 hover:ring-white/20",
                        item.hoverColor,
                      ].join(" ")}
                      aria-label={item.label}
                    >
                      <item.icon className="w-5 h-5 text-white drop-shadow-lg" />
                      {/* purely visual overlays must not capture clicks */}
                      <span className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity blur-xl scale-110" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="bg-black/90 text-white border border-white/10">
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </TooltipProvider>

          {/* Music button with a portal-based DropdownMenu (no overlap) */}
          <DropdownMenu open={musicOpen} onOpenChange={setMusicOpen}>
            <DropdownMenuTrigger asChild>
              <button
                className={[
                  "relative p-3 rounded-2xl",
                  "bg-gradient-to-br from-white/15 via-white/8 to-white/5",
                  "border border-white/20 backdrop-blur-xl",
                  "shadow-2xl shadow-black/50 transition-all duration-200 ease-out",
                  "hover:-translate-y-0.5 hover:ring-1 hover:ring-white/20",
                  "hover:bg-purple-500/20 hover:border-purple-400/50",
                ].join(" ")}
                aria-label="Enable Music"
              >
                <Volume2 className="w-5 h-5 text-white drop-shadow-lg" />
                <span className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity blur-xl scale-110" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              side="top"
              align="start"
              className="w-56 bg-black/90 backdrop-blur-xl border border-purple-400/50 rounded-xl shadow-2xl text-sm p-2"
            >
              <DropdownMenuItem
                onClick={() => {
                  setSettings({ ...settings, soundEnabled: true });
                  setMusicOpen(false);
                  toast.success("Music enabled!");
                }}
                className="w-full px-3 py-2 text-white bg-purple-600/80 hover:bg-purple-500/90 rounded-lg transition-colors cursor-pointer"
              >
                Enable Sound
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSettings({ ...settings, soundEnabled: false });
                  setMusicOpen(false);
                  toast.info("Proceeding with no sound");
                }}
                className="w-full px-3 py-2 text-white/80 bg-white/10 hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
              >
                Proceed with no sound
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Settings: control it explicitly. If your SettingsSheet wraps Radix <Sheet>, pass these props through. */}
      <SettingsSheet
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        currentSettings={settings}
        onSave={(newSettings) => {
          setSettings(newSettings);
          setSettingsOpen(false);
          toast.success("Settings saved successfully!");
        }}
        onResetAll={() => {
          setSettings({
            defaultDuration: 25,
            defaultMultiplier: 1.5,
            autoStartTimer: true,
            soundEnabled: true,
            volume: 0.15,
            notifications: true,
            accountabilityEmail: "",
            userName: settings.userName || "",
            collaborators: "",
            defaultPlaylist: "PLl-ShioB5kapLuMhLMqdyx_gKX_MBiXeb",
          });
          setSettingsOpen(false);
          toast.success("Settings reset to defaults!");
        }}
      />
    </>
  );
}
