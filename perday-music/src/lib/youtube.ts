/// <reference types="youtube" />

let ready: Promise<void> | null = null;

declare global {
  interface Window {
    YT?: typeof YT;
    onYouTubeIframeAPIReady?: () => void;
  }
}

/** Single-flight loader for the YouTube IFrame API. */
export function loadYouTubeAPI(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.YT?.Player) return Promise.resolve();

  if (!ready) {
    ready = new Promise<void>((resolve) => {
      const prior = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        prior?.();
        resolve();
      };

      // inject once
      if (!document.querySelector<HTMLScriptElement>('script[src="https://www.youtube.com/iframe_api"]')) {
        const s = document.createElement("script");
        s.src = "https://www.youtube.com/iframe_api";
        s.async = true;
        document.head.appendChild(s);
      }
    });
  }
  return ready;
}
