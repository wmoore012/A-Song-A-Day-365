import { describe, it, expect, beforeEach, vi } from 'vitest';
import { handler as emailHandler } from '../netlify/functions/email.js';

function event(body, method='POST'){
  return { httpMethod: method, body: typeof body === 'string' ? body : JSON.stringify(body || {}) };
}

describe('netlify/functions/email', () => {
  const OLD_ENV = process.env;
  beforeEach(() => { vi.restoreAllMocks(); process.env = { ...OLD_ENV }; });

  it('returns 405 on non-POST', async () => {
    const res = await emailHandler(event({}, 'GET'));
    expect(res.statusCode).toBe(405);
  });

  it('returns 204 on OPTIONS', async () => {
    const res = await emailHandler(event({}, 'OPTIONS'));
    expect(res.statusCode).toBe(204);
  });

  it('rejects when no recipients', async () => {
    const res = await emailHandler(event({ to: [] }));
    expect(res.statusCode).toBe(400);
  });

  it('errors when no provider configured', async () => {
    delete process.env.SENDGRID_API_KEY;
    const res = await emailHandler(event({ to:['a@b.com'], subject:'s', text:'hi' }));
    expect(res.statusCode).toBe(500);
  });

  it('succeeds with SendGrid mocked', async () => {
    process.env.SENDGRID_API_KEY = 'sg_abc';
    process.env.MAIL_FROM = 'no-reply@nukes.local';
    // mock fetch to emulate sendgrid 202
    const ok = { ok:true, status:202, text: async ()=>'OK' };
    const spy = vi.spyOn(global, 'fetch').mockResolvedValue(ok);
    const res = await emailHandler(event({ to:['x@y.com'], subject:'s', html:'<b>yo</b>' }));
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body||'{}').provider).toBe('sendgrid');
    spy.mockRestore();
  });
});
