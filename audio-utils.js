export function createMusicDucker(player, opts = {}){
	const targetVolume = Number.isFinite(opts.initialVolume) ? opts.initialVolume : 15;
	let isDucking = false;
	let prevVolume = targetVolume;
	let fadeTimer = null;

	function safeGetVolume(){
		try{ return Number(player.getVolume?.()) || prevVolume; }catch{ return prevVolume; }
	}
	function safeSetVolume(v){
		try{ if (player && player.setVolume) player.setVolume(Math.max(0, Math.min(100, Math.round(v)))); }catch{}
	}
	function clearFade(){ if (fadeTimer) { clearInterval(fadeTimer); fadeTimer = null; } }

	function duckForHints({ target = 5, step = 3, intervalMs = 120 } = {}){
		clearFade();
		isDucking = true;
		prevVolume = safeGetVolume();
		let v = prevVolume;
		fadeTimer = setInterval(()=>{
			v = Math.max(target, v - step);
			safeSetVolume(v);
			if (v <= target){ clearFade(); }
		}, intervalMs);
	}
	function restore(){
		clearFade();
		// restore only if we were ducking
		if (!isDucking) return;
		isDucking = false;
		safeSetVolume(prevVolume);
	}
	function fadeOutAndPause(step = 3, intervalMs = 120){
		clearFade();
		isDucking = true;
		let v = safeGetVolume();
		fadeTimer = setInterval(()=>{
			v = Math.max(0, v - step);
			safeSetVolume(v);
			if (v <= 0){
				clearFade();
				try{ player.pauseVideo?.(); }catch{}
				isDucking = false;
			}
		}, intervalMs);
	}
	function keepUpright(){
		// Call periodically if you want to enforce a floor; avoids accidental dips
		if (!isDucking){ safeSetVolume(targetVolume); }
	}
	return { duckForHints, restore, fadeOutAndPause, keepUpright };
}