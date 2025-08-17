/* @vitest-environment jsdom */
import { describe, it, expect } from 'vitest';
import { typeInto } from '../typewriter.js';

describe('typewriter neon', () => {
	it('applies neon class and types', async () => {
		document.body.innerHTML = `<div id="warn"></div>`;
		const el = document.getElementById('warn');
		await typeInto(el, 'Warning…', { speedMs: 1, neon: true });
		expect(el.classList.contains('neon-type')).toBe(true);
		expect(el.textContent).toBe('Warning…');
	});
});