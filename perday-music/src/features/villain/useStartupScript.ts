import { useEffect, useState } from 'react';
import { _fxEmit } from '../fx/useVillainAnnounce';

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
  { id: 'villain-watching', text: 'I\'ll be watching... don\'t disappoint me.', delay: 25000 },
];

// Continuous quippy messages for ongoing monitoring
const CONTINUOUS_MESSAGES = [
  "Focus on your work, or DON'T! 😂 More placements for me ✅",
  "I see you scrolling... 👀",
  "That beat better be fire 🔥",
  "Time is money, producer 💰",
  "Still here... still watching 👁️",
  "Make it count or make it again 🔄",
  "Your multiplier is getting lonely 😈",
  "Tick tock... ⏰",
  "I believe in you... sort of 🤷‍♂️",
  "This better be worth my time 😏",
  "Channel that energy into music 🎵",
  "Less talk, more action 💪",
  "Your future self will thank me 😌",
  "Pressure makes diamonds 💎",
  "Or pressure makes you quit 😅",
];

export function useStartupScript(userName: string = 'Producer') {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [continuousInterval, setContinuousInterval] = useState<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isComplete) return;

    const message = STARTUP_SCRIPT[currentMessageIndex];
    if (!message) {
      setIsComplete(true);
      return;
    }

    const timer = setTimeout(() => {
      const formattedText = message.text.replace('{name}', userName);
      _fxEmit('villain-nudge', { msg: formattedText });
      
      if (currentMessageIndex < STARTUP_SCRIPT.length - 1) {
        setCurrentMessageIndex(prev => prev + 1);
      } else {
        setIsComplete(true);
      }
    }, message.delay);

    return () => clearTimeout(timer);
  }, [currentMessageIndex, isComplete, userName]);

  // Start continuous quippy messages after startup script
  useEffect(() => {
    if (isComplete && !continuousInterval) {
      const interval = setInterval(() => {
        const randomMessage = CONTINUOUS_MESSAGES[Math.floor(Math.random() * CONTINUOUS_MESSAGES.length)];
        _fxEmit('villain-nudge', { msg: randomMessage });
      }, 90000); // 1min 30sec = 90 seconds

      setContinuousInterval(interval);
    }

    return () => {
      if (continuousInterval) {
        clearInterval(continuousInterval);
      }
    };
  }, [isComplete, continuousInterval]);

  const restartScript = () => {
    setCurrentMessageIndex(0);
    setIsComplete(false);
    // Clear continuous interval when restarting
    if (continuousInterval) {
      clearInterval(continuousInterval);
      setContinuousInterval(null);
    }
  };

  // Function to reduce villain messages during active work
  const reduceVillainMessages = () => {
    setIsComplete(true);
    // Clear continuous messages during focus
    if (continuousInterval) {
      clearInterval(continuousInterval);
      setContinuousInterval(null);
    }
    // Set a quiet period message
    setTimeout(() => {
      _fxEmit('villain-nudge', { msg: 'Focus on your work. I\'ll be quiet for a while...' });
    }, 30000); // 30 seconds
  };

  return { isComplete, restartScript, reduceVillainMessages };
}
