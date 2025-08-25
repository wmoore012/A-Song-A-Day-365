type FxPayload =
  | { msg: string; type?: never }
  | { msg?: never; type?: 'success' | 'error' | 'info' }
  | Record<string, unknown>;

type FxType = 'announce' | 'confetti' | 'toast' | 'villain-nudge';

// Lightweight event bus (module singleton)
const subscribers = new Set<(type: FxType, data?: FxPayload) => void>();

export function _fxEmit(type: FxType, data?: FxPayload) {
  subscribers.forEach(fn => fn(type, data));
}

export function _fxSubscribe(fn: (type: FxType, data?: FxPayload) => void) {
  subscribers.add(fn);
  return () => subscribers.delete(fn);
}

export function useVillainAnnounce() {
  return {
    announce: (msg: string) => _fxEmit("announce", { msg }),
    confetti: () => _fxEmit("confetti"),
    toast: (msg: string, type: "success" | "error" | "info" = "info") =>
      _fxEmit("toast", { msg, type }),
    villainNudge: (msg: string) => _fxEmit("villain-nudge", { msg }),
  };
}
