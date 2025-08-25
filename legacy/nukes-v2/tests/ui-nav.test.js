/* @vitest-environment jsdom */
import { describe, it, expect } from 'vitest';
import { initHamburger, smoothScrollTo, askCookAgainOrDone } from '../ui-nav.js';

describe('ui-nav', () => {
	it('hamburger toggles panel', () => {
		document.body.innerHTML = `
		  <button id="menuHamburger"></button>
		  <nav id="tacticalMenu"></nav>
		`;
		initHamburger();
		document.getElementById('menuHamburger').click();
		expect(document.getElementById('tacticalMenu').classList.contains('open')).toBe(true);
	});
	it('smoothScrollTo no-ops if selector missing', () => {
		expect(smoothScrollTo('#missing')).toBe(false);
	});
	it('askCookAgainOrDone calls callback', () => {
		let choice=null;
		document.body.innerHTML = `
		  <div id="cookAgainModal" class="overlay">
		    <button id="cookAgainBtn"></button>
		    <button id="cookDoneBtn"></button>
		  </div>`;
		askCookAgainOrDone((c)=>{ choice=c; });
		document.getElementById('cookDoneBtn').click();
		expect(choice).toBe('done');
	});
});