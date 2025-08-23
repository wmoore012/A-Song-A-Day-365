import { describe, it, expect } from 'vitest';
import { handler } from '../netlify/functions/notion-attach-file.js';

const validEvent = {
  body: JSON.stringify({
    notionPageId: 'abc123',
    fileUrl: 'https://files.com/Night_Drive_122bpm_Am_v2.wav',
    collaborators: ['user1', 'user2'],
    contactsDb: { user1: { id: 'n1' }, user2: { id: 'n2' } }
  })
};

describe('notion-attach-file Netlify function', () => {
  it('attaches file and collaborators with parsed meta', async () => {
    const res = await handler(validEvent);
    expect(res.statusCode).toBe(200);
    expect(res.body).toContain('success');
  });

  it('fails loudly on missing fileUrl', async () => {
    const badEvent = { body: JSON.stringify({ notionPageId: 'abc123' }) };
    const res = await handler(badEvent);
    expect(res.statusCode).toBe(400);
    expect(res.body).toContain('Missing fileUrl');
  });

  it('fails loudly on missing notionPageId', async () => {
    const badEvent = { body: JSON.stringify({ fileUrl: 'x.wav' }) };
    const res = await handler(badEvent);
    expect(res.statusCode).toBe(400);
    expect(res.body).toContain('Missing notionPageId');
  });

  it('fails loudly on invalid filename', async () => {
    const badEvent = { body: JSON.stringify({ notionPageId: 'abc123', fileUrl: 'https://files.com/NoTempoKey.wav' }) };
    const res = await handler(badEvent);
    expect(res.statusCode).toBe(422);
    expect(res.body).toContain('Could not parse tempo/key');
  });
});
