import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Session, FlowState, Action } from './types';
import { transition } from './transitions';

interface SessionStore {
  session: Session;
  dispatch: (action: Action) => void;
  reset: () => void;
}

const initialState: Session = {
  state: FlowState.PRE_START,
  readyPressed: false,
  multiplierPenalty: false
};

export const useSessionStore = create<SessionStore>()(
  persist(
    (set, get) => ({
      session: initialState,
      dispatch: (action: Action) => {
        try {
          const newSession = transition(get().session, action);
          set({ session: newSession });
        } catch (error) {
          console.error('Invalid transition:', error);
          // Could dispatch to error state here
        }
      },
      reset: () => set({ session: initialState })
    }),
    {
      name: 'perday-session',
      partialize: (state) => ({ session: state.session })
    }
  )
);
