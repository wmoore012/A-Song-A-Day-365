export const DEMO_KEY = "perday-demo";
export const INTENT_KEY = "perday-intent";
export const X_COUNT_KEY = "perday-x-count";

export type IntentType = "songs" | "produce" | "riffs" | "mixes";

export interface DemoConfig {
  intent?: IntentType;
  xCount?: number;
}

export function enableDemoFromQuery() {
  const params = new URLSearchParams(window.location.search);
  if (params.get("demo") === "1") {
    localStorage.setItem(DEMO_KEY, "1");
  }
  
  // Store intent and x count from URL params
  const intent = params.get("intent") as IntentType;
  if (intent) {
    localStorage.setItem(INTENT_KEY, intent);
  }
  
  const xCount = params.get("x");
  if (xCount) {
    localStorage.setItem(X_COUNT_KEY, xCount);
  }
}

export function isDemoEnabled(): boolean {
  return localStorage.getItem(DEMO_KEY) === "1";
}

export function getDemoConfig(): DemoConfig {
  return {
    intent: (localStorage.getItem(INTENT_KEY) as IntentType) || undefined,
    xCount: parseInt(localStorage.getItem(X_COUNT_KEY) || "3", 10)
  };
}

export function demoUrl(path: string, config?: Partial<DemoConfig>): string {
  const url = new URL(path, window.location.origin);
  url.searchParams.set("demo", "1");
  
  if (config?.intent) {
    url.searchParams.set("intent", config.intent);
  }
  
  if (config?.xCount) {
    url.searchParams.set("x", config.xCount.toString());
  }
  
  return url.pathname + url.search;
}

export function clearDemoConfig() {
  localStorage.removeItem(DEMO_KEY);
  localStorage.removeItem(INTENT_KEY);
  localStorage.removeItem(X_COUNT_KEY);
}

export function setDemoConfig(config: DemoConfig) {
  if (config.intent) {
    localStorage.setItem(INTENT_KEY, config.intent);
  }
  if (config.xCount) {
    localStorage.setItem(X_COUNT_KEY, config.xCount.toString());
  }
}
