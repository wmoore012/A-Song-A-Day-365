/* THE NUKES — v4 Sidekick Dashboard
   - Non-interactive Leaflet + heat (Charlotte default)
   - Open-Meteo current weather (no key)
   - City slide-out (Nominatim; 1 rps + UA)
   - Start Work gate (7:00), streak+freeze, grade+charts
   - Villain chat corner (LLM-ready via OpenRouter OR rule-based)
   - Music: YouTube playlist @ 15% volume until Start -> fade out
   - White noise: LifeAt live toggle @ 15%
*/

import { playlistIdFromUrl, videoIdFromUrl, clampMultiplier, rotatePick } from './web-utils.js';
import { LS } from './storage.js';
import { api } from './api.js';

(() => {
  'use strict';
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
    // Competitive, passive‑aggressive AAVE tone; no sports metaphors
    VILLAIN_SEED: [
      "I started already. You still debating?",
      "Got a sample flipped. You still window‑shopping?",
      "Hook’s bounced. Catch up.",
      "I’m posting placements later. Don’t get left.",
      "Keep polishing—I’ll keep publishing.",
      "I move. You muse. See the difference?",
      "Quiet grind > loud plans. What you on?",
      "Timers runnin’. Your excuses too?",
      "Catalog grows when you stop overthinking.",
      "You still curating vibes instead of making one?",
      "I got stems zipped already. You still auditioning kicks.",
      "Talk less, bounce more.",
      "Idea down, drums on. You comin’ or what?",
      "You busy scrolling. I’m busy shipping.",
      "Less pretend, more print.",
    ],
    VILLAIN_PRESTART: [
      "Start the timer. Loops don’t cook themselves.",
      "Quit stalling. Put one idea down—then build.",
      "Talking won’t bounce a track. Press start.",
      "Open DAW, pick a loop, drums, go.",
      "First move: eight bars, no detours.",
      "Clock’s live. Put numbers on the board—quietly.",
      "Keep it simple, ship it. Then flex.",
      "Load the kit, not another tab.",
      "No grand plan. One section, print it.",
      "Set a limiter: 30 mins, export no matter what.",
      "You know the recipe. Stop remixing the checklist.",
      "Minimal chain. Max output.",
      "Reference last win. Repeat the steps.",
      "One hook. One bounce. Next.",
      "You ain’t stuck. You bored. Move.",
    ],
    VILLAIN_HYPE: [
      "Clean bounce. That’s grown work.",
      "Kept it simple and shipped. Respect.",
      "Bag secured. Next one.",
      "Catalog up one. Keep moving.",
      "You executed, not fantasized. That’s it.",
      "Quiet cook, loud results.",
      "You don’t chase perfect, you chase done.",
      "Real discipline. I see it.",
      "You made it easy on yourself. That’s mastery.",
      "Routine hittin’.",
      "Clocked in, clocked out, product shipped.",
      "You treated it like a job. That’s why it’s working.",
      "You left nothing cute—just the export.",
      "Numbers moving up. Keep it boring, keep it winning.",
      "That’s momentum.",
    ],
    VILLAIN_SHADE: [
      "You polishing excuses. Arrange and bounce.",
      "Too many tabs, not enough exports.",
      "You scrolling like it pays. It doesn’t.",
      "Close IG. Open that chorus.",
      "Stop auditioning. Pick one and commit.",
      "You busy, not productive. Fix that.",
      "All preview, no print—classic.",
      "You tweaking solo’d hats again? C’mon.",
      "If it ain’t exporting, it’s just stalling.",
      "Playlist curator vibes. Producer? Prove it.",
      "Loop been looping. When you gon’ bounce?",
      "You love ‘almost’. Try ‘done’.",
      "That’s not research, that’s hiding.",
      "Less taste‑testing, more plate‑serving.",
      "Cut the cute. Ship the song.",
    ],
    RARE_DROP_RATE: 0.15,
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
    // Music playlist (full YouTube links OK). We’ll cycle if one fails.
    MUSIC_PLAYLIST: [
      "https://www.youtube.com/watch?v=b0wbCtrGjXA",
      "https://music.youtube.com/watch?v=rxlHSy3b-jI",
      "https://music.youtube.com/watch?v=RtCsmozSF3Y",
      "https://music.youtube.com/watch?v=t_M6TbnDOCE",
      "https://music.youtube.com/watch?v=BT2DTjTmG9I"
    ],
    // Your premade playlist (preferred; fallback to above if blocked)
    MUSIC_PLAYLIST_FALLBACK: "https://www.youtube.com/playlist?list=PLl-ShioB5kapLuMhLMqdyx_gKX_MBiXeb",
    NOISE_LIFEAT: "https://www.youtube.com/live/xdJ58r0k340"
  };

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
  // init multiplier UI
  updateMultiplier(LS.mult);

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
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=${CFG.WEATHER_FIELDS}&timezone=auto`;
  const r = await api.getJSON(url).catch(()=>null);
  if (!r?.current) { setText('#weatherBox', `${label} — weather unavailable.`); return; }
    const w = r.current;
  setHTML('#weatherBox', `<b>${label}</b> — Temp: <b>${w.temperature_2m}&deg;C</b> · Wind: ${w.wind_speed_10m} m/s · ${codeDesc(w.weather_code)}`);
    lastWeather = {
      city: label,
      lat,
      lon,
      code: w.weather_code,
      temp_c: w.temperature_2m,
      wind: w.wind_speed_10m
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
  setInterval(()=>{
    const rem = 7*60*1000 - (Date.now()-t0);
    setText('#latencyCountdown', fmt(rem));
    if (rem <= 0) { const el=$("#latencyCountdown"); if (el) el.style.color = '#ff6b6b'; }
  }, 250);

  // One-time pre-start sting in the message bar
  const preTaunt = ()=> setText('#messageBar', rotPick('pre'));
  preTaunt();

  { const el = $("#startBtn"); if (el) el.onclick = ()=>{
    if (started) return;
    started = true;
    const latency = Date.now()-t0;
  setText('#latencyMs', `${latency.toLocaleString()} ms`);
    const db=$("#doneBtn"); if (db) db.disabled = false;
    setText('#messageBar', pick(CFG.ENCOURAGEMENT_TIPS));
    LS.latencies = [...LS.latencies, latency].slice(-60);
    fadeOutMusic(); // music fade then stop
  startIso = new Date().toISOString();
  // Small start sting
  stingVillainMaybeLLM(rotPick('pre'));
  }; }

  { const el = $("#doneBtn"); if (el) el.onclick = async ()=>{
    if (!started) return toast("Hit Start first.");
    started = false;
  LS.streak += 1; setText('#streak', LS.streak);
  if (LS.streak % 7 === 0){ LS.freezes += 1; setText('#freezes', LS.freezes); toast("🧊 Earned a freeze!"); }
  gearDrop();
  // show survey before success overlay
  const survey = document.getElementById('surveyModal');
  if (survey) survey.classList.remove('hidden');
    const db=$("#doneBtn"); if (db) db.disabled = true;

    // Notion snapshot with 1/day guard + retry
    try {
      const igClosed = $("#igClosed")?.checked || false;
      const fbClosed = $("#fbClosed")?.checked || false;
      const ytConsidered = $("#ytConsidered")?.checked || false;
      const gradeVal = +$("#gradeSlider")?.value || null;
      const latencyMs = LS.latencies.slice(-1)[0] || null;
      const today = new Date().toISOString().slice(0,10);
      const willIncrement = LS.lastDay !== today;
      const dayIdxToSend = willIncrement ? (LS.dayIndex||0)+1 : LS.dayIndex;
      const body = {
        type: 'session_done',
        date: today,
        day_index: dayIdxToSend,
        streak_after: LS.streak,
        freezes: LS.freezes,
        freeze_used: !!freezeUsedToday,
        latency_ms: latencyMs,
        grade: gradeVal,
        survey_choice: (localStorage.getItem('nk_survey_choice')||'') || null,
        survey_note: (localStorage.getItem('nk_survey_note')||'') || null,
        ig_closed: igClosed,
        fb_closed: fbClosed,
        yt_closed: ytConsidered,
        start_time_iso: startIso,
        start_epoch_ms: startIso ? Date.parse(startIso) : null,
        weather: lastWeather || (LS.city ? { city: LS.city.name, lat: LS.city.lat, lon: LS.city.lon } : {})
      };
  const { ok } = await api.postNotionWithRetry(body);
  if (!ok) {
        toastBad('Notion sync failed.');
      } else {
        toastGoodPager('Synced');
        if (willIncrement){ LS.dayIndex = dayIdxToSend; LS.lastDay = today; }
        // fire-and-forget accountability email
        sendAccountabilityEmail({ day: LS.dayIndex, date: today, streak: LS.streak, grade: gradeVal, latencyMs });
        freezeUsedToday = false;
      }
    } catch {}
  }; }

  // Survey handlers
  document.getElementById('submitSurvey')?.addEventListener('click', ()=>{
    const v = document.querySelector('input[name="surveyChoice"]:checked');
    const note = document.getElementById('surveyNote');
    localStorage.setItem('nk_survey_choice', v?.value || '');
    localStorage.setItem('nk_survey_note', note?.value || '');
    document.getElementById('surveyModal')?.classList.add('hidden');
    setTimeout(()=> showSuccess(), 400);
  });
  document.getElementById('skipSurvey')?.addEventListener('click', ()=>{
    localStorage.removeItem('nk_survey_choice');
    localStorage.removeItem('nk_survey_note');
    document.getElementById('surveyModal')?.classList.add('hidden');
    setTimeout(()=> showSuccess(), 200);
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
  scheduleNudge(29*60*1000, 41*60*1000, () => { stingVillainMaybeLLM(rotPick('shade')); openNudge(); });
  scheduleNudge(60*60*1000, 100*60*1000, () => { stingVillainMaybeLLM(rotPick('shade')); openNudge(); });

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
        stingVillain(rotPick('shade'));
        hintPrompt();
      } else {
        bumpMultiplier(+3);
        stingVillain(rotPick('hype'));
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
  setText('#llmModeLabel', chat.mode()==='LLM' ? 'On' : 'Off');
    if (chat.open && chat.log && chat.log.childElementCount===0) {
      pushMsg('bot', pick(CFG.VILLAIN_SEED));
    }
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
      catch { pushMsg('bot', pick(CFG.VILLAIN_SEED)); }
    } else {
    pushMsg('bot', ruleReply(text));
    }
  });
  function pushMsg(who, text){
    const m = document.createElement('div');
    m.className = `msg ${who}`; m.textContent = (who==='bot'?'😈 ':'🫵 ')+text;
    if (!chat.log) return; chat.log.appendChild(m); chat.log.scrollTop = chat.log.scrollHeight;
  }
  function ruleReply(txt){
    // super simple attitude — keeps you moving
    const lower = txt.toLowerCase();
    if (lower.includes('tired')||lower.includes('low')) return "Lower the bar. Loop it, drums, bounce. Finish then nap.";
    if (lower.includes('youtube')) return "YT considered? Use Music only. Don’t derail.";
    if (lower.includes('mix')) return "Don’t mix the song. Finish, bounce, pack. Next.";
    return pick(CFG.VILLAIN_SEED);
  }
  async function villainLLM(user){
    const key = LS.llmKey; const model = LS.llmModel;
    const sys = [
      "Role: Pocket-watching producer sidekick (villain).",
      "Goal: Push to finish one song today. Keep it short, blunt, funny. No cornball, no motivational posters.",
      "Style: Competitive, passive‑aggressive AAVE for music. Avoid slurs and disrespect to groups. Keep it playful, not cruel.",
      "Constraints: 1-2 sentences max. No emojis (unless user uses them). Always point to an action (loop, drums, bounce, arrange, post)."
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
    return json?.choices?.[0]?.message?.content?.trim() || pick(CFG.VILLAIN_SEED);
  }

  /* -------------------- Music / Noise (YouTube IFrame) -------------------- */
  let musicPlayer, noisePlayer, hintPlayer;
  let musicReady=false, noiseReady=false, hintReady=false;
  let musicVol=15, noiseVol=15;
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
          playerVars:{ autoplay:1, controls:0, rel:0, playsinline:1, mute:0 },
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
    playPlaylist(e, CFG.MUSIC_PLAYLIST_FALLBACK, CFG.MUSIC_PLAYLIST);
    setVol(musicPlayer, musicVol);
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
    // Track title
    if (e?.data === (window.YT?.PlayerState?.PLAYING)){
      try {
        const d = e.target.getVideoData();
  const np=document.getElementById(EL.nowPlaying); if (np) np.textContent = `${d?.title || '—'}`;
      } catch { /* ignore */ }
    }
  }
  function onNoiseReady(e){
    noiseReady=true;
    // don't autostart; controlled by button
    setVol(noisePlayer, noiseVol);
  }
  function setVol(player, pct){
    try{ player.setVolume(Math.max(0, Math.min(100, pct))); }catch{}
  }
  function fadeOutMusic(){
    if (!musicPlayer||!musicReady) return;
    let v = musicVol;
    const tick = setInterval(()=>{
      v = Math.max(0, v-3);
      setVol(musicPlayer, v);
      if (v<=0){ clearInterval(tick); try{ musicPlayer.pauseVideo(); }catch{} }
    }, 120);
  }
  { const el = $("#toggleNoise"); if (el) el.onclick = ()=>{
    if (!noisePlayer){ initYouTubeOnce(); return; }
    try{
      const s = noisePlayer.getPlayerState();
      if (s===(window.YT?.PlayerState?.PLAYING)){ noisePlayer.pauseVideo(); }
      else {
        const id = videoIdFromUrl(CFG.NOISE_LIFEAT);
        noisePlayer.loadVideoById(id);
        setVol(noisePlayer, noiseVol);
        noisePlayer.playVideo();
      }
    }catch{}
  }; }

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
    // fade out music if playing
    fadeOutMusic();
    // load a fresh hint
  const v = rotPickHint();
  if (hintPlayer && v){ try{ hintPlayer.loadVideoById(v); }catch{} }
  const a = document.getElementById('openInYoutube');
  if (a && v){ a.href = openInYouTubeHrefFor(v); }
  }
  function closeHints(){ document.getElementById('hintsModal')?.classList.add('hidden'); try{ hintPlayer?.pauseVideo(); }catch{} }
  window.openHints = openHints; window.closeHints = closeHints;
  function rotPickHint(){
    if (!HINTS.length) return null;
    const i = (+localStorage.getItem('nk_rot_hint')||0) % HINTS.length;
    localStorage.setItem('nk_rot_hint', (i+1) % HINTS.length);
    return videoIdFromUrl(HINTS[i]);
  }
  async function loadHintsConfig(){
    try{
      const r = await fetch('config/hints.json', { headers:{'Accept':'application/json'} });
      if (r.ok){ const j = await r.json(); if (Array.isArray(j?.videos)) HINTS = j.videos; }
    }catch{}
    // fallback examples if none
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
    $("#rewardTitle").textContent = rare ? "🌟 RARE Gear Drop" : "🎁 Gear Drop";
    $("#rewardGif").src = gif;
    $("#rewardCap").textContent = rare ? "Limited run. Flex quietly and keep working." : "Pocket this and move on.";
    $("#rewardModal").classList.remove('hidden');
  }
  window.closeReward = ()=> $("#rewardModal").classList.add('hidden');

  function showSuccess(){
    $("#successGif").src = CFG.GIFS.SUCCESS_HOME;
    $("#successHome").classList.remove('hidden');
  }
  window.closeSuccess = ()=> $("#successHome").classList.add('hidden');

  function showFail(){
    $("#failGif").src = CFG.GIFS.FAIL_HOME;
    $("#willGif").src = CFG.GIFS.WILL_PLACEHOLDER;
    $("#failHome").classList.remove('hidden');
  }
  window.closeFail = ()=> $("#failHome").classList.add('hidden');

  function showRun(){
    $("#runGif").src = pick(CFG.GIFS.RUN);
    $("#runOverlay").classList.remove('hidden');
  }
  window.closeRun = ()=> $("#runOverlay").classList.add('hidden');

  /* -------------------- Utils -------------------- */
  function pick(arr){ return arr[Math.floor(Math.random()*arr.length)] }
  function rotPick(kind){
    const map = { pre:['VILLAIN_PRESTART','rotPre'], hype:['VILLAIN_HYPE','rotHype'], shade:['VILLAIN_SHADE','rotShade'], seed:['VILLAIN_SEED','rotSeed'] };
    const [arrName, idxKey] = map[kind]||[];
    const pool = CFG[arrName]||[]; if (!pool.length) return '';
    const i = (LS[idxKey]||0) % pool.length;
    LS[idxKey] = (i+1) % pool.length;
    return pool[i];
  }
  function stingVillainMaybeLLM(text){
    // occasionally replace with LLM if configured
    const doLLM = LS.llmKey && Math.random() < 0.22;
    if (!doLLM){ stingVillain(text); return; }
    villainLLM(text).then(reply=> stingVillain(reply)).catch(()=> stingVillain(text));
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
  function stingVillain(text){
    const box=document.createElement('div'); box.className='villain-toast';
    const hdr=document.createElement('div'); hdr.className='hdr'; hdr.innerHTML='😈 Villain';
    const msg=document.createElement('div'); msg.className='msg'; msg.textContent=text;
    box.appendChild(hdr); box.appendChild(msg);
    document.body.appendChild(box);
    setTimeout(()=>box.remove(), 3000);
  }
  function scheduleNudge(minDelay, maxDelay, fn){
    const wait = Math.floor(minDelay + Math.random()*(maxDelay-minDelay));
    setTimeout(()=>{ if (started) fn(); }, wait);
  }
  function updateMultiplier(v){
    const el = document.getElementById('multVal'); const bar = document.getElementById('multBar');
    const cv = clampMultiplier(v, 0, 200);
    if (el) el.textContent = `${cv}%`;
    if (bar) bar.style.width = `${Math.max(0, Math.min(100, cv))}%`;
  }
  function bumpMultiplier(delta){ LS.mult = clampMultiplier(LS.mult + delta, 0, 200); updateMultiplier(LS.mult); }
  // JSON + retry moved to api.js

  /* -------------------- Action Nudge modal -------------------- */
  function openNudge(){ document.getElementById('nudgeModal')?.classList.remove('hidden'); }
  function closeNudge(){ document.getElementById('nudgeModal')?.classList.add('hidden'); }
  window.closeNudge = closeNudge;
  document.getElementById('nudgeMoreTime')?.addEventListener('click', ()=>{
    closeNudge(); bumpMultiplier(-10); stingVillain(rotPick('shade')); hintPrompt();
  });
  document.getElementById('nudgeEightBar')?.addEventListener('click', ()=>{
    closeNudge(); bumpMultiplier(+5); stingVillain(rotPick('hype'));
  });
  document.getElementById('nudgeFocusmate')?.addEventListener('click', ()=>{
    closeNudge(); bumpMultiplier(+3); window.open('https://www.focusmate.com/', '_blank');
  });
  document.getElementById('nudgeCloseSocial')?.addEventListener('click', ()=>{
    closeNudge(); bumpMultiplier(+4); stingVillain("Lock in. Tabs down, faders up.");
  });

  /* -------------------- Settings (emails) -------------------- */
  document.getElementById('openSettings')?.addEventListener('click', ()=>{
    const el = document.getElementById('acctEmails');
    if (el) el.value = (LS.emails||[]).join(', ');
    document.getElementById('settingsPanel')?.classList.remove('hidden');
  });
  document.getElementById('closeSettings')?.addEventListener('click', ()=>{
    document.getElementById('settingsPanel')?.classList.add('hidden');
  });
  document.getElementById('saveSettings')?.addEventListener('click', ()=>{
    const raw = (document.getElementById('acctEmails')?.value||'').split(',').map(s=>s.trim()).filter(Boolean);
    LS.emails = raw; toastGoodPager('Settings saved');
    document.getElementById('settingsPanel')?.classList.add('hidden');
  });

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
    }catch{}
  }

})();