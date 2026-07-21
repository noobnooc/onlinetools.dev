import { describe, expect, it } from 'vitest';
import { detect } from './detectors';

const JWT =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
	'eyJzdWIiOiIxMjMiLCJuYW1lIjoiQWRhIiwiaWF0IjoxNTE2MjM5MDIyfQ.' +
	'abc123';

describe('smart paste detection', () => {
	it('detects JWT above base64', () => {
		const r = detect(JWT);
		expect(r[0]?.type).toBe('jwt');
	});
	it('detects JSON', () => {
		expect(detect('{"a": [1, 2, 3]}')[0]?.type).toBe('json');
	});
	it('detects unix timestamps', () => {
		expect(detect('1700000000')[0]?.type).toBe('timestamp');
	});
	it('detects UUIDs', () => {
		expect(detect('123e4567-e89b-42d3-a456-426614174000')[0]?.type).toBe('uuid');
	});
	it('detects hex colors', () => {
		expect(detect('#4c8dff')[0]?.type).toBe('color');
	});
	it('detects URLs with query strings', () => {
		expect(detect('https://example.com/a?b=1')[0]?.type).toBe('url');
	});
	it('detects percent-encoded text', () => {
		expect(detect('hello%20world%21')[0]?.type).toBe('url-encoded');
	});
	it('detects base64 text', () => {
		const r = detect('aGVsbG8gd29ybGQsIHRoaXMgaXMgYSB0ZXN0');
		expect(r.some((d) => d.type === 'base64')).toBe(true);
	});
	it('detects a JWT even with a Bearer prefix', () => {
		expect(detect('Bearer ' + JWT)[0]?.type).toBe('jwt');
	});
	it('detects rgb()/hsl() colors, not just hex', () => {
		expect(detect('rgb(76 141 255)')[0]?.type).toBe('color');
		expect(detect('hsl(218 100% 65%)')[0]?.type).toBe('color');
	});
	it('millisecond timestamps also register', () => {
		expect(detect('1700000000000')[0]?.type).toBe('timestamp');
	});
	it('orders multiple detections by confidence', () => {
		// A JWT is also base64ish — JWT must win.
		const r = detect(JWT);
		const types = r.map((d) => d.type);
		expect(types.indexOf('jwt')).toBe(0);
	});
	it('every detection points at a real tool slug and has actions', () => {
		for (const input of [JWT, '{"a":1}', '1700000000', '#fff', 'https://x.dev/?a=1', 'hello%20world']) {
			for (const d of detect(input)) {
				expect(d.tool.length).toBeGreaterThan(0);
				expect(d.actions.length).toBeGreaterThan(0);
				expect(d.confidence).toBeGreaterThan(0);
				expect(d.confidence).toBeLessThanOrEqual(1);
			}
		}
	});
	it('detects an image data URL ahead of plain base64', () => {
		const r = detect(
			'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
		);
		expect(r[0]?.type).toBe('image-data-url');
		expect(r[0]?.tool).toBe('image-to-base64');
	});
	it('returns nothing for plain prose', () => {
		expect(detect('just some ordinary words here')).toHaveLength(0);
	});
	it('returns nothing for empty or absurdly large input', () => {
		expect(detect('  ')).toHaveLength(0);
		expect(detect('x'.repeat(600_000))).toHaveLength(0);
	});
});
