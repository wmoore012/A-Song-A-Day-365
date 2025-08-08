// /netlify/functions/notion.js
// Runtime: Node 18+ on Netlify
import { Client } from '@notionhq/client';

const ALLOW_ORIGIN = process.env.CORS_ALLOW_ORIGIN || '*'; // set your domain later for stricter CORS
const REQUIRED_ENV = ['NOTION_TOKEN', 'NOTION_DATABASE_ID'];

export async function handler(event) {
  // --- Preflight CORS ---
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: corsHeaders(),
    };
  }

  // --- Method guard ---
  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method Not Allowed' });
  }

  // --- Env guard ---
  const missing = REQUIRED_ENV.filter(k => !process.env[k]);
  if (missing.length) {
    console.error('Missing env:', missing);
    return json(500, { error: `Server not configured: missing ${missing.join(', ')}` });
  }

  // --- Parse + validate body ---
  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch (e) {
    return json(400, { error: 'Invalid JSON body' });
  }

  // Only persist finished sessions by default
  if (payload.type && payload.type !== 'session_done') {
    return json(204, { ok: true, skipped: `ignored type ${payload.type}` });
  }

  // Minimal required fields
  const day = num(payload.day_index);
  const dateStr = (payload.date || new Date().toISOString().slice(0, 10));
  const streak = num(payload.streak_after);
  const freezes = num(payload.freezes);
  const latency = num(payload.latency_ms);
  const grade = num(payload.grade);
  const lyrics = str(payload.song_lyrics);
  const beat = str(payload.song_beat || lyrics);
  const sameSong = !!payload.same_song;
  const igClosed = !!payload.ig_closed;
  const fbClosed = !!payload.fb_closed;
  const ytConsidered = !!payload.yt_closed; // naming kept from browser

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

    // Build Notion properties. Property names MUST match your DB.
    const properties = {
      'Name': { title: [{ text: { content: title } }] },
      'Date': { date: { start: dateStr } },
      'Day': numberOrNull(day),
      'Streak': numberOrNull(streak),
      'Freeze count': numberOrNull(freezes),
      'Freeze used': { checkbox: false }, // set true if you log this client-side
      'Start latency (ms)': numberOrNull(latency),
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
    };

    await notion.pages.create({ parent: { database_id }, properties });

    return json(200, { ok: true });
  } catch (err) {
    console.error('Notion error:', err?.body || err);
    const msg = err?.body?.message || err?.message || 'Unknown Notion API error';
    return json(502, { error: msg });
  }
}

/* ---------------- helpers ---------------- */
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': ALLOW_ORIGIN,
    'Access-Control-Allow-Methods': 'POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}
function json(statusCode, body) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json', ...corsHeaders() },
    body: JSON.stringify(body),
  };
}
function num(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}
function numberOrNull(v) {
  return v == null ? { number: null } : { number: v };
}
function str(v) {
  return (typeof v === 'string' ? v : (v == null ? '' : String(v))).slice(0, 2000); // keep it safe length-wise
}
function richText(s) {
  return { rich_text: s ? [{ text: { content: s } }] : [] };
}