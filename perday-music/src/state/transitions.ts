import { FlowState, Session, Action, InvalidTransition } from './types';

export function transition(session: Session, action: Action): Session {
  const { state } = session;
  
  switch (action.type) {
    case 'READY':
      if (state !== FlowState.PRE_START) {
        throw new InvalidTransition(state, 'READY');
      }
      return { ...session, readyPressed: true };
      
    case 'TIMER_ZERO':
      if (state !== FlowState.PRE_START) {
        throw new InvalidTransition(state, 'TIMER_ZERO');
      }
      return {
        ...session,
        state: FlowState.LOCK_IN,
        multiplierPenalty: !session.readyPressed
      };
      
    case 'PICK_TYPE':
      if (state !== FlowState.LOCK_IN) {
        throw new InvalidTransition(state, 'PICK_TYPE');
      }
      return {
        ...session,
        state: FlowState.FOCUS_SETUP,
        target: action.payload
      };
      
    case 'SET_TARGET':
      if (state !== FlowState.FOCUS_SETUP) {
        throw new InvalidTransition(state, 'SET_TARGET');
      }
      return { ...session, target: action.payload };
      
    case 'SET_DURATION':
      if (state !== FlowState.FOCUS_SETUP) {
        throw new InvalidTransition(state, 'SET_DURATION');
      }
      return { ...session, durationMin: action.payload };
      
    case 'START_FOCUS':
      if (state !== FlowState.FOCUS_SETUP || !session.target || !session.durationMin) {
        throw new InvalidTransition(state, 'START_FOCUS');
      }
      return {
        ...session,
        state: FlowState.FOCUS_RUNNING,
        startTime: Date.now()
      };
      
    case 'PAUSE':
      if (state !== FlowState.FOCUS_RUNNING) {
        throw new InvalidTransition(state, 'PAUSE');
      }
      // For now, just continue - could add pause state later
      return session;
      
    case 'END_FOCUS':
      if (state !== FlowState.FOCUS_RUNNING) {
        throw new InvalidTransition(state, 'END_FOCUS');
      }
      return {
        ...session,
        state: FlowState.CHECKPOINT,
        endTime: Date.now()
      };
      
    case 'ADD_NOTE':
      if (state !== FlowState.FOCUS_RUNNING) {
        throw new InvalidTransition(state, 'ADD_NOTE');
      }
      return { ...session, notes: action.payload };
      
    case 'ATTACH_PROOF':
      if (state !== FlowState.CHECKPOINT) {
        throw new InvalidTransition(state, 'ATTACH_PROOF');
      }
      return {
        ...session,
        state: FlowState.SELF_RATE,
        proof: action.payload
      };
      
    case 'SKIP_CHECKPOINT':
      if (state !== FlowState.CHECKPOINT) {
        throw new InvalidTransition(state, 'SKIP_CHECKPOINT');
      }
      return {
        ...session,
        state: FlowState.SELF_RATE
      };
      
    case 'CONTINUE':
      if (state === FlowState.SELF_RATE) {
        return { ...session, state: FlowState.RECAP };
      } else if (state === FlowState.RECAP) {
        return { ...session, state: FlowState.REWARD_GATE };
      } else if (state === FlowState.REWARD_GATE) {
        return { ...session, state: FlowState.POST_ACTIONS };
      } else {
        throw new InvalidTransition(state, 'CONTINUE');
      }
      
    case 'RATE_SESSION':
      if (state !== FlowState.SELF_RATE) {
        throw new InvalidTransition(state, 'RATE_SESSION');
      }
      return { ...session, rating: action.payload };
      
    case 'SAVE_SUMMARY':
      if (state !== FlowState.RECAP) {
        throw new InvalidTransition(state, 'SAVE_SUMMARY');
      }
      return session; // Could add persistence logic here
      
    case 'DISCARD':
      if (state !== FlowState.RECAP) {
        throw new InvalidTransition(state, 'DISCARD');
      }
      return session;
      
    case 'CLAIM_AWARD':
      if (state !== FlowState.REWARD_GATE) {
        throw new InvalidTransition(state, 'CLAIM_AWARD');
      }
      return session;
      
    case 'BACK':
      if (state === FlowState.FOCUS_SETUP) {
        return { ...session, state: FlowState.LOCK_IN };
      } else if (state === FlowState.CHECKPOINT) {
        return { ...session, state: FlowState.FOCUS_RUNNING };
      } else {
        throw new InvalidTransition(state, 'BACK');
      }
      
    case 'RESET':
      return {
        state: FlowState.PRE_START,
        readyPressed: false,
        multiplierPenalty: false
      };
      
    default:
      throw new InvalidTransition(state, `Unknown action: ${(action as any).type}`);
  }
}

export const visibleControls: Record<FlowState, string[]> = {
  [FlowState.PRE_START]: ['Ready', 'Start Now'],
  [FlowState.LOCK_IN]: ['Beat', 'Bars', 'Mix', 'Practice'],
  [FlowState.FOCUS_SETUP]: ['Select Target', 'Select Duration', 'Start Focus', 'Back'],
  [FlowState.FOCUS_RUNNING]: ['Pause', 'End', 'Add Note'],
  [FlowState.CHECKPOINT]: ['Attach Proof', 'Skip', 'Continue'],
  [FlowState.SELF_RATE]: ['Underhit', 'Hit', 'Overhit', 'Continue'],
  [FlowState.RECAP]: ['Save Summary', 'Discard'],
  [FlowState.REWARD_GATE]: ['Claim Award', 'Continue'],
  [FlowState.POST_ACTIONS]: ['Export', 'Upload', 'Share', 'Start New'],
};
