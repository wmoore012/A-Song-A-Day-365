// Lightweight event bus for various UI effects
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _fxSubscribers = new Set<(type: string, data?: any) => void>();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function _fxEmit(type: string, data?: any) {
  _fxSubscribers.forEach(subscriber => subscriber(type, data));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function _fxSubscribe(fn: (type: string, data?: any) => void) {
  _fxSubscribers.add(fn);
  // Return unsubscribe function
  return () => _fxSubscribers.delete(fn);
}

// Public hook to trigger effects
export function useVillainAnnounce() {
  return {
    announce: (msg: string) => _fxEmit("announce", { msg }),
    confetti: () => _fxEmit("confetti"),
    toast: (msg: string, type: "success" | "error" | "info" = "info") => _fxEmit("toast", { msg, type }),
    villainNudge: (msg: string) => _fxEmit("villain-nudge", { msg }),
  };
}
