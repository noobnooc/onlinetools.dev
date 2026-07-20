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
	it('returns nothing for plain prose', () => {
		expect(detect('just some ordinary words here')).toHaveLength(0);
	});
	it('returns nothing for empty input', () => {
		expect(detect('  ')).toHaveLength(0);
	});
});
