import { describe, it, expect } from 'vitest';
import { shouldCrossfade } from '../pro/fx-overlays.js';

describe('fx-overlays helpers', () => {
	it('shouldCrossfade triggers near end of clip', () => {
		// With 0.3s threshold, both 0.2s and 0.3s remaining should crossfade
		expect(shouldCrossfade(9.8, 10, 0.3)).toBe(true);  // 0.2s left
		expect(shouldCrossfade(9.7, 10, 0.3)).toBe(true);  // 0.3s left
		// Below the floor and under given threshold should not crossfade
		expect(shouldCrossfade(9.6, 10, 0.2)).toBe(false); // 0.4s left
		expect(shouldCrossfade(NaN, 10, 0.3)).toBe(false);
		expect(shouldCrossfade(5, 0, 0.3)).toBe(false);
	});
});