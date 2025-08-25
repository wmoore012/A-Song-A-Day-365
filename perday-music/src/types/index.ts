export enum FlowState {
  PRE_START = "PRE_START",
  LOCK_IN = "LOCK_IN",
  FOCUS_SETUP = "FOCUS_SETUP",
  FOCUS_RUNNING = "FOCUS_RUNNING",
  CHECKPOINT = "CHECKPOINT",
  SELF_RATE = "SELF_RATE",
  RECAP = "RECAP",
  REWARD_GATE = "REWARD_GATE",
  POST_ACTIONS = "POST_ACTIONS", // Add missing state
}

export type Rating = 1 | 2 | 3;

export type Grade = 'A' | 'B' | 'C';

export interface Session {
  state: FlowState;
  readyPressed: boolean;
  multiplierPenalty: boolean;
  target?: string;
  durationMin?: number;
  rating?: Rating;
  startTime?: number;
  endTime?: number;
  notes?: string;
  proof?: string;
}

export type Action =
  | { type: "READY" }
  | { type: "TIMER_ZERO" }
  | { type: "PICK_TYPE"; payload: string }
  | { type: "SET_TARGET"; payload: string }
  | { type: "SET_DURATION"; payload: number }
  | { type: "START_FOCUS" }
  | { type: "PAUSE" }
  | { type: "END_FOCUS" }
  | { type: "ATTACH_PROOF"; payload?: string }
  | { type: "SKIP_CHECKPOINT" }
  | { type: "RATE_SESSION"; payload: Rating }
  | { type: "CONTINUE" }
  | { type: "SAVE_SUMMARY" }
  | { type: "DISCARD" }
  | { type: "CLAIM_AWARD" }
  | { type: "BACK" }
  | { type: "RESET" }
  | { type: "ADD_NOTE"; payload: string }; // Add missing action

export class InvalidTransition extends Error {
  constructor(from: FlowState, action: string) {
    super(`Invalid transition from ${from} via ${action}`);
    this.name = "InvalidTransition";
  }
}
