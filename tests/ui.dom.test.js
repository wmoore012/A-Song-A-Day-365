/* @vitest-environment jsdom */
import { describe, it, expect } from 'vitest';
import { bootParallaxMat } from '../parallax-mat.js';

describe('UI structure', () => {
	it('parallax mat requires layers and ruler', () => {
		document.body.innerHTML = `
		  <div id="scrollRuler"><div class="ticks"></div><div class="marker"></div></div>
		  <section id="mat" class="parallax-mat">
		    <div class="mat-layer" data-speed="0.2" data-theme="dark" style="--slab:#0b0f14;"></div>
		  </section>
		  <div id="laserDeck"><div class="laser"></div></div>
		`;
		// Fake gsap minimal
		const gsap = { registerPlugin: ()=>{}, to: ()=>{}, fromTo: ()=>{}, utils:{ toArray: a=>a } };
		globalThis.ScrollTrigger = { create: ()=>({}) };
		expect(()=> bootParallaxMat(gsap)).not.toThrow();
	});
});