import { FlowState } from "../types";

// "Break" = CHECKPOINT, PRE_START, or after stack (RECAP/REWARD_GATE).
// You can tweak this set any time.
const SOCIAL_OK = new Set<FlowState>([
  FlowState.PRE_START,
  FlowState.CHECKPOINT,
  FlowState.RECAP,
  FlowState.REWARD_GATE,
]);

export function canUseSocial(state: FlowState) {
  return SOCIAL_OK.has(state);
}

export function reasonWhenBlocked(state: FlowState) {
  if (state === FlowState.FOCUS_RUNNING) {
    return "Locked while you're cooking. Social unlocks on breaks or after you stack.";
  }
  return "Social opens on breaks or after you stack.";
}
