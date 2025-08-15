import { describe, it, expect } from 'vitest';
import { playlistIdFromUrl, videoIdFromUrl, clampMultiplier, rotatePick, bumpMultiplierCalc } from '../web-utils.js';

describe('web-utils', () => {
  it('extracts playlistIdFromUrl', () => {
    expect(playlistIdFromUrl('https://youtube.com/playlist?list=PL123&foo=bar')).toBe('PL123');
    expect(playlistIdFromUrl('https://x.com?a=1')).toBeNull();
  });
  it('extracts videoIdFromUrl for normal and short links', () => {
    expect(videoIdFromUrl('https://www.youtube.com/watch?v=abcdEFG1234&t=10')).toBe('abcdEFG1234');
    expect(videoIdFromUrl('https://youtu.be/qwerty-987')).toBe('qwerty-987');
    expect(videoIdFromUrl('https://site/none')).toBeNull();
  });
  it('clamps multiplier', () => {
    expect(clampMultiplier(220)).toBe(200);
    expect(clampMultiplier(-4)).toBe(0);
    expect(clampMultiplier(95)).toBe(95);
  });
  it('rotatePick cycles and returns nextIdx', () => {
    const pool = ['a','b','c'];
    const r0 = rotatePick(pool, 0); expect(r0.value).toBe('a'); expect(r0.nextIdx).toBe(1);
    const r1 = rotatePick(pool, r0.nextIdx); expect(r1.value).toBe('b'); expect(r1.nextIdx).toBe(2);
    const r2 = rotatePick(pool, r1.nextIdx); expect(r2.value).toBe('c'); expect(r2.nextIdx).toBe(0);
    const rEmpty = rotatePick([], 3); expect(rEmpty.value).toBeUndefined(); expect(rEmpty.nextIdx).toBe(0);
  });

  it('bumpMultiplierCalc clamps and sums safely', () => {
    expect(bumpMultiplierCalc(100, +5)).toBe(105);
    expect(bumpMultiplierCalc(98, +10)).toBe(110);
    expect(bumpMultiplierCalc(0, -4)).toBe(0);
    expect(bumpMultiplierCalc(195, +20)).toBe(200);
    expect(bumpMultiplierCalc('x', 'y')).toBe(0);
    expect(bumpMultiplierCalc(100, +3)).toBe(105);
    expect(bumpMultiplierCalc(100, -3)).toBe(95);
  });
});
