import { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function VillainChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hey producer! What's on your mind? Need motivation, advice, or just want to chat?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate villain response (in real app, this would be an LLM call)
    setTimeout(() => {
      const responses = [
        "That's the spirit! Keep pushing forward, producer! 🚀",
        "You're doing great! Remember, consistency beats perfection every time.",
        "I love that energy! What's your next move?",
        "You've got this! Every session builds your skills.",
        "That's exactly the mindset we need! Keep that fire burning! 🔥",
        "I'm here for you, producer. Let's make some magic happen!",
        "You're on the right track! Trust the process.",
        "That's what I'm talking about! You're building something special.",
        "Keep that momentum going! You're unstoppable! 💪",
        "I believe in you! Let's turn those dreams into reality!"
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const villainMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, villainMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000); // Random delay for realism
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="fixed bottom-20 right-6 w-80 h-96 bg-black/90 border border-cyan-400/50 rounded-xl shadow-lg shadow-cyan-400/30 z-50">
      <div className="flex items-center justify-between p-4 border-b border-cyan-400/30">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-cyan-300" />
          <span className="text-cyan-300 font-semibold">Villain Chat</span>
        </div>
        <span className="text-xs text-white/60">📟</span>
      </div>

      <div className="h-64 overflow-y-auto p-4 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                message.isUser
                  ? 'bg-cyan-500 text-white'
                  : 'bg-white/10 text-white border border-cyan-400/30'
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white/10 text-white border border-cyan-400/30 px-3 py-2 rounded-lg text-sm">
              <span className="flex items-center gap-1">
                <span className="animate-pulse">📟</span>
                <span className="animate-pulse">...</span>
              </span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-cyan-400/30">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Talk to the villain..."
            className="flex-1 bg-white/10 border border-cyan-400/30 rounded-lg px-3 py-2 text-white placeholder:text-white/50 text-sm"
            disabled={isTyping}
          />
          <button
            onClick={sendMessage}
            disabled={!inputText.trim() || isTyping}
            className="px-3 py-2 bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-500/50 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
