/* @vitest-environment jsdom */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('Villain shade rain', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="devilLayer"></div>
      <div id="messageBar"></div>
      <div id="lockinTicker"></div>
      <div id="map"></div>
      <canvas id="chartGrades"></canvas>
      <canvas id="chartLatency"></canvas>
      <div id="npTitle"></div>
      <div id="musicPlayer"></div>
      <div id="noisePlayer"></div>
      <div id="hintPlayer"></div>
      <div id="hintsModal" class="overlay hidden"></div>
      <button id="hintsBtn"></button>
      <div id="rewardModal" class="overlay hidden"></div>
      <img id="rewardGif" />
      <div id="successHome" class="overlay hidden"></div>
      <img id="successGif" />
      <div id="failHome" class="overlay hidden"></div>
      <img id="failGif" /><img id="willGif" />
      <div id="surveyModal" class="overlay hidden">
        <button id="submitSurvey"></button>
        <button id="skipSurvey"></button>
      </div>
      <input id="gradeSlider" value="60" />
      <button id="saveGrade"></button>
      <button id="startBtn"></button>
      <button id="doneBtn" disabled></button>
      <input type="checkbox" id="igClosed" />
      <input type="checkbox" id="fbClosed" />
      <input type="checkbox" id="ytConsidered" />
    `;
    // Stubs for required globals used by nukes-v2.js
    globalThis.YT = { Player: vi.fn().mockImplementation(()=>({
      loadVideoById: vi.fn(),
      playVideo: vi.fn(),
      pauseVideo: vi.fn(),
      getPlayerState: vi.fn().mockReturnValue(2),
      setVolume: vi.fn(),
      getVideoData: () => ({ title:'Track' })
    })) };
    const mapObj = { setView: (...args) => mapObj };
    globalThis.L = {
      map: vi.fn().mockReturnValue(mapObj),
      tileLayer: vi.fn().mockImplementation(() => ({ addTo: () => ({}) })),
      heatLayer: vi.fn().mockImplementation(() => ({ addTo: () => ({ addLatLng: () => {} }) }))
    };
    globalThis.Chart = class { constructor(){} destroy(){} };
    vi.spyOn(global, 'fetch').mockResolvedValue({ ok:true, json: async()=>({ videos: [] }) });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    delete globalThis.YT;
  });

  it('spawns devil-heads when shade sting occurs via ytConsidered going down', async () => {
    await import('../nukes-v2.js');

    // Trigger DOMContentLoaded to initialize event listeners
    document.dispatchEvent(new Event('DOMContentLoaded'));

    // Ensure ytConsidered is initially checked, then uncheck to trigger shade path
    const yt = document.getElementById('ytConsidered');
    yt.checked = true;
    yt.dispatchEvent(new Event('change'));

    // Now uncheck -> should trigger shade sting -> devil rain spawn
    yt.checked = false;
    yt.dispatchEvent(new Event('change'));

    // Allow requestAnimationFrame tick to run and spawn some nodes
    await new Promise(r => setTimeout(r, 50));
    const devilHeads = document.querySelectorAll('.devil-head');
    expect(devilHeads.length).toBeGreaterThan(0);
  });
});
