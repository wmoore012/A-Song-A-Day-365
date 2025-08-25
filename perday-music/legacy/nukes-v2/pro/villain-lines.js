// Placeholder for proprietary villain lines
// This file provides basic functionality for open-core version

function getProVillainLines() {
  return [
    {
      id: 'pro_villain_1',
      text: 'I\'m watching you...',
      weight: 10,
      phase: 'general'
    }
  ];
}

function getVillainShadeMessages() {
  return [
    'That\'s not quite right...',
    'Try again, producer.',
    'Keep working...'
  ];
}

function shouldShowVillainShade() {
  return Math.random() > 0.7; // 30% chance
}

// ES Module exports
export { getProVillainLines, getVillainShadeMessages, shouldShowVillainShade };

// CommonJS exports for compatibility
module.exports = { getProVillainLines, getVillainShadeMessages, shouldShowVillainShade };
