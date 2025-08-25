import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock dynamic import through a shim
vi.mock('../pro/analytics-hud.js', () => ({ bootAnalyticsHud: vi.fn(async ()=>{}) }));
vi.mock('../pro/fx-overlays.js', () => ({ bootFxOverlays: vi.fn(async ()=>{}) }));

import { bootProPlugins } from '../pro-loader.js';

describe('pro-loader', () => {
	beforeEach(() => { delete window.__PRO__; });
	it('no-ops when __PRO__ is falsy', async () => {
		const res = await bootProPlugins({});
		expect(res.loaded).toBe(false);
	});
	it('tries to load modules when __PRO__ truthy', async () => {
		window.__PRO__ = true;
		const res = await bootProPlugins({});
		expect(res.loaded).toBe(true);
		expect(res.analyticsLoaded || res.fxLoaded).toBe(true);
	});
});

describe('open-core boot does not require pro', () => {
	it('importing nukes-v2.js should not throw with __PRO__ false', async () => {
		delete window.__PRO__;
		document.body.innerHTML = `
		  <div id="musicPlayer"></div><div id="noisePlayer"></div>
		  <div id="map"></div><canvas id="chartGrades"></canvas><canvas id="chartLatency"></canvas>
		  <div id="lockinTicker"></div>
		  <button id="startBtn"></button>
		  <div id="hintsModal"></div>
		  <div id="hintPlayerHost"></div>
		  <div id="npTitle"></div>
		  <div id="cityInput"></div>
		`;
		globalThis.YT = { Player: function(){} };
		const mapObj = { setView: ()=> mapObj };
		globalThis.L = {
			map: ()=> mapObj,
			tileLayer: ()=> ({ addTo: ()=> ({}) }),
			heatLayer: ()=> ({ addTo: ()=> ({ addLatLng: ()=>{} }) })
		};
		class FakeC{ destroy(){} }; globalThis.Chart = FakeC;
		await import('../nukes-v2.js');
		expect(true).toBe(true);
	});
});