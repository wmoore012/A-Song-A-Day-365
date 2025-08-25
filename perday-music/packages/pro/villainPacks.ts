export interface VillainMessage {
  id: string;
  text: string;
  category: 'welcome' | 'motivation' | 'challenge' | 'celebration' | 'taunt';
  intensity: 1 | 2 | 3; // 1=gentle, 2=moderate, 3=aggressive
  cooldownMs: number;
  conditions?: {
    multiplier?: number;
    state?: string;
    timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
  };
}

export interface VillainPack {
  id: string;
  name: string;
  description: string;
  messages: VillainMessage[];
  isPremium: boolean;
}

export const VILLAIN_PACKS: VillainPack[] = [
  {
    id: 'bsl',
    name: 'BSL (Big Studio Legend)',
    description: 'The classic villain who knows the industry inside out',
    isPremium: false,
    messages: [
      // Welcome messages
      {
        id: 'welcome-back',
        text: 'Welcome Back {name}!',
        category: 'welcome',
        intensity: 1,
        cooldownMs: 0,
        conditions: { state: 'PRE_START' }
      },
      {
        id: 'first-time',
        text: 'Still nervous? ...I remember my first time producing lol',
        category: 'welcome',
        intensity: 2,
        cooldownMs: 30000,
        conditions: { state: 'PRE_START' }
      },
      
      // Motivation messages
      {
        id: 'baby-step',
        text: 'First baby step locked. 🔒✨',
        category: 'motivation',
        intensity: 1,
        cooldownMs: 0,
        conditions: { state: 'LOCK_IN' }
      },
      {
        id: 'lane-locked',
        text: 'Lane locked. Now show me what you got.',
        category: 'motivation',
        intensity: 2,
        cooldownMs: 60000,
        conditions: { state: 'FOCUS_SETUP' }
      },
      
      // Challenge messages
      {
        id: 'focus-or-dont',
        text: 'Focus on your work, or DON\'T! 😂 More placements for me ✅',
        category: 'challenge',
        intensity: 3,
        cooldownMs: 90000, // 1min 30sec
        conditions: { state: 'FOCUS_RUNNING' }
      },
      {
        id: 'multiplier-dying',
        text: 'Your multiplier is dying... tick tock...',
        category: 'challenge',
        intensity: 2,
        cooldownMs: 60000,
        conditions: { multiplier: 1.5, state: 'FOCUS_RUNNING' }
      },
      
      // Celebration messages
      {
        id: 'session-complete',
        text: 'Not bad... not bad at all.',
        category: 'celebration',
        intensity: 1,
        cooldownMs: 0,
        conditions: { state: 'POST_ACTIONS' }
      },
      
      // Taunt messages
      {
        id: 'more-placements',
        text: 'More placements for me while you waste time!',
        category: 'taunt',
        intensity: 3,
        cooldownMs: 120000,
        conditions: { state: 'FOCUS_RUNNING' }
      }
    ]
  }
];

export const getVillainPack = (id: string): VillainPack | undefined =>
  VILLAIN_PACKS.find(pack => pack.id === id);

export const getDefaultVillainPack = (): VillainPack => VILLAIN_PACKS[0];

export const getMessagesByCategory = (packId: string, category: VillainMessage['category']): VillainMessage[] => {
  const pack = getVillainPack(packId);
  if (!pack) return [];
  return pack.messages.filter(msg => msg.category === category);
};

export const getRandomMessage = (packId: string, category?: VillainMessage['category']): VillainMessage | null => {
  const pack = getVillainPack(packId);
  if (!pack) return null;
  
  let messages = pack.messages;
  if (category) {
    messages = messages.filter(msg => msg.category === category);
  }
  
  if (messages.length === 0) return null;
  
  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
};
