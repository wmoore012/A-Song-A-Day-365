/* THE NUKES — V2 logic
   Requires (load these first, in this order):
   1) Leaflet 1.9.4 CSS/JS
   2) leaflet.heat plugin
   3) Chart.js 4.x
   CDNs: Leaflet/leaflet.heat/Chart.js official links. */
// --- BOOTSTRAP: render the HTML so EF doesn't have to save a huge block ---
(function bootstrapMarkup(){
  const root = document.getElementById('saday');
  if (!root || root.children.length) return;
  root.classList.add('saday');
  root.innerHTML = `
  <!-- Header & counters -->
  <div class="row">
    <div class="title">THE NUKES — <span id="dayLabel">Day ?</span> <span class="muted">Start gate</span></div>
    <div class="chip"><span>🔥 Streak:</span><span id="streakCount">0</span></div>
    <div class="chip"><span>🧊 Freezes:</span><span id="freezeCount">0</span></div>
  </div>

  <!-- ADHD Tip -->
  <div class="card">
    <div class="row" style="justify-content:space-between">
      <div>
        <div class="muted small">Real ADHD tip of the session</div>
        <div id="adhdTip" style="font-weight:800; font-size:16px; margin-top:6px;">Make the ugly version. Shipping > perfection.</div>
      </div>
      <button id="newTip" class="btn-secondary" aria-label="New tip">♻️ New</button>
    </div>
  </div>

  <!-- Start latency + primary actions -->
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
  </div>

  <!-- If-Then + music links -->
  <div class="grid">
    <div class="card">
      <div class="title" style="font-size:16px;">If-Then checks</div>
      <div class="divider"></div>
      <label class="toggle"><input type="checkbox" id="closedIg"> 📵 If IG is open → close it. (Tap when closed)</label><br/>
      <label class="toggle"><input type="checkbox" id="closedFb"> 📵 If Facebook is open → close it. (Tap when closed)</label><br/>
      <label class="toggle"><input type="checkbox" id="closedYt"> 🧐 “Did you close YouTube?” (Optional; use YouTube Music if needed)</label>
      <div class="row" style="margin-top:8px;">
        <a class="btn-secondary" href="https://music.youtube.com/" target="_blank" rel="noopener">🎵 YouTube Music</a>
        <a class="btn-secondary" href="https://youtube.com/playlist?list=PLl-ShioB5kapDf5pXDxe2_FpNiTCQdVAO&si=ADssb7QlTymc-169" target="_blank" rel="noopener">🏠 Studio Vibes</a>
      </div>
      <div class="muted small" style="margin-top:10px;">Rule stays blunt: Stop polishing. Finish the song.</div>
    </div>

    <!-- Streak & freeze logic -->
    <div class="card">
      <div class="title" style="font-size:16px;">Streaks & Freezes</div>
      <div class="divider"></div>
      <div class="muted small">Finish today = +1 streak day. Every 7 finished days → earn 1 freeze.</div>
      <div class="row" style="margin-top:8px;">
        <button id="useFreeze" class="btn-warn">🧊 Use Freeze</button>
        <div id="freezeMsg" class="muted small"></div>
      </div>
    </div>
  </div>

  <!-- Grade your day (grows a CD) -->
  <div class="card">
    <div class="title" style="font-size:16px;">Grade your day</div>
    <div class="divider"></div>
    <div class="row" style="align-items:flex-end; justify-content:space-between">
      <div>
        <input id="gradeSlider" type="range" min="0" max="100" value="60" style="width:300px">
        <div class="muted small">Slide to score 0–100. Keep it honest.</div>
      </div>
      <div class="cd-grow" id="cdGrow">💿</div>
      <button id="saveGrade" class="btn-secondary">Save Grade</button>
    </div>
  </div>

  <!-- Weather + Map + Heatmap -->
  <div class="card">
    <div class="title">City Weather & Map</div>
    <div class="divider"></div>
    <div class="row" style="gap:8px;">
      <input id="cityInput" placeholder="Enter city (e.g., Charlotte, NC)" style="padding:10px;border-radius:10px;border:1px solid #2a2a33;background:#0f0f13;color:#fff;width:260px"/>
      <button id="findCity" class="btn-secondary">📍 Search</button>
      <button id="useGeo" class="btn-secondary">🛰️ Use My Location</button>
      <div class="chip"><span>⏱️ Flip:</span><span class="flip" id="flipClock">00:00</span></div>
    </div>
    <div id="weatherBox" class="muted small" style="margin-top:8px">—</div>
    <div id="map" style="margin-top:10px"></div>
  </div>

  <!-- Last Page: Data Science + Weather Recap -->
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

  <!-- Overlays -->
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

  <!-- Gear reward modal -->
  <div class="reward-modal" id="rewardModal" role="dialog" aria-modal="true" aria-labelledby="rewardTitle">
    <div class="modal-card">
      <h3 id="rewardTitle">🎁 Gear Drop</h3>
      <img id="rewardImg" class="reward-img" alt="Reward">
      <div class="muted small" id="rewardCaption" style="margin:8px 0 12px;"></div>
      <button id="rewardClose" class="btn-good">OK</button>
    </div>
  </div>

  <canvas id="confetti" class="confetti"></canvas>
  <div class="emoji-sprite">🎹</div>
  <div class="emoji-sprite second">🔊</div>
  `;
})();
(() => {
  'use strict';
  const $ = s => document.querySelector(s);

  /** ---------- Config ---------- */
  const CFG = {
    RARE_DROP_RATE: 0.15,
    NOTION_WEBHOOK_URL: "", // set later if/when you add your serverless relay
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
    REWARD_GIF_URLS: {
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
    ADHD_TIPS: [
      "Don’t plan twenty steps. Pick the first step. Do just that.",
      "Front-load friction: set the bounce/pack timer now so you can’t fake ‘one more tweak’.",
      "If you stall, body-double. Book it before you think about it.",
      "Make the bad version on purpose. Shipping > perfection.",
      "Low energy? Lower the bar. Use a loop; sketch fast.",
      "IG/FB closed. Music only.",
      "Buffer time is sacred. Stop early so you can finish.",
      "You aren’t a good judge mid-build. Finish; evaluate tomorrow."
    ],
    MAP_TILES: {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attr: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors'
    }
  };

  /** ---------- State (localStorage) ---------- */
  const LS = {
    get nDone(){ return +localStorage.getItem("saday_done_count")||0 }, set nDone(v){ localStorage.setItem("saday_done_count", String(v)); },
    get streak(){ return +localStorage.getItem("saday_streak")||0 }, set streak(v){ localStorage.setItem("saday_streak", String(v)); },
    get freezes(){ return +localStorage.getItem("saday_freezes")||0 }, set freezes(v){ localStorage.setItem("saday_freezes", String(v)); },
    get dayIndex(){ return +localStorage.getItem("saday_day_index")||1 }, set dayIndex(v){ localStorage.setItem("saday_day_index", String(v)); },
    get lastLatencyMs(){ return +localStorage.getItem("saday_last_latency_ms")||0 }, set lastLatencyMs(v){ localStorage.setItem("saday_last_latency_ms", String(v)); },
    get grades(){ return JSON.parse(localStorage.getItem("saday_grades")||"[]") }, set grades(v){ localStorage.setItem("saday_grades", JSON.stringify(v)); },
    get latencies(){ return JSON.parse(localStorage.getItem("saday_latencies")||"[]") }, set latencies(v){ localStorage.setItem("saday_latencies", JSON.stringify(v)); },
    get heatPoints(){ return JSON.parse(localStorage.getItem("saday_heat")||"[]") }, set heatPoints(v){ localStorage.setItem("saday_heat", JSON.stringify(v)); },
    pushHeat(pt){ const a=this.heatPoints; a.push(pt); this.heatPoints=a; }
  };

  /** ---------- Seed UI ---------- */
  const dayLabel=$("#dayLabel"), sc=$("#streakCount"), fc=$("#freezeCount");
  if (dayLabel) dayLabel.textContent = `Day ${LS.dayIndex}`;
  if (sc) sc.textContent = LS.streak;
  if (fc) fc.textContent = LS.freezes;
  const setTip = ()=> { const el=$("#adhdTip"); if(el) el.textContent = CFG.ADHD_TIPS[Math.floor(Math.random()*CFG.ADHD_TIPS.length)]; };
  setTip(); const tipBtn=$("#newTip"); if (tipBtn) tipBtn.addEventListener("click", setTip);

  /** ---------- Latency timer (7:00) ---------- */
  const t0 = Date.now(); let started=false;
  const fmt = ms => { const s=Math.max(0,Math.ceil(ms/1000)); const m=String(Math.floor(s/60)).padStart(2,"0"); const r=String(s%60).padStart(2,"0"); return `${m}:${r}`; };
  setInterval(()=>{ const el=$("#latencyCountdown"); if(!el) return; const rem=7*60*1000-(Date.now()-t0); el.textContent=fmt(rem); if(rem<=0) el.classList.add("danger"); }, 250);

  /** ---------- Start / Done ---------- */
  const startBtn=$("#startSession"), doneBtn=$("#markDone");
  if (startBtn) startBtn.addEventListener("click", ()=>{
    if (started) return; started=true;
    LS.lastLatencyMs = Date.now()-t0;
    const out=$("#latencyMs"); if(out) out.textContent=`${LS.lastLatencyMs.toLocaleString()} ms`;
    startBtn.textContent="⏱️ Locked In"; startBtn.disabled=true;
    confettiBurst();
    trySendWebhook({
      type:"session_started",
      latency_ms:LS.lastLatencyMs,
      day_index:LS.dayIndex,
      ts:new Date().toISOString(),
      ig_closed:$("#closedIg")?.checked||false,
      fb_closed:$("#closedFb")?.checked||false,
      yt_closed:$("#closedYt")?.checked||false
    });
  });

  if (doneBtn) doneBtn.addEventListener("click", ()=>{
    if(!started){ alert("Start first."); return; }
    LS.nDone++; LS.streak++; if(sc) sc.textContent=LS.streak;
    if(LS.streak%7===0){ LS.freezes++; if(fc) fc.textContent=LS.freezes; toast("🧊 Earned a streak freeze."); }
    confettiBurst(); gearDrop(); powerUpFlash();
    LS.dayIndex++; if(dayLabel) dayLabel.textContent=`Day ${LS.dayIndex}`;
    started=false; if(startBtn){ startBtn.textContent="🚀 Start Work"; startBtn.disabled=false; } setTip();
    trySendWebhook({
      type:"session_done",
      day_index:LS.dayIndex-1,
      streak_after:LS.streak,
      freezes:LS.freezes,
      latency_ms:LS.lastLatencyMs||null,
      ts:new Date().toISOString()
    });
    setTimeout(()=>showSuccessHome(), 1500);
  });

  /** ---------- Freeze ---------- */
  const useFreezeBtn=$("#useFreeze"), freezeMsg=$("#freezeMsg");
  if (useFreezeBtn) useFreezeBtn.addEventListener("click", ()=>{
    if(LS.freezes<=0){ if(freezeMsg) freezeMsg.textContent="No freezes. Earn one every 7 finishes."; return; }
    LS.freezes--; if(fc) fc.textContent=LS.freezes;
    LS.streak++; if(sc) sc.textContent=LS.streak;
    if(freezeMsg) freezeMsg.textContent="Freeze used. Streak preserved today.";
    toast("🧊 Streak preserved.");
  });

  /** ---------- Grade slider → grow CD; <50 shows fail overlay ---------- */
  const slider=$("#gradeSlider"), cd=$("#cdGrow");
  const renderCD=()=>{ const v=+slider.value; const scale=0.6+(v/100)*0.9; if(cd){ cd.style.transform=`scale(${scale})`; cd.style.filter = v>=50 ? "hue-rotate(0deg)" : "grayscale(75%)"; } };
  if (slider){ slider.addEventListener("input", renderCD); renderCD(); }
  const saveGrade=$("#saveGrade");
  if (saveGrade) saveGrade.addEventListener("click", ()=>{
    const v=+slider.value; const g=LS.grades; g.push(v); LS.grades=g.slice(-30);
    const Ls=LS.latencies; if(LS.lastLatencyMs){ Ls.push(LS.lastLatencyMs); LS.latencies=Ls.slice(-30); }
    drawCharts(); toast("Saved."); if(v<50) showFailHome();
  });

  /** ---------- Flip clock on weather card ---------- */
  setInterval(()=>{ const el=$("#flipClock"); if(!el) return; const now=new Date(); el.textContent=`${String(now.getMinutes()).padStart(2,"0")}:${String(now.getSeconds()).padStart(2,"0")}`; },1000);

  /** ---------- Map + Heatmap ---------- */
  const map = L.map('map',{ zoomControl:true }).setView([35.2271,-80.8431],12); // Charlotte default
  L.tileLayer(CFG.MAP_TILES.url,{ attribution:CFG.MAP_TILES.attr, maxZoom:19 }).addTo(map);
  const heatLayer = L.heatLayer(LS.heatPoints, {radius:25, blur:18, maxZoom:17, minOpacity:0.35}).addTo(map);

  /** ---------- Geolocate / City search ---------- */
  const useGeo=$("#useGeo");
  if (useGeo) useGeo.addEventListener("click", ()=> {
    navigator.geolocation?.getCurrentPosition(async pos=>{
      const {latitude, longitude}=pos.coords;
      map.setView([latitude, longitude], 12);
      await loadWeather(latitude, longitude);
    }, ()=> toast("Location blocked."));
  });

  const findCity=$("#findCity");
  if (findCity) findCity.addEventListener("click", async ()=>{
    const q=$("#cityInput")?.value?.trim(); if(!q) return;
    const {lat, lon} = await geocodeCity(q);
    map.setView([lat, lon], 12);
    await loadWeather(lat, lon);
  });

  /** ---------- Weather (Open-Meteo) ---------- */
  async function loadWeather(lat, lon){
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,wind_speed_10m`;
    const data = await safeFetch(url);
    const box=$("#weatherBox");
    if(!data?.current){ if(box) box.textContent="Weather unavailable."; return; }
    const w=data.current; const desc=codeToDesc(w.weather_code);
    if(box) box.innerHTML=`Temp: <b>${w.temperature_2m}&deg;C</b> · Wind: ${w.wind_speed_10m} m/s · ${desc}`;
    const wg=$("#weatherGif"); if(wg) wg.src = weatherGifForCode(w.weather_code);
    heatLayer.addLatLng([lat, lon, 0.4]); LS.pushHeat([lat, lon, 0.4]);
  }
  function codeToDesc(code){
    const m={0:"Clear",1:"Mainly clear",2:"Partly cloudy",3:"Overcast",45:"Fog",48:"Rime fog",51:"Drizzle",61:"Rain",71:"Snow",80:"Rain showers",95:"Thunderstorm"};
    return m[code]||"—";
  }
  function weatherGifForCode(code){
    if(code===0||code===1) return "https://media.giphy.com/media/l0Exk8EUzSLsrErEQ/giphy.gif";      // sunny-ish
    if(code===2||code===3) return "https://media.giphy.com/media/l0MYGB3b0b9L0s1mI/giphy.gif";      // clouds
    if(String(code).startsWith("8")||code===61) return "https://media.giphy.com/media/xT9KVF7V3vP0JxyKPC/giphy.gif"; // rain
    if(String(code).startsWith("7")) return "https://media.giphy.com/media/l0HlFJ5Q2G8a9NzDi/giphy.gif";             // snow-ish
    if(code===95) return "https://media.giphy.com/media/26u4lOMA8JKSnL9Uk/giphy.gif";                 // thunder
    return "https://media.giphy.com/media/l0MYGB3b0b9L0s1mI/giphy.gif";
  }
  async function geocodeCity(q){
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=1&addressdetails=0`;
    const res = await safeFetch(url);
    if(!res?.length) throw new Error("City not found");
    return { lat:+res[0].lat, lon:+res[0].lon };
  }

  /** ---------- Charts ---------- */
  let chart1, chart2;
  function drawCharts(){
    const grades = LS.grades.slice(-14);
    const lat = LS.latencies.slice(-14);
    const labels = grades.map((_,i)=>`-${grades.length-i}d`);
    const c1=document.getElementById("chart1"), c2=document.getElementById("chart2");
    if(!c1||!c2) return;
    if (window.Chart) {
      chart1?.destroy();
      chart1 = new Chart(c1,{
        type:'line',
        data:{ labels, datasets:[{label:'Grade', data:grades, fill:false, tension:.3}] },
        options:{ plugins:{legend:{display:false}}, scales:{ y:{min:0,max:100} } }
      });
      chart2?.destroy();
      chart2 = new Chart(c2,{
        type:'bar',
        data:{ labels, datasets:[{label:'Latency (ms)', data:lat}] },
        options:{ plugins:{legend:{display:false}}, scales:{ y:{beginAtZero:true} } }
      });
    }
  }
  drawCharts();

  /** ---------- Rewards / overlays ---------- */
  function randOf(arr){ return arr[Math.floor(Math.random()*arr.length)] }
  function gearDrop(){
    const rare = Math.random() < CFG.RARE_DROP_RATE;
    const pool = rare ? CFG.REWARD_GIF_URLS.rare : CFG.REWARD_GIF_URLS.common;
    const url = randOf(pool)||"";
    const modal=$("#rewardModal"), img=$("#rewardImg"), cap=$("#rewardCaption"), title=$("#rewardTitle");
    if(title) title.textContent = rare ? "🌟 RARE Gear Drop" : "🎁 Gear Drop";
    if(img) img.src = url;
    if(cap) cap.textContent = rare ? "Limited run. Flex quietly and keep working." : "Pocket this and move on.";
    if(modal) { modal.style.display="flex"; const close=$("#rewardClose"); if(close) close.onclick=()=>modal.style.display="none"; }
  }
  function showRun(){ const el=$("#runOverlay"); if(el){ $("#runGif").src = randOf(CFG.GIFS.RUN); el.style.display="flex"; } }
  function powerUpFlash(){ toast("🪙 Power-up!"); const img=new Image(); img.src=CFG.GIFS.POWERUP; }
  function showSuccessHome(){ const el=$("#successHomeOverlay"); if(el){ $("#successHomeGif").src = CFG.GIFS.SUCCESS_HOME; el.style.display="flex"; } }
  function showFailHome(){ const el=$("#failHomeOverlay"); if(el){ $("#failHomeGif").src = CFG.GIFS.FAIL_HOME; $("#willGif").src = CFG.GIFS.WILL_PLACEHOLDER; el.style.display="flex"; } }
  window.SADAY_RUN = showRun; // manual test: SADAY_RUN()

  /** ---------- Confetti + Toast ---------- */
  function confettiBurst(){
    const c=document.getElementById("confetti"); if(!c) return;
    const ctx=c.getContext("2d"); const w=c.width=innerWidth, h=c.height=innerHeight;
    const parts=Array.from({length:120},()=>({x:Math.random()*w,y:-10,vx:(Math.random()-0.5)*2,vy:Math.random()*3+2,r:Math.random()*6+2}));
    let t=0; (function step(){
      ctx.clearRect(0,0,w,h);
      parts.forEach(p=>{
        p.x+=p.vx; p.y+=p.vy; p.vy+=0.05;
        ctx.fillStyle=["#6cf","#33d17a","#ffb020","#ff3b30","#f5f5f7"][Math.floor(Math.random()*5)];
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
      });
      if(t++<90) requestAnimationFrame(step); else ctx.clearRect(0,0,w,h);
    })();
  }
  function toast(msg){
    const el=document.createElement("div");
    el.textContent=msg;
    el.style.cssText="position:fixed;bottom:18px;left:50%;transform:translateX(-50%);background:#1c1c22;color:#fff;padding:10px 14px;border-radius:12px;border:1px solid #2a2a33;z-index:9999;font-weight:800";
    document.body.appendChild(el); setTimeout(()=>el.remove(),1800);
  }

  /** ---------- Fetch helper ---------- */
  async function safeFetch(url, ms=8000){
    const ctrl=new AbortController(); const to=setTimeout(()=>ctrl.abort(), ms);
    try{
      const r=await fetch(url,{signal:ctrl.signal, headers:{'Accept':'application/json'}});
      clearTimeout(to);
      if(!r.ok) throw new Error(`HTTP ${r.status}`);
      return await r.json();
    }catch(e){
      console.warn("fetch failed", url, e);
      toast("⚠️ Network issue.");
      return null;
    }
  }

  /** ---------- Optional: Notion relay ---------- */
  async function trySendWebhook(payload){
    if(!CFG.NOTION_WEBHOOK_URL) return;
    try {
      await fetch(CFG.NOTION_WEBHOOK_URL,{ method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(payload) });
    } catch(e) {
      console.warn("webhook failed", e);
    }
  }
})();