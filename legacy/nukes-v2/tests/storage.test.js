import { describe, it, expect } from 'vitest';
import { createStorage } from '../storage.js';

function fakeStore(){
  const m = new Map();
  return {
    getItem:k=>m.get(k)??null,
    setItem:(k,v)=>{ m.set(k,String(v)); },
    removeItem:k=>{ m.delete(k); }
  };
}

describe('storage', () => {
  it('persists and clamps multiplier', () => {
    const s = createStorage(fakeStore());
    expect(s.mult).toBe(100);
    s.mult = 250; // clamp
    expect(s.mult).toBe(200);
    s.mult = -10; // clamp
    expect(s.mult).toBe(0);
  });
  it('handles JSON roundtrips', () => {
    const s = createStorage(fakeStore());
    s.city = { name:'CLT', lat:1, lon:2 };
    expect(s.city.name).toBe('CLT');
    s.emails = ['a@b.com'];
    expect(s.emails).toEqual(['a@b.com']);
  });
});
