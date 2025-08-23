import { useEffect, useRef, useState } from 'react';
import { _fxSubscribe } from '../features/fx/useVillainAnnounce';
import { gsap } from 'gsap';

interface VillainMessage {
  id: string;
  text: string;
  type: 'success' | 'error' | 'info' | 'villain-nudge';
  timestamp: number;
}

export default function VillainDisplay() {
  const [messages, setMessages] = useState<VillainMessage[]>([]);
  const [devilHeads, setDevilHeads] = useState<Array<{ id: string; x: number; y: number }>>([]);
  const devilLayerRef = useRef<HTMLDivElement>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
          // Subscribe to villain events
      const unsubscribe = _fxSubscribe((type: string, data: any) => {
        if (type === 'villain-nudge' || type === 'announce' || type === 'toast') {
          const newMessage: VillainMessage = {
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            text: data.msg || data.text || 'Villain speaks!',
            type: type === 'villain-nudge' ? 'villain-nudge' : 
                  type === 'toast' ? (data.type || 'info') : 'info',
            timestamp: Date.now()
          };

          setMessages(prev => [...prev.slice(-4), newMessage]);

        // Auto-remove message after 5 seconds
        setTimeout(() => {
          setMessages(prev => prev.filter(m => m.id !== newMessage.id));
        }, 5000);

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

  const spawnDevilHeads = () => {
    const newDevilHeads = Array.from({ length: 5 }, (_, i) => ({
      id: `devil-${Date.now()}-${i}`,
      x: Math.random() * window.innerWidth,
      y: -50 - (i * 30)
    }));

    setDevilHeads(prev => [...prev, ...newDevilHeads]);

    // Animate devil heads falling
    newDevilHeads.forEach((devil, index) => {
      gsap.to(`#${devil.id}`, {
        y: window.innerHeight + 100,
        x: devil.x + (Math.random() - 0.5) * 200,
        rotation: Math.random() * 360,
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
        return 'bg-gradient-to-r from-synth-amber/90 to-synth-amberLight/90 text-synth-white border-synth-amber/50';
      case 'success':
        return 'bg-gradient-to-r from-synth-aqua/90 to-synth-icy/90 text-synth-white border-synth-aqua/50';
      case 'error':
        return 'bg-gradient-to-r from-synth-magenta/90 to-synth-violet/90 text-synth-white border-synth-magenta/50';
      default:
        return 'bg-gradient-to-r from-synth-violet/90 to-synth-magenta/90 text-synth-white border-synth-violet/50';
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
            className={`p-4 rounded-lg border-2 shadow-lg backdrop-blur-sm transform transition-all duration-300 animate-slideInRight ${getMessageStyle(message.type)}`}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">
                {message.type === 'villain-nudge' ? '😈' : 
                 message.type === 'success' ? '✅' : 
                 message.type === 'error' ? '❌' : '💬'}
              </span>
              <span className="font-medium text-sm">{message.text}</span>
            </div>
          </div>
        ))}
      </div>


    </>
  );
}
