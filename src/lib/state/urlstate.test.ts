import { describe, expect, it } from 'vitest';
import { encodeState, decodeState, shareUrl, MAX_SHARED_INPUT } from './urlstate';

describe('url state', () => {
	it('round-trips unicode state', () => {
		const state = { input: '{"a": "héllo 世界"}', mode: 'format' };
		const decoded = decodeState('#s=' + encodeState(state));
		expect(decoded).toEqual(state);
	});
	it('produces URL-safe output', () => {
		const enc = encodeState({ input: '???>>>~~~' });
		expect(/^[A-Za-z0-9_-]+$/.test(enc)).toBe(true);
	});
	it('rejects garbage hashes', () => {
		expect(decodeState('#s=!!!not-base64')).toBeNull();
		expect(decodeState('#other=1')).toBeNull();
		expect(decodeState('')).toBeNull();
	});
	it('shareUrl refuses oversized state', () => {
		expect(shareUrl('https://x/t/a', { input: 'x'.repeat(MAX_SHARED_INPUT + 1) })).toBeNull();
		expect(shareUrl('https://x/t/a', { input: 'hi' })).toContain('#s=');
	});
});
