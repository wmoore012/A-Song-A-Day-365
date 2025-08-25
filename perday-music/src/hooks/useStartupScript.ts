import { useEffect, useRef, useState } from 'react';
import { _fxEmit } from './useVillainAnnounce';

interface StartupMessage {
  id: string;
  text: string;
  delay: number;
}

const STARTUP_SCRIPT: StartupMessage[] = [
  { id: 'welcome', text: 'Welcome Back {name}!', delay: 2000 },
  { id: 'first-time', text: 'Ready to make some magic today?', delay: 6000 },
  { id: 'nervous', text: 'Still nervous? ...I remember my first time producing lol', delay: 10000 },
  { id: 'focus', text: 'Focus on the music. Everything else is noise.', delay: 15000 },
  { id: 'multiplier', text: 'Your multiplier is your friend. Keep it alive!', delay: 20000 },
  { id: 'villain-watching', text: "I'll be watching... don't disappoint me.", delay: 25000 },
];

const CONTINUOUS_MESSAGES = [
  "Focus on your work, or DON'T! 😂 More placements for me ✅",
  "I see you scrolling... 👀",
  "That beat better be fire 🔥",
  "Time is money, producer 💰",
  "Still here... still watching 👁️",
  "Make it count or make it again 🔄",
  "Your multiplier is getting lonely 😈",
  "Tick tock... ⏰",
  "Pressure makes diamonds 💎",
  "Less talk, more action 💪",
];

export function useStartupScript(userName = 'Producer') {
  const [idx, setIdx] = useState(0);
  const [done, setDone] = useState(false);
  const timers = useRef<number[]>([]);
  const continuousId = useRef<number | null>(null);

  const clearAll = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    if (continuousId.current) {
      clearInterval(continuousId.current);
      continuousId.current = null;
    }
  };

  useEffect(() => {
    const isSSR = typeof window === 'undefined';
    const isTest = (import.meta as any)?.env?.MODE === 'test';
    if (isSSR || isTest) return; // no chatter in tests/SSR

    if (done) return;

    const msg = STARTUP_SCRIPT[idx];
    if (!msg) {
      setDone(true);
      return;
    }

    const id = window.setTimeout(() => {
      _fxEmit('villain-nudge', { msg: msg.text.replace('{name}', userName) });
      setIdx((v) => v + 1);
    }, msg.delay);

    timers.current.push(id);
    return clearAll;
  }, [idx, done, userName]);

  // Start continuous quips after startup
  useEffect(() => {
    const isSSR = typeof window === 'undefined';
    const isTest = (import.meta as any)?.env?.MODE === 'test';
    if (isSSR || isTest) return;

    if (done && !continuousId.current) {
      continuousId.current = window.setInterval(() => {
        const m = CONTINUOUS_MESSAGES[Math.floor(Math.random() * CONTINUOUS_MESSAGES.length)];
        _fxEmit('villain-nudge', { msg: m });
      }, 90_000);
    }
    return clearAll;
  }, [done]);

  const restartScript = () => {
    clearAll();
    setIdx(0);
    setDone(false);
  };

  const reduceVillainMessages = () => {
    clearAll();
    setDone(true);
    const id = window.setTimeout(() => {
      _fxEmit('villain-nudge', { msg: "Focus on your work. I'll be quiet for a while..." });
    }, 30_000);
    timers.current.push(id);
  };

  return { isComplete: done, restartScript, reduceVillainMessages };
}
