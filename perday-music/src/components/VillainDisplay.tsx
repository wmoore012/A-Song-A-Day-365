import { useEffect, useRef, useState } from 'react';
import { _fxSubscribe } from '../hooks/useVillainAnnounce';
import { gsap } from 'gsap';
import { typeInto } from '../utils/typewriter';

interface VillainMessage {
  id: string;
  text: string;
  type: 'success' | 'error' | 'info' | 'villain-nudge';
  timestamp: number;
  isTyping?: boolean;
}

export default function VillainDisplay() {
  const [messages, setMessages] = useState<VillainMessage[]>([]);
  const [devilHeads, setDevilHeads] = useState<Array<{ id: string; x: number; y: number }>>([]);
  const devilLayerRef = useRef<HTMLDivElement>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const messageRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  useEffect(() => {
    // Subscribe to villain events
    const unsubscribe = _fxSubscribe((type: string, data: any) => {
      if (type === 'villain-nudge' || type === 'announce' || type === 'toast') {
        const newMessage: VillainMessage = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          text: data.msg || data.text || 'Villain speaks!',
          type: type === 'villain-nudge' ? 'villain-nudge' : 
                type === 'toast' ? (data.type || 'info') : 'info',
          timestamp: Date.now(),
          isTyping: type === 'villain-nudge' // Only typewriter for villain messages
        };

        setMessages(prev => [...prev.slice(-4), newMessage]);

        // Auto-remove message after 8 seconds (longer for typewriter)
        setTimeout(() => {
          setMessages(prev => prev.filter(m => m.id !== newMessage.id));
        }, type === 'villain-nudge' ? 8000 : 5000);

        // Spawn devil heads for villain-nudge messages
        if (type === 'villain-nudge') {
          spawnDevilHeads();
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Handle typewriter effect after message is added to DOM
  useEffect(() => {
    messages.forEach(message => {
      if (message.isTyping && messageRefs.current.has(message.id)) {
        const messageEl = messageRefs.current.get(message.id);
        if (messageEl) {
          const textEl = messageEl.querySelector('.message-text');
          if (textEl) {
            // Clear the text and start typewriter
            textEl.textContent = '';
            typeInto(textEl as HTMLElement, message.text, {
              speedMs: 35, // Slightly faster than legacy
              jitterMs: 8, // More human-like jitter
              caret: true,
              neon: true
            });
          }
        }
      }
    });
  }, [messages]);

  const spawnDevilHeads = () => {
    const newDevilHeads = Array.from({ length: 5 }, (_, i) => ({
      id: `devil-${Date.now()}-${i}`,
      x: Math.random() * window.innerWidth,
      y: -50 - (i * 30)
    }));

    setDevilHeads(prev => [...prev, ...newDevilHeads]);

    // Animate devil heads falling with enhanced effects
    newDevilHeads.forEach((devil, index) => {
      gsap.to(`#${devil.id}`, {
        y: window.innerHeight + 100,
        x: devil.x + (Math.random() - 0.5) * 200,
        rotation: Math.random() * 360,
        scale: 0.5 + Math.random() * 0.5,
        duration: 3 + Math.random() * 2,
        delay: index * 0.1,
        ease: "power1.out",
        onComplete: () => {
          setDevilHeads(prev => prev.filter(d => d.id !== devil.id));
        }
      });
    });
  };

  const getMessageStyle = (type: string) => {
    switch (type) {
      case 'villain-nudge':
        return 'bg-black/80 text-cyan-300 border-cyan-400/30';
      case 'success':
        return 'bg-gradient-to-r from-synth-aqua/90 to-synth-icy/90 text-synth-white border-synth-aqua/50 shadow-lg shadow-synth-aqua/20';
      case 'error':
        return 'bg-gradient-to-r from-synth-magenta/90 to-synth-violet/90 text-synth-white border-synth-magenta/50 shadow-lg shadow-synth-magenta/20';
      default:
        return 'bg-gradient-to-r from-synth-violet/90 to-synth-magenta/90 text-synth-white border-synth-violet/50 shadow-lg shadow-synth-violet/20';
    }
  };

  return (
    <>
      {/* Devil Layer for animated devil heads */}
      <div 
        ref={devilLayerRef}
        className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
      >
        {devilHeads.map(devil => (
          <div
            key={devil.id}
            id={devil.id}
            data-testid="devil-head"
            className="absolute text-4xl animate-bounce"
            style={{ left: devil.x, top: devil.y }}
          >
            😈
          </div>
        ))}
      </div>

      {/* Message Container */}
      <div 
        ref={messageContainerRef}
        className="fixed top-4 right-4 z-40 space-y-2 max-w-sm"
      >
        {messages.map(message => (
          <div
            key={message.id}
            ref={(el) => {
              if (el) messageRefs.current.set(message.id, el);
            }}
            className={`p-4 rounded-lg border-2 backdrop-blur-sm transform transition-all duration-300 animate-slideInRight ${getMessageStyle(message.type)}`}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">
                {message.type === 'villain-nudge' ? '😈' : 
                 message.type === 'success' ? '✅' : 
                 message.type === 'error' ? '❌' : '💬'}
              </span>
              <span className="font-medium text-sm message-text">
                {!message.isTyping ? message.text : ''}
              </span>
            </div>
          </div>
        ))}
      </div>


    </>
  );
}
