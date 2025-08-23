import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createMusicDucker } from '../audio-utils.js';

describe('audio-utils music ducker', () => {
	let vol;
	let player;
	beforeEach(() => {
		vol = 15;
		player = {
			getVolume: vi.fn(() => vol),
			setVolume: vi.fn((v) => { vol = v; }),
			pauseVideo: vi.fn()
		};
	});

	it('ducks for hints then restores', async () => {
		const d = createMusicDucker(player, { initialVolume: 15 });
		d.duckForHints({ target: 5, step: 5, intervalMs: 1 });
		await new Promise(r => setTimeout(r, 5));
		expect(vol).toBeLessThanOrEqual(10);
		d.restore();
		expect(vol).toBe(15);
	});

	it('fades out and pauses', async () => {
		const d = createMusicDucker(player, { initialVolume: 15 });
		d.fadeOutAndPause(5, 1);
		await new Promise(r => setTimeout(r, 10));
		expect(vol).toBe(0);
		expect(player.pauseVideo).toHaveBeenCalled();
	});

	it('keepUpright enforces target when not ducking', () => {
		const d = createMusicDucker(player, { initialVolume: 15 });
		vol = 3; // simulate external dip
		d.keepUpright();
		expect(vol).toBe(15);
	});
});