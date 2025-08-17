export function typeInto(element, text, opts = {}){
	if (!element) throw new Error('typeInto: missing target element');
	const speedMs = Number.isFinite(opts.speedMs) ? Math.max(0, opts.speedMs) : 20;
	const prefix = opts.prefix || '';
	const finalText = String(text ?? '');
	if (opts.neon){
		element.classList.add('neon-type');
	}
	element.textContent = prefix;
	let i = 0;
	return new Promise((resolve) => {
		if (finalText.length === 0){ resolve(); return; }
		const tick = ()=>{
			const next = finalText.charAt(i++);
			element.textContent += next;
			if (i >= finalText.length) { resolve(); return; }
			setTimeout(tick, speedMs);
		};
		setTimeout(tick, speedMs);
	});
}

export function clearTyped(element){ if (!element) throw new Error('clearTyped: missing element'); element.textContent = ''; }