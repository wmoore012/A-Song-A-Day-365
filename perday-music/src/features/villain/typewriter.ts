export interface TypewriterOptions {
  speedMs?: number;
  jitterMs?: number;
  neon?: boolean;
  caret?: boolean;
  prefix?: string;
  onComplete?: () => void;
}

export function typeInto(
  element: HTMLElement,
  text: string,
  opts: {
    speedMs?: number;
    jitterMs?: number;
    caret?: boolean;
    neon?: boolean;
    prefix?: string;
    onComplete?: () => void;
  } = {}
): Promise<void> {
  // Validate and provide defaults with proper type checking
  const speedMs = Number.isFinite(opts.speedMs) ? Math.max(0, opts.speedMs || 50) : 50;
  const jitterMs = Number.isFinite(opts.jitterMs) ? Math.max(0, opts.jitterMs || 6) : 6;
  const prefix = opts.prefix || '';
  const finalText = String(text ?? '');
  
  if (opts.neon) { 
    element.classList.add('neon-type'); 
  }
  
  // Optional caret
  let caretEl: HTMLSpanElement | null = null;
  if (opts.caret) {
    caretEl = document.createElement('span'); 
    caretEl.className = 'neon-caret'; 
    caretEl.textContent = '|';
  }
  
  element.textContent = prefix;
  if (caretEl) element.appendChild(caretEl);
  
  let i = 0;
  
  return new Promise((resolve) => {
    if (finalText.length === 0) { 
      resolve(); 
      return; 
    }
    
    const tick = () => {
      const next = finalText.charAt(i++);
      
      // Insert before caret if present
      if (caretEl) { 
        caretEl.remove(); 
        element.textContent += next; 
        element.appendChild(caretEl); 
      } else { 
        element.textContent += next; 
      }
      
      if (i >= finalText.length) { 
        if (caretEl) caretEl.remove();
        if (opts.onComplete) opts.onComplete();
        resolve(undefined);
        return;
      }
      
      // Add human-like jitter to timing
      const jitter = Math.random() < 0.5 ? -1 : 1;
      const delay = Math.max(0, speedMs + jitter * Math.floor(Math.random() * jitterMs));
      setTimeout(tick, delay);
    };
    
    setTimeout(tick, speedMs);
  });
}

export function clearTyped(element: HTMLElement) { 
  if (!element) throw new Error('clearTyped: missing element'); 
  element.textContent = '';
}
