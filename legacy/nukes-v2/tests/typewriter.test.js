/* @vitest-environment jsdom */
import { describe, it, expect } from 'vitest';
import { typeInto, clearTyped } from '../typewriter.js';

describe('typewriter', () => {
	it('types into element with speed', async () => {
		document.body.innerHTML = `<div id="t"></div>`;
		const el = document.getElementById('t');
		await typeInto(el, 'TEST', { speedMs: 1 });
		expect(el.textContent).toBe('TEST');
		clearTyped(el);
		expect(el.textContent).toBe('');
	});
	it('throws on missing element', async () => {
		expect(()=> clearTyped(null)).toThrow();
		let err=null; try{ await typeInto(null, 'x'); }catch(e){ err=e; }
		expect(err).toBeInstanceOf(Error);
	});
});