import { useEffect, useState } from 'react';
import { _fxEmit } from '../fx/useVillainAnnounce';

interface StartupMessage {
  id: string;
  text: string;
  delay: number;
}

const STARTUP_SCRIPT: StartupMessage[] = [
  { id: 'welcome', text: 'Welcome Back {name}!', delay: 1000 },
  { id: 'first-time', text: 'Ready to make some magic today?', delay: 3000 },
  { id: 'nervous', text: 'Still nervous? ...I remember my first time producing lol', delay: 4000 },
  { id: 'focus', text: 'Focus on the music. Everything else is noise.', delay: 5000 },
  { id: 'multiplier', text: 'Your multiplier is your friend. Keep it alive!', delay: 6000 },
  { id: 'villain-watching', text: 'I\'ll be watching... don\'t disappoint me.', delay: 7000 },
];

export function useStartupScript(userName: string = 'Producer') {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

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

  const restartScript = () => {
    setCurrentMessageIndex(0);
    setIsComplete(false);
  };

  return { isComplete, restartScript };
}
