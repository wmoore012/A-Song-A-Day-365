// Placeholder for proprietary villain lines
// This file provides basic functionality for open-core version

export function getProVillainLines() {
  return [
    {
      id: 'pro_villain_1',
      text: 'I\'m watching you...',
      weight: 10,
      phase: 'general'
    }
  ];
}

export function getVillainShadeMessages() {
  return [
    'That\'s not quite right...',
    'Try again, producer.',
    'Keep working...'
  ];
}

export function shouldShowVillainShade() {
  return Math.random() > 0.7; // 30% chance
}
