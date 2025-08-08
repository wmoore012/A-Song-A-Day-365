/* THE NUKES — V2.2 logic (fonts, villain intro, Focusmate, better tips)
   Requires: Leaflet 1.9.4, leaflet.heat, Chart.js 4.x — loaded in Head */

/* ---------- BOOTSTRAP: render the markup at runtime ---------- */
(function bootstrapMarkup(){
  const root = document.getElementById('saday');
  if (!root || root.children.length) return;
  root.classList.add('saday');
  root.innerHTML = `
    <div class="row">
      <div class="title">THE NUKES — <span id="dayLabel">Day ?</span> <span class="muted">Start gate</span></div>
      <div class="header-right">
        <div class="chip"><span>🔥 Streak:</span><span id="streakCount">0</span></div>
        <div class="chip"><span>🧊 Freezes:</span><span id="freezeCount">0</span></div>
      </div>
    </div>

    <div class="card">
      <div class="row" style="justify-content:space-between">
        <div>
          <div class="muted small">Real ADHD tip of the session</div>
          <div id="adhdTip" style="font-weight:800; font-size:16px; margin-top:6px;">Pick the first step and do only that.</div>
        </div>
        <button id="newTip" class="btn-secondary" aria-label="New tip">♻️ New</button>
      </div>
    </div>

    <div class="card">
      <div class="row" style="justify-content:space-between">
        <div>
          <div class="muted small">You’ve got 7:00 to lock in. Don’t stall.</div>
          <div class="flip" id="latencyCountdown">07:00</div>
          <div class="muted small">Task start latency: <span id="latencyMs" class="stat">—</span></div>
        </div>
        <div class="row">
          <button id="startSession" class="btn-good">🚀 Start Work</button>
          <button id="markDone" class="btn">🎉 Mark Done</button>
        </div>
      </div>
      <div id="msgBox" class="msgbox neutral" style="margin-top:12px">I’m here. One sound. Move forward. No mixing.</div>
    </div>

    <div class="grid">
      <div class="card">
        <div class="title" style="font-size:16px;">Checks</div>
        <div class="divider"></div>
        <label class="toggle"><input type="checkbox" id="closedIg"> IG CLOSED</label><br/>
        <label class="toggle"><input type="checkbox" id="closedFb"> FACEBOOK CLOSED</label><br/>
        <label class="toggle"><input type="checkbox" id="closedYt"> YT CONSIDERED</label>
        <div class="row" style="margin-top:10px;">
          <a class="btn" href="https://music.youtube.com/" target="_blank" rel="noopener">🎵 YouTube Music</a>
          <a class="btn" href="https://youtube.com/playlist?list=PLl-ShioB5kapDf5pXDxe2_FpNiTCQdVAO&si=ADssb7QlTymc-169" target="_blank" rel="noopener">🏠 Studio Vibes</a>
          <a class="btn" href="https://www.focusmate.com/" target="_blank" rel="noopener">👥 Focusmate</a>
        </div>
      </div>

      <div class="card">
        <div class="title" style="font-size:16px;">Session Clock & Weather</div>
        <div class="divider"></div>
        <div class="row" style="gap:8px;">
          <input id="cityInput" placeholder="Enter city (e.g., Charlotte, NC)" type="text">
          <button id="findCity" class="btn-secondary">📍 Search</button>
          <button id="useGeo" class="btn-secondary">🛰️ Use My Location</button>
          <div class="chip"><span>⏱️ Clock:</span><span class="flip" id="flipClock">00:00</span></div>
        </div>
        <div id="weatherBox" class="muted small" style="margin-top:8px">—</div>
        <div id="map" style="margin-top:10px"></div>
      </div>
    </div>

    <div class="card">
      <div class="title" style="font-size:16px;">Song details</div>
      <div class="divider"></div>
      <div class="row"><label class="toggle"><input type="checkbox" id="sameSong" checked> Same song for lyrics + beat</label></div>
      <div class="grid" style="margin-top:8px">
        <div><input id="songLyrics" type="text" placeholder="Song I wrote lyrics to"></div>
        <div id="beatWrap"><input id="songBeat" type="text" placeholder="Song I made a beat for"></div>
      </div>
    </div>

    <div class="card">
      <div class="title">Insights</div>
      <div class="divider"></div>
      <div class="grid">
        <div>
          <canvas id="chart1" height="220" aria-label="Success grade trend"></canvas>
          <div class="muted small">Success grade (last 14 sessions)</div>
        </div>
        <div>
          <canvas id="chart2" height="220" aria-label="Start latency trend"></canvas>
          <div class="muted small">Start latency (ms) — lower is better</div>
        </div>
      </div>
      <div class="row" style="margin-top:8px"><span class="muted small">Weather recap GIF:</span><img id="weatherGif" style="height:90px;border-radius:12px"/></div>
    </div>

    <div class="card">
      <div class="title" style="font-size:16px;">Grade your day</div>
      <div class="divider"></div>
      <div class="row" style="align-items:flex-end; justify-content:space-between">
        <div>
          <input id="gradeSlider" type="range" min="0" max="100" value="60" style="width:320px">
          <div class="muted small">Slide to score 0–100. Keep it honest.</div>
        </div>
        <div class="cd-grow" id="cdGrow">💿</div>
        <button id="saveGrade" class="btn-secondary">Save Grade</button>
      </div>
    </div>

    <!-- Overlays -->
    <div class="overlay" id="villainOverlay">
      <div class="modal-card">
        <h3>😈 “Cook up time, right?”</h3>
        <div id="villainLines" class="muted" style="font-weight:800; margin:10px 0 12px"></div>
        <button id="villainGo" class="btn-good">I’m starting. Watch me.</button>
      </div>
    </div>

    <div class="overlay" id="runOverlay">
      <div class="modal-card">
        <h3>🏃 RUN!</h3>
        <img id="runGif" class="reward-img" alt="Run">
        <button class="btn-good" onclick="document.getElementById('runOverlay').style.display='none'">On it</button>
      </div>
    </div>

    <div class="overlay" id="successHomeOverlay">
      <div class="modal-card">
        <h3>Wrap. We’re out. ✅</h3>
        <img id="successHomeGif" class="reward-img" alt="Success Home">
        <button class="btn-good" onclick="document.getElementById('successHomeOverlay').style.display='none'">Peace</button>
      </div>
    </div>

    <div class="overlay" id="failHomeOverlay">
      <div class="modal-card" style="display:flex; gap:12px; align-items:center;">
        <div style="flex:1">
          <h3 class="danger">We failed today.</h3>
          <img id="failHomeGif" class="reward-img" alt="Fail Home">
        </div>
        <div class="wall" aria-hidden="true"></div>
        <div style="flex:1">
          <div class="muted">Villain watching from the sidelines. Tighten up tomorrow.</div>
          <img id="willGif" class="reward-img" alt="Will (placeholder)">
        </div>
        <button class="btn-bad" style="margin-top:10px" onclick="document.getElementById('failHomeOverlay').style.display='none'">I’ll fix it</button>
      </div>
    </div>

    <div id="spriteTip">Need a nudge? Start with ONE sound. Loop it. Build from there.</div>
    <canvas id="confetti" class="confetti"></canvas>
    <div class="emoji-sprite" id="spriteKey" title="Start with one sound.">🎹</div>
    <div class="emoji-sprite second">🔊</div>
  `;
})();

/* ---------- App Logic ---------- */
(() => {
  'use strict';
  const $ = s => document.querySelector(s);

  const CFG = {
    RARE_DROP_RATE: 0.15,
    NOTION_WEBHOOK_URL: "", // set to your serverless relay when ready
    ADHD_TIPS: [
      // Evidence-backed patterns: implementation intentions, body doubling, BA
      "If phone in hand → flip it face-down, set 25-min Focusmate. Start.",  // body doubling/implementation intentions
      "Feeling lonely? Open Focusmate. Camera on, one sentence in chat, go.", // body doubling/social presence
      "Low energy? 60s movement + water + pick a LOOP. No mixing.", // behavioral activation
      "One micro-goal: 4 bars drums or 1 hook idea. Ship that.", 
      "Gate your tools: studio vibes playlist on, socials off.",
      "If you open IG/FB → close → press Start again.",
      "Bounce early. Buffer time is non-negotiable.",
      "You aren’t a good judge mid-build. Finish; evaluate tomorrow."
    ],
    GIFS: {
      RUN: [
        "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3bTUwbzlxZ2pmYzNuYnZucDY1c3J0emU5c2I5MHFoa3NwNm01MmlvbCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/TJaNCdTf06YvwRPCge/giphy.gif",
        "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaHo5Y215Z3M2ZjF1YW54cmttaGtnZXZwZ2M5N3Y2ajliMWljb3dubiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/ypugC2vCJMqyXrSfzS/giphy.gif"
      ],
      POWERUP:"https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3bnYwanJhNTBpN3V1bHFidG96MXA3M214ejZpczhkOXdlZHRmMDFmYSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/ekBL7F6GgOaxsPKkIU/giphy.gif",
      SUCCESS_HOME:"https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3OTMxczJ4cXJsdWVheGcxbXltaHhwbHJhb3pienF1MnhjZG1sdzF6eCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/2X88cdOqfloof9Tht1/giphy.gif",
      FAIL_HOME:"https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3ZGZtN242cHd4MjdqbDByaThmbWdiOW50dWhsY3p1NXRzeW9rNndqaiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/OSuaE6AknuRc7syZXp/giphy.gif",
      WILL_PLACEHOLDER:"https://media.giphy.com/media/l0HU2s0vG3q8b2T9e/giphy.gif"
    },
    REWARD_GIF_URLS:{
      common:[
        "https://media.giphy.com/media/3ohzdM9W0kZ5p7T1Di/giphy.gif",
        "https://media.giphy.com/media/3o6Zt6ML6BklcajjsA/giphy.gif",
        "https://media.giphy.com/media/3ohhwi1q9lN1NsxTLa/giphy.gif",
        "https://media.giphy.com/media/l3vRk9B8g2cM3rj1W/giphy.gif"
      ],
      rare:[
        "https://media.giphy.com/media/1xkA4rpsDQn3e/giphy.gif",
        "https://media.giphy.com/media/l0HU2s0vG3q8b2T9e/giphy.gif"
      ]
    },
    MAP_TILES:{ url:"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", attr:'&copy; OpenStreetMap contributors' },
    VILLAIN_LINES:[
      "“Oh we cookin’? I already flipped a sample. Manager sent the pack.”",
      "“I got this hook idea—crazy catchy. You might wanna hurry, big bro.”",
      "“I started ten minutes ago. Placements don’t win themselves.”",
      "“You mixing already? Cute. I’m finishing.”",
      "“Clock’s running—don’t let me beat you *again*.”"
    ]
  };

  /* ---------- Local state ---------- */
  const LS = {
    get nDone(){ return +localStorage.getItem("saday_done_count")||0 }, set nDone(v){ localStorage.setItem("saday_done_count", String(v)); },
    get streak(){ return +localStorage.getItem("saday_streak")||0 }, set streak(v){ localStorage.setItem("saday_streak", String(v)); },
    get freezes(){ return +localStorage.getItem("saday_freezes")||0 }, set freezes(v){ localStorage.setItem("saday_freezes", String(v)); },
    get dayIndex(){ return +localStorage.getItem("saday_day_index")||1 }, set dayIndex(v){ localStorage.setItem("saday_day_index", String(v)); },
    get lastLatencyMs(){ return +localStorage.getItem("saday_last_latency_ms")||0 }, set lastLatencyMs(v){ localStorage.setItem("saday_last_latency_ms", String(v)); },
    get grades(){ return JSON.parse(localStorage.getItem("saday_grades")||"[]") }, set grades(v){ localStorage.setItem("saday_grades", JSON.stringify(v)); },
    get latencies(){ return JSON.parse(localStorage.getItem("saday_latencies")||"[]") }, set latencies(v){ localStorage.setItem("saday_latencies", JSON.stringify(v)); },
    get heatPoints(){ return JSON.parse(localStorage.getItem("saday_heat")||"[]") }, set heatPoints(v){ localStorage.setItem("saday_heat", JSON.stringify(v)); },
    get lastWeather(){ return JSON.parse(localStorage.getItem("saday_last_weather")||"null") }, set lastWeather(v){ localStorage.setItem("saday_last_weather", JSON.stringify(v)); },
    pushHeat(pt){ const a=this.heatPoints; a.push(pt); this.heatPoints=a; }
  };

  /* ---------- Seed UI ---------- */
  const dayLabel=$("#dayLabel"), sc=$("#streakCount"), fc=$("#freezeCount");
  if (dayLabel) dayLabel.textContent = `Day ${LS.dayIndex}`;
  if (sc) sc.textContent = LS.streak;
  if (fc) fc.textContent = LS.freezes;

  const setTip = ()=> { const el=$("#adhdTip"); if(el) el.textContent = CFG.ADHD_TIPS[Math.floor(Math.random()*CFG.ADHD_TIPS.length)]; };
  setTip(); $("#newTip")?.addEventListener("click", setTip);

  const say = (text, tone="neutral") => { const box=$("#msgBox"); if(!box) return; box.textContent=text; box.className=`msgbox ${tone}`; };

  /* ---------- Villain intro ---------- */
  (function villainIntro(){
    const ov=$("#villainOverlay"), box=$("#villainLines"), btn=$("#villainGo"); if(!ov||!box||!btn) return;
    let i=0;
    const next=()=>{ box.textContent = CFG.VILLAIN_LINES[i%CFG.VILLAIN_LINES.length]; i++; };
    next();
    const t=setInterval(next, 1400);
    const close=()=>{ clearInterval(t); ov.style.display="none"; say("Prove him wrong. One sound. Go.", "good"); };
    btn.addEventListener("click", close);
    // show it a moment after load so layout is ready
    setTimeout(()=> ov.style.display="flex", 300);
  })();

  /* ---------- Latency ticker (7:00) ---------- */
  const t0 = Date.now(); let started=false, lastGrade=null;
  const fmt = ms => { const s=Math.max(0,Math.ceil(ms/1000)); const m=String(Math.floor(s/60)).padStart(2,"0"); const r=String(s%60).padStart(2,"0"); return `${m}:${r}`; };
  setInterval(()=>{ const el=$("#latencyCountdown"); if(!el) return; const rem=7*60*1000-(Date.now()-t0); el.textContent=fmt(rem); if(rem<=0) el.classList.add("danger"); }, 250);

  /* ---------- Start / Done ---------- */
  $("#startSession")?.addEventListener("click", ()=>{
    if (started) return; started=true;
    LS.lastLatencyMs = Date.now()-t0;
    $("#latencyMs").textContent=`${LS.lastLatencyMs.toLocaleString()} ms`;
    const btn=$("#startSession"); btn.textContent="⏱️ Locked In"; btn.disabled=true;
    confettiBurst();
    say("Lock in: 4 bars or 1 hook. No mixing.", "good");
    trySendWebhook({type:"session_started", latency_ms:LS.lastLatencyMs, day_index:LS.dayIndex, ts:new Date().toISOString(),
      ig_closed:$("#closedIg")?.checked||false, fb_closed:$("#closedFb")?.checked||false, yt_closed:$("#closedYt")?.checked||false
    });
  });

  $("#markDone")?.addEventListener("click", ()=>{
    if(!started){ alert("Start first."); return; }
    LS.nDone++; LS.streak++; sc.textContent=LS.streak;
    if(LS.streak%7===0){ LS.freezes++; fc.textContent=LS.freezes; say("🧊 Earned a streak freeze.", "good"); }
    confettiBurst(); gearDrop(); powerUpFlash();

    // collect song info
    const same=$("#sameSong").checked;
    const lyrics=$("#songLyrics").value?.trim()||"";
    const beat=$("#songBeat").value?.trim()||lyrics;

    const payload = {
      type:"session_done",
      day_index:LS.dayIndex,
      date: new Date().toISOString().slice(0,10),
      streak_after:LS.streak, freezes:LS.freezes,
      latency_ms:LS.lastLatencyMs||null, grade:lastGrade,
      song_lyrics:lyrics, song_beat:beat, same_song:same,
      ig_closed:$("#closedIg")?.checked||false, fb_closed:$("#closedFb")?.checked||false, yt_closed:$("#closedYt")?.checked||false,
      weather: LS.lastWeather || null
    };
    trySendWebhook(payload);

    LS.dayIndex++; if(dayLabel) dayLabel.textContent=`Day ${LS.dayIndex}`;
    started=false; const btn=$("#startSession"); btn.textContent="🚀 Start Work"; btn.disabled=false; setTip();
    say("Done. Bounce/pack now. Don’t linger.", "good");
    setTimeout(()=>showSuccessHome(), 1200);
  });

  /* ---------- Freeze ---------- */
  $("#useFreeze")?.addEventListener("click", ()=>{
    if(LS.freezes<=0){ say("No freezes. Earn one every 7 finishes.", "warn"); return; }
    LS.freezes--; fc.textContent=LS.freezes; LS.streak++; sc.textContent=LS.streak;
    say("Freeze used. Streak preserved today.", "good");
  });

  /* ---------- Grade slider ---------- */
  const slider=$("#gradeSlider"), cd=$("#cdGrow");
  const renderCD=()=>{ const v=+slider.value; const scale=0.6+(v/100)*0.9; cd.style.transform=`scale(${scale})`; cd.style.filter = v>=50 ? "hue-rotate(0deg)" : "grayscale(75%)"; };
  slider?.addEventListener("input", renderCD); slider && renderCD();
  $("#saveGrade")?.addEventListener("click", ()=>{
    const v=+slider.value; lastGrade = v;
    const g=LS.grades; g.push(v); LS.grades=g.slice(-30);
    const Ls=LS.latencies; if(LS.lastLatencyMs){ Ls.push(LS.lastLatencyMs); LS.latencies=Ls.slice(-30); }
    drawCharts(); say("Grade saved.", v<50 ? "warn" : "good"); if(v<50) showFailHome();
  });

  /* ---------- Same song toggle ---------- */
  const sameEl=$("#sameSong"), beatWrap=$("#beatWrap"), lyr=$("#songLyrics"), beat=$("#songBeat");
  const syncBeat = ()=> { if (sameEl.checked) beat.value = lyr.value; };
  const toggleSongFields = ()=> { beatWrap.style.display = sameEl.checked ? "none" : ""; if (sameEl.checked) syncBeat(); };
  sameEl?.addEventListener("change", toggleSongFields); lyr?.addEventListener("input", syncBeat); toggleSongFields();

  /* ---------- Clock ---------- */
  setInterval(()=>{ const el=$("#flipClock"); if(!el) return; const now=new Date(); el.textContent=`${String(now.getMinutes()).padStart(2,"0")}:${String(now.getSeconds()).padStart(2,"0")}`; },1000);

  /* ---------- Map + Heatmap + Weather ---------- */
  const map = L.map('map',{ zoomControl:true }).setView([35.2271,-80.8431],12); // Charlotte default
  L.tileLayer(CFG.MAP_TILES.url,{ attribution:CFG.MAP_TILES.attr, maxZoom:19 }).addTo(map);
  const heatLayer = L.heatLayer(LS.heatPoints, {radius:25, blur:18, maxZoom:17, minOpacity:0.35}).addTo(map);

  $("#useGeo")?.addEventListener("click", ()=> {
    navigator.geolocation?.getCurrentPosition(async pos=>{
      const {latitude, longitude}=pos.coords; map.setView([latitude, longitude], 12); await loadWeather(latitude, longitude);
    }, ()=> say("Location blocked.", "warn"));
  });
  $("#findCity")?.addEventListener("click", async ()=>{
    const q=$("#cityInput")?.value?.trim(); if(!q) return; const {lat, lon} = await geocodeCity(q); map.setView([lat, lon], 12); await loadWeather(lat, lon);
  });

  async function loadWeather(lat, lon){
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,wind_speed_10m`;
    const data = await safeFetch(url);
    const box=$("#weatherBox");
    if(!data?.current){ box.textContent="Weather unavailable."; return; }
    const w=data.current; const desc=codeToDesc(w.weather_code);
    box.innerHTML=`Temp: <b>${w.temperature_2m}&deg;C</b> · Wind: ${w.wind_speed_10m} m/s · ${desc}`;
    $("#weatherGif").src = weatherGifForCode(w.weather_code);
    heatLayer.addLatLng([lat, lon, 0.4]); LS.pushHeat([lat, lon, 0.4]);
    LS.lastWeather = { lat, lon, code:w.weather_code, temp_c:w.temperature_2m, wind:w.wind_speed_10m };
  }
  function codeToDesc(code){ const m={0:"Clear",1:"Mainly clear",2:"Partly cloudy",3:"Overcast",45:"Fog",48:"Rime fog",51:"Drizzle",61:"Rain",71:"Snow",80:"Rain showers",95:"Thunderstorm"}; return m[code]||"—"; }
  function weatherGifForCode(code){
    if(code===0||code===1) return "https://media.giphy.com/media/l0Exk8EUzSLsrErEQ/giphy.gif";
    if(code===2||code===3) return "https://media.giphy.com/media/l0MYGB3b0b9L0s1mI/giphy.gif";
    if(String(code).startsWith("8")||code===61) return "https://media.giphy.com/media/xT9KVF7V3vP0JxyKPC/giphy.gif";
    if(String(code).startsWith("7")) return "https://media.giphy.com/media/l0HlFJ5Q2G8a9NzDi/giphy.gif";
    if(code===95) return "https://media.giphy.com/media/26u4lOMA8JKSnL9Uk/giphy.gif";
    return "https://media.giphy.com/media/l0MYGB3b0b9L0s1mI/giphy.gif";
  }
  async function geocodeCity(q){
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=1&addressdetails=0`;
    const res = await safeFetch(url); if(!res?.length) throw new Error("City not found"); return { lat:+res[0].lat, lon:+res[0].lon };
  }

  /* ---------- Charts ---------- */
  let chart1, chart2;
  function drawCharts(){
    const grades = LS.grades.slice(-14);
    const lat = LS.latencies.slice(-14);
    const labels = grades.map((_,i)=>`-${grades.length-i}d`);
    const c1=document.getElementById("chart1"), c2=document.getElementById("chart2");
    if(!c1||!c2||!window.Chart) return;
    chart1?.destroy(); chart1 = new Chart(c1,{ type:'line', data:{ labels, datasets:[{label:'Grade', data:grades, fill:false, tension:.3}] }, options:{ plugins:{legend:{display:false}}, scales:{ y:{min:0,max:100} } } });
    chart2?.destroy(); chart2 = new Chart(c2,{ type:'bar', data:{ labels, datasets:[{label:'Latency (ms)', data:lat}] }, options:{ plugins:{legend:{display:false}}, scales:{ y:{beginAtZero:true} } } });
  }
  drawCharts();

  /* ---------- Rewards / overlays ---------- */
  function randOf(arr){ return arr[Math.floor(Math.random()*arr.length)] }
  function gearDrop(){
    const rare = Math.random() < CFG.RARE_DROP_RATE;
    const pool = rare ? CFG.REWARD_GIF_URLS.rare : CFG.REWARD_GIF_URLS.common;
    const url = randOf(pool)||"";
    $("#rewardTitle").textContent = rare ? "🌟 RARE Gear Drop" : "🎁 Gear Drop";
    $("#rewardImg").src = url; $("#rewardCaption").textContent = rare ? "Limited run. Flex quietly and keep working." : "Pocket this and move on.";
    const modal=$("#rewardModal"); modal.style.display="flex"; $("#rewardClose").onclick=()=>modal.style.display="none";
  }
  function showRun(){ $("#runGif").src = randOf(CFG.GIFS.RUN); $("#runOverlay").style.display="flex"; }
  function powerUpFlash(){ toast("🪙 Power-up!"); new Image().src=CFG.GIFS.POWERUP; }
  function showSuccessHome(){ $("#successHomeGif").src = CFG.GIFS.SUCCESS_HOME; $("#successHomeOverlay").style.display="flex"; }
  function showFailHome(){ $("#failHomeGif").src = CFG.GIFS.FAIL_HOME; $("#willGif").src = CFG.GIFS.WILL_PLACEHOLDER; $("#failHomeOverlay").style.display="flex"; }
  window.SADAY_RUN = showRun;

  /* ---------- Tooltip on the dancing keyboard ---------- */
  (function spriteTooltip(){
    const key=$("#spriteKey"), tip=$("#spriteTip"); if(!key||!tip) return;
    key.addEventListener("mouseenter", ()=> tip.style.display="block");
    key.addEventListener("mouseleave", ()=> tip.style.display="none");
  })();

  /* ---------- Confetti + Toast ---------- */
  function confettiBurst(){
    const c=document.getElementById("confetti"); if(!c) return;
    const ctx=c.getContext("2d"); const w=c.width=innerWidth, h=c.height=innerHeight;
    const parts=Array.from({length:120},()=>({x:Math.random()*w,y:-10,vx:(Math.random()-0.5)*2,vy:Math.random()*3+2,r:Math.random()*6+2}));
    let t=0; (function step(){ ctx.clearRect(0,0,w,h); parts.forEach(p=>{ p.x+=p.vx; p.y+=p.vy; p.vy+=0.05; ctx.fillStyle=["#a78bfa","#22c55e","#f59e0b","#ef4444","#f5f5f7"][Math.floor(Math.random()*5)]; ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill(); }); if(t++<90) requestAnimationFrame(step); else ctx.clearRect(0,0,w,h); })();
  }
  function toast(msg){ const el=document.createElement("div"); el.textContent=msg; el.style.cssText="position:fixed;bottom:18px;left:50%;transform:translateX(-50%);background:#1c1c22;color:#fff;padding:10px 14px;border-radius:12px;border:1px solid #2a2a33;z-index:9999;font-weight:800"; document.body.appendChild(el); setTimeout(()=>el.remove(),1800); }

  /* ---------- Fetch helper & Notion webhook ---------- */
  async function safeFetch(url, ms=8000){
    const ctrl=new AbortController(); const to=setTimeout(()=>ctrl.abort(), ms);
    try{ const r=await fetch(url,{signal:ctrl.signal, headers:{'Accept':'application/json'}}); clearTimeout(to); if(!r.ok) throw new Error(`HTTP ${r.status}`); return await r.json(); }
    catch(e){ console.warn("fetch failed", url, e); say("Network hiccup. Keep working; I’ll retry later.", "warn"); return null; }
  }
  async function trySendWebhook(payload){
    if(!CFG.NOTION_WEBHOOK_URL) return;
    try{ await fetch(CFG.NOTION_WEBHOOK_URL,{ method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(payload) }); }
    catch(e){ console.warn("webhook failed", e); }
  }
})();