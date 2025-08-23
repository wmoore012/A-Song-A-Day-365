export function initHamburger(){
	const menu = document.getElementById('tacticalMenu');
	if (!menu) return;
	const overlay = menu.querySelector('.menu-overlay');
	const header = menu.querySelector('.menu-header');
	const burger = document.getElementById('menuHamburger');
	const links = menu.querySelectorAll('.menu-nav a');
	let open = false; let animating = false;
	function openMenu(){ if (animating||open) return; animating=true; open=true; burger?.classList.add('open'); try{ window.gsap && window.gsap.to(overlay,{ scaleY:1, duration:.4, ease:'power3.out' }); window.gsap.utils.toArray('.menu-nav li').forEach((li,i)=>{ window.gsap.set(li,{opacity:0,y:12}); window.gsap.to(li,{opacity:1,y:0, delay:.05*i, duration:.25, ease:'power2.out'}); }); window.gsap.to(menu,{ y:0, duration:.2 }); }catch{} setTimeout(()=>animating=false, 450); }
	function closeMenu(){ if (animating||!open) return; animating=true; open=false; burger?.classList.remove('open'); try{ window.gsap && window.gsap.to(overlay,{ scaleY:0, duration:.35, ease:'power3.inOut' }); }catch{} setTimeout(()=>animating=false, 380); }
	header?.addEventListener('click', ()=> open ? closeMenu() : openMenu());
	links.forEach(a=>{
		a.addEventListener('click', (e)=>{
			const act = a.getAttribute('data-action');
			if (act==='open-city'){ e.preventDefault(); document.getElementById('cityPanel')?.classList.remove('hidden'); closeMenu(); return; }
			if (act==='open-settings'){ e.preventDefault(); document.getElementById('settingsPanel')?.classList.remove('hidden'); closeMenu(); return; }
			// internal anchors scroll
			if (a.getAttribute('href')?.startsWith('#')){ e.preventDefault(); smoothScrollTo(a.getAttribute('href')); closeMenu(); }
		});
	});
	// show menu after mount
	menu.classList.remove('hidden');
}

export function smoothScrollTo(sel){
	const el = document.querySelector(sel);
	if (!el) return false;
	el.scrollIntoView({ behavior:'smooth', block:'start' });
	return true;
}

export function askCookAgainOrDone(onChoice){
	const modal = document.getElementById('cookAgainModal');
	if (!modal) return;
	modal.classList.remove('hidden');
	const again = modal.querySelector('#cookAgainBtn');
	const done = modal.querySelector('#cookDoneBtn');
	again?.addEventListener('click', ()=>{ modal.classList.add('hidden'); onChoice?.('again'); }, { once:true });
	done?.addEventListener('click', ()=>{ modal.classList.add('hidden'); onChoice?.('done'); }, { once:true });
}