import { describe, it, expect } from 'vitest';
import { parseFilenameMeta } from '../netlify/functions/notion-attach-file.js';

describe('parseFilenameMeta', () => {
  it('extracts tempo and key from filename', () => {
    const m = parseFilenameMeta('Night_Drive_122bpm_Am_v2.wav');
    expect(m.tempo).toBe(122);
    expect(m.key).toBe('AM');
    expect(m.cleanTitle.toLowerCase()).toContain('night drive');
  });
  it('fails loudly if no bpm/key', () => {
    const m = parseFilenameMeta('NoTempoKey.wav');
    expect(m.tempo).toBeUndefined();
    expect(m.key).toBeUndefined();
  });
});
