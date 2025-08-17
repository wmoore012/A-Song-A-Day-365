import { clamp01 } from './hud-utils.js';

export function flipThemeClass(rulerElement, theme){
	if (!rulerElement) throw new Error('flipThemeClass: missing rulerElement');
	rulerElement.classList.remove('is-light','is-dark');
	rulerElement.classList.add(theme === 'light' ? 'is-light' : 'is-dark');
}

export function computeMarkerTranslateY(scrollY, docHeight, viewportH){
	const total = Math.max(1, (docHeight - viewportH));
	const p = clamp01(scrollY / total);
	return p * 100; // vh units
}

export function updateRulerMarker(markerEl, scrollY, docHeight, viewportH){
	if (!markerEl) throw new Error('updateRulerMarker: missing marker element');
	const yvh = computeMarkerTranslateY(scrollY, docHeight, viewportH);
	markerEl.style.transform = `translateY(${yvh}vh)`;
	return yvh;
}

export function bootParallaxMat(gsapRef){
	const gsap = gsapRef || (typeof window !== 'undefined' ? window.gsap : null);
	const ScrollTrigger = (typeof window !== 'undefined' ? window.ScrollTrigger : null);
	if (!gsap || !ScrollTrigger) throw new Error('ParallaxMat: GSAP/ScrollTrigger missing');
	gsap.registerPlugin(ScrollTrigger);

	// Layers
	const layers = Array.from(document.querySelectorAll('.mat-layer'));
	if (!layers.length) throw new Error('ParallaxMat: no .mat-layer elements found');
	layers.forEach(layer => {
		const speed = parseFloat(layer.dataset.speed || '0.2');
		gsap.to(layer, {
			yPercent: () => -speed * 100,
			ease: 'none',
			scrollTrigger: {
				trigger: layer,
				start: 'top bottom',
				end: 'bottom top',
				scrub: true
			}
		});
	});

	// Lasers
	const lasers = Array.from(document.querySelectorAll('#laserDeck .laser'));
	const deck = document.getElementById('laserDeck');
	const sweepLasers = ()=>{
		if (!deck || !lasers.length) return;
		const h = deck.clientHeight || (typeof window !== 'undefined' ? window.innerHeight * 0.3 : 240);
		lasers.forEach((el, i)=>{
			const y = (i+1) * (h/(lasers.length+1));
			gsap.fromTo(el,
				{ y:y-8, opacity:0 },
				{ y:y, opacity:.7, duration:.28, ease:'power1.out',
					onComplete: ()=> gsap.to(el, {opacity:0, duration:.22, ease:'power1.in'})
				}
			);
		});
	};
	layers.forEach(layer=>{
		ScrollTrigger.create({ trigger: layer, start:'top 80%', onEnter: sweepLasers, onEnterBack: sweepLasers });
	});

	// Ruler
	const ruler = document.getElementById('scrollRuler');
	const marker = ruler?.querySelector('.marker');
	if (!ruler || !marker) throw new Error('ParallaxMat: missing #scrollRuler/.marker');
	flipThemeClass(ruler, 'dark');
	const onScrollResize = ()=>{
		const d = (typeof document !== 'undefined' ? document.documentElement.scrollHeight : 0);
		const y = (typeof window !== 'undefined' ? window.scrollY : 0);
		const vh = (typeof window !== 'undefined' ? window.innerHeight : 0);
		updateRulerMarker(marker, y, d, vh);
	};
	onScrollResize();
	if (typeof window !== 'undefined'){
		window.addEventListener('scroll', onScrollResize, { passive:true });
		window.addEventListener('resize', onScrollResize);
	}

	// Theme flip based on current slab in view
	layers.forEach(layer=>{
		const theme = (layer.dataset.theme || 'dark');
		ScrollTrigger.create({
			trigger: layer,
			start: 'top 50%',
			end: 'bottom 50%',
			onEnter: ()=> flipThemeClass(ruler, theme),
			onEnterBack: ()=> flipThemeClass(ruler, theme)
		});
	});

	return { sweepLasers, onScrollResize };
}