// /netlify/functions/notion-health.js
// Quick connectivity check for Notion integration and DB access.
// Returns actionable diagnostics (no secrets leaked).

import { Client } from '@notionhq/client';

const ALLOW_ORIGIN = process.env.CORS_ALLOW_ORIGIN || '*';
const REQUIRED_ENV = ['NOTION_TOKEN', 'NOTION_DATABASE_ID'];

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': ALLOW_ORIGIN,
    'Access-Control-Allow-Methods': 'GET,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}
function json(statusCode, data) {
  return { statusCode, headers: { 'Content-Type': 'application/json', ...corsHeaders() }, body: JSON.stringify(data) };
}

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: corsHeaders() };
  if (event.httpMethod !== 'GET') return json(405, { error: 'Method Not Allowed' });

  const missing = REQUIRED_ENV.filter(k => !process.env[k]);
  if (missing.length) {
    return json(500, { ok: false, error: `Server not configured: missing ${missing.join(', ')}` });
  }

  if (process.env.NOTION_TOKEN === 'test') {
    return json(200, {
      ok: true,
      checks: {
        env: 'ok',
        token: 'ok',
        database_access: 'ok (mock)',
      }
    });
  }

  try {
    const notion = new Client({ auth: process.env.NOTION_TOKEN });
    const database_id = process.env.NOTION_DATABASE_ID;
    // Fetch minimal DB info to verify token + share + access
    const db = await notion.databases.retrieve({ database_id });
    const propNames = Object.keys(db?.properties || {});
    return json(200, {
      ok: true,
      checks: {
        env: 'ok',
        token: 'ok',
        database_access: 'ok',
      },
      database: {
        id: db?.id,
        title: (db?.title?.[0]?.plain_text) || null,
        properties: propNames,
      }
    });
  } catch (err) {
    const code = err?.status || 502;
    const message = err?.body?.message || err?.message || 'Notion API error';
    const hint = hintFromNotionError(err);
    return json(code, { ok: false, error: message, hint });
  }
}

function hintFromNotionError(err) {
  const status = err?.status;
  const msg = (err?.body?.message || err?.message || '').toLowerCase();
  if (status === 401) return 'Unauthorized: Verify NOTION_TOKEN matches your integration secret.';
  if (status === 404 || msg.includes('could not find')) return 'Not found: Double-check NOTION_DATABASE_ID.';
  if (status === 403 || msg.includes('restricted resource')) return 'Permission denied: Share the database with your integration in Notion (Settings > Connections).';
  return 'See the Notion error message; common fixes: share DB with the integration, confirm token, confirm DB ID.';
}
