import { describe, it, expect } from 'vitest';
import { quantizeToStep, gaugeDisplayValue, clamp01 } from '../hud-utils.js';

describe('hud-utils', () => {
	it('quantizes to step', () => {
		expect(quantizeToStep(97, 10)).toBe(100);
		expect(quantizeToStep(101, 10)).toBe(100);
		expect(quantizeToStep(14, 15)).toBe(15);
	});
	it('gaugeDisplayValue snaps to 10s and clamps 0-200', () => {
		expect(gaugeDisplayValue(0)).toBe('×0');
		expect(gaugeDisplayValue(88)).toBe('×90');
		expect(gaugeDisplayValue(205)).toBe('×200');
	});
	it('clamp01 bounds values', () => {
		expect(clamp01(-1)).toBe(0);
		expect(clamp01(0.4)).toBe(0.4);
		expect(clamp01(2)).toBe(1);
	});
});