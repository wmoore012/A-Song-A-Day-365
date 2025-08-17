export function initHamburger(){
	const btn = document.getElementById('menuToggle');
	const nav = document.getElementById('menuPanel');
	if (!btn || !nav) return;
	btn.addEventListener('click', ()=> nav.classList.toggle('open'));
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