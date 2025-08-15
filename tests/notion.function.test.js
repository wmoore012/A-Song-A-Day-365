import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock Notion client
vi.mock('@notionhq/client', () => {
  return {
    Client: vi.fn().mockImplementation(() => ({
      pages: { create: vi.fn().mockResolvedValue({ id: 'page_123' }) }
    }))
  };
});

import { handler as notionHandler, validatePayload } from '../netlify/functions/notion.js';

function event(body, method='POST'){
  return { httpMethod: method, body: typeof body === 'string' ? body : JSON.stringify(body || {}) };
}

describe('netlify/functions/notion', () => {
  const OLD_ENV = process.env;
  beforeEach(() => { vi.restoreAllMocks(); process.env = { ...OLD_ENV }; });

  it('returns 405 on non-POST', async () => {
    const res = await notionHandler(event({}, 'GET'));
    expect(res.statusCode).toBe(405);
  });

  it('returns 204 on OPTIONS preflight', async () => {
    const res = await notionHandler(event({}, 'OPTIONS'));
    expect(res.statusCode).toBe(204);
  });

  it('returns 500 if env missing', async () => {
    delete process.env.NOTION_TOKEN; delete process.env.NOTION_DATABASE_ID;
    const res = await notionHandler(event({ type:'session_done' }));
    expect(res.statusCode).toBe(500);
  });

  it('returns 400 on invalid JSON', async () => {
    process.env.NOTION_TOKEN = 't'; process.env.NOTION_DATABASE_ID = 'db';
    const res = await notionHandler({ httpMethod:'POST', body:'{bad json' });
    expect(res.statusCode).toBe(400);
  });

    it('creates a page and returns 200 on valid payload', async () => {
      process.env.NOTION_TOKEN = 't'; process.env.NOTION_DATABASE_ID = 'db';
      const create = vi.fn().mockResolvedValue({ id:'page_123'});
      globalThis.__TEST_NOTION_PAGES__ = { create };
      const payload = {
        type: 'session_done',
        date: '2025-08-09',
        day_index: 10,
        streak_after: 3,
        freezes: 1,
        freeze_used: false,
        latency_ms: 1234,
        grade: 80,
        all_nighter: true,
        survey_choice: 'Low energy',
        survey_note: 'Stayed focused, shorter session',
        ig_closed: true,
        fb_closed: true,
        yt_closed: false,
        start_time_iso: '2025-08-09T12:00:00Z',
        start_epoch_ms: 1754731200000,
        weather: { city:'Charlotte, NC', lat:35.2, lon:-80.84, code:1, temp_c:28, wind:2.1 }
      };
      const res = await notionHandler(event(payload));
      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.body||'{}');
      expect(body.ok).toBe(true);
      const props = create.mock.calls[0][0].properties;
      expect(props['All nighter']).toBeDefined();
      expect(props['All nighter'].checkbox).toBe(true);
    });

  it('optionally attaches external file URLs and infers tempo/key from filename when env is set', async () => {
    process.env.NOTION_TOKEN = 't';
    process.env.NOTION_DATABASE_ID = 'db';
    process.env.NOTION_FILES_PROP = 'Files';
    process.env.NOTION_TEMPO_PROP = 'Tempo';
    process.env.NOTION_KEY_PROP = 'Key';
    const create = vi.fn().mockResolvedValue({ id: 'page_456' });
    globalThis.__TEST_NOTION_PAGES__ = { create };

    const payload = {
      type: 'session_done',
      date: '2025-08-09',
      day_index: 11,
      streak_after: 4,
      file_name: 'My Hit_128bpm_Amin_v2.wav',
      file_urls: ['https://example.com/audio/MyHit.wav'],
    };
    const res = await notionHandler(event(payload));
    expect(res.statusCode).toBe(200);
    const callArgs = create.mock.calls[0][0];
    expect(callArgs.parent.database_id).toBe('db');
    const props = callArgs.properties;
    expect(props.Files).toBeDefined();
    expect(Array.isArray(props.Files.files)).toBe(true);
    expect(props.Files.files[0].external.url).toContain('https://example.com/audio/MyHit.wav');
    expect(props.Tempo).toBeDefined();
    expect(props.Tempo.number).toBe(128);
    expect(props.Key).toBeDefined();
    // Key stored as rich_text for compatibility
    expect(props.Key.rich_text?.[0]?.text?.content).toMatch(/Amin|Amin/i);
  });

  it('rejects invalid payload with 422', async () => {
    process.env.NOTION_TOKEN = 't'; process.env.NOTION_DATABASE_ID = 'db';
    const bad = { type:'session_done', date:'2025/08/09', day_index:'NaN' };
    const res = await notionHandler(event(bad));
    expect(res.statusCode).toBe(422);
  });

  it('validatePayload catches issues and passes good data', () => {
    const bad = validatePayload({});
    expect(bad.ok).toBe(false);
    const ok = validatePayload({ date:'2025-08-09', day_index:1, streak_after:0 });
    expect(ok.ok).toBe(true);
  });
});
