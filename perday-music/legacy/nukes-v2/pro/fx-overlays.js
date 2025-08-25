// Placeholder for proprietary FX overlays
// This file provides basic functionality for open-core version

export function shouldCrossfade(element, duration = 300) {
  if (!element) return false;

  // Simple crossfade implementation
  element.style.transition = `opacity ${duration}ms ease-in-out`;
  element.style.opacity = '0';

  setTimeout(() => {
    element.style.opacity = '1';
  }, 50);

  return true;
}

export function createEmberEffect(targetElement) {
  if (!targetElement) return false;

  // Create simple ember effect
  const ember = document.createElement('div');
  ember.style.cssText = `
    position: absolute;
    width: 4px;
    height: 4px;
    background: #ff4500;
    border-radius: 50%;
    pointer-events: none;
    animation: ember 1s ease-out forwards;
  `;

  targetElement.appendChild(ember);

  setTimeout(() => {
    if (ember.parentNode) {
      ember.parentNode.removeChild(ember);
    }
  }, 1000);

  return true;
}

export function addGlowEffect(element, color = '#ff4500') {
  if (!element) return false;

  element.style.boxShadow = `0 0 20px ${color}`;
  element.style.transition = 'box-shadow 0.3s ease';

  setTimeout(() => {
    element.style.boxShadow = '';
  }, 1000);

  return true;
}
