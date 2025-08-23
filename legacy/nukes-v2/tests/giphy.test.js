import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { giphySearch } from '../giphy.js';

describe('giphy', () => {
	beforeEach(()=>{
		vi.spyOn(global, 'fetch').mockResolvedValue({ ok:true, json: async ()=> ({ data:[ { images:{ downsized_medium:{ url:'https://media.giphy.com/mock1.gif' } } }, { images:{ downsized_medium:{ url:'https://media.giphy.com/mock2.gif' } } } ] }) });
	});
	afterEach(()=> vi.restoreAllMocks());
	it('returns downsized urls', async () => {
		const res = await giphySearch('villain', { apiKey: 'test' });
		expect(res.length).toBe(2);
		expect(res[0]).toMatch(/giphy/);
	});
	it('throws without key', async () => {
		await expect(giphySearch('x', {})).rejects.toThrow();
	});
});