/* THE NUKES — v4 Sidekick Dashboard
   - Non-interactive Leaflet + heat (Charlotte default)
   - Open-Meteo current weather (no key)
   - City slide-out (Nominatim; 1 rps + UA)
   - Start Work gate (7:00), streak+freeze, grade+charts
   - Villain chat corner (LLM-ready via OpenRouter OR rule-based)
   - Music: YouTube playlist @ 15% volume until Start -> fade out
   - White noise: LifeAt live toggle @ 15%
*/

(() => {
  'use strict';
  const $ = s => document.querySelector(s);

  /* -------------------- Config -------------------- */
  const CFG = {
    DEFAULT_CITY: { name:'Charlotte, NC', lat:35.2271, lon:-80.8431 },
    NOMINATIM_UA: 'TheNukes/1.0 (thenukessonsaday365.netlify.app)', // required UA (Nominatim policy)
    WEATHER_FIELDS: 'temperature_2m,weather_code,wind_speed_10m',
    ADHD_TIPS: [
      "Don’t plan 20 steps. Do the first step only.",
      "Low energy? Lower the bar: loop + simple drums.",
      "Front-load friction: set your bounce/pack timer now.",
      "If you stall, body-double: book Focusmate before you think.",
      "You’re allowed to make a bad song. The win is finishing.",
      "IG/FB closed. Music only. Keep it moving.",
      "Start tiny: 8 bars. Bounce. Expand only if time allows."
    ],
    VILLAIN_SEED: [
      "I started 20 minutes ago, champ.",
      "My manager tossed me a sample to flip. You still scrolling?",
      "Hook idea already bounced. Don’t get left.",
      "Cook up lil bro, I’m posting placements later. 😈",
      "Keep polishing — I’ll keep publishing. 🤑"
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
  const LS = {
    get city(){ return JSON.parse(localStorage.getItem('nk_city')||'null') },
    set city(v){ localStorage.setItem('nk_city', JSON.stringify(v)) },
    get streak(){ return +localStorage.getItem('nk_streak')||0 }, set streak(v){ localStorage.setItem('nk_streak', v) },
    get freezes(){ return +localStorage.getItem('nk_freezes')||0 }, set freezes(v){ localStorage.setItem('nk_freezes', v) },
    get grades(){ return JSON.parse(localStorage.getItem('nk_grades')||'[]') }, set grades(v){ localStorage.setItem('nk_grades', JSON.stringify(v)) },
    get latencies(){ return JSON.parse(localStorage.getItem('nk_lat')||'[]') }, set latencies(v){ localStorage.setItem('nk_lat', JSON.stringify(v)) },
    get heat(){ return JSON.parse(localStorage.getItem('nk_heat')||'[]') }, set heat(v){ localStorage.setItem('nk_heat', JSON.stringify(v)) },
    get llmKey(){ return localStorage.getItem('nk_or_key')||'' }, set llmKey(v){ localStorage.setItem('nk_or_key', v) },
    get llmModel(){ return localStorage.getItem('nk_or_model')||'mistralai/mistral-small' }, set llmModel(v){ localStorage.setItem('nk_or_model', v) },
  };

  /* -------------------- Clocks / headers -------------------- */
  setInterval(()=>{
    const n=new Date();
    $("#flipClock").textContent = `${String(n.getHours()).padStart(2,'0')}:${String(n.getMinutes()).padStart(2,'0')}`;
  }, 1000);

  $("#streak").textContent = LS.streak;
  $("#freezes").textContent = LS.freezes;
  $("#tipTag").textContent = pick(CFG.ADHD_TIPS);

  /* -------------------- Map (non-interactive) + heat -------------------- */
  let map = L.map('map', { dragging:false, touchZoom:false, scrollWheelZoom:false, doubleClickZoom:false, boxZoom:false, keyboard:false, zoomControl:false })
              .setView([CFG.DEFAULT_CITY.lat, CFG.DEFAULT_CITY.lon], 12);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:'&copy; OSM contributors'
  }).addTo(map);
  const heat = L.heatLayer(LS.heat, { radius:24, blur:18, maxZoom:17, minOpacity:.35 }).addTo(map);

  function setCity(city){
    LS.city = city;
    map.setView([city.lat, city.lon], 12);
    heat.addLatLng([city.lat, city.lon, 0.4]);
    LS.heat = [...LS.heat, [city.lat, city.lon, 0.4]].slice(-200);
    $("#cityInput").value = city.name;
    loadWeather(city.lat, city.lon, city.name);
  }
  setCity(LS.city || CFG.DEFAULT_CITY);

  /* -------------------- City slide-out -------------------- */
  $("#openCity").onclick = ()=> $("#cityPanel").classList.remove('hidden');
  $("#closeCity").onclick = ()=> $("#cityPanel").classList.add('hidden');

  $("#cityFind").onclick = async ()=>{
    const q = $("#cityInput").value.trim(); if(!q) return;
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(q)}`, {
      headers:{ 'Accept':'application/json', 'User-Agent': CFG.NOMINATIM_UA }
    }).then(r=>r.json()).catch(()=>null);
    if (res && res[0]) {
      setCity({ name:q, lat:+res[0].lat, lon:+res[0].lon });
      $("#cityPanel").classList.add('hidden');
    } else {
      toast("City not found.");
    }
  };
  $("#useGeo").onclick = ()=>{
    navigator.geolocation?.getCurrentPosition(pos=>{
      const {latitude:lat, longitude:lon} = pos.coords;
      setCity({ name:'Current Location', lat, lon });
      $("#cityPanel").classList.add('hidden');
    }, ()=> toast("Location blocked."));
  };

  /* -------------------- Weather -------------------- */
  async function loadWeather(lat, lon, label){
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=${CFG.WEATHER_FIELDS}`;
    const r = await safeJSON(url);
    if (!r?.current) { $("#weatherBox").textContent = `${label} — weather unavailable.`; return; }
    const w = r.current;
    $("#weatherBox").innerHTML = `<b>${label}</b> — Temp: <b>${w.temperature_2m}&deg;C</b> · Wind: ${w.wind_speed_10m} m/s · ${codeDesc(w.weather_code)}`;
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
  let t0 = Date.now(), started=false;
  setInterval(()=>{
    const rem = 7*60*1000 - (Date.now()-t0);
    $("#latencyCountdown").textContent = fmt(rem);
    if (rem <= 0) $("#latencyCountdown").style.color = '#ff6b6b';
  }, 250);

  $("#startBtn").onclick = ()=>{
    if (started) return;
    started = true;
    const latency = Date.now()-t0;
    $("#latencyMs").textContent = `${latency.toLocaleString()} ms`;
    $("#doneBtn").disabled = false;
    $("#messageBar").textContent = pick(CFG.ADHD_TIPS);
    LS.latencies = [...LS.latencies, latency].slice(-60);
    fadeOutMusic(); // music fade then stop
  };

  $("#doneBtn").onclick = ()=>{
    if (!started) return toast("Hit Start first.");
    started = false;
    LS.streak += 1; $("#streak").textContent = LS.streak;
    if (LS.streak % 7 === 0){ LS.freezes += 1; $("#freezes").textContent = LS.freezes; toast("🧊 Earned a freeze!"); }
    gearDrop();
    setTimeout(()=> showSuccess(), 1200);
    $("#doneBtn").disabled = true;
  };

  $("#freezeBtn").onclick = ()=>{
    if (LS.freezes<=0) return toast("No freezes yet. Earn one every 7 wins.");
    LS.freezes -= 1; $("#freezes").textContent = LS.freezes;
    LS.streak += 1; $("#streak").textContent = LS.streak;
    toast("🧊 Streak preserved.");
  };

  // Grade + CD grow
  $("#gradeSlider").addEventListener('input', ()=>{
    const v = +$("#gradeSlider").value;
    const s = 0.7 + (v/100)*0.9;
    $("#cd").style.transform = `scale(${s})`;
    $("#cd").style.filter = v>=50 ? "none" : "grayscale(80%)";
  });
  $("#saveGrade").onclick = ()=>{
    const v = +$("#gradeSlider").value;
    LS.grades = [...LS.grades, v].slice(-60);
    drawCharts(); toast("Saved.");
    if (v < 50) showFail();
  };

  /* -------------------- Villain chat corner -------------------- */
  const chat = {
    open:false,
    log: $("#chatLog"),
    form: $("#chatForm"),
    input: $("#chatInput"),
    kbd: $("#kbd"),
    mode(){ return LS.llmKey ? 'LLM' : 'Rule'; }
  };
  $("#chatToggle").onclick = ()=>{
    chat.open = !chat.open;
    $("#chatDock").classList.toggle('open', chat.open);
    $("#llmModeLabel").textContent = chat.mode()==='LLM' ? 'On' : 'Off';
    if (chat.open && chat.log.childElementCount===0) {
      pushMsg('bot', pick(CFG.VILLAIN_SEED));
    }
  };
  $("#saveLLM").onclick = ()=>{
    LS.llmKey = $("#openrouterKey").value.trim();
    LS.llmModel = $("#openrouterModel").value.trim() || 'mistralai/mistral-small';
    $("#llmModeLabel").textContent = chat.mode()==='LLM' ? 'On' : 'Off';
    toast('LLM settings saved.');
  };
  // sidekick keys wiggle
  document.addEventListener('keydown', e=>{
    const k = (e.key||'').toUpperCase();
    const el = chat.kbd?.querySelector(`[data-k="${k}"]`); if(!el) return;
    el.classList.add('active'); setTimeout(()=>el.classList.remove('active'), 70);
  });
  chat.form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const text = chat.input.value.trim(); if(!text) return;
    pushMsg('me', text); chat.input.value='';
    if (chat.mode()==='LLM'){
      try { const reply = await villainLLM(text); pushMsg('bot', reply); }
      catch{ pushMsg('bot', pick(CFG.VILLAIN_SEED)); }
    } else {
      pushMsg('bot', ruleReply(text));
    }
  });
  function pushMsg(who, text){
    const m = document.createElement('div');
    m.className = `msg ${who}`; m.textContent = (who==='bot'?'😈 ':'🫵 ')+text;
    chat.log.appendChild(m); chat.log.scrollTop = chat.log.scrollHeight;
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
    const sys = "You are a petty, funny, pocket-watching beat producer who bullies (lightly) but actually helps Will finish one song a day. Be blunt, short, urban tone, no fluff. Always push toward finishing.";
    const r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method:"POST",
      headers:{
        "Authorization": `Bearer ${key}`,
        "Content-Type":"application/json"
      },
      body: JSON.stringify({
        model, messages:[
          {role:"system", content:sys},
          {role:"user", content:user}
        ], temperature:0.7, max_tokens:120
      })
    });
    const json = await r.json();
    return json?.choices?.[0]?.message?.content?.trim() || pick(CFG.VILLAIN_SEED);
  }

  /* -------------------- Music / Noise (YouTube IFrame) -------------------- */
  let musicPlayer, noisePlayer, musicReady=false, noiseReady=false, musicVol=15, noiseVol=15;

  // Gate for autoplay w/ sound: user must click once (Chrome policy)
  $("#armAudio").onclick = ()=>{
    $("#armAudio").style.display='none';
    initYouTube(); // create players and start music quietly
  };

  // YouTube API callback
  window.onYouTubeIframeAPIReady = () => {
    // created on demand in initYouTube()
  };
  function initYouTube(){
    if (!musicPlayer){
      musicPlayer = new YT.Player('musicPlayer',{
        height:'0', width:'0',
        playerVars:{ autoplay:1, controls:0, rel:0, playsinline:1, mute:0 },
        events:{
          'onReady': onMusicReady,
          'onStateChange': onMusicState
        }
      });
    }
    if (!noisePlayer){
      noisePlayer = new YT.Player('noisePlayer',{
        height:'0', width:'0',
        playerVars:{ autoplay:0, controls:0, rel:0, playsinline:1, mute:0 },
        events:{
          'onReady': onNoiseReady
        }
      });
    }
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
    if (e.data === YT.PlayerState.PLAYING){
      try {
        const d = e.target.getVideoData();
        $("#npTitle").textContent = `${d.title || '—'}`;
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
  $("#toggleNoise").onclick = ()=>{
    if (!noisePlayer){ initYouTube(); return; }
    try{
      const s = noisePlayer.getPlayerState();
      if (s===YT.PlayerState.PLAYING){ noisePlayer.pauseVideo(); }
      else {
        const id = videoIdFromUrl(CFG.NOISE_LIFEAT);
        noisePlayer.loadVideoById(id);
        setVol(noisePlayer, noiseVol);
        noisePlayer.playVideo();
      }
    }catch{}
  };

  function playlistIdFromUrl(u){
    const m = u.match(/[?&]list=([^&]+)/); return m?m[1]:null;
  }
  function videoIdFromUrl(u){
    const m = u.match(/v=([^&]+)/); return m?m[1]:null;
  }

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
  function fmt(ms){ const s=Math.max(0,Math.ceil(ms/1000)); return `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`; }
  function toast(msg){
    const el=document.createElement('div');
    el.textContent=msg;
    el.style.cssText="position:fixed;bottom:18px;left:50%;transform:translateX(-50%);background:#131421;border:1px solid #24253a;color:#fff;padding:10px 14px;border-radius:12px;z-index:9999;font-weight:900";
    document.body.appendChild(el); setTimeout(()=>el.remove(),1800);
  }
  async function safeJSON(url){
    try{ const r=await fetch(url,{headers:{'Accept':'application/json'}}); if(!r.ok) throw new Error(r.status); return await r.json(); }
    catch(e){ console.warn('fetch',e); return null; }
  }

})();