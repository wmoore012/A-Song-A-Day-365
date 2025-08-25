import { describe, it, expect } from 'vitest';
import { transition } from '../../store/transitions';
import { FlowState, type Session } from '../../types';

const fresh: Session = {
  state: FlowState.PRE_START,
  readyPressed: false,
  multiplierPenalty: false,
  // add other fields if your Session type requires them
} as Session;

describe('flow transitions', () => {
  it('PRE_START → READY → LOCK_IN at T0', () => {
    const ready = transition(fresh, { type: 'READY' });
    expect(ready.readyPressed).toBe(true);

    const toLock = transition({ ...ready, state: FlowState.PRE_START }, { type: 'TIMER_ZERO' });
    expect(toLock.state).toBe(FlowState.LOCK_IN);
  });

  it('LOCK_IN → FOCUS_SETUP → FOCUS_RUNNING', () => {
    const s1 = { ...fresh, state: FlowState.LOCK_IN } as Session;
    const s2 = transition(s1, { type: 'PICK_TYPE', payload: 'Beat' });
    expect(s2.state).toBe(FlowState.FOCUS_SETUP);

    const s3 = transition(s2, { type: 'SET_TARGET', payload: 'Mix vocals' });
    const s4 = transition(s3, { type: 'SET_DURATION', payload: 14 });
    const s5 = transition(s4, { type: 'START_FOCUS' });
    expect(s5.state).toBe(FlowState.FOCUS_RUNNING);
  });

  it('invalid moves throw', () => {
    expect(() =>
      transition({ ...fresh, state: FlowState.FOCUS_RUNNING } as Session, { type: 'START_FOCUS' })
    ).toThrow();
  });

  it('BACK from FOCUS_SETUP returns to LOCK_IN; BACK from LOCK_IN (if unimplemented) throws', () => {
    const fromSetup = transition({ ...fresh, state: FlowState.FOCUS_SETUP } as Session, { type: 'BACK' });
    expect(fromSetup.state).toBe(FlowState.LOCK_IN);

    const fromLock = { ...fresh, state: FlowState.LOCK_IN } as Session;
    expect(() => transition(fromLock, { type: 'BACK' })).toThrow();
  });
});

