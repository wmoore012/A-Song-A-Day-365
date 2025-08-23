import { describe, it, expect } from 'vitest';
import { validateGrade, validateLatency, validatePhase } from './storage';

describe('storage', () => {
  describe('validation', () => {
    describe('validateGrade', () => {
      it('accepts valid grades', () => {
        expect(validateGrade(0)).toBe(0);
        expect(validateGrade(50)).toBe(50);
        expect(validateGrade(100)).toBe(100);
      });

      it('rejects invalid grades', () => {
        expect(() => validateGrade(-1)).toThrow('Invalid grade: -1');
        expect(() => validateGrade(101)).toThrow('Invalid grade: 101');
        expect(() => validateGrade('50')).toThrow('Invalid grade: 50');
        expect(() => validateGrade(null)).toThrow('Invalid grade: null');
      });
    });

    describe('validateLatency', () => {
      it('accepts valid latencies', () => {
        expect(validateLatency(0)).toBe(0);
        expect(validateLatency(1000)).toBe(1000);
        expect(validateLatency(300000)).toBe(300000);
      });

      it('rejects invalid latencies', () => {
        expect(() => validateLatency(-1)).toThrow('Invalid latency: -1ms');
        expect(() => validateLatency(300001)).toThrow('Invalid latency: 300001ms');
        expect(() => validateLatency('1000')).toThrow('Invalid latency: 1000ms');
      });
    });

    describe('validatePhase', () => {
      it('accepts valid phases', () => {
        expect(validatePhase('prestart')).toBe('prestart');
        expect(validatePhase('lockin')).toBe('lockin');
        expect(validatePhase('wrap')).toBe('wrap');
      });

      it('rejects invalid phases', () => {
        expect(() => validatePhase('invalid')).toThrow('Invalid phase: invalid');
        expect(() => validatePhase('')).toThrow('Invalid phase: ');
        expect(() => validatePhase(null)).toThrow('Invalid phase: null');
      });
    });
  });
});
