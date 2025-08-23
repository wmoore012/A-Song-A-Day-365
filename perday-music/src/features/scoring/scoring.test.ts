import { describe, it, expect } from 'vitest';
import { sessionMultiplier, sessionScore } from './scoring';

describe('scoring', () => {
  describe('sessionMultiplier', () => {
    it('validates prestartTotalMs > 0', () => {
      expect(() => sessionMultiplier({
        readyAtMs: null,
        prestartTotalMs: 0,
        wrapGrade: 'B'
      })).toThrow('Invalid prestartTotalMs: 0. Must be > 0.');
    });

    it('validates readyAtMs within bounds', () => {
      expect(() => sessionMultiplier({
        readyAtMs: -1000,
        prestartTotalMs: 420_000,
        wrapGrade: 'B'
      })).toThrow('Invalid readyAtMs: -1000. Must be 0-420000.');
    });

    it('applies no-ready penalty', () => {
      const mult = sessionMultiplier({
        readyAtMs: null,
        prestartTotalMs: 420_000,
        wrapGrade: 'B'
      });
      expect(mult).toBe(0.75); // 1.0 - 0.25
    });

    it('applies early boost', () => {
      const mult = sessionMultiplier({
        readyAtMs: 0, // immediate
        prestartTotalMs: 420_000,
        wrapGrade: 'B'
      });
      expect(mult).toBe(1.25); // 1.0 + 0.25
    });

    it('applies grade adjustments', () => {
      const a = sessionMultiplier({
        readyAtMs: 210_000, // middle
        prestartTotalMs: 420_000,
        wrapGrade: 'A'
      });
      const b = sessionMultiplier({
        readyAtMs: 210_000,
        prestartTotalMs: 420_000,
        wrapGrade: 'B'
      });
      const c = sessionMultiplier({
        readyAtMs: 210_000,
        prestartTotalMs: 420_000,
        wrapGrade: 'C'
      });
      
      expect(a).toBeGreaterThan(b);
      expect(b).toBeGreaterThan(c);
    });
  });

  describe('sessionScore', () => {
    it('validates basePoints >= 0', () => {
      expect(() => sessionScore(-100, 1.5)).toThrow('Invalid basePoints: -100. Must be >= 0.');
    });

    it('validates multiplier >= 0', () => {
      expect(() => sessionScore(100, -0.5)).toThrow('Invalid multiplier: -0.5. Must be >= 0.');
    });

    it('calculates rounded score', () => {
      expect(sessionScore(100, 1.5)).toBe(150);
      expect(sessionScore(100, 0.75)).toBe(75);
    });
  });
});
