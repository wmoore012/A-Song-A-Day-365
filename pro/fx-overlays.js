// License: Business Source License 1.1 (BSL)
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

	// Helper to add a looping overlay video (screen blend)
	function addOverlayVideo(src, opacity=0.12){
		const v = el('video', {
			playsInline:true, muted:true, loop:true, autoplay:true,
			className:'overlayVideo'
		}, deck);
		Object.assign(v.style, {
			position:'absolute', inset:'0', width:'100%', height:'100%', objectFit:'cover',
			mixBlendMode:'screen', opacity:String(opacity), filter:'contrast(1.05) brightness(1.02)'
		});
		const s = el('source', { src: asset(src), type:'video/mp4' }, v);
		return v;
	}
	function addFrame(src, opacity=0.18){
		const img = el('img', { src: asset(src), alt:'', 'aria-hidden':'true' }, deck);
		Object.assign(img.style, {
			position:'absolute', inset:'0', width:'100%', height:'100%', objectFit:'cover',
			opacity:String(opacity), pointerEvents:'none'
		});
		return img;
	}

	// Mount 1 burn + 1 dust + 1 frame if available
	addOverlayVideo(burns[0], 0.10);
	addOverlayVideo(dust[0], 0.08);
	addFrame(frames[2], 0.16);

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