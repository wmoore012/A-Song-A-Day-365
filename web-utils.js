// Small pure helpers for parsing and value handling
export function playlistIdFromUrl(u = ''){
  const m = String(u).match(/[?&]list=([^&]+)/);
  return m ? m[1] : null;
}

export function videoIdFromUrl(u = ''){
  // handle youtu.be short links and standard v= param
  const s = String(u);
  const short = s.match(/youtu\.be\/([\w-]{6,})/);
  if (short) return short[1];
  const m = s.match(/[?&]v=([^&]+)/);
  return m ? m[1] : null;
}

export function clampMultiplier(v, min = 0, max = 200){
  const n = Number.isFinite(+v) ? +v : 0;
  return Math.max(min, Math.min(max, n));
}

export function rotatePick(pool, idx = 0){
  const arr = Array.isArray(pool) ? pool : [];
  if (!arr.length) return { value: undefined, nextIdx: 0 };
  const i = Math.abs(Math.trunc(idx)) % arr.length;
  const nextIdx = (i + 1) % arr.length;
  return { value: arr[i], nextIdx };
}

export function bumpMultiplierCalc(prev = 100, delta = 0, min = 0, max = 200){
  return clampMultiplier((Number.isFinite(+prev) ? +prev : 0) + (Number.isFinite(+delta) ? +delta : 0), min, max);
}

// Build an Open-in-YouTube link from a video URL or ID
export function openInYouTubeHrefFor(input){
  const id = videoIdFromUrl(input) || String(input || '').trim();
  if (!id) return null;
  return `https://www.youtube.com/watch?v=${id}`;
}
