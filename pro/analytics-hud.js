// PRO HUD: ECharts boot with playful military HUD vibes
export async function bootAnalyticsHud(ctx={}){
  try{
    const root = document.getElementById('hudAnalytics');
    if (!root) return;
    const $ = (s)=> document.querySelector(s);
    const charts = {
      streak: echarts.init(document.getElementById('chartStreak')),
      bars: echarts.init(document.getElementById('chartBars')),
      calendar: echarts.init(document.getElementById('chartCalendar')),
      mult: echarts.init(document.getElementById('chartMultiplier')),
    };
    const LS = ctx?.LS || (globalThis.LS||{});
    const grades = (LS.grades||[]).slice(-14);
    const lat = (LS.latencies||[]).slice(-14);
    const labels = grades.map((_,i)=>`-${grades.length - i}d`);

    charts.streak.setOption({
      backgroundColor: 'transparent',
      grid:{ top:20, left:30, right:10, bottom:20 },
      xAxis:{ type:'category', data: labels, axisLine:{lineStyle:{color:'#405'}} },
      yAxis:{ type:'value', axisLine:{lineStyle:{color:'#405'}}, splitLine:{lineStyle:{color:'#1a1a2a'}} },
      series:[{ type:'line', data: grades, smooth:true, areaStyle:{opacity:.15}, lineStyle:{width:3} }]
    });
    charts.bars.setOption({
      backgroundColor:'transparent',
      grid:{ top:20, left:30, right:10, bottom:20 },
      xAxis:{ type:'category', data: labels },
      yAxis:{ type:'value' },
      series:[{ type:'bar', data: lat }]
    });
    charts.mult.setOption({
      backgroundColor:'transparent',
      series:[{ type:'gauge', progress:{show:true}, detail:{formatter:'{value}%'}, data:[{value: Math.max(0, Math.min(100, Math.round(LS.mult||0)))}]}]
    });

    // HUD entrance sting
    try{ window.gsap && window.gsap.fromTo('#hudAnalytics', { opacity:0, y:18, filter:'brightness(1.6) contrast(1.2)' }, { opacity:1, y:0, duration:.35, ease:'power2.out', filter:'none' }); }catch{}
  }catch(e){ console.error('HUD boot failed', e); }
}

// Proprietary. All rights reserved.
// Premium analytics HUD (ECharts) — plus villain GIF announcer

function el(tag, attrs={}, parent){ const e=document.createElement(tag); Object.entries(attrs).forEach(([k,v])=>{ if(k==='style'&&typeof v==='object') Object.assign(e.style,v); else if(k in e) e[k]=v; else e.setAttribute(k,v); }); if(parent) parent.appendChild(e); return e; }

export async function bootAnalyticsHud(){ /* charts wired privately */ }

export function rotateVillainAnnounce(kind, opts = {}){
	const pool = (opts.pool && Array.isArray(opts.pool) ? opts.pool : [
		'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaHo5Y215Z3M2ZjF1YW54cmttaGtnZXZwZ2M5N3Y2ajliMWljb3dubiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/ypugC2vCJMqyXrSfzS/giphy.gif'
	]);
	const i = (Number(localStorage.getItem('nk_villain_gif_idx')||'0') % pool.length);
	localStorage.setItem('nk_villain_gif_idx', String((i+1) % pool.length));
	const url = pool[i];
	const root = el('div', { className:'villain-announce' }, document.body);
	Object.assign(root.style, { position:'fixed', inset:'0', display:'flex', alignItems:'center', justifyContent:'center', zIndex:'9997', pointerEvents:'none' });
	const card = el('div', { className:'gif-card' }, root);
	Object.assign(card.style, {
		position:'relative', width:'min(520px, 92vw)', aspectRatio:'16/9',
		border:'1px solid rgba(255,255,255,.22)', borderRadius:'16px',
		backdropFilter:'blur(12px) saturate(120%)', background:'rgba(10,12,18,.55)',
		boxShadow:'0 18px 40px rgba(0,0,0,.5)', overflow:'hidden'
	});
	const img = el('img', { src:url, alt:'', 'aria-hidden':'true' }, card);
	Object.assign(img.style, { width:'100%', height:'100%', objectFit:'cover' });
	// Optional frame PNG
	if (opts.frameSrc){ const f = el('img', { src:opts.frameSrc, alt:'', 'aria-hidden':'true' }, card); Object.assign(f.style, { position:'absolute', inset:'0', width:'100%', height:'100%', objectFit:'cover', opacity:'.35' }); }
	try{ if (window.gsap){ window.gsap.fromTo(card, { opacity:0, scale:.98, y:10 }, { opacity:1, scale:1, y:0, duration:.28, ease:'power2.out' }); } }catch{}
	setTimeout(()=>{ try{ if (window.gsap) window.gsap.to(card, { opacity:0, y:-12, duration:.22, ease:'power1.in', onComplete:()=> root.remove() }); else root.remove(); }catch{ root.remove(); } }, opts.durationMs || 2000);
	return url;
}