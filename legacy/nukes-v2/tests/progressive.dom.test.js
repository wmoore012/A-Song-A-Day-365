/* @vitest-environment jsdom */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('Progressive disclosure flow', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <main class="grid">
        <section class="card focus">
          <button id="startBtn">Start</button>
          <button id="doneBtn" disabled>Done</button>
          <div id="messageBar"></div>
          <div id="latencyCountdown"></div>
          <div id="latencyMs"></div>
        </section>
        <section id="cardCity" class="card prestart-hide" aria-hidden="true">
          <div id="map"></div>
        </section>
        <section id="cardInsights" class="card prestart-hide" aria-hidden="true">
          <canvas id="chartGrades"></canvas>
          <canvas id="chartLatency"></canvas>
        </section>
      </main>
      <div id="musicPlayer"></div>
      <div id="noisePlayer"></div>
      <div id="hintPlayerHost"></div>
      <div id="lockinTicker"></div>
      <div id="npTitle"></div>
    `;
    // Stubs required by nukes-v2
    globalThis.YT = { Player: vi.fn().mockImplementation(()=>({ loadVideoById: vi.fn(), playVideo: vi.fn(), pauseVideo: vi.fn(), getPlayerState: vi.fn().mockReturnValue(2), setVolume: vi.fn(), getVideoData: () => ({ title: 'Song' }) })) };
    const mapObj = { setView: (...args) => mapObj };
    globalThis.L = {
      map: vi.fn().mockReturnValue(mapObj),
      tileLayer: vi.fn().mockImplementation(() => ({ addTo: () => ({}) })),
      heatLayer: vi.fn().mockImplementation(() => ({ addTo: () => ({ addLatLng: () => {} }) }))
    };
    globalThis.Chart = class { constructor(){ } destroy(){} };
    vi.spyOn(global, 'fetch').mockResolvedValue({ ok:true, json: async()=>({ videos: [] }) });
  });

  afterEach(() => { vi.restoreAllMocks(); delete globalThis.YT; });

  it('hides city/insights before Start and reveals after Start', async () => {
    await import('../nukes-v2.js');
    const cardCity = document.getElementById('cardCity');
    const cardInsights = document.getElementById('cardInsights');
    // Pre-start hidden
    expect(cardCity.classList.contains('prestart-hide')).toBe(true);
    expect(cardInsights.classList.contains('prestart-hide')).toBe(true);
    expect(cardCity.getAttribute('aria-hidden')).toBe('true');
    expect(cardInsights.getAttribute('aria-hidden')).toBe('true');
    // Start
    document.getElementById('startBtn').click();
    // Revealed by body class
    expect(document.body.classList.contains('prestarted')).toBe(true);
    expect(cardCity.getAttribute('aria-hidden')).toBe(null);
    expect(cardInsights.getAttribute('aria-hidden')).toBe(null);
  });
});


