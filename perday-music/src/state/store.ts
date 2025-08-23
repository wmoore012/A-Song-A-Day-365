import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Session, FlowState, Action } from './types';
import { transition } from './transitions';

interface SessionStore {
  session: Session;
  userSettings: UserSettings;
  dispatch: (action: Action) => void;
  reset: () => void;
  resetAll: () => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
}

interface UserSettings {
  defaultDuration: number;
  defaultMultiplier: number;
  autoStartTimer: boolean;
  soundEnabled: boolean;
  volume: number;
  notifications: boolean;
  accountabilityEmail: string;
  userName: string;
  collaborators: string;
}

const initialSession: Session = {
  state: FlowState.PRE_START,
  readyPressed: false,
  multiplierPenalty: false
};

const initialSettings: UserSettings = {
  defaultDuration: 25,
  defaultMultiplier: 1.5,
  autoStartTimer: true,
  soundEnabled: true,
  volume: 0.7,
  notifications: true,
  accountabilityEmail: '',
  userName: '',
  collaborators: ''
};

export const useSessionStore = create<SessionStore>()(
  persist(
    (set, get) => ({
      session: initialSession,
      userSettings: initialSettings,
      dispatch: (action: Action) => {
        try {
          const newSession = transition(get().session, action);
          set({ session: newSession });
        } catch (error) {
          console.error('Invalid transition:', error);
          // Could dispatch to error state here
        }
      },
      reset: () => set({ session: initialSession }),
      resetAll: () => set({ session: initialSession, userSettings: initialSettings }),
      updateSettings: (newSettings: Partial<UserSettings>) => {
        set((state) => ({
          userSettings: { ...state.userSettings, ...newSettings }
        }));
      }
    }),
    {
      name: 'perday-session',
      partialize: (state) => ({ 
        userSettings: state.userSettings 
        // Don't persist session state - always start fresh
      })
    }
  )
);
