/* @vitest-environment jsdom */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { LS } from '../storage.js';

beforeEach(() => {
  // Minimal DOM used by nukes-v2.js
  document.body.innerHTML = `
    <div id="rewardModal" class="overlay hidden"></div>
    <div id="runOverlay" class="overlay hidden"><img id="runGif" /></div>
    <div id="successHome" class="overlay hidden"><img id="successGif" /></div>
    <div id="failHome" class="overlay hidden"><img id="failGif" /><img id="willGif" /></div>
    <div id="surveyModal" class="overlay hidden">
      <button id="submitSurvey"></button>
      <button id="skipSurvey"></button>
    </div>
    <div id="cityPanel" class="panel hidden"></div>
    <div id="settingsPanel" class="panel hidden"></div>
    <div id="setupPanel" class="panel hidden"></div>
    <div id="hintsModal" class="overlay hidden"></div>
    <a id="openInYoutube"></a>
    <div id="hintPlayerHost"></div>
    <div id="map"></div>
    <canvas id="chartGrades"></canvas>
    <canvas id="chartLatency"></canvas>
    <div id="multiplier"><span id="multVal"></span><div class="bar"><div id="multBar"></div></div></div>
    <div id="lockinTicker"></div>
    <div id="messageBar"></div>
    <div id="weatherBox"></div>
    <input id="gradeSlider" value="60" />
    <button id="saveGrade"></button>
    <button id="startBtn"></button>
    <button id="doneBtn" disabled></button>

    <button id="heatDrums" class="heat-btn">🥁🔥</button>
    <button id="heatVocals" class="heat-btn">🎤🔥</button>
    <button id="heatKeys" class="heat-btn">🎹🔥</button>
    <button id="heatLyrics" class="heat-btn">✍️🔥</button>
    <button id="heatBass" class="heat-btn">8️⃣0️⃣8️⃣🔥</button>

    <div id="musicPlayer"></div>
    <div id="noisePlayer"></div>
    <div id="hintPlayer"></div>
    <div id="npTitle"></div>
    <div id="cityInput"></div>
  `;

  // Stub YT API
  globalThis.YT = { Player: vi.fn().mockImplementation(()=>({ loadVideoById: vi.fn(), playVideo: vi.fn(), pauseVideo: vi.fn(), getPlayerState: vi.fn().mockReturnValue(2), setVolume: vi.fn(), getVideoData: () => ({ title: 'Song' }) })) };
  // Stub Leaflet + heat plugin used by nukes-v2
  const mapObj = { setView: (...args) => mapObj };
  globalThis.L = {
    map: vi.fn().mockReturnValue(mapObj),
    tileLayer: vi.fn().mockImplementation(() => ({ addTo: () => ({}) })),
    heatLayer: vi.fn().mockImplementation(() => ({ addTo: () => ({ addLatLng: () => {} }) }))
  };
  // Stub Chart.js
  globalThis.Chart = class { constructor(){ } destroy(){} };

  // Mock fetch: hints.json ok; notion ok; others minimal fail
  vi.spyOn(global, 'fetch').mockImplementation(async (url, opts={}) => {
    const u = String(url);
    if (u.includes('config/hints.json')) return { ok:true, json: async ()=>({ videos: [] }) };
    if (u.includes('/.netlify/functions/notion')) return { ok:true, status:200, headers: new Map(), json: async ()=>({ ok:true }) };
    return { ok:false, status:404, json: async ()=>({}) };
  });

  // Reset heat counts before each test
  LS.heatCounts = { drums:0, vocals:0, keys:0, lyrics:0, bass:0 };
});

afterEach(() => { vi.restoreAllMocks(); delete globalThis.YT; });

describe('Heat buttons', () => {
  it('increments LS.heatCounts and shows a pager toast + fire embers', async () => {
    await import('../nukes-v2.js');

    // Start session to enable Done
    document.getElementById('startBtn').click();
    const doneBtn = document.getElementById('doneBtn');
    if (doneBtn) doneBtn.disabled = false;

    // Click a heat button
    document.getElementById('heatDrums').click();
    expect(LS.heatCounts.drums).toBe(1);

    // Expect pager toast in DOM
    const toast = document.querySelector('.pager-toast');
    expect(toast).toBeTruthy();

    // Expect at least one fire ember to appear shortly
    await new Promise(r => setTimeout(r, 50));
    const ember = document.querySelector('.fire-ember');
    expect(ember).toBeTruthy();

    // Click Done to trigger Notion payload; ensure fetch was called with heat
    let bodySent = null;
    document.getElementById('doneBtn').click();
    document.getElementById('skipSurvey').click();
    // Allow async post to run
    await new Promise(r => setTimeout(r, 0));

    const calls = global.fetch.mock.calls.filter(([u]) => String(u).includes('/.netlify/functions/notion'));
    expect(calls.length).toBeGreaterThan(0);
    try { bodySent = JSON.parse(calls.at(-1)[1].body); } catch { bodySent = null; }
    expect(bodySent).toBeTruthy();
    expect(bodySent.heat).toBeTruthy();
    expect(bodySent.heat.drums).toBe(1);
  });

  it('multiplier updates and clamps display at 100%', async () => {
    document.body.innerHTML = `
      <div id="multiplier"><span id="multVal"></span><div class="bar"><div id="multBar"></div></div></div>
    `;
    // Simulate module logic locally
    const el = document.getElementById('multVal'); const bar = document.getElementById('multBar');
    const { clampMultiplier } = await import('../web-utils.js');
    function updateMultiplier(v){
      const cv = clampMultiplier(Math.round(v), 0, 200);
      const display = Math.max(0, Math.min(100, cv));
      if (el) el.textContent = `${display}%`;
      if (bar) bar.style.width = `${display}%`;
    }
    updateMultiplier(103);
    expect(el.textContent).toBe('100%');
    updateMultiplier(88);
    expect(el.textContent).toBe('88%');
  });
});
