/* @vitest-environment jsdom */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

beforeEach(() => {
  document.body.innerHTML = `
    <div id="hintsModal" class="overlay hidden"></div>
    <a id="openInYoutube"></a>
    <div id="hintPlayerHost"></div>
  `;
  // Stub YT API
  globalThis.YT = { Player: vi.fn().mockImplementation(()=>({ loadVideoById: vi.fn(), })) };
  // Stub Leaflet + heat plugin used by nukes-v2
  const mapObj = { setView: (...args) => mapObj };
  globalThis.L = {
    map: vi.fn().mockReturnValue(mapObj),
    tileLayer: vi.fn().mockImplementation(() => ({ addTo: () => ({}) })),
    heatLayer: vi.fn().mockImplementation(() => ({ addTo: () => ({ addLatLng: () => {} }) }))
  };
  // Stub Chart.js
  globalThis.Chart = class { constructor(){ } destroy(){} };
});

afterEach(() => { delete globalThis.YT; });

it('openHints sets the Open in YouTube link to the rotated hint id', async () => {
  // Mock fetch for hints.json
  const hints = { videos: ['https://youtu.be/ABC123xyz', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'] };
  const ok = { ok:true, json: async ()=>hints };
  const spy = vi.spyOn(global, 'fetch').mockResolvedValue(ok);

  // Load module (as ESM) which defines openHints on window
  await import('../nukes-v2.js');

  // Trigger DOMContentLoaded to initialize event listeners
  document.dispatchEvent(new Event('DOMContentLoaded'));

  // Wait a tick for hints to load
  await Promise.resolve();

  // call openHints
  window.openHints();
  const a = document.getElementById('openInYoutube');
  expect(a.getAttribute('href')).toContain('watch?v=ABC123xyz');
  spy.mockRestore();
});
