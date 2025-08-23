/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach } from 'vitest';

function villainMuted(){ return localStorage.getItem('villain_muted')==='1'; }

beforeEach(()=>{
  localStorage.clear();
  document.body.innerHTML = `<button id="villainMuteChip" aria-pressed="false">🔇 Villain</button>`;
});

describe('villain mute chip', () => {
  it('toggles villain mute flag + aria-pressed', () => {
    const btn = document.getElementById('villainMuteChip');
    const toggle = () => {
      localStorage.setItem('villain_muted', villainMuted() ? '0' : '1');
      btn.setAttribute('aria-pressed', villainMuted() ? 'true' : 'false');
    };
    toggle();
    expect(villainMuted()).toBe(true);
    expect(btn.getAttribute('aria-pressed')).toBe('true');
    toggle();
    expect(villainMuted()).toBe(false);
    expect(btn.getAttribute('aria-pressed')).toBe('false');
  });
});
