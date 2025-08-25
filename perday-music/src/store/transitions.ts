import { Action, FlowState, InvalidTransition, Session } from "../types";

export function transition(s: Session, a: Action): Session {
  switch (a.type) {
    case "OPEN_VAULT":
      if (s.state !== FlowState.VAULT_CLOSED) throw new InvalidTransition(s.state, a.type);
      return { ...s, state: FlowState.QUESTIONNAIRE };

    case "GO_TO_DASHBOARD":
      // Can go to dashboard from any state
      return { ...s, state: FlowState.DASHBOARD };

    case "START_QUESTIONNAIRE":
      // Allow transition from VAULT_CLOSED to QUESTIONNAIRE
      if (s.state !== FlowState.VAULT_CLOSED && s.state !== FlowState.QUESTIONNAIRE) throw new InvalidTransition(s.state, a.type);
      return { ...s, state: FlowState.QUESTIONNAIRE };

    case "COMPLETE_QUESTIONNAIRE":
      if (s.state !== FlowState.QUESTIONNAIRE) throw new InvalidTransition(s.state, a.type);
      return {
        ...s,
        state: FlowState.PREPARATION,
        userName: a.payload.name,
        collaborators: a.payload.collaborators,
        preparationStartTime: Date.now()
      };

    case "START_PREPARATION":
      if (s.state !== FlowState.PREPARATION) throw new InvalidTransition(s.state, a.type);
      return { ...s, preparationStartTime: Date.now() };

    case "COMPLETE_PREPARATION":
      if (s.state !== FlowState.PREPARATION) throw new InvalidTransition(s.state, a.type);
      return { ...s, state: FlowState.PRE_START, preparationComplete: true };

    case "READY":
      if (s.state !== FlowState.PRE_START) throw new InvalidTransition(s.state, a.type);
      return { ...s, readyPressed: true };

    case "TIMER_ZERO":
      if (s.state !== FlowState.PRE_START) throw new InvalidTransition(s.state, a.type);
      // autostart into LOCK_IN; apply penalty if not READY
      return {
        ...s,
        state: FlowState.LOCK_IN,
        multiplierPenalty: !s.readyPressed,
      };

    case "PICK_TYPE":
      if (s.state !== FlowState.LOCK_IN) throw new InvalidTransition(s.state, a.type);
      return { ...s, state: FlowState.FOCUS_SETUP };

    case "SET_TARGET":
      if (s.state !== FlowState.FOCUS_SETUP) throw new InvalidTransition(s.state, a.type);
      return { ...s, target: a.payload };

    case "SET_DURATION":
      if (s.state !== FlowState.FOCUS_SETUP) throw new InvalidTransition(s.state, a.type);
      return { ...s, durationMin: a.payload };

    case "START_FOCUS":
      if (s.state !== FlowState.FOCUS_SETUP) throw new InvalidTransition(s.state, a.type);
      if (!s.target || !s.durationMin) throw new Error("Target and duration required");
      return { ...s, state: FlowState.FOCUS_RUNNING };

    case "END_FOCUS":
      if (s.state !== FlowState.FOCUS_RUNNING) throw new InvalidTransition(s.state, a.type);
      return { ...s, state: FlowState.CHECKPOINT };

    case "ADD_NOTE":
      if (s.state !== FlowState.FOCUS_RUNNING) throw new InvalidTransition(s.state, a.type);
      // For now, just return the same state since we don't have a notes field
      // In a real implementation, you'd add the note to a notes array
      return s;

    case "SKIP_CHECKPOINT":
    case "ATTACH_PROOF":
      if (s.state !== FlowState.CHECKPOINT) throw new InvalidTransition(s.state, a.type);
      return { ...s, state: FlowState.SELF_RATE };

    case "RATE_SESSION":
      if (s.state !== FlowState.SELF_RATE) throw new InvalidTransition(s.state, a.type);
      return { ...s, rating: a.payload };

    case "CONTINUE":
      if (s.state === FlowState.SELF_RATE) return { ...s, state: FlowState.RECAP };
      if (s.state === FlowState.REWARD_GATE) return { ...s, state: FlowState.PRE_START, readyPressed: false, multiplierPenalty: false, target: undefined, durationMin: undefined, rating: undefined };
      throw new InvalidTransition(s.state, a.type);

    case "SAVE_SUMMARY":
      if (s.state !== FlowState.RECAP) throw new InvalidTransition(s.state, a.type);
      return { ...s, state: FlowState.REWARD_GATE };

    case "DISCARD":
      if (s.state !== FlowState.RECAP) throw new InvalidTransition(s.state, a.type);
      return { ...s, state: FlowState.PRE_START, readyPressed: false, multiplierPenalty: false, target: undefined, durationMin: undefined, rating: undefined };

    case "CLAIM_AWARD":
      if (s.state !== FlowState.REWARD_GATE) throw new InvalidTransition(s.state, a.type);
      return { ...s, state: FlowState.PRE_START, readyPressed: false, multiplierPenalty: false, target: undefined, durationMin: undefined, rating: undefined };

    case "BACK":
      if (s.state === FlowState.FOCUS_SETUP) return { ...s, state: FlowState.LOCK_IN };
      if (s.state === FlowState.CHECKPOINT) return { ...s, state: FlowState.FOCUS_RUNNING };
      throw new InvalidTransition(s.state, a.type);

    case "SCROLL_DEMO":
      // Direct navigation to scroll demo (can be accessed from any state)
      return { ...s, state: FlowState.SCROLL_DEMO };

    case "STACK_SONG":
      // Stack a song to inventory (can be called from any state)
      return { ...s, state: FlowState.RECAP };

    case "RESET":
      return { state: FlowState.VAULT_CLOSED, readyPressed: false, multiplierPenalty: false, preparationStartTime: undefined };

    default:
      return s;
  }
}
