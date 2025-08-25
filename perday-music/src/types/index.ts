export enum FlowState {
  VAULT_CLOSED = "VAULT_CLOSED",      // Vault is closed, show welcome screen
  DASHBOARD = "DASHBOARD",           // Main dashboard view
  QUESTIONNAIRE = "QUESTIONNAIRE",    // User answering initial questions
  PREPARATION = "PREPARATION",        // 7-minute preparation phase
  PRE_START = "PRE_START",           // Ready to start session
  LOCK_IN = "LOCK_IN",               // Choose work type
  FOCUS_SETUP = "FOCUS_SETUP",       // Set up focus session
  FOCUS_RUNNING = "FOCUS_RUNNING",   // Active work session
  CHECKPOINT = "CHECKPOINT",         // Mid-session checkpoint
  SELF_RATE = "SELF_RATE",           // Rate the session
  RECAP = "RECAP",                   // Session summary
  REWARD_GATE = "REWARD_GATE",       // Reward screen
  POST_ACTIONS = "POST_ACTIONS",     // Post-session actions
  SCROLL_DEMO = "SCROLL_DEMO",       // Scroll animation demo page
}

export type Rating = 1 | 2 | 3;

export type Grade = 'A' | 'B' | 'C';

export type Genre = 'Trap' | 'Hip-Hop' | 'R&B' | 'Pop' | 'Electronic' | 'Rock' | 'Jazz' | 'Country' | 'Other';

export interface InventoryItem {
  id: string;
  title: string;
  genre: Genre;
  createdAt: Date;
  rating?: Rating;
  notes?: string;
}

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
  // User profile data
  userName?: string;
  collaborators?: string;
  // Preparation phase
  preparationComplete?: boolean;
  preparationStartTime?: number;
}

export type Action =
  | { type: "OPEN_VAULT" }                          // Open vault to reveal content
  | { type: "GO_TO_DASHBOARD" }                     // Go to main dashboard
  | { type: "START_QUESTIONNAIRE" }                 // Begin questionnaire
  | { type: "COMPLETE_QUESTIONNAIRE"; payload: { name: string; collaborators: string; sessionDate?: Date } }
  | { type: "START_PREPARATION" }                   // Begin 7-minute preparation
  | { type: "COMPLETE_PREPARATION" }                // Finish preparation phase
  | { type: "READY" }                               // User is ready to start
  | { type: "TIMER_ZERO" }                          // Timer reached zero
  | { type: "PICK_TYPE"; payload: string }          // Choose work type
  | { type: "SET_TARGET"; payload: string }         // Set work target
  | { type: "SET_DURATION"; payload: number }       // Set session duration
  | { type: "START_FOCUS" }                         // Start focus session
  | { type: "PAUSE" }                               // Pause session
  | { type: "END_FOCUS" }                           // End focus session
  | { type: "ATTACH_PROOF"; payload?: string }      // Attach proof of work
  | { type: "SKIP_CHECKPOINT" }                     // Skip checkpoint
  | { type: "RATE_SESSION"; payload: Rating }       // Rate the session
  | { type: "CONTINUE" }                            // Continue to next phase
  | { type: "SAVE_SUMMARY" }                        // Save session summary
  | { type: "DISCARD" }                             // Discard session
  | { type: "CLAIM_AWARD" }                         // Claim reward
  | { type: "BACK" }                                // Go back to previous state
  | { type: "RESET" }                               // Reset entire flow
  | { type: "ADD_NOTE"; payload: string }
  | { type: "UPDATE_SETTINGS"; payload: Partial<Settings> }
  | { type: "SCROLL_DEMO" }
  | { type: "STACK_SONG"; payload: { title: string; genre: Genre; rating?: Rating; notes?: string } };

export interface Settings {
  defaultDuration: number;
  defaultMultiplier: number;
  autoStartTimer: boolean;
  soundEnabled: boolean;
  volume: number;
  notifications: boolean;
  accountabilityEmail: string;
  userName?: string;
  collaborators?: string;
  defaultPlaylist?: string;
}

export class InvalidTransition extends Error {
  constructor(from: FlowState, action: string) {
    super(`Invalid transition from ${from} via ${action}`);
    this.name = "InvalidTransition";
  }
}
