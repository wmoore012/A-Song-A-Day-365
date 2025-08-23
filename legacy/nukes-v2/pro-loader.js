export async function bootProPlugins(ctx = {}){
	const proFlag = typeof window !== 'undefined' ? !!window.__PRO__ : false;
	if (!proFlag) return { loaded:false };
	let analyticsLoaded = false, fxLoaded = false;
	try {
		const modA = await import('./pro/analytics-hud.js');
		await modA.bootAnalyticsHud?.(ctx);
		analyticsLoaded = true;
	} catch {}
	try {
		const modF = await import('./pro/fx-overlays.js');
		await modF.bootFxOverlays?.(ctx);
		fxLoaded = true;
	} catch {}
	return { loaded: (analyticsLoaded || fxLoaded), analyticsLoaded, fxLoaded };
}