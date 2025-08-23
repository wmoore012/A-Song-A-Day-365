import { describe, it, expect } from 'vitest';
import { buildVillainEmoji, isHumanSelection } from '../emoji-builder.js';

describe('emoji-builder', () => {
	it('returns non-human when subject nonhuman', () => {
		expect(buildVillainEmoji({ subject:'nonhuman', nonHuman:'😈' })).toBe('😈');
		expect(isHumanSelection({ subject:'nonhuman' })).toBe(false);
	});
	it('builds old male/female with tone', () => {
		expect(buildVillainEmoji({ subject:'human', presenting:'male', age:'old', tone:'dark' })).toMatch(/👴/);
		expect(buildVillainEmoji({ subject:'human', presenting:'female', age:'old', tone:'light' })).toMatch(/👵/);
	});
	it('bearded male adult uses 🧔 with tone', () => {
		const e = buildVillainEmoji({ subject:'human', presenting:'male', beard:true, tone:'medium' });
		expect(e).toMatch(/🧔/);
	});
	it('female short/long hair variants', () => {
		expect(buildVillainEmoji({ subject:'human', presenting:'female', hair:'long', tone:'medium' })).toMatch(/👩/);
		expect(buildVillainEmoji({ subject:'human', presenting:'female', hair:'short', tone:'medium' })).toMatch(/👩/);
	});
	it('male variants', () => {
		expect(buildVillainEmoji({ subject:'human', presenting:'male', hair:'short', tone:'medium' })).toMatch(/👨/);
	});
});