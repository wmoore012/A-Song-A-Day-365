/**
 * Centralized villain line registry
 * MIT licensed - open core
 */

export interface VillainLine {
  id: string;
  phase: 'prestart' | 'lockin' | 'focus' | 'wrap' | 'general';
  weight: number;
  text: string;
  tags: string[];
}

export const VILLAIN_LINES: VillainLine[] = [
  // Prestart phase
  {
    id: 'prestart_welcome',
    phase: 'prestart',
    weight: 10,
    text: 'Welcome Back {name}!',
    tags: ['welcome', 'personal']
  },
  {
    id: 'prestart_ready',
    phase: 'prestart',
    weight: 8,
    text: 'First baby step locked. 🔒✨',
    tags: ['celebration', 'progress']
  },
  {
    id: 'prestart_nervous',
    phase: 'prestart',
    weight: 6,
    text: 'Still nervous? ...I remember my first time producing lol',
    tags: ['encouragement', 'humor']
  },
  
  // Lock-in phase
  {
    id: 'lockin_beat',
    phase: 'lockin',
    weight: 7,
    text: 'Beat selection locked. Rhythm is your foundation.',
    tags: ['beat', 'rhythm']
  },
  {
    id: 'lockin_bars',
    phase: 'lockin',
    weight: 7,
    text: 'Bars mode activated. Time to write some heat.',
    tags: ['writing', 'bars']
  },
  {
    id: 'lockin_mix',
    phase: 'lockin',
    weight: 7,
    text: 'Mix mode engaged. Let\'s make it sound professional.',
    tags: ['mixing', 'production']
  },
  {
    id: 'lockin_practice',
    phase: 'lockin',
    weight: 7,
    text: 'Practice mode on. Repetition builds mastery.',
    tags: ['practice', 'skill']
  },
  
  // Focus phase
  {
    id: 'focus_flow',
    phase: 'focus',
    weight: 8,
    text: 'Flow state achieved. Keep the momentum going.',
    tags: ['flow', 'momentum']
  },
  {
    id: 'focus_distraction',
    phase: 'focus',
    weight: 5,
    text: 'Focus on your work, or DON\'T! 😂 More placements for me ✅',
    tags: ['humor', 'motivation']
  },
  
  // Wrap phase
  {
    id: 'wrap_success',
    phase: 'wrap',
    weight: 9,
    text: 'Session complete! You\'re building something special.',
    tags: ['completion', 'encouragement']
  },
  {
    id: 'wrap_grade_a',
    phase: 'wrap',
    weight: 10,
    text: 'Grade A performance! You\'re on fire today.',
    tags: ['excellence', 'celebration']
  },
  {
    id: 'wrap_grade_b',
    phase: 'wrap',
    weight: 8,
    text: 'Solid B work. Consistency beats perfection.',
    tags: ['solid', 'consistency']
  },
  {
    id: 'wrap_grade_c',
    phase: 'wrap',
    weight: 6,
    text: 'C grade - room to grow. Every session is progress.',
    tags: ['growth', 'progress']
  }
];

export const VILLAIN_PACK = {
  id: 'perday-villain-v1',
  name: 'Perday Villain Pack v1',
  description: 'Core villain lines for the Perday Music 365 experience',
  lines: VILLAIN_LINES,
  schema: 'perday.villain.v1'
} as const;
