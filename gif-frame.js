function el(tag, attrs={}, parent){ const e=document.createElement(tag); Object.entries(attrs).forEach(([k,v])=>{ if(k==='style'&&typeof v==='object') Object.assign(e.style,v); else if(k in e) e[k]=v; else e.setAttribute(k,v); }); if(parent) parent.appendChild(e); return e; }

export function showVillainGifOverlay(url, opts = {}){
	if (!url) throw new Error('gifOverlay: missing url');
	const root = el('div', { className:'gif-overlay' }, document.body);
	Object.assign(root.style, { position:'fixed', inset:'0', display:'flex', alignItems:'center', justifyContent:'center', zIndex:'9998', pointerEvents:'none' });
	const card = el('div', { className:'gif-card' }, root);
	Object.assign(card.style, {
		position:'relative', width:'min(520px, 92vw)', aspectRatio:'16/9',
		border:'1px solid rgba(255,255,255,.22)', borderRadius:'16px',
		backdropFilter:'blur(12px) saturate(120%)', background:'rgba(10,12,18,.55)',
		boxShadow:'0 18px 40px rgba(0,0,0,.5)', overflow:'hidden'
	});
	const img = el('img', { src:url, alt:'', 'aria-hidden':'true' }, card);
	Object.assign(img.style, { width:'100%', height:'100%', objectFit:'cover' });
	if (opts.frameSrc){
		const frame = el('img', { src:opts.frameSrc, alt:'', 'aria-hidden':'true' }, card);
		Object.assign(frame.style, { position:'absolute', inset:'0', width:'100%', height:'100%', objectFit:'cover', opacity:'.35', pointerEvents:'none' });
	}
	if (typeof window !== 'undefined' && window.gsap){ try{ window.gsap.fromTo(card, { opacity:0, y:18 }, { opacity:1, y:0, duration:.28, ease:'power2.out' }); }catch{} }
	setTimeout(()=>{ try{ if (window.gsap) window.gsap.to(card, { opacity:0, y:-12, duration:.22, ease:'power2.in', onComplete:()=> root.remove() }); else root.remove(); }catch{ root.remove(); } }, opts.durationMs || 1800);
	return root;
}