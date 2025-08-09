// /netlify/functions/notion.js
// Netlify runtime: Node 18+ (ESM). Needs NOTION_TOKEN + NOTION_DATABASE_ID.
// Optional: CORS_ALLOW_ORIGIN to lock down who can call this function.

import { Client } from '@notionhq/client';

const REQUIRED_ENV = ['NOTION_TOKEN', 'NOTION_DATABASE_ID'];
const ALLOW_ORIGIN = process.env.CORS_ALLOW_ORIGIN || '*';

export async function handler(event) {
  // --- CORS preflight ---
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders() };
  }

  // --- Only POST is allowed ---
  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method Not Allowed' });
  }

  // --- Env guard ---
  const missing = REQUIRED_ENV.filter(k => !process.env[k]);
  if (missing.length) {
    console.error('Missing env vars:', missing);
    return json(500, { error: `Server not configured: missing ${missing.join(', ')}` });
  }

  // --- Parse + validate body ---
  let payload = {};
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return json(400, { error: 'Invalid JSON body' });
  }

  // Validate shape (lightweight schema guard; no silent failure)
  const v = validatePayload(payload);
  if (!v.ok) {
    return json(422, { error: 'Invalid payload', issues: v.issues });
  }

  // We only write when a session is completed.
  if (payload.type && payload.type !== 'session_done') {
    return json(204, { ok: true, skipped: `ignored type ${payload.type}` });
  }

  // Normalize inputs
  const day = num(payload.day_index);
  const dateStr = payload.date || new Date().toISOString().slice(0, 10);
  const streak = num(payload.streak_after);
  const freezes = num(payload.freezes);
  const latency = num(payload.latency_ms);
    const grade = num(payload.grade);
    const startTimeIso = payload.start_time_iso || null;
    const startEpochMs = num(payload.start_epoch_ms);
  const lyrics = str(payload.song_lyrics);
  const beat = str(payload.song_beat || lyrics);
  const sameSong = !!payload.same_song;
  const surveyChoice = str(payload.survey_choice);
  const surveyNote = str(payload.survey_note);
  const igClosed = !!payload.ig_closed;
  const fbClosed = !!payload.fb_closed;
  const ytConsidered = !!payload.yt_closed;

  const w = payload.weather || {};
  const weather = {
    city: str(w.city),
    lat: num(w.lat),
    lon: num(w.lon),
    code: num(w.code),
    temp_c: num(w.temp_c),
    wind: num(w.wind),
  };

  try {
  const notion = new Client({ auth: process.env.NOTION_TOKEN });
  const database_id = process.env.NOTION_DATABASE_ID;

    const title = `Day ${day ?? '—'} — ${dateStr}`;

    // Property names MUST match your Notion DB.
    const properties = {
      'Name': { title: [{ text: { content: title } }] },
      'Date': { date: { start: dateStr } },
      'Day': numberOrNull(day),
      'Streak': numberOrNull(streak),
      'Freeze count': numberOrNull(freezes),
      'Freeze used': { checkbox: !!payload.freeze_used },
      'Start latency (ms)': numberOrNull(latency),
    'Start time': startTimeIso ? { date: { start: startTimeIso } } : { date: null },
    'Start epoch (ms)': numberOrNull(startEpochMs),
      'Grade': numberOrNull(grade),
      'Lyrics song': richText(lyrics),
      'Beat song': richText(beat),
      'Same song': { checkbox: sameSong },
      'IG closed': { checkbox: igClosed },
      'FB closed': { checkbox: fbClosed },
      'YT closed': { checkbox: ytConsidered },
      'City': richText(weather.city),
      'Lat': numberOrNull(weather.lat),
      'Lon': numberOrNull(weather.lon),
      'Weather code': numberOrNull(weather.code),
      'Temp C': numberOrNull(weather.temp_c),
      'Wind m/s': numberOrNull(weather.wind),
  'Survey choice': richText(surveyChoice),
  'Survey note': richText(surveyNote),
    };

  const pagesApi = (globalThis && globalThis.__TEST_NOTION_PAGES__) || notion.pages;
  await pagesApi.create({ parent: { database_id }, properties });
    return json(200, { ok: true });
  } catch (err) {
    console.error('Notion error:', err?.body || err);
    return json(502, { error: err?.body?.message || err?.message || 'Notion API error' });
  }
}

/* ------------- helpers ------------- */
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': ALLOW_ORIGIN,
    'Access-Control-Allow-Methods': 'POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}
function json(statusCode, data) {
  return { statusCode, headers: { 'Content-Type': 'application/json', ...corsHeaders() }, body: JSON.stringify(data) };
}
function num(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}
function numberOrNull(v) {
  return v == null ? { number: null } : { number: v };
}
function str(v) {
  return (typeof v === 'string' ? v : (v == null ? '' : String(v))).slice(0, 2000);
}
function richText(s) {
  return { rich_text: s ? [{ text: { content: s } }] : [] };
}

/* ------------- validation (no deps) ------------- */
export function validatePayload(p){
  const issues = [];
  if (!p || typeof p !== 'object') return { ok:false, issues:['payload must be an object'] };
  if (p.type && p.type !== 'session_done') {
    // allow other types to pass through to 204 skip, but structure should still be object
  }
  const req = ['date','day_index','streak_after'];
  req.forEach(k=>{ if (!(k in p)) issues.push(`missing ${k}`); });
  if (p.date && !/^\d{4}-\d{2}-\d{2}$/.test(p.date)) issues.push('date must be YYYY-MM-DD');
  ['day_index','streak_after','freezes','latency_ms','grade','start_epoch_ms'].forEach(k=>{
    if (p[k] != null && !Number.isFinite(Number(p[k]))) issues.push(`${k} must be number`);
  });
  if (p.weather){
    const w = p.weather;
    if (typeof w !== 'object') issues.push('weather must be object');
    ['lat','lon','code','temp_c','wind'].forEach(k=>{ if (w[k]!=null && !Number.isFinite(Number(w[k]))) issues.push(`weather.${k} must be number`); });
  }
  return { ok: issues.length===0, issues };
}