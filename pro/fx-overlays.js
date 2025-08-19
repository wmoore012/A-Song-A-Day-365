// Proprietary. All rights reserved.
// Premium FX overlays (film burn, glitch, cursor trail)

function el(tag, attrs={}, parent){
	const e = document.createElement(tag);
	Object.entries(attrs).forEach(([k,v])=>{
		if (k === 'style' && typeof v === 'object') Object.assign(e.style, v);
		else if (k in e) e[k] = v; else e.setAttribute(k, v);
	});
	if (parent) parent.appendChild(e);
	return e;
}

function asset(path){ return encodeURI(path); }

export function shouldCrossfade(currentTime, duration, threshold = 0.3){
	if (!Number.isFinite(currentTime) || !Number.isFinite(duration) || duration <= 0) return false;
	// threshold is seconds remaining to start crossfade (enforce a small floor)
	const floor = Math.max(0.2, threshold);
	return (duration - currentTime) <= floor + 1e-6; // include boundary
}

function addCrossfadedLoop(parent, src, baseOpacity = 0.12){
	const style = {
		position:'absolute', inset:'0', width:'100%', height:'100%', objectFit:'cover',
		mixBlendMode:'screen', filter:'contrast(1.05) brightness(1.02)', transition:'opacity 240ms ease'
	};
	const v1 = el('video', { playsInline:true, muted:true, loop:false, autoplay:true }, parent);
	const v2 = el('video', { playsInline:true, muted:true, loop:false, autoplay:false }, parent);
	Object.assign(v1.style, style, { opacity:String(baseOpacity) });
	Object.assign(v2.style, style, { opacity:'0' });
	el('source', { src: asset(src), type:'video/mp4' }, v1);
	el('source', { src: asset(src), type:'video/mp4' }, v2);
	let active = v1, idle = v2;
	function tick(){
		try{
			const d = active.duration || 0; const t = active.currentTime || 0;
			if (shouldCrossfade(t, d)){
				idle.currentTime = 0;
				idle.play().catch(()=>{});
				// crossfade
				idle.style.opacity = String(baseOpacity);
				active.style.opacity = '0';
				const old = active; active = idle; idle = old;
			}
		}catch{}
	}
	active.addEventListener('timeupdate', tick);
	active.addEventListener('ended', ()=>{ try{ active.currentTime = 0; active.play(); }catch{} });
	return { v1, v2 };
}

export async function bootFxOverlays(){
	if (typeof document === 'undefined') return { mounted:false };
	// Respect reduced motion
	try{ if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return { mounted:false }; }catch{}

	// Build overlay deck
	const deck = el('div', { id:'fxOverlay' }, document.body);
	Object.assign(deck.style, {
		position:'fixed', inset:'0', zIndex:'850', pointerEvents:'none'
	});

	// Candidate assets (MOV/PNG). They can have spaces; we encode URIs.
	const burns = [
		'pro/video/BURN_01-H.264.mov',
		'pro/video/BURN_02-H.264.mov',
		'pro/video/BURN 03-H.264.mov',
		'video/TC - FILM BURNS - FLASH BURNS_12.mov',
		'video/TC - FILM BURNS - FLASH BURNS_14.mov'
	];
	const dust = [
		'pro/video/TC - DUST & SCRATCHES SUBTLE_2.mov',
		'pro/video/TC - ARTIFACTS - FLASH FRAMES_1.mov',
		'pro/video/TC - ARTIFACTS - FLASH FRAMES_4.mov'
	];
	const frames = [
		'pro/video/TC - 35mm_MATTE.png',
		'pro/video/TC - SUPER 185 W CROSSHAIR - BLACK.png',
		'pro/video/TC - VIEWFINDER 235 - BLACK.png'
	];

	// Mount crossfaded loops for seamless look
	addCrossfadedLoop(deck, burns[0], 0.10);
	addCrossfadedLoop(deck, dust[0], 0.08);
	// Frame overlay
	const img = el('img', { src: asset(frames[2]), alt:'', 'aria-hidden':'true' }, deck);
	Object.assign(img.style, { position:'absolute', inset:'0', width:'100%', height:'100%', objectFit:'cover', opacity:'0.16', pointerEvents:'none' });

	// Grain on wallpaper color via matte png
	const grain = el('div', { id:'grainOverlay' }, deck);
	Object.assign(grain.style, {
		position:'absolute', inset:'0', backgroundImage:`url(${asset(frames[0])})`, backgroundSize:'cover',
		opacity:'0.08', mixBlendMode:'overlay', pointerEvents:'none'
	});

	// Screen flicker panel inside content (if container exists)
	const host = document.querySelector('.mat-content');
	if (host){
		const panel = el('div', { className:'screenFlicker' }, host);
		Object.assign(panel.style, {
			position:'relative', width:'min(420px, 92vw)', aspectRatio:'16/9',
			border:'1px solid rgba(255,255,255,.12)', borderRadius:'12px',
			overflow:'hidden', boxShadow:'0 10px 28px rgba(0,0,0,.35)', margin:'10px 0'
		});
		const vid = el('video', { playsInline:true, muted:true, loop:true, autoplay:true }, panel);
		Object.assign(vid.style, { width:'100%', height:'100%', objectFit:'cover', filter:'grayscale(.1) contrast(1.15) brightness(.95)' });
		el('source', { src: asset(dust[1]), type:'video/mp4' }, vid);
		// Flicker via CSS or GSAP
		const style = el('style', {}, document.head);
		style.textContent = `@keyframes screenFlicker{0%,92%{opacity:.85}95%{opacity:.6}100%{opacity:.85}} .screenFlicker video{animation:screenFlicker 3.6s ease-in-out infinite}`;
		try{ if (window.gsap){ window.gsap.to(panel, { opacity:.88, duration:.1, yoyo:true, repeat:-1, repeatDelay:3.2, ease:'power1.inOut' }); } }catch{}
	}

	// Global toggle
	window.toggleFx = (on=true)=>{ deck.style.display = on ? 'block' : 'none'; };

	return { mounted:true };
}