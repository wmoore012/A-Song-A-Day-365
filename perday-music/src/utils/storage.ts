

// Storage helper with validation
export const storage = {
  get<T>(key: string, fallback: T): T {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) as T : fallback;
    } catch (error) {
      // Fail loud in dev
      if (import.meta.env.DEV) {
        console.error(`Storage get error for key "${key}":`, error);
      }
      return fallback;
    }
  },

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      // Fail loud in dev
      if (import.meta.env.DEV) {
        console.error(`Storage set error for key "${key}":`, error);
      }
    }
  },

  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      // Fail loud in dev
      if (import.meta.env.DEV) {
        console.error(`Storage remove error for key "${key}":`, error);
      }
    }
  }
};

// Namespaced helpers for Perday
export const perday = {
  get<T>(key: string, fallback: T): T {
    return storage.get(`perday.${key}`, fallback);
  },

  set<T>(key: string, value: T): void {
    storage.set(`perday.${key}`, value);
  },

  // Feature toggles
  sound: {
    get enabled(): boolean {
      return perday.get('sound.enabled', false);
    },
    set enabled(value: boolean) {
      perday.set('sound.enabled', value);
    }
  },

  motion: {
    get enabled(): boolean {
      return perday.get('motion.enabled', true);
    },
    set enabled(value: boolean) {
      perday.set('motion.enabled', value);
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
