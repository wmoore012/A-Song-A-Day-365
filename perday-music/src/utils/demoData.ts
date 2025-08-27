import { InventoryItem } from '../types';

// Demo inventory items with realistic music production data
export const demoInventory: InventoryItem[] = [
  {
    id: 'demo-1',
    title: 'Midnight Groove',
    genre: 'Trap',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    rating: 3,
    notes: 'Dark trap beat with heavy 808s. Need to add more variation in the second verse.'
  },
  {
    id: 'demo-2',
    title: 'Summer Vibes',
    genre: 'Pop',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    rating: 2,
    notes: 'Upbeat pop track. The chorus needs work - feels too repetitive.'
  },
  {
    id: 'demo-3',
    title: 'Neon Dreams',
    genre: 'Electronic',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    rating: 3,
    notes: 'Synthwave inspired track. The arpeggiator pattern is fire!'
  },
  {
    id: 'demo-4',
    title: 'Street Poetry',
    genre: 'Hip-Hop',
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    rating: 1,
    notes: 'Lo-fi hip-hop beat. The sample is perfect but needs better drums.'
  },
  {
    id: 'demo-5',
    title: 'Ocean Waves',
    genre: 'R&B',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    rating: 2,
    notes: 'Smooth R&B track. The vocals are great but the mix needs work.'
  },
  {
    id: 'demo-6',
    title: 'Desert Wind',
    genre: 'Rock',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    rating: 3,
    notes: 'Alternative rock with Middle Eastern influences. The guitar solo is epic!'
  }
];

// Demo session data
export const demoSession = {
  userName: 'Alex Chen',
  collaborators: 'Sarah, Mike, DJ Kool',
  streak: 7,
  freezes: 2,
  grades: [85, 92, 78, 95, 88, 91, 87],
  latencies: [120, 95, 150, 88, 110, 102, 98]
};

// Demo settings
export const demoSettings = {
  defaultDuration: 25,
  defaultMultiplier: 1.5,
  autoStartTimer: true,
  soundEnabled: true,
  volume: 0.15,
  notifications: true,
  accountabilityEmail: 'alex.chen@producer.com',
  userName: 'Alex Chen',
  collaborators: 'Sarah, Mike, DJ Kool',
  defaultPlaylist: 'PLl-ShioB5kapLuMhLMqdyx_gKX_MBiXeb'
};

// Helper to get demo data based on current state
export const getDemoData = () => ({
  inventory: demoInventory,
  session: demoSession,
  settings: demoSettings,
  streak: demoSession.streak,
  freezes: demoSession.freezes,
  grades: demoSession.grades,
  latencies: demoSession.latencies
});
