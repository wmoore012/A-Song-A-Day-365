export function typeInto(element, text, opts = {}){
	if (!element) throw new Error('typeInto: missing target element');
	// Slow down default typing ~2.5x
	const speedMs = Number.isFinite(opts.speedMs) ? Math.max(0, opts.speedMs) : 50;
	const jitterMs = Number.isFinite(opts.jitterMs) ? Math.max(0, opts.jitterMs) : 6;
	const prefix = opts.prefix || '';
	const finalText = String(text ?? '');
	if (opts.neon){ element.classList.add('neon-type'); }
	// optional caret
	let caretEl = null;
	if (opts.caret){
		caretEl = document.createElement('span'); caretEl.className = 'neon-caret'; caretEl.textContent = '|';
	}
	element.textContent = prefix;
	if (caretEl) element.appendChild(caretEl);
	let i = 0;
	return new Promise((resolve) => {
		if (finalText.length === 0){ resolve(); return; }
		const tick = ()=>{
			const next = finalText.charAt(i++);
			// insert before caret if present
			if (caretEl){ caretEl.remove(); element.textContent += next; element.appendChild(caretEl); }
			else { element.textContent += next; }
			if (i >= finalText.length) { resolve(); return; }
			const jitter = Math.random() < 0.5 ? -1 : 1;
			const delay = Math.max(0, speedMs + jitter * Math.floor(Math.random()*jitterMs));
			setTimeout(tick, delay);
		};
		setTimeout(tick, speedMs);
	});
}

export function clearTyped(element){ if (!element) throw new Error('clearTyped: missing element'); element.textContent = ''; }