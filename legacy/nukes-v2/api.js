// Tiny API helpers with timeout and retry logic
// Expose dependency-injected factory for fetch and timers for easy testing

export function createApi({ fetchImpl = fetch, now = Date.now, sleep = (ms)=>new Promise(r=>setTimeout(r,ms)) } = {}){
  async function getJSON(url, { headers = {}, timeoutMs = 10000 } = {}){
    const ctl = new AbortController();
    const to = setTimeout(()=>ctl.abort(new Error('timeout')), timeoutMs);
    try{
      const res = await fetchImpl(url, { headers: { Accept:'application/json', ...headers }, signal: ctl.signal });
      if (!res.ok) throw new Error(String(res.status));
      return await res.json();
    } finally { clearTimeout(to); }
  }

  async function postJSON(url, body, { headers = {}, timeoutMs = 10000 } = {}){
    const ctl = new AbortController();
    const to = setTimeout(()=>ctl.abort(new Error('timeout')), timeoutMs);
    try{
      const res = await fetchImpl(url, { method:'POST', headers: { 'Content-Type':'application/json', ...headers }, body: JSON.stringify(body), signal: ctl.signal });
      return res;
    } finally { clearTimeout(to); }
  }

  async function postNotionWithRetry(body){
    const delays = [0, 2000, 5000];
    for (let i=0;i<delays.length;i++){
      if (delays[i]) await sleep(delays[i]);
      try{
        const r = await postJSON('/.netlify/functions/notion', body);
        if (r.ok) return { ok:true, status:r.status, retry:i };
        if (r.status === 429){
          const ra = parseInt(r.headers.get('Retry-After')||'0',10);
          if (ra>0) await sleep(ra*1000);
          continue;
        }
      }catch{
        // fallthrough to retry
      }
    }
    return { ok:false, status:0, retry:delays.length-1 };
  }

  return { getJSON, postJSON, postNotionWithRetry, now };
}

// default instance
export const api = createApi();
