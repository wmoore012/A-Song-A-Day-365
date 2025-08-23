/* @vitest-environment jsdom */
import { describe, it, expect } from 'vitest';
import { computeMarkerTranslateY, updateRulerMarker, flipThemeClass, bootParallaxMat } from '../parallax-mat.js';

describe('parallax-mat helpers', () => {
	it('computes marker translate in vh from scroll', () => {
		const yvh = computeMarkerTranslateY(500, 2000, 1000);
		expect(yvh).toBeCloseTo(50, 1);
		const early = computeMarkerTranslateY(0, 2000, 1000);
		expect(early).toBe(0);
		const past = computeMarkerTranslateY(2000, 2000, 1000);
		expect(past).toBe(100);
	});
	it('updates marker style or throws missing element', () => {
		document.body.innerHTML = `<div id="r"><div class="marker"></div></div>`;
		const m = document.querySelector('.marker');
		const yvh = updateRulerMarker(m, 250, 2000, 1000);
		expect(m.style.transform).toMatch(/translateY\(/);
		expect(yvh).toBeGreaterThan(0);
		expect(()=> updateRulerMarker(null, 0, 1, 1)).toThrow();
	});
	it('flips theme classes', () => {
		document.body.innerHTML = `<div id="ruler" class="is-dark"><div class="marker"></div></div>`;
		const r = document.getElementById('ruler');
		flipThemeClass(r, 'light');
		expect(r.classList.contains('is-light')).toBe(true);
		flipThemeClass(r, 'dark');
		expect(r.classList.contains('is-dark')).toBe(true);
	});
});

describe('parallax-mat boot (guarded)', () => {
	it('throws when GSAP missing', () => {
		document.body.innerHTML = `<div id="scrollRuler"><div class="marker"></div></div>`;
		expect(()=> bootParallaxMat(null)).toThrow();
	});
	it('throws when no layers or ruler', () => {
		// Provide fake gsap
		const gsap = { registerPlugin: ()=>{}, to: ()=>{}, utils:{ toArray: (x)=>x } };
		globalThis.ScrollTrigger = {};
		document.body.innerHTML = `<div id="scrollRuler"><div class="marker"></div></div>`;
		expect(()=> bootParallaxMat(gsap)).toThrow();
		document.body.innerHTML = `<div class="mat-layer" data-speed="0.2"></div>`;
		expect(()=> bootParallaxMat(gsap)).toThrow();
	});
});