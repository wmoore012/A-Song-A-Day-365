/* THE NUKES — v4 Sidekick Dashboard
   - Non-interactive Leaflet + heat (Charlotte default)
   - Open-Meteo current weather (no key)
   - City slide-out (Nominatim; 1 rps + UA)
   - Start Work gate (7:00), streak+freeze, grade+charts
   - Villain chat corner (LLM-ready via OpenRouter OR rule-based)
   - Music: YouTube playlist @ 15% volume until Start -> fade out
   - White noise: LifeAt live toggle @ 15%
*/

import { playlistIdFromUrl, videoIdFromUrl, clampMultiplier, rotatePick, bumpMultiplierCalc } from './web-utils.js';
import { createMusicDucker } from './audio-utils.js';
import { buildVillainEmoji, isHumanSelection } from './emoji-builder.js';
import { LS } from './storage.js';
import { api } from './api.js';

(() => {
  'use strict';
  const TYPED_BOT_MESSAGES = true;
  const $ = s => document.querySelector(s);
  const setText = (sel, v) => { const el=$(sel); if (el) el.textContent = String(v); };
  const setHTML = (sel, v) => { const el=$(sel); if (el) el.innerHTML = String(v); };

  /* -------------------- Config -------------------- */
  const CFG = {
    DEFAULT_CITY: { name:'Charlotte, NC', lat:35.2271, lon:-80.8431 },
    NOMINATIM_UA: 'TheNukes/1.0 (thenukessonsaday365.netlify.app)', // required UA (Nominatim policy)
  WEATHER_FIELDS: 'temperature_2m,weather_code,wind_speed_10m',
  ENCOURAGEMENT_TIPS: [
      "Don’t plan 20 steps. Do the first step only.",
      "Low energy? Lower the bar: loop + simple drums.",
      "Front‑load friction: set your bounce/pack timer now.",
      "If you stall, body‑double: book Focusmate before you think.",
      "You’re allowed to make a bad song. The win is finishing.",
      "IG/FB closed. Music only. Keep it moving.",
      "Start tiny: 8 bars. Bounce. Expand only if time allows.",
      "Tiny task, tiny win, repeat.",
      "Five good minutes beats zero perfect ones.",
      "Set one outcome. Everything else is extra.",
    ],
    // Villain lines are provided by /pro/villain-lines.js (BSL). Empty by default in open core.
    VILLAIN_SEED: [],
    VILLAIN_PRESTART: [],
    VILLAIN_HYPE: [],
    VILLAIN_SHADE: [],
    RARE_DROP_RATE: 0.15,
    VILLAIN_POCKET: [],
    GIFS: {
      RUN: [
        "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3bTUwbzlxZ2pmYzNuYnZucDY1c3J0emU5c2I5MHFoa3NwNm01MmlvbCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/TJaNCdTf06YvwRPCge/giphy.gif",
        "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaHo5Y215Z3M2ZjF1YW54cmttaGtnZXZwZ2M5N3Y2ajliMWljb3dubiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/ypugC2vCJMqyXrSfzS/giphy.gif"
      ],
      POWERUP: "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3bnYwanJhNTBpN3V1bHFidG96MXA3M214ejZpczhkOXdlZHRmMDFmYSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/ekBL7F6GgOaxsPKkIU/giphy.gif",
      SUCCESS_HOME: "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3OTMxczJ4cXJsdWVheGcxbXltaHhwbHJhb3pienF1MnhjZG1sdzF6eCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/2X88cdOqfloof9Tht1/giphy.gif",
      FAIL_HOME: "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3ZGZtN242cHd4MjdqbDByaThmbWdiOW50dWhsY3p1NXRzeW9rNndqaiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/OSuaE6AknuRc7syZXp/giphy.gif",
      WILL_PLACEHOLDER: "https://media.giphy.com/media/l0HU2s0vG3q8b2T9e/giphy.gif"
    },
    REWARD_GIFS: {
      common: [
        "https://media.giphy.com/media/3ohzdM9W0kZ5p7T1Di/giphy.gif",
        "https://media.giphy.com/media/3o6Zt6ML6BklcajjsA/giphy.gif",
        "https://media.giphy.com/media/3ohhwi1q9lN1NsxTLa/giphy.gif",
        "https://media.giphy.com/media/l3vRk9B8g2cM3rj1W/giphy.gif"
      ],
      rare: [
        "https://media.giphy.com/media/1xkA4rpsDQn3e/giphy.gif",
        "https://media.giphy.com/media/l0HU2s0vG3q8b2T9e/giphy.gif"
      ]
    },
  DEFAULT_PLAYLIST: "https://music.youtube.com/playlist?list=PLl-ShioB5kapLuMhLMqdyx_gKX_MBiXeb&si=SOYdGB364nptRLFA",
  DEFAULT_STUDIO_VIBES: "",
    NOISE_LIFEAT: "https://www.youtube.com/live/xdJ58r0k340"
  };

  // Load Pro villain lines (BSL) if available
  (async () => {
    try {
      const mod = await import('./pro/villain-lines.js');
      const v = mod?.getProVillainLines?.();
      if (!v) throw new Error('Invalid pro villain export');
      if (Array.isArray(v.seed)) CFG.VILLAIN_SEED = v.seed;
      if (Array.isArray(v.prestart)) CFG.VILLAIN_PRESTART = v.prestart;
      if (Array.isArray(v.hype)) CFG.VILLAIN_HYPE = v.hype;
      if (Array.isArray(v.shade)) CFG.VILLAIN_SHADE = v.shade;
      if (Array.isArray(v.pocket)) CFG.VILLAIN_POCKET = v.pocket;
    } catch (e) {
      console.error('Pro villain scripts missing or invalid.', e);
      try { if (location && location.hostname === 'localhost') throw new Error('Missing /pro/villain-lines.js (BSL): add your villain packs.'); } catch {}
    }
  })();

  /* -------------------- State -------------------- */
  const EL = { music:'musicPlayer', noise:'noisePlayer', nowPlaying:'npTitle', map:'map', hint:'hintPlayerHost' };
  // Storage moved to storage.js (LS)

  /* -------------------- Clocks / headers -------------------- */
  setInterval(()=>{
    const n=new Date();
    setText('#flipClock', `${String(n.getHours()).padStart(2,'0')}:${String(n.getMinutes()).padStart(2,'0')}`);
  }, 1000);

  setText('#streak', LS.streak);
  setText('#freezes', LS.freezes);
  setText('#tipTag', pick(CFG.ENCOURAGEMENT_TIPS));
  buildTicker();
  const heelHdr = document.getElementById('sidekickHeader'); if (heelHdr) heelHdr.textContent = `${LS.heelEmoji||'😈'} ${LS.heelName||'Heel'}`;
  // init multiplier UI
  updateMultiplier(LS.mult);

  // Title input wiring
  const titleEl = document.getElementById('songTitle');
  if (titleEl){
    titleEl.value = LS.songTitle || '';
    titleEl.addEventListener('input', ()=>{ LS.songTitle = titleEl.value.trim(); });
  }

  /* -------------------- Map (non-interactive) + heat -------------------- */
  let map = L.map('map', { dragging:false, touchZoom:false, scrollWheelZoom:false, doubleClickZoom:false, boxZoom:false, keyboard:false, zoomControl:false })
              .setView([CFG.DEFAULT_CITY.lat, CFG.DEFAULT_CITY.lon], 12);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:'&copy; OSM contributors'
  }).addTo(map);
  const heat = L.heatLayer(LS.heat, { radius:24, blur:18, maxZoom:17, minOpacity:.35 }).addTo(map);

  let lastWeather = null; // cache last weather payload for Notion
  function setCity(city){
    LS.city = city;
    map.setView([city.lat, city.lon], 12);
    heat.addLatLng([city.lat, city.lon, 0.4]);
    LS.heat = [...LS.heat, [city.lat, city.lon, 0.4]].slice(-200);
  const ci = $("#cityInput"); if (ci) ci.value = city.name;
    loadWeather(city.lat, city.lon, city.name);
  }
  setCity(LS.city || CFG.DEFAULT_CITY);

  /* -------------------- City slide-out -------------------- */
  { const el = $("#openCity"); if (el) el.onclick = ()=>{ const p=$("#cityPanel"); if(p) p.classList.remove('hidden'); }; }
  { const el = $("#closeCity"); if (el) el.onclick = ()=>{ const p=$("#cityPanel"); if(p) p.classList.add('hidden'); }; }

  let lastNomTime = 0;
  { const el = $("#cityFind"); if (el) el.onclick = async ()=>{
    const q = $("#cityInput").value.trim(); if(!q) return;
    const now = Date.now();
    if (now - lastNomTime < 1100){ toast("Slow down — 1 req/sec."); return; }
    lastNomTime = now;
    const cache = LS.cityCache; if (cache[q]){ setCity(cache[q]); $("#cityPanel").classList.add('hidden'); return; }
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(q)}`, {
      headers:{ 'Accept':'application/json', 'User-Agent': CFG.NOMINATIM_UA }
    }).then(r=>r.json()).catch(()=>null);
    if (res && res[0]) {
      const city = { name:q, lat:+res[0].lat, lon:+res[0].lon };
      const cache2 = LS.cityCache; cache2[q]=city; LS.cityCache = cache2;
      setCity(city);
      $("#cityPanel").classList.add('hidden');
    } else {
      toast("City not found.");
    }
  }; }
  { const el = $("#useGeo"); if (el) el.onclick = ()=>{
    navigator.geolocation?.getCurrentPosition(pos=>{
      const {latitude:lat, longitude:lon} = pos.coords;
      setCity({ name:'Current Location', lat, lon });
      $("#cityPanel").classList.add('hidden');
    }, ()=> toast("Location blocked."));
  }; }

  /* -------------------- Weather -------------------- */
  async function loadWeather(lat, lon, label){
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=${CFG.WEATHER_FIELDS}&temperature_unit=fahrenheit&windspeed_unit=mph&timezone=auto`;
    const r = await api.getJSON(url).catch(()=>null);
    if (!r?.current) { setText('#weatherBox', `${label} — weather unavailable.`); return; }
    const w = r.current;
    setHTML('#weatherBox', `<b>${label}</b> — Temp: <b>${w.temperature_2m}&deg;F</b> · Wind: ${w.wind_speed_10m} mph · ${codeDesc(w.weather_code)}`);
    lastWeather = {
      city: label,
      lat,
      lon,
      code: w.weather_code,
      temp_f: w.temperature_2m,
      wind_mph: w.wind_speed_10m
    };
  }
  function codeDesc(c){
    const m = {0:"Clear",1:"Mainly clear",2:"Partly cloudy",3:"Overcast",45:"Fog",48:"Rime fog",51:"Drizzle",61:"Rain",71:"Snow",80:"Rain showers",95:"Thunderstorm"};
    return m[c]||"—";
  }

  /* -------------------- Charts -------------------- */
  let cg, cl;
  function drawCharts(){
    const grades = LS.grades.slice(-14);
    const lat = LS.latencies.slice(-14);
    const labels = grades.map((_,i)=>`-${grades.length - i}d`);
    cg?.destroy(); cl?.destroy();
    cg = new Chart($("#chartGrades"), {
      type:'line', data:{ labels, datasets:[{ data:grades, tension:.3 }]},
      options:{ plugins:{legend:{display:false}}, scales:{ y:{ min:0,max:100 } } }
    });
    cl = new Chart($("#chartLatency"), {
      type:'bar', data:{ labels, datasets:[{ data:lat }]},
      options:{ plugins:{legend:{display:false}}, scales:{ y:{ beginAtZero:true } } }
    });
  }
  drawCharts();

/* -------------------- Session flow -------------------- */
let t0 = Date.now(), started=false, startIso=null, freezeUsedToday=false;
let pendingBody = null;
  setInterval(()=>{
    const rem = 7*60*1000 - (Date.now()-t0);
    setText('#latencyCountdown', fmt(rem));
    const el = $("#latencyCountdown");
    if (el){
      el.classList.remove('blink');
      if (rem <= 60*1000){ el.style.color = 'var(--bad)'; el.classList.add('blink'); }
      else if (rem <= 2*60*1000){ el.style.color = 'var(--bad)'; }
      else if (rem <= 4*60*1000){ el.style.color = 'var(--warn)'; }
      else { el.style.color = 'var(--good)'; }
    }
  }, 250);

  // One-time pre-start sting in the message bar
  const preTaunt = ()=> setText('#messageBar', 'LOCK IN — '+rotPick('pre'));
  preTaunt();
  // Type warning when settings open
  document.getElementById('openSettings')?.addEventListener('click', ()=>{
    const w = document.getElementById('villainWarning');
    if (w) import('./typewriter.js').then(m=> m.typeInto(w, w.textContent || w.innerText || '', { speedMs: 8, neon:true }));
  });

  { const el = $("#startBtn"); if (el) el.onclick = ()=>{
    if (started) return;
    started = true;
    const latency = Date.now()-t0;
  setText('#latencyMs', `${latency.toLocaleString()} ms`);
    const db=$("#doneBtn"); if (db) db.disabled = false;
  setText('#messageBar', 'LOCKED 🔒');
    LS.latencies = [...LS.latencies, latency].slice(-60);
    fadeOutMusic(); // music fade then stop
  startIso = new Date().toISOString();
  // Small start sting
  stingVillainMaybeLLM(rotPick('pre'));
  // Pro: show villain announce
  try { if (window.__PRO__) import('./pro/analytics-hud.js').then(m=> m.rotateVillainAnnounce('start', { frameSrc: 'pro/video/TC - VIEWFINDER 235 - BLACK.png', durationMs: 1800 })); } catch {}
  }; }

  { const el = $("#doneBtn"); if (el) el.onclick = ()=>{
    if (!started) return toast("Hit Start first.");
    started = false;
    LS.streak += 1; setText('#streak', LS.streak);
    if (LS.streak % 7 === 0){ LS.freezes += 1; setText('#freezes', LS.freezes); toast("🧊 Earned a freeze!"); }
    gearDrop();
    const survey = document.getElementById('surveyModal');
    if (survey) survey.classList.remove('hidden');
    const db=$("#doneBtn"); if (db) db.disabled = true;

    const igClosed = $("#igClosed")?.checked || false;
    const fbClosed = $("#fbClosed")?.checked || false;
    const ytConsidered = $("#ytConsidered")?.checked || false;
    const gradeVal = +$("#gradeSlider")?.value || null;
    const latencyMs = LS.latencies.slice(-1)[0] || null;
    const today = new Date().toISOString().slice(0,10);
    pendingBody = {
      type: 'session_done',
      date: today,
      streak_after: LS.streak,
      freezes: LS.freezes,
      freeze_used: !!freezeUsedToday,
      latency_ms: latencyMs,
      grade: gradeVal,
      user_title: (LS.songTitle||'').trim() || null,
      ig_closed: igClosed,
      fb_closed: fbClosed,
      yt_closed: ytConsidered,
      start_time_iso: startIso,
      start_epoch_ms: startIso ? Date.parse(startIso) : null,
      weather: lastWeather || (LS.city ? { city: LS.city.name, lat: LS.city.lat, lon: LS.city.lon } : {}),
      heat: LS.heatCounts
    };
  }; }

  async function finalizeSession(allNighter, surveyChoice, surveyNote){
    if (!pendingBody) return;
    const baseDate = pendingBody.date;
    const d = new Date(baseDate + 'T00:00:00');
    if (allNighter) d.setDate(d.getDate()-1);
    const dateStr = d.toISOString().slice(0,10);
    const willIncrement = LS.lastDay !== dateStr;
    const dayIdxToSend = willIncrement ? (LS.dayIndex||0)+1 : LS.dayIndex;
    const body = { ...pendingBody, date: dateStr, day_index: dayIdxToSend, survey_choice: surveyChoice || null, survey_note: surveyNote || null, all_nighter: allNighter };
    try {
      const { ok } = await api.postNotionWithRetry(body);
      if (!ok) {
        toastBad('Notion sync failed.');
      } else {
        toastGoodPager('Synced');
        if (willIncrement){ LS.dayIndex = dayIdxToSend; LS.lastDay = dateStr; }
        sendAccountabilityEmail({ day: LS.dayIndex, date: dateStr, streak: LS.streak, grade: body.grade, latencyMs: body.latency_ms });
        freezeUsedToday = false;
        LS.heatCounts = { drums:0, vocals:0, keys:0, lyrics:0, bass:0 };
      }
    } catch {}
    pendingBody = null;
  }

  // Survey handlers
  document.getElementById('submitSurvey')?.addEventListener('click', ()=>{
    const v = document.querySelector('input[name="surveyChoice"]:checked');
    const note = document.getElementById('surveyNote');
    const allNight = document.getElementById('surveyAllNighter')?.checked || false;
    localStorage.setItem('nk_survey_choice', v?.value || '');
    localStorage.setItem('nk_survey_note', note?.value || '');
    document.getElementById('surveyModal')?.classList.add('hidden');
    finalizeSession(allNight, v?.value || null, note?.value || null);
    setTimeout(()=> showSuccess(), 400);
  });
  document.getElementById('skipSurvey')?.addEventListener('click', ()=>{
    localStorage.removeItem('nk_survey_choice');
    localStorage.removeItem('nk_survey_note');
    const allNight = document.getElementById('surveyAllNighter')?.checked || false;
    document.getElementById('surveyModal')?.classList.add('hidden');
    finalizeSession(allNight, null, null);
    setTimeout(()=> showSuccess(), 200);
    // After wrap, ask if cooking again or done
    try {
      import('./ui-nav.js').then(mod => {
        const { askCookAgainOrDone, smoothScrollTo } = mod;
        askCookAgainOrDone((choice)=>{
          if (choice === 'done') smoothScrollTo('#hudAnalytics');
        });
      });
    } catch {}
  });

  // Beeper encouragements
  const BEEPER = [
    "You’re Grammy‑nominated for a reason.",
    "Platinum plaques coming. Stay focused!",
    "Small reps, big catalog.",
    "Ship quietly; let results talk."
  ];
  setInterval(()=>{ if (started && Math.random()<0.06) toastGoodPager(pick(BEEPER)); }, 90_000);

  // Time-based nudges: one between 29–41 min, one between 60–100 min
  // Time nudges bring up the action modal with a sting first
  scheduleNudge(29*60*1000, 41*60*1000, () => { stingVillainMaybeLLM(rotPick('shade'), 'shade'); openNudge(); });
  scheduleNudge(60*60*1000, 100*60*1000, () => { stingVillainMaybeLLM(rotPick('shade'), 'shade'); openNudge(); showRun(); });

  { const el = $("#freezeBtn"); if (el) el.onclick = ()=>{
    if (LS.freezes<=0) return toast("No freezes yet. Earn one every 7 wins.");
  LS.freezes -= 1; setText('#freezes', LS.freezes);
  LS.streak += 1; setText('#streak', LS.streak);
    toast("🧊 Streak preserved.");
    freezeUsedToday = true;
  }; }

  // Grade + CD grow
  $("#gradeSlider")?.addEventListener('input', ()=>{
    const v = +$("#gradeSlider").value;
    const s = 0.7 + (v/100)*0.9;
    const cd=$("#cd"); if (cd){ cd.style.transform = `scale(${s})`; cd.style.filter = v>=50 ? "none" : "grayscale(80%)"; }
  });
  { const el = $("#saveGrade"); if (el) el.onclick = ()=>{
    const v = +$("#gradeSlider").value;
    LS.grades = [...LS.grades, v].slice(-60);
    drawCharts(); toastGoodPager("Saved");
    if (v < 50) toast("Keep it moving. Tomorrow: 8 bars, keep it simple.");
  }; }

  // If-Then choice reactions
  ["#igClosed", "#fbClosed", "#ytConsidered"].forEach(sel=>{
    const el = $(sel); if (!el) return;
    el.addEventListener('change', ()=>{
      const goingDown = (sel==="#ytConsidered" && !el.checked);
      if (goingDown){
        bumpMultiplier(-5);
  stingVillain(rotPick('shade'), 'shade');
        hintPrompt();
      } else {
        bumpMultiplier(+3);
  stingVillain(rotPick('hype'), 'hype');
      }
    });
  });

  /* -------------------- Villain chat corner -------------------- */
  const chat = {
    open:false,
    log: $("#chatLog"),
    form: $("#chatForm"),
    input: $("#chatInput"),
    kbd: $("#kbd"),
    mode(){ return LS.llmKey ? 'LLM' : 'Rule'; }
  };
  { const el = $("#chatToggle"); if (el) el.onclick = ()=>{
    chat.open = !chat.open;
    $("#chatDock")?.classList.toggle('open', chat.open);
    const name = LS.heelName || 'Villain';
    chat.input?.setAttribute('placeholder', `Turn on LLM & Send message to ${name}`);
    setText('#llmModeLabel', chat.mode()==='LLM' ? 'On' : 'Off');
    if (chat.open && chat.log && chat.log.childElementCount===0) {
      const l = rotPick('seed');
      if (l) pushMsg('bot', l);
    }
  }; }
  { const el = $("#chatCloseBtn"); if (el) el.onclick = ()=>{
    chat.open = false;
    $("#chatDock")?.classList.remove('open');
  }; }
  { const el = $("#saveLLM"); if (el) el.onclick = ()=>{
    const keyEl=$("#openrouterKey"); const mdlEl=$("#openrouterModel");
    LS.llmKey = keyEl?.value.trim() || '';
    LS.llmModel = mdlEl?.value.trim() || 'mistralai/mistral-small';
  setText('#llmModeLabel', chat.mode()==='LLM' ? 'On' : 'Off');
  toastGoodPager('LLM settings saved.');
  }; }
  // sidekick keys wiggle
  document.addEventListener('keydown', e=>{
    const k = (e.key||'').toUpperCase();
    const el = chat.kbd?.querySelector(`[data-k="${k}"]`); if(!el) return;
    el.classList.add('active'); setTimeout(()=>el.classList.remove('active'), 70);
  });
  chat.form?.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const text = chat.input?.value.trim(); if(!text) return;
    pushMsg('me', text); if (chat.input) chat.input.value='';
    if (chat.mode()==='LLM'){
      try { const reply = await villainLLM(text); pushMsg('bot', reply); }
      catch { const l = rotPick('seed'); if (l) pushMsg('bot', l); }
    } else {
    pushMsg('bot', ruleReply(text));
    }
  });
  async function pushMsg(who, text){
    const m = document.createElement('div');
    m.className = `msg ${who}`;
    if (who==='bot' && TYPED_BOT_MESSAGES){
      m.textContent = '😈 ';
      if (!chat.log) return; chat.log.appendChild(m);
      try{ const mod = await import('./typewriter.js'); await mod.typeInto(m, text, { speedMs: 18, jitterMs: 6, neon: false, caret: true, prefix: m.textContent }); }catch{ m.textContent = '😈 '+text; }
    } else {
      m.textContent = (who==='bot'?'😈 ':'🫵 ')+text;
      if (!chat.log) return; chat.log.appendChild(m);
    }
    if (chat.log) chat.log.scrollTop = chat.log.scrollHeight;
  }
  function ruleReply(txt){
      // tone-aware quick replies
    const lower = txt.toLowerCase();
      const tone = LS.tone ?? 1; // 0 gentle, 1 default, 2 spicy
      const gentle = {
        tired: "Low energy? Try 8 bars, simple drums. Finish is the win.",
        youtube: "Stay on track. Music only, skip the scroll.",
        mix: "Don’t overmix. Arrange, bounce, move on.",
        other: "One small step. 8 bars, then bounce."
      };
      const mid = {
        tired: "Lower the bar. 8 bars, simple drums, bounce it. Done beats perfect.",
        youtube: "YT considered? Use Music only. Don’t derail.",
        mix: "Don’t mix the song. Finish, bounce, pack. Next.",
        other: (rotPick('seed') || 'Lower the bar. 8 bars, simple drums, bounce it.')
      };
      const spicy = {
        tired: "Lower the bar and move. 8 bars, drums, bounce.",
        youtube: "Close the tabs. Make the track, not excuses.",
        mix: "Stop mixing pretty. Arrange and print it.",
        other: (rotPick('shade') || 'Close the tabs. Make the track, not excuses.')
      };
      const T = tone===0?gentle:(tone===2?spicy:mid);
      if (lower.includes('tired')||lower.includes('low')) return T.tired;
      if (lower.includes('youtube')) return T.youtube;
      if (lower.includes('mix')) return T.mix;
      return T.other;
  }
  async function villainLLM(user){
    const key = LS.llmKey; const model = LS.llmModel;
    const sys = [
    "Role: Pocket-watching producer heel (villain actor).",
      "Goal: Push to finish one song today. Keep it short, blunt, funny. No cornball, no motivational posters.",
      "Style: Competitive, passive‑aggressive AAVE for music. Avoid slurs and disrespect to groups. Keep it playful, not cruel.",
      "Constraints: 1-2 sentences max. No emojis (unless user uses them). Always point to an action (loop, drums, bounce, arrange, post).",
      `Tone: ${LS.tone===0?'gentle, encouraging':LS.tone===2?'spicy, blunt':'balanced, direct but respectful'}.`
    ].join(' ');
    const shots = [
      {role:'user', content:'I feel tired and unmotivated'},
      {role:'assistant', content:'Lower the bar. 8 bars, simple drums, bounce it. Done beats perfect.'},
      {role:'user', content:'I’m still tweaking the mix'},
      {role:'assistant', content:'Stop mixing. Arrange and bounce. Post the rough. Next.'},
      {role:'user', content:'Scrolling YouTube rn'},
      {role:'assistant', content:'Close YouTube. One loop, one bounce. Back in the game.'},
    ];
    const r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method:"POST",
      headers:{
        "Authorization": `Bearer ${key}`,
        "Content-Type":"application/json"
      },
      body: JSON.stringify({
        model,
        messages:[{role:"system", content:sys}, ...shots, {role:"user", content:user}],
        temperature:0.4,
        max_tokens:80,
        top_p:0.9
      })
    });
    const json = await r.json();
    return json?.choices?.[0]?.message?.content?.trim() || (rotPick('seed') || 'Hook slid by… go write the one that sticks.');
  }

  /* -------------------- Music / Noise (YouTube IFrame) -------------------- */
  let musicPlayer, noisePlayer, hintPlayer;
  let musicReady=false, noiseReady=false, hintReady=false;
  let musicVol=15, noiseVol=15;
  let musicDucker = null;
  let noisePending=false;
  let ytInited = false;

  // Gate for autoplay w/ sound: user must click once (Chrome policy)
  { const el = $("#armAudio"); if (el) el.onclick = ()=>{
    el.style.display = 'none';
    initYouTubeOnce(); // create players and start music quietly
  }; }

  function ensurePlayers(){
    if (!window.YT || !window.YT.Player) return;
    if (!musicPlayer){
      const musicEl = document.getElementById(EL.music);
      if (musicEl){
        musicPlayer = new YT.Player(EL.music,{
          height:'0', width:'0',
          playerVars:{ autoplay:1, controls:0, rel:0, playsinline:1 },
          events:{ onReady: onMusicReady, onStateChange: onMusicState }
        });
      }
    }
    if (!noisePlayer){
      const noiseEl = document.getElementById(EL.noise);
      if (noiseEl){
        noisePlayer = new YT.Player(EL.noise,{
          height:'0', width:'0',
          playerVars:{ autoplay:0, controls:0, rel:0, playsinline:1, mute:0 },
          events:{ onReady: onNoiseReady }
        });
      }
    }
  }
  function ensureHintPlayer(){
    if (!window.YT || !window.YT.Player || hintPlayer) return;
    const el = document.getElementById(EL.hint);
    if (!el) return;
    hintPlayer = new YT.Player(EL.hint,{
      height:'270', width:'480',
      playerVars:{ autoplay:0, controls:1, rel:0, playsinline:1, mute:0 },
      events:{ onReady: (e)=>{ hintReady=true; }, onStateChange: ()=>{} }
    });
  }
  function initYouTubeOnce(){
    if (ytInited) return; ytInited = true;
    if (window.YT && window.YT.Player) ensurePlayers();
    else { window.onYouTubeIframeAPIReady = ensurePlayers; }
  }
  function onMusicReady(e){
    musicReady=true;
    const src = (LS.musicUrl && LS.musicUrl.trim()) || CFG.DEFAULT_PLAYLIST;
    try{
      if (src.includes('list=')){
        e.target.loadPlaylist({ listType:'playlist', list: playlistIdFromUrl(src) });
      } else {
        e.target.loadVideoById(videoIdFromUrl(src));
      }
      e.target.unMute();
      setVol(musicPlayer, musicVol);
      if (!musicDucker) musicDucker = createMusicDucker(musicPlayer, { initialVolume: musicVol });
      e.target.playVideo();
    }catch{}
  }
  function playPlaylist(e, playlistUrl, singles){
    // Try playlist first; if blocked, fall back to first single
    try{
      e.target.loadPlaylist({ listType:'playlist', list: playlistIdFromUrl(playlistUrl) });
      e.target.playVideo();
    }catch{
      const id = videoIdFromUrl(singles[0]);
      e.target.loadVideoById(id);
    }
  }
  function onMusicState(e){
  // Track title only; do not touch volume here to avoid mid-song dips
  if (e?.data === (window.YT?.PlayerState?.PLAYING)){
    try {
      const d = e.target.getVideoData();
      const np=document.getElementById(EL.nowPlaying); if (np) np.textContent = `${d?.title || '—'}`;
      const hud=document.getElementById('hudNowPlaying'); if (hud) hud.textContent = `Now Playing: ${d?.title || '—'}`;
    } catch { /* ignore */ }
  }
}
  function onNoiseReady(e){
    noiseReady=true;
    setVol(noisePlayer, noiseVol);
    if (noisePending){
      const src = (LS.noiseUrl && LS.noiseUrl.trim()) || CFG.NOISE_LIFEAT;
      const id = videoIdFromUrl(src);
      if (id){
        noisePlayer.loadVideoById(id);
        noisePlayer.playVideo();
      }
      noisePending=false;
    }
  }
  function setVol(player, pct){
    try{ player.setVolume(Math.max(0, Math.min(100, pct))); }catch{}
  }
  function fadeOutMusic(){
    if (!musicPlayer||!musicReady) return;
    try{
      if (!musicDucker) musicDucker = createMusicDucker(musicPlayer, { initialVolume: musicVol });
      musicDucker.fadeOutAndPause(3, 120);
    }catch{}
  }
  { const el = $("#toggleNoise"); if (el) el.onclick = ()=>{
    initYouTubeOnce();
    if (!noisePlayer){ noisePending=true; return; }
    try{
      const s = noisePlayer.getPlayerState();
      if (s===(window.YT?.PlayerState?.PLAYING)){ noisePlayer.pauseVideo(); }
      else {
        const src = (LS.noiseUrl && LS.noiseUrl.trim()) || CFG.NOISE_LIFEAT;
        const id = videoIdFromUrl(src);
        if (id){
          noisePlayer.loadVideoById(id);
          setVol(noisePlayer, noiseVol);
          noisePlayer.playVideo();
        }
      }
    }catch{}
  }; }

  // Open Studio Vibes in a new tab using user preference or default
  document.getElementById('openVibes')?.addEventListener('click', ()=>{
    const src = (LS.vibesUrl && LS.vibesUrl.trim()) || CFG.DEFAULT_STUDIO_VIBES;
    if (!src){ toast('No Studio Vibes URL set.'); return; }
    const href = src.includes('list=') ? `https://www.youtube.com/playlist?list=${playlistIdFromUrl(src)}` : `https://www.youtube.com/watch?v=${videoIdFromUrl(src)}`;
    window.open(href, '_blank');
  });

  // parsing helpers come from web-utils.js

  /* -------------------- Hints (floating) -------------------- */
  let HINTS = [];
  loadHintsConfig();
  function openHints(){
    const modal = document.getElementById('hintsModal');
    if (!modal) return;
    modal.classList.remove('hidden');
    initYouTubeOnce();
    ensureHintPlayer();
    // gently duck music while hints play; restore on close
    try{
      if (!musicDucker && musicPlayer) musicDucker = createMusicDucker(musicPlayer, { initialVolume: musicVol });
      musicDucker?.duckForHints({ target: 5, step: 3, intervalMs: 120 });
    }catch{}
    // load a fresh hint
    const v = rotPickHint();
    if (hintPlayer && v){ try{ hintPlayer.loadVideoById(v); }catch{} }
    const a = document.getElementById('openInYoutube');
    if (a && v){ a.href = openInYouTubeHrefFor(v); }
  }
  function closeHints(){ document.getElementById('hintsModal')?.classList.add('hidden'); try{ hintPlayer?.pauseVideo(); }catch{} try{ musicDucker?.restore(); }catch{} }
  window.openHints = openHints; window.closeHints = closeHints;
  function rotPickHint(){
    if (!HINTS.length) return null;
    const i = (+localStorage.getItem('nk_rot_hint')||0) % HINTS.length;
    localStorage.setItem('nk_rot_hint', (i+1) % HINTS.length);
    return videoIdFromUrl(HINTS[i]);
  }
  async function loadHintsConfig(){
    // 1) User-saved list takes priority
    try{
      const user = (LS.hintsUrls||[]).filter(Boolean);
      if (user.length) { HINTS = user; return; }
    }catch{}
    // 2) Repo config next
    try{
      const r = await fetch('config/hints.json', { headers:{'Accept':'application/json'} });
      if (r.ok){ const j = await r.json(); if (Array.isArray(j?.videos)) HINTS = j.videos; }
    }catch{}
    // 3) Fallback examples if still empty
    if (!HINTS.length){
      HINTS = [
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        'https://www.youtube.com/watch?v=5qap5aO4i9A'
      ];
    }
  }
  function openInYouTubeHrefFor(id){ return `https://www.youtube.com/watch?v=${id}`; }
  function hintPrompt(){
    const hb = document.getElementById('hintsBtn');
    hb?.classList.add('shake');
    setTimeout(()=>hb?.classList.remove('shake'), 1600);
    toastGoodPager('Need a nudge? Tap the ?📈 button');
  }
  document.getElementById('hintsBtn')?.addEventListener('click', openHints);

  /* -------------------- Rewards + overlays -------------------- */
  function gearDrop(){
    const rare = Math.random() < CFG.RARE_DROP_RATE;
    const pool = rare ? CFG.REWARD_GIFS.rare : CFG.REWARD_GIFS.common;
    const gif = pick(pool);
  const tEl = document.getElementById('rewardTitle');
  const gEl = document.getElementById('rewardGif');
  const cEl = document.getElementById('rewardCap');
  const mEl = document.getElementById('rewardModal');
  if (tEl) tEl.textContent = rare ? "🌟 RARE Gear Drop" : "🎁 Gear Drop";
  if (gEl) gEl.src = gif;
  if (cEl) cEl.textContent = rare ? "Limited run. Flex quietly and keep working." : "Pocket this and move on.";
  if (mEl) mEl.classList.remove('hidden');
  }
  window.closeReward = ()=> { $("#rewardModal").classList.add('hidden'); try{ import('./ui-nav.js').then(m=> m.smoothScrollTo('#lockerSection')); }catch{} };

        function showSuccess(){
     // Sprinkle a kind word at wrap unless user opted out of next session
     try{ const line = Math.random()<0.5 ? rotPick('hype') : rotPick('pocket'); if (line) stingVillain(line, 'seed'); }catch{}
     try { if (window.__PRO__) import('./pro/analytics-hud.js').then(m=> m.rotateVillainAnnounce('done', { frameSrc: 'pro/video/TC - 35mm_MATTE.png', durationMs: 2200 })); } catch {}
     setTimeout(()=>{
       $("#successGif").src = CFG.GIFS.SUCCESS_HOME;
       $("#successHome").classList.remove('hidden');
       sideConfetti(2200);
     }, 700);
   }
  window.closeSuccess = ()=> $("#successHome").classList.add('hidden');

     function showFail(){
     $("#failGif").src = CFG.GIFS.FAIL_HOME;
     $("#willGif").src = CFG.GIFS.WILL_PLACEHOLDER;
     $("#failHome").classList.remove('hidden');
     try { if (window.__PRO__) import('./pro/analytics-hud.js').then(m=> m.rotateVillainAnnounce('low-time', { frameSrc: 'pro/video/TC - VIEWFINDER 235 - BLACK.png', durationMs: 2000 })); } catch {}
   }
  window.closeFail = ()=> $("#failHome").classList.add('hidden');

  function showRun(){
    $("#runGif").src = pick(CFG.GIFS.RUN);
    $("#runOverlay").classList.remove('hidden');
  }
  window.closeRun = ()=> $("#runOverlay").classList.add('hidden');
  function showPowerup(){
    try{
      if (window.__PRO__){
        import('./pro/analytics-hud.js').then(m=> m.rotateVillainAnnounce('award', { durationMs: 1800 }));
      } else {
        const box=document.createElement('div');
        box.style.cssText='position:fixed;right:18px;bottom:110px;z-index:9998;background:#0f0f18;border:1px solid #24253a;border-radius:12px;overflow:hidden;box-shadow:0 8px 28px rgba(0,0,0,.45)';
        const img=document.createElement('img'); img.src=CFG.GIFS.POWERUP; img.alt='powerup'; img.style.cssText='width:180px;height:auto;display:block';
        box.appendChild(img); document.body.appendChild(box);
        setTimeout(()=>box.remove(), 1400);
      }
    }catch{}
  }

  /* -------------------- Utils -------------------- */
  function pick(arr){ return arr[Math.floor(Math.random()*arr.length)] }
  function buildTicker(){
    const el = document.getElementById('lockinTicker'); if (!el) return;
    const tipEl = document.createElement('span'); tipEl.className='ticker-item';
    el.innerHTML=''; el.appendChild(tipEl);
    const tips = CFG.ENCOURAGEMENT_TIPS; let idx=0;
    const show = ()=>{
      tipEl.textContent = tips[idx];
      tipEl.classList.add('visible');
      setTimeout(()=>tipEl.classList.remove('visible'), 19500);
      idx = (idx+1) % tips.length;
    };
    show();
    setInterval(show, 20000);
  }
  function rotPick(kind){
    const map = { pre:['VILLAIN_PRESTART','rotPre'], hype:['VILLAIN_HYPE','rotHype'], shade:['VILLAIN_SHADE','rotShade'], seed:['VILLAIN_SEED','rotSeed'], pocket:['VILLAIN_POCKET','rotPocket'] };
    const [arrName, idxKey] = map[kind]||[];
    const pool = CFG[arrName]||[]; if (!pool.length) return '';
    const i = (LS[idxKey]||0) % pool.length;
    LS[idxKey] = (i+1) % pool.length;
    return pool[i];
  }
  function stingVillainMaybeLLM(text, kind='seed'){
    // occasionally replace with LLM if configured
    const doLLM = LS.llmKey && Math.random() < 0.22;
    if (!doLLM){ stingVillain(text, kind); return; }
    villainLLM(text).then(reply=> stingVillain(reply, kind)).catch(()=> stingVillain(text, kind));
  }
  function fmt(ms){ const s=Math.max(0,Math.ceil(ms/1000)); return `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`; }
  function toast(msg){
    const el=document.createElement('div');
    el.textContent=msg;
    el.style.cssText="position:fixed;bottom:18px;left:50%;transform:translateX(-50%);background:#131421;border:1px solid #24253a;color:#fff;padding:10px 14px;border-radius:12px;z-index:9999;font-weight:900";
    document.body.appendChild(el); setTimeout(()=>el.remove(),1800);
  }
  function toastGoodPager(msg){
    const wrap=document.createElement('div');
    wrap.className='pager-toast';
    const icon=document.createElement('span');
    icon.className='icon'; icon.textContent='📟';
    const screen=document.createElement('span');
    screen.className='screen'; screen.textContent=msg;
    wrap.appendChild(icon); wrap.appendChild(screen);
    document.body.appendChild(wrap);
    setTimeout(()=>wrap.remove(),1800);
  }
  function toastBad(msg){
    const el=document.createElement('div');
    el.textContent=msg;
    el.style.cssText="position:fixed;bottom:18px;left:50%;transform:translateX(-50%);background:#3a0c0c;border:2px solid #ff3b30;color:#fff;padding:10px 14px;border-radius:12px;z-index:9999;font-weight:900";
    el.style.animation = 'flashRed 0.3s ease-in-out 6 alternate';
    document.body.appendChild(el); setTimeout(()=>el.remove(),2400);
  }
  function stingVillain(text, kind='seed'){
    const box=document.createElement('div'); box.className='villain-toast';
    const hdr=document.createElement('div'); hdr.className='hdr'; hdr.innerHTML=`${LS.heelEmoji||'😈'} ${LS.heelName||'Heel'}`;
    const msg=document.createElement('div'); msg.className='msg'; msg.textContent=text;
    box.appendChild(hdr); box.appendChild(msg);
    document.body.appendChild(box);
    setTimeout(()=>box.remove(), 3000);
    if (kind==='shade') {
      // trigger public API so tests/other modules can call it too
      if (typeof window.villainShadeRain === 'function') window.villainShadeRain(28, 2200);
      else devilRain(2200);
    }
  }
  function scheduleNudge(minDelay, maxDelay, fn){
    const wait = Math.floor(minDelay + Math.random()*(maxDelay-minDelay));
    setTimeout(()=>{ if (started) fn(); }, wait);
  }

  // Pre-start recurring stings: ~every 30s show up to 10s, before Start is pressed
  (function preStartPopups(){
    let stop=false; // will flip when started
    const loop=()=>{
      if (started) { stop=true; return; }
      // Optional: attach a themed GIF background if available
      try{
        const theme = LS.heelTheme || 'masc';
        const pool = theme==='custom' ? (LS.heelGifs||[]) : (CFG.HEEL_GIFS?.[theme]||[]);
        if (pool.length){
          const { value: gif, nextIdx } = rotatePick(pool, LS.rotHeel);
          LS.rotHeel = nextIdx;
          const bg = document.createElement('div');
          bg.style.cssText = 'position:fixed;inset:auto 18px 80px auto;z-index:998;border-radius:12px;overflow:hidden;opacity:.9;box-shadow:0 8px 28px rgba(0,0,0,.45)';
          const img = document.createElement('img'); img.src = gif; img.style.cssText='width:220px;height:auto;display:block';
          bg.appendChild(img); document.body.appendChild(bg);
          setTimeout(()=>bg.remove(), 10_000);
        }
      }catch{}
      stingVillain(rotPick('seed'));
      setTimeout(()=>{ if (!stop) setTimeout(loop, 30_000); }, 10_000);
    };
    setTimeout(loop, 8_000);
  })();
  function updateMultiplier(v){
    const el = document.getElementById('multVal'); const bar = document.getElementById('multBar');
    const cv = clampMultiplier(Math.round(v), 0, 200);
    const display = Math.max(0, Math.min(100, cv));
    if (el) el.textContent = `${display}%`;
    if (bar) bar.style.width = `${display}%`;
  }
  function bumpMultiplier(delta){
    const prev = LS.mult;
    LS.mult = bumpMultiplierCalc(LS.mult, delta, 0, 200);
    updateMultiplier(LS.mult);
    if (delta >= 5 && LS.mult > prev) showPowerup();
  }
  // JSON + retry moved to api.js

  /* -------------------- Action Nudge modal -------------------- */
  function openNudge(){ document.getElementById('nudgeModal')?.classList.remove('hidden'); }
  function closeNudge(){ document.getElementById('nudgeModal')?.classList.add('hidden'); }
  window.closeNudge = closeNudge;
  document.getElementById('nudgeMoreTime')?.addEventListener('click', ()=>{
    closeNudge(); bumpMultiplier(-10); stingVillain(rotPick('shade'), 'shade'); hintPrompt();
  });
  document.getElementById('nudgeEightBar')?.addEventListener('click', ()=>{
    closeNudge(); bumpMultiplier(+5); stingVillain(rotPick('hype')); showRun();
  });
  document.getElementById('nudgeFocusmate')?.addEventListener('click', ()=>{
    closeNudge(); bumpMultiplier(+3); window.open('https://www.focusmate.com/', '_blank');
  });
  document.getElementById('nudgeCloseSocial')?.addEventListener('click', ()=>{
    closeNudge(); bumpMultiplier(+4); stingVillain("Lock in. Tabs down, faders up.", 'seed');
  });

  /* -------------------- Heat buttons -------------------- */
  const HEAT_MAP = [
    ['#heatDrums','drums','DRUMS'],
    ['#heatVocals','vocals','VOCALS'],
    ['#heatKeys','keys','KEYS'],
    ['#heatLyrics','lyrics','LYRICS'],
    ['#heatBass','bass','BASS']
  ];
  HEAT_MAP.forEach(([sel, key, label])=>{
    const el = $(sel); if (!el) return;
    el.addEventListener('click', ()=> heatBump(el, key, label));
  });
  function heatBump(btn, key, label){
    try{
      btn.classList.add('jiggle'); setTimeout(()=>btn.classList.remove('jiggle'), 500);
      const hc = LS.heatCounts; hc[key] = (hc[key]||0) + 1; LS.heatCounts = hc;
      toastGoodPager(`HEAT: ${label}`);
      // Sprinkle a hype line occasionally
      try{ if (Math.random() < 0.35) { const hype = rotPick('hype'); if (hype) stingVillain(hype, 'seed'); } }catch{}
      // Update badge
      const badge = btn.querySelector('.badge'); if (badge){ badge.textContent = String(hc[key]); }
      // Cooldown glow
      btn.classList.add('cool'); setTimeout(()=>btn.classList.remove('cool'), 900);
      fireRain(2600);
      // Soft prompt to title once (first heat; no title yet)
      if (!LS.songTitle && titleEl){
        titleEl.focus();
        toastGoodPager('Name it now (you can change later).');
      }
    }catch{}
  }
  function fireRain(ms=2400){
    const start = performance.now();
    const spawn = ()=>{
      const now = performance.now();
      const t = (now - start) / ms;
      if (t > 1) return;
      // ramp emit rate
      const rate = t < 0.5 ? (t*2) : (2 - t*2); // 0->1->0
      const count = Math.max(1, Math.floor(rate * 6));
      for (let i=0;i<count;i++) createEmber();
      requestAnimationFrame(spawn);
    };
    requestAnimationFrame(spawn);
  }
  function createEmber(){
    const e = document.createElement('div');
    e.className = 'fire-ember'; e.textContent = '🔥';
    const left = Math.random()*100; // vw
    const dur = 1.4 + Math.random()*1.6; // 1.4s - 3.0s
    const drift = (Math.random()*80 - 40) + 'px';
    const size = 16 + Math.floor(Math.random()*12);
    e.style.left = left+'vw';
    e.style.setProperty('--drift', drift);
    e.style.animationDuration = dur+'s';
    e.style.fontSize = size+'px';
    document.body.appendChild(e);
    setTimeout(()=> e.remove(), dur*1000 + 100);
  }

  function devilRain(ms=1600){
    const start = performance.now();
    const spawn = ()=>{
      const now = performance.now();
      const t = (now - start) / ms;
      if (t > 1) return;
      const rate = t < 0.5 ? (t*2) : (2 - t*2);
      const count = Math.max(1, Math.floor(rate * 5));
      for (let i=0;i<count;i++) createDevil();
      requestAnimationFrame(spawn);
    };
    requestAnimationFrame(spawn);
  }
  // Public API for shade rain; intensity scales emission
  window.villainShadeRain = function(intensity=28, durationMs=2200){
    const start = performance.now();
    const tick = ()=>{
      const now = performance.now();
      const t = (now - start) / durationMs;
      if (t > 1) return;
      const rate = Math.max(1, Math.floor(intensity * (t < 0.5 ? (t*2) : (2 - t*2)) / 6));
      for (let i=0;i<rate;i++) createDevil();
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
  function createDevil(){
    const e = document.createElement('div');
    e.className = 'devil-head'; e.textContent = '😈';
    const left = Math.random()*100; // vw
    const dur = 1.1 + Math.random()*1.2;
    const drift = (Math.random()*40 - 20) + 'px';
    const size = 16 + Math.floor(Math.random()*14);
    e.style.left = left+'vw';
    e.style.setProperty('--drift', drift);
    e.style.animationDuration = dur+'s';
    e.style.fontSize = size+'px';
    document.body.appendChild(e);
    setTimeout(()=> e.remove(), dur*1000 + 120);
  }

  function sideConfetti(ms=1800){
    const colors = ['#b6ff00','#7c3aed','#ff3b30','#ffb020','#35d07f','#4e2bb5'];
    const start = performance.now();
    function spawn(){
      const now = performance.now();
      const t = (now - start) / ms;
      if (t>1) return;
      const rate = t < 0.5 ? (t*2) : (2 - t*2);
      const n = Math.max(1, Math.floor(rate*12));
      for (let i=0;i<n;i++){
        cannon('left'); cannon('right');
      }
      requestAnimationFrame(spawn);
    }
    function cannon(side){
      const d = document.createElement('div');
      d.className = 'cannon-piece';
      const color = colors[Math.floor(Math.random()*colors.length)];
      const w = 6 + Math.floor(Math.random()*6);
      const h = 8 + Math.floor(Math.random()*10);
      d.style.background = color;
      d.style.width = w+'px'; d.style.height = h+'px';
      if (side==='left'){
        d.style.left = '-12px'; d.style.top = (20+Math.random()*60)+'vh';
        d.style.animation = `cannonLeft ${1+Math.random()*1.2}s linear forwards`;
      } else {
        d.style.right = '-12px'; d.style.top = (20+Math.random()*60)+'vh';
        d.style.animation = `cannonRight ${1+Math.random()*1.2}s linear forwards`;
      }
      document.body.appendChild(d);
      setTimeout(()=> d.remove(), 2500);
    }
    requestAnimationFrame(spawn);
  }

  /* -------------------- Settings (emails) -------------------- */
  document.getElementById('openSettings')?.addEventListener('click', ()=>{
    const el = document.getElementById('acctEmails');
    if (el) el.value = (LS.emails||[]).join(', ');
    const vu = document.getElementById('vibesUrl'); if (vu) vu.value = LS.vibesUrl || '';
    const mu = document.getElementById('musicUrl'); if (mu) mu.value = LS.musicUrl || '';
    const hl = document.getElementById('hintsList'); if (hl) hl.value = (LS.hintsUrls||[]).join('\n');
    const ve = document.getElementById('villainEmoji'); if (ve) ve.value = LS.heelEmoji || '😈';
    const nu = document.getElementById('noiseUrl'); if (nu) nu.value = LS.noiseUrl || '';
    document.getElementById('settingsPanel')?.classList.remove('hidden');
    // Auto-close chat so settings are unobstructed
    document.getElementById('chatDock')?.classList.remove('open');
  });
  document.getElementById('closeSettings')?.addEventListener('click', ()=>{
    document.getElementById('settingsPanel')?.classList.add('hidden');
  });
  document.getElementById('saveSettings')?.addEventListener('click', ()=>{
    const raw = (document.getElementById('acctEmails')?.value||'').split(',').map(s=>s.trim()).filter(Boolean);
    LS.emails = raw;
    // Save vibes (studio) URL
    LS.vibesUrl = document.getElementById('vibesUrl')?.value?.trim() || '';
    // Save music playlist override
    const music = document.getElementById('musicUrl')?.value?.trim() || '';
    LS.musicUrl = music;
    // Save hints list
    const hintsRaw = (document.getElementById('hintsList')?.value||'').split('\n').map(s=>s.trim()).filter(Boolean);
    LS.hintsUrls = hintsRaw;
    // Save villain emoji
    try{
      const chooser = {
        subject: (document.getElementById('villainSubject')?.value || 'nonhuman'),
        presenting: (document.getElementById('villainPresenting')?.value || 'neutral'),
        age: (document.getElementById('villainAge')?.value || 'adult'),
        hair: (document.getElementById('villainHair')?.value || 'default'),
        beard: !!(document.getElementById('villainBeard')?.checked),
        tone: (document.getElementById('villainTone')?.value || 'medium'),
        nonHuman: (document.getElementById('villainNonHuman')?.value || '😈')
      };
      const vEm = buildVillainEmoji(chooser);
      LS.heelEmoji = vEm;
      // React to choice
      const msg = isHumanSelection(chooser) ? "4 real you picked me?!? That's craaaazzzzy fam... Aight" : 'Good choice.';
      stingVillain(msg, 'seed');
    }catch{}
    const hdr=document.getElementById('sidekickHeader'); if(hdr) hdr.textContent=`${LS.heelEmoji||'😈'} ${LS.heelName||'Heel'}`;
    // Save noise URL
    const noise = document.getElementById('noiseUrl')?.value?.trim() || '';
    LS.noiseUrl = noise;

    toastGoodPager('Settings saved');
    document.getElementById('settingsPanel')?.classList.add('hidden');
    // If music player exists, apply new music source (but keep paused until explicitly played)
    try{
      if (musicPlayer && musicReady){
        if (music){
          if (music.includes('list=')) musicPlayer.loadPlaylist({ listType:'playlist', list: playlistIdFromUrl(music) });
          else musicPlayer.loadVideoById(videoIdFromUrl(music));
        }
        setVol(musicPlayer, 0);
        musicPlayer.pauseVideo();
      }
    }catch{}
  });

  // First-run setup
  (function firstRun(){
    if (!LS.heelName || !LS.vibesUrl){
      const p = document.getElementById('setupPanel');
      if (p){
        const n=document.getElementById('setupName'); if (n) n.value = LS.heelName || '';
        const v=document.getElementById('setupVibesUrl'); if (v) v.value = LS.vibesUrl || '';
        const m=document.getElementById('setupMusicUrl'); if (m) m.value = LS.musicUrl || '';
        const t=document.getElementById('setupTone'); if (t) t.value = String(LS.tone ?? 1);
        p.classList.remove('hidden');
        document.getElementById('setupSave')?.addEventListener('click', ()=>{
          LS.heelName = document.getElementById('setupName')?.value?.trim() || '';
          LS.vibesUrl = document.getElementById('setupVibesUrl')?.value?.trim() || '';
          LS.musicUrl = document.getElementById('setupMusicUrl')?.value?.trim() || '';
          LS.tone = Number(document.getElementById('setupTone')?.value || 1);
          p.classList.add('hidden');
          const hdr=document.getElementById('sidekickHeader'); if(hdr) hdr.textContent=`${LS.heelEmoji||'😈'} ${LS.heelName||'Heel'}`;
          toastGoodPager('Setup saved');
        });
      }
    }
  })();

  // Note: hidden unlock flow removed; users supply their own URL.

  async function sendAccountabilityEmail(report){
    const to = (LS.emails||[]);
    if (!to.length) return;
    try{
      await fetch('/.netlify/functions/email', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          to,
          subject: `THE NUKES — Day ${report.day} done`,
          text: `Done. Day ${report.day} — ${report.date}\nStreak: ${report.streak}\nGrade: ${report.grade ?? '—'}\nStart latency: ${report.latencyMs ?? '—'} ms`,
          html: `<b>Done.</b> Day ${report.day} — ${report.date}<br/>Streak: <b>${report.streak}</b><br/>Grade: <b>${report.grade ?? '—'}</b><br/>Start latency: <b>${report.latencyMs ?? '—'} ms</b>`
        })
      });
    }catch{}
  }

  /* -------------------- Modular villain config -------------------- */
  loadVillainConfig();
  async function loadVillainConfig(){
    try{
      const r = await fetch('config/villain.json', { headers:{'Accept':'application/json'} });
      if (!r.ok) return;
      const v = await r.json();
      if (Array.isArray(v.seed) && v.seed.length) CFG.VILLAIN_SEED = v.seed;
      if (Array.isArray(v.prestart) && v.prestart.length) CFG.VILLAIN_PRESTART = v.prestart;
      if (Array.isArray(v.hype) && v.hype.length) CFG.VILLAIN_HYPE = v.hype;
      if (Array.isArray(v.shade) && v.shade.length) CFG.VILLAIN_SHADE = v.shade;
  if (Array.isArray(v.pocket) && v.pocket.length) CFG.VILLAIN_POCKET = v.pocket;
    }catch{}
  }

})();
// ---------- open-core helpers: villain mute, calendar moon, lobby fade
const VILLAIN_MUTED_KEY = "villain_muted";
function villainMuted(){ try { return localStorage.getItem(VILLAIN_MUTED_KEY) === "1"; } catch { return false; } }

export function initVillainMuteChip(){
  const btn = document.getElementById("villainMuteChip");
  if (!btn) return; // UI may not exist in some views
  const sync = () => btn.setAttribute("aria-pressed", villainMuted() ? "true" : "false");
  sync();
  btn.addEventListener("click", () => {
    try {
      localStorage.setItem(VILLAIN_MUTED_KEY, villainMuted() ? "0" : "1");
    } catch {}
    sync();
  });
}

export function villainMaybeSpeak(line){
  if (villainMuted()) return;
  // Integrate with existing sting/coach function if present
  if (typeof window !== 'undefined' && typeof window.stingVillain === 'function') {
    window.stingVillain(line || "Hook slid by… go write the one that sticks.");
  }
}

export function finishSessionRecord(base){
  const record = { ...base, allNighter: !!(base && base.allNighter) };
  const d = new Date(record.timestamp || Date.now());
  const key = d.toISOString().slice(0,10);
  const cell = document.getElementById(`day-${key}`);
  if (cell){
    const dot = cell.querySelector('.dot');
    if (dot){
      dot.classList?.add('active');
      if (record.allNighter) { dot.classList?.add('moon'); dot.title = "All-nighter 🌙"; }
    }
  }
  return record;
}

export   function fadeLobbyBackdrop(){
  const el = document.getElementById("lobbyBackdrop");
  if (el) el.classList.add("lobby-faded");
}

// Idle bounce for chat tab every 50s
(function villainIdleBounce(){
  const btn = document.getElementById('chatToggle');
  if (!btn) return;
  setInterval(()=>{
    try{
      if (window.gsap) window.gsap.to(btn, { y:-8, duration:0.22, yoyo:true, repeat:1, ease:'power1.out' });
      else { btn.style.transform='translateY(-8px)'; setTimeout(()=>btn.style.transform='', 240); }
    }catch{}
  }, 50_000);
})();

document.addEventListener('DOMContentLoaded', async () => {
  // Initialize mute chip and lobby fade if buttons exist
  initVillainMuteChip();
  document.getElementById('startBtn')?.addEventListener('click', fadeLobbyBackdrop);
  try { const { bootProPlugins } = await import('./pro-loader.js'); await bootProPlugins({ LS }); } catch {}
});
