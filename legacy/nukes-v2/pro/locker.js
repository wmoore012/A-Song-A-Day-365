// Proprietary. All rights reserved.
// Villain Locker (Pro): simple glass grid with items
function el(tag, attrs={}, parent){ const e=document.createElement(tag); Object.entries(attrs).forEach(([k,v])=>{ if(k==='style'&&typeof v==='object') Object.assign(e.style,v); else if(k in e) e[k]=v; else e.setAttribute(k,v); }); if(parent) parent.appendChild(e); return e; }

export function mountLocker(items = []){
	const host = document.getElementById('lockerSection');
	if (!host) throw new Error('Locker: missing #lockerSection');
	host.innerHTML = '';
	const grid = el('div', { className:'locker-grid' }, host);
	Object.assign(grid.style, {
		display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(160px,1fr))', gap:'12px'
	});
	items.forEach((it)=>{
		const card = el('div', { className:'locker-card' }, grid);
		Object.assign(card.style, {
			position:'relative', border:'1px solid rgba(255,255,255,.18)', borderRadius:'14px',
			background:'rgba(12,14,18,.5)', backdropFilter:'blur(10px) saturate(120%)',
			padding:'8px', minHeight:'120px', display:'flex', alignItems:'center', justifyContent:'center'
		});
		if (it.gif){ const img = el('img', { src: it.gif, alt:'', 'aria-hidden':'true' }, card); Object.assign(img.style, { maxWidth:'100%', maxHeight:'100%', objectFit:'cover', borderRadius:'10px' }); }
		if (it.title){ const t = el('div', { className:'t' }, card); Object.assign(t.style, { position:'absolute', left:'8px', bottom:'6px', fontWeight:'800', color:'#eaf6ff', textShadow:'0 0 6px rgba(0,0,0,.5)' }); t.textContent = it.title; }
	});
	return host;
}