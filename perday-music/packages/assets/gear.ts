export interface GearItem {
  id: string;
  name: string;
  category: 'synth' | 'drum' | 'fx' | 'vocal' | 'mastering';
  description: string;
  icon: string;
  isPremium?: boolean;
  tags: string[];
}

export const GEAR_ITEMS: GearItem[] = [
  // Synths
  {
    id: 'serum',
    name: 'Serum',
    category: 'synth',
    description: 'Wavetable synthesis powerhouse',
    icon: '🎹',
    isPremium: true,
    tags: ['wavetable', 'synthesis', 'professional']
  },
  {
    id: 'massive',
    name: 'Massive',
    category: 'synth',
    description: 'Classic subtractive synth',
    icon: '🎛️',
    tags: ['subtractive', 'classic', 'bass']
  },
  {
    id: 'operator',
    name: 'Operator',
    category: 'synth',
    description: 'FM synthesis specialist',
    icon: '🔊',
    tags: ['FM', 'Ableton', 'modular']
  },
  
  // Drums
  {
    id: 'battery',
    name: 'Battery',
    category: 'drum',
    description: 'Professional drum sampler',
    icon: '🥁',
    isPremium: true,
    tags: ['drums', 'sampling', 'professional']
  },
  {
    id: 'drumrack',
    name: 'Drum Rack',
    category: 'drum',
    description: 'Ableton drum machine',
    icon: '🎯',
    tags: ['Ableton', 'drums', 'live']
  },
  
  // FX
  {
    id: 'valhalla',
    name: 'Valhalla Room',
    category: 'fx',
    description: 'Beautiful algorithmic reverb',
    icon: '🌊',
    tags: ['reverb', 'algorithmic', 'beautiful']
  },
  {
    id: 'fabfilter',
    name: 'FabFilter Pro-Q',
    category: 'fx',
    description: 'Surgical EQ with visual feedback',
    icon: '📊',
    isPremium: true,
    tags: ['EQ', 'surgical', 'professional']
  },
  
  // Vocal
  {
    id: 'antares',
    name: 'Auto-Tune Pro',
    category: 'vocal',
    description: 'Industry standard pitch correction',
    icon: '🎤',
    isPremium: true,
    tags: ['vocal', 'pitch', 'industry']
  },
  
  // Mastering
  {
    id: 'ozone',
    name: 'Ozone 10',
    category: 'mastering',
    description: 'Complete mastering suite',
    icon: '🎚️',
    isPremium: true,
    tags: ['mastering', 'suite', 'professional']
  }
];

export const getGearByCategory = (category: GearItem['category']): GearItem[] =>
  GEAR_ITEMS.filter(item => item.category === category);

export const getPremiumGear = (): GearItem[] =>
  GEAR_ITEMS.filter(item => item.isPremium);

export const getGearById = (id: string): GearItem | undefined =>
  GEAR_ITEMS.find(item => item.id === id);
