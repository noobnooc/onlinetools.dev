import { describe, expect, it } from 'vitest';
import { encodeBytes, decodeBytes, isLikelyHexDump } from './hexbin';

const HEX_OPTS = { format: 'hex', separator: ' ', uppercase: false, prefix: false } as const;

describe('encodeBytes', () => {
	it('encodes text to spaced hex', () => {
		expect(encodeBytes('Hi', HEX_OPTS)).toEqual({ ok: true, value: '48 69' });
	});
	it('supports uppercase and 0x prefixes', () => {
		expect(encodeBytes('Hi', { ...HEX_OPTS, uppercase: true, prefix: true })).toEqual({
			ok: true,
			value: '0x48 0x69'
		});
	});
	it('encodes to binary bytes', () => {
		expect(encodeBytes('A', { ...HEX_OPTS, format: 'binary' })).toEqual({
			ok: true,
			value: '01000001'
		});
	});
	it('forces a separator for decimal output', () => {
		expect(encodeBytes('AB', { ...HEX_OPTS, format: 'decimal', separator: '' })).toEqual({
			ok: true,
			value: '65 66'
		});
	});
	it('encodes UTF-8 multibyte characters', () => {
		const r = encodeBytes('é', { ...HEX_OPTS, separator: '' });
		expect(r).toEqual({ ok: true, value: 'c3a9' });
	});
});

describe('decodeBytes', () => {
	it('decodes continuous hex', () => {
		expect(decodeBytes('48656c6c6f', 'hex')).toEqual({ ok: true, value: 'Hello' });
	});
	it('decodes spaced, colon and 0x-prefixed hex', () => {
		expect(decodeBytes('48 65:6c,6c 6f', 'hex')).toEqual({ ok: true, value: 'Hello' });
		expect(decodeBytes('0x48 0x69', 'hex')).toEqual({ ok: true, value: 'Hi' });
		expect(decodeBytes('\\x48\\x69', 'hex')).toEqual({ ok: true, value: 'Hi' });
	});
	it('round-trips UTF-8', () => {
		const enc = encodeBytes('héllo 世界', { ...HEX_OPTS, separator: '' });
		expect(enc.ok).toBe(true);
		if (enc.ok) expect(decodeBytes(enc.value, 'hex')).toEqual({ ok: true, value: 'héllo 世界' });
	});
	it('decodes binary with and without spaces', () => {
		expect(decodeBytes('01001000 01101001', 'binary')).toEqual({ ok: true, value: 'Hi' });
		expect(decodeBytes('0100100001101001', 'binary')).toEqual({ ok: true, value: 'Hi' });
	});
	it('decodes decimal bytes', () => {
		expect(decodeBytes('72 105', 'decimal')).toEqual({ ok: true, value: 'Hi' });
	});
	it('rejects odd-length hex', () => {
		expect(decodeBytes('abc', 'hex').ok).toBe(false);
	});
	it('rejects invalid UTF-8 byte sequences', () => {
		expect(decodeBytes('ff', 'hex').ok).toBe(false);
	});
	it('rejects out-of-range decimal bytes', () => {
		expect(decodeBytes('256', 'decimal').ok).toBe(false);
	});
});

describe('isLikelyHexDump', () => {
	it('accepts long hex runs and spaced dumps', () => {
		expect(isLikelyHexDump('deadbeefdeadbeef')).toBe(true);
		expect(isLikelyHexDump('48 65 6c 6c 6f 20 77 6f')).toBe(true);
	});
	it('rejects plain decimal numbers and common hash lengths', () => {
		expect(isLikelyHexDump('1234567890123456')).toBe(false);
		expect(isLikelyHexDump('d41d8cd98f00b204e9800998ecf8427e')).toBe(false); // MD5
		expect(isLikelyHexDump('a'.repeat(64))).toBe(false); // SHA-256
	});
});
