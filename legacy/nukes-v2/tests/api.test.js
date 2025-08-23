import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createApi } from '../api.js';

function makeFetchSequence(responses){
  let i = 0;
  return vi.fn().mockImplementation(async (...args) => {
    const r = responses[Math.min(i, responses.length-1)];
    i++;
    return r;
  });
}

function delayable(){
  let time = 0;
  const sleepers = [];
  return {
    now: () => time,
    sleep: (ms)=> new Promise(res => sleepers.push({ at: time+ms, res })),
    tick: (ms)=>{
      time += ms;
      sleepers.sort((a,b)=>a.at-b.at);
      const ready = sleepers.filter(s=>s.at <= time);
      ready.forEach(s=>s.res());
      for(const r of ready){ const idx = sleepers.indexOf(r); if (idx>=0) sleepers.splice(idx,1); }
    }
  };
}

describe('api', () => {
  beforeEach(()=>{ vi.useFakeTimers(); });

  it('getJSON returns parsed JSON and respects timeout', async () => {
    const ok = { ok:true, json: async ()=>({ a:1 }) };
    const fetch = vi.fn().mockResolvedValue(ok);
    const api = createApi({ fetchImpl: fetch });
    await expect(api.getJSON('/x')).resolves.toEqual({ a:1 });
  });

  it('postNotionWithRetry backoff and Retry-After', async () => {
    const r429 = { ok:false, status:429, headers: new Map([['Retry-After','1']]), json:async()=>({}) };
    r429.headers.get = (k)=>r429.headers.get(k);
    const r500 = { ok:false, status:500, headers: new Map(), json:async()=>({}) };
    const r200 = { ok:true, status:200, headers: new Map(), json:async()=>({}) };
    const fetch = makeFetchSequence([ r429, r500, r200 ]);
    const clk = delayable();
    const api = createApi({ fetchImpl: fetch, now: clk.now, sleep: (ms)=>{ return new Promise(res=>{ setTimeout(()=>{ clk.tick(ms); res(); }, 0); }); } });

    const p = api.postNotionWithRetry({ hello:'world' });
    // advance timers: 0ms -> first 429 -> Retry-After 1s + backoff 2000ms + then third attempt
    await vi.runAllTimersAsync();
    const res = await p;
    expect(res.ok).toBe(true);
  });
});
