// Tiny storage facade around localStorage with sane defaults and clamping
// Keep it dependency-free and easy to unit test by allowing storage injection

const key = (k) => `nk_${k}`;

export function createStorage(store = (typeof localStorage !== 'undefined' ? localStorage : null)){
  // Fall back to in-memory if no localStorage (e.g., tests)
  const mem = new Map();
  const s = store || {
    getItem: (k) => (mem.has(k) ? mem.get(k) : null),
    setItem: (k, v) => mem.set(k, String(v)),
    removeItem: (k) => mem.delete(k)
  };

  const getJSON = (k, def) => {
    try { const v = s.getItem(key(k)); return v ? JSON.parse(v) : def; } catch { return def; }
  };
  const setJSON = (k, v) => { s.setItem(key(k), JSON.stringify(v)); };
  const getNum = (k, def=0) => {
    const raw = s.getItem(key(k));
    if (raw === null || raw === undefined) return def;
    const n = Number(raw);
    return Number.isFinite(n) ? n : def;
  };
  const setNum = (k, v) => { s.setItem(key(k), String(v)); };
  const getStr = (k, def='') => { const v = s.getItem(key(k)); return v ?? def; };
  const setStr = (k, v) => { s.setItem(key(k), String(v)); };
  const getArr = (k, def=[]) => {
    const v = s.getItem(key(k));
    if (!v) return def;
    try { const j = JSON.parse(v); return Array.isArray(j) ? j : def; } catch { return def; }
  };
  const setArr = (k, v) => { s.setItem(key(k), JSON.stringify(Array.isArray(v)?v:[])); };

  const clamp = (v, min=0, max=200) => Math.max(min, Math.min(max, v));

  return {
  // User city prefs
    get city(){ return getJSON('city', null); },
    set city(v){ setJSON('city', v); },
    get streak(){ return getNum('streak', 0); },
    set streak(v){ setNum('streak', v); },
    get freezes(){ return getNum('freezes', 0); },
    set freezes(v){ setNum('freezes', v); },
    get grades(){ return getJSON('grades', []); },
    set grades(v){ setJSON('grades', v); },
    get latencies(){ return getJSON('lat', []); },
    set latencies(v){ setJSON('lat', v); },
    get heat(){ return getJSON('heat', []); },
    set heat(v){ setJSON('heat', v); },
    get llmKey(){ return getStr('or_key', ''); },
    set llmKey(v){ setStr('or_key', v); },
    get llmModel(){ return getStr('or_model', 'mistralai/mistral-small'); },
    set llmModel(v){ setStr('or_model', v); },
    get dayIndex(){ return getNum('day_index', 0); },
    set dayIndex(v){ setNum('day_index', v); },
    get lastDay(){ return getStr('last_day', ''); },
    set lastDay(v){ setStr('last_day', v); },
    get cityCache(){ return getJSON('city_cache', {}); },
    set cityCache(v){ setJSON('city_cache', v); },
    get rotSeed(){ return getNum('rot_seed', 0); },
    set rotSeed(v){ setNum('rot_seed', v); },
    get rotPre(){ return getNum('rot_pre', 0); },
    set rotPre(v){ setNum('rot_pre', v); },
    get rotHype(){ return getNum('rot_hype', 0); },
    set rotHype(v){ setNum('rot_hype', v); },
    get rotShade(){ return getNum('rot_shade', 0); },
    set rotShade(v){ setNum('rot_shade', v); },
    get emails(){ return getJSON('emails', []); },
    set emails(v){ setJSON('emails', v || []); },
    get mult(){ return clamp(getNum('mult', 100), 0, 200); },
    set mult(v){ setNum('mult', clamp(Number(v)||0, 0, 200)); },

    // Heat counts per session
    get heatCounts(){
      const v = getJSON('heat_counts', null);
      const base = { drums:0, vocals:0, keys:0, lyrics:0, bass:0 };
      return v && typeof v === 'object' ? { ...base, ...v } : base;
    },
    set heatCounts(v){
      const base = { drums:0, vocals:0, keys:0, lyrics:0, bass:0 };
      setJSON('heat_counts', { ...base, ...(v||{}) });
    },

  // Song title (user-provided)
  get songTitle(){ return getStr('title', ''); },
  set songTitle(v){ setStr('title', v || ''); },

  // User-configured Studio Vibes source (video or playlist URL)
  get vibesUrl(){ return getStr('vibes_url', ''); },
  set vibesUrl(v){ setStr('vibes_url', v || ''); },

  // Optional: override default music playlist (used for Now Playing at startup)
  get musicUrl(){ return getStr('music_url', ''); },
  set musicUrl(v){ setStr('music_url', v || ''); },

  // Optional: custom hints list (array of YouTube video URLs)
  get hintsUrls(){ return getArr('hints_urls', []); },
  set hintsUrls(v){ setArr('hints_urls', Array.isArray(v)?v:[]); },

    // Heel (villain actor) personalization
    get heelName(){
      const v = getStr('heel_name', '');
      if (v) return v;
      const legacy = getStr('sidekick_name', '');
      if (legacy) { setStr('heel_name', legacy); return legacy; }
      return '';
    },
    set heelName(v){ setStr('heel_name', v || ''); },
    get heelTheme(){ return getStr('heel_theme', 'masc'); }, // masc | fem | custom
    set heelTheme(v){ setStr('heel_theme', v || 'masc'); },
    get heelGifs(){ return getArr('heel_gifs', []); }, // for custom
    set heelGifs(v){ setArr('heel_gifs', v || []); },
    get tone(){ return getNum('tone', 1); },
    set tone(v){ setNum('tone', Number(v)||0); },
  };
}

// Default singleton storage
export const LS = createStorage();
