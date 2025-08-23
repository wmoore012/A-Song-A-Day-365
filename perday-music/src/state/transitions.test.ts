import { describe, it, expect } from 'vitest';
import { transition, visibleControls } from './transitions';
import { FlowState, InvalidTransition } from './types';

describe('State Machine Transitions', () => {
  const initialState = {
    state: FlowState.PRE_START,
    readyPressed: false,
    multiplierPenalty: false
  };

  describe('Valid Transitions', () => {
    it('should allow READY from PRE_START', () => {
      const result = transition(initialState, { type: 'READY' });
      expect(result.readyPressed).toBe(true);
      expect(result.state).toBe(FlowState.PRE_START);
    });

    it('should allow TIMER_ZERO from PRE_START', () => {
      const result = transition(initialState, { type: 'TIMER_ZERO' });
      expect(result.state).toBe(FlowState.LOCK_IN);
      expect(result.multiplierPenalty).toBe(true); // No ready pressed
    });

    it('should allow TIMER_ZERO from PRE_START after READY', () => {
      const readyState = transition(initialState, { type: 'READY' });
      const result = transition(readyState, { type: 'TIMER_ZERO' });
      expect(result.state).toBe(FlowState.LOCK_IN);
      expect(result.multiplierPenalty).toBe(false); // Ready was pressed
    });

    it('should allow PICK_TYPE from LOCK_IN', () => {
      const lockInState = { ...initialState, state: FlowState.LOCK_IN };
      const result = transition(lockInState, { type: 'PICK_TYPE', payload: 'Beat' });
      expect(result.state).toBe(FlowState.FOCUS_SETUP);
      expect(result.target).toBe('Beat');
    });

    it('should allow SET_TARGET from FOCUS_SETUP', () => {
      const focusState = { ...initialState, state: FlowState.FOCUS_SETUP };
      const result = transition(focusState, { type: 'SET_TARGET', payload: 'New Beat' });
      expect(result.target).toBe('New Beat');
    });

    it('should allow SET_DURATION from FOCUS_SETUP', () => {
      const focusState = { ...initialState, state: FlowState.FOCUS_SETUP };
      const result = transition(focusState, { type: 'SET_DURATION', payload: 45 });
      expect(result.durationMin).toBe(45);
    });

    it('should allow START_FOCUS from FOCUS_SETUP with target and duration', () => {
      const focusState = { 
        ...initialState, 
        state: FlowState.FOCUS_SETUP,
        target: 'Beat',
        durationMin: 25
      };
      const result = transition(focusState, { type: 'START_FOCUS' });
      expect(result.state).toBe(FlowState.FOCUS_RUNNING);
      expect(result.startTime).toBeDefined();
    });

    it('should allow END_FOCUS from FOCUS_RUNNING', () => {
      const runningState = { 
        ...initialState, 
        state: FlowState.FOCUS_RUNNING,
        startTime: Date.now()
      };
      const result = transition(runningState, { type: 'END_FOCUS' });
      expect(result.state).toBe(FlowState.CHECKPOINT);
      expect(result.endTime).toBeDefined();
    });

    it('should allow ATTACH_PROOF from CHECKPOINT', () => {
      const checkpointState = { ...initialState, state: FlowState.CHECKPOINT };
      const result = transition(checkpointState, { type: 'ATTACH_PROOF', payload: 'proof' });
      expect(result.state).toBe(FlowState.SELF_RATE);
      expect(result.proof).toBe('proof');
    });

    it('should allow SKIP_CHECKPOINT from CHECKPOINT', () => {
      const checkpointState = { ...initialState, state: FlowState.CHECKPOINT };
      const result = transition(checkpointState, { type: 'SKIP_CHECKPOINT' });
      expect(result.state).toBe(FlowState.SELF_RATE);
    });

    it('should allow RATE_SESSION from SELF_RATE', () => {
      const rateState = { ...initialState, state: FlowState.SELF_RATE };
      const result = transition(rateState, { type: 'RATE_SESSION', payload: 2 });
      expect(result.rating).toBe(2);
    });

    it('should allow CONTINUE from SELF_RATE to RECAP', () => {
      const rateState = { ...initialState, state: FlowState.SELF_RATE };
      const result = transition(rateState, { type: 'CONTINUE' });
      expect(result.state).toBe(FlowState.RECAP);
    });

    it('should allow CONTINUE from RECAP to REWARD_GATE', () => {
      const recapState = { ...initialState, state: FlowState.RECAP };
      const result = transition(recapState, { type: 'CONTINUE' });
      expect(result.state).toBe(FlowState.REWARD_GATE);
    });

    it('should allow CONTINUE from REWARD_GATE to POST_ACTIONS', () => {
      const rewardState = { ...initialState, state: FlowState.REWARD_GATE };
      const result = transition(rewardState, { type: 'CONTINUE' });
      expect(result.state).toBe(FlowState.POST_ACTIONS);
    });

    it('should allow BACK from FOCUS_SETUP to LOCK_IN', () => {
      const focusState = { ...initialState, state: FlowState.FOCUS_SETUP };
      const result = transition(focusState, { type: 'BACK' });
      expect(result.state).toBe(FlowState.LOCK_IN);
    });

    it('should allow BACK from CHECKPOINT to FOCUS_RUNNING', () => {
      const checkpointState = { ...initialState, state: FlowState.CHECKPOINT };
      const result = transition(checkpointState, { type: 'BACK' });
      expect(result.state).toBe(FlowState.FOCUS_RUNNING);
    });

    it('should allow RESET to return to PRE_START', () => {
      const anyState = { ...initialState, state: FlowState.FOCUS_RUNNING };
      const result = transition(anyState, { type: 'RESET' });
      expect(result.state).toBe(FlowState.PRE_START);
      expect(result.readyPressed).toBe(false);
      expect(result.multiplierPenalty).toBe(false);
    });
  });

  describe('Invalid Transitions', () => {
    it('should throw InvalidTransition for READY from non-PRE_START', () => {
      const lockInState = { ...initialState, state: FlowState.LOCK_IN };
      expect(() => transition(lockInState, { type: 'READY' }))
        .toThrow(InvalidTransition);
    });

    it('should throw InvalidTransition for TIMER_ZERO from non-PRE_START', () => {
      const lockInState = { ...initialState, state: FlowState.LOCK_IN };
      expect(() => transition(lockInState, { type: 'TIMER_ZERO' }))
        .toThrow(InvalidTransition);
    });

    it('should throw InvalidTransition for PICK_TYPE from non-LOCK_IN', () => {
      expect(() => transition(initialState, { type: 'PICK_TYPE', payload: 'Beat' }))
        .toThrow(InvalidTransition);
    });

    it('should throw InvalidTransition for START_FOCUS without target and duration', () => {
      const focusState = { ...initialState, state: FlowState.FOCUS_SETUP };
      expect(() => transition(focusState, { type: 'START_FOCUS' }))
        .toThrow(InvalidTransition);
    });

    it('should throw InvalidTransition for CONTINUE from invalid states', () => {
      const preStartState = { ...initialState, state: FlowState.PRE_START };
      expect(() => transition(preStartState, { type: 'CONTINUE' }))
        .toThrow(InvalidTransition);
    });

    it('should throw InvalidTransition for BACK from invalid states', () => {
      const preStartState = { ...initialState, state: FlowState.PRE_START };
      expect(() => transition(preStartState, { type: 'BACK' }))
        .toThrow(InvalidTransition);
    });
  });

  describe('Visible Controls', () => {
    it('should have controls defined for all states', () => {
      Object.values(FlowState).forEach(state => {
        expect(visibleControls[state]).toBeDefined();
        expect(Array.isArray(visibleControls[state])).toBe(true);
        expect(visibleControls[state].length).toBeGreaterThan(0);
      });
    });

    it('should have PRE_START controls', () => {
      expect(visibleControls[FlowState.PRE_START]).toContain('Ready');
      expect(visibleControls[FlowState.PRE_START]).toContain('Start Now');
    });

    it('should have LOCK_IN controls', () => {
      expect(visibleControls[FlowState.LOCK_IN]).toContain('Beat');
      expect(visibleControls[FlowState.LOCK_IN]).toContain('Bars');
      expect(visibleControls[FlowState.LOCK_IN]).toContain('Mix');
      expect(visibleControls[FlowState.LOCK_IN]).toContain('Practice');
    });
  });
});
