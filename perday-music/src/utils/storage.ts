

// Storage helper with validation
export const store = {
  get<T>(k: string, fallback: T): T {
    try { 
      const v = localStorage.getItem(k); 
      return v ? JSON.parse(v) as T : fallback;
    }
    catch (error) { 
      if (process.env.NODE_ENV === 'development') {
        console.error(`Storage get error for key "${k}":`, error);
      }
      return fallback; // fail loud in dev via console
    }
  },
  
  set<T>(k: string, v: T): void {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error(`Storage set error for key "${k}":`, error);
        throw error; // fail loud in dev
      }
      // In prod, log but don't throw to avoid breaking the app
      console.warn(`Failed to save to localStorage: ${error}`);
    }
  },

  // Namespaced helpers for Perday
  perday: {
    get<T>(key: string, fallback: T): T {
      return store.get(`perday.${key}`, fallback);
    },
    
    set<T>(key: string, value: T): void {
      store.set(`perday.${key}`, value);
    },

    // Feature toggles
    sound: {
      get enabled(): boolean {
        return store.perday.get('sound.enabled', false);
      },
      set enabled(value: boolean) {
        store.perday.set('sound.enabled', value);
      }
    },

    motion: {
      get enabled(): boolean {
        return store.perday.get('motion.enabled', true);
      },
      set enabled(value: boolean) {
        store.perday.set('motion.enabled', value);
      }
    }
  }
};

// Schema validation helpers
export function validateGrade(grade: unknown): number {
  if (typeof grade !== 'number' || grade < 0 || grade > 100) {
    throw new Error(`Invalid grade: ${grade}. Must be number 0-100.`);
  }
  return grade;
}

export function validateLatency(ms: unknown): number {
  if (typeof ms !== 'number' || ms < 0 || ms > 300_000) {
    throw new Error(`Invalid latency: ${ms}ms. Must be number 0-300000.`);
  }
  return ms;
}

export function validatePhase(phase: unknown): 'prestart' | 'lockin' | 'wrap' {
  if (phase !== 'prestart' && phase !== 'lockin' && phase !== 'wrap') {
    throw new Error(`Invalid phase: ${phase}. Must be 'prestart' | 'lockin' | 'wrap'.`);
  }
  return phase;
}
