import { describe, expect, it } from 'vitest';
import { formatJson, validateJson, offsetToLineCol } from './json';
import { encodeBase64, decodeBase64, isLikelyBase64Text, normalizeBase64 } from './base64';
import { encodeUrl, decodeUrl, parseUrl } from './url';
import { decodeJwt, isLikelyJwt } from './jwt';
import { parseTimestamp, isLikelyTimestamp, formatRelative } from './timestamp';
import { uuidV4, uuidV7, ulid, nanoid, generateIds, isUuid, type RandomFn } from './uuid';
import { hashText, hmacText } from './hash';
import { diffLines } from './diff';
import { testRegex, replaceRegex } from './regex';
import { parseColor, rgbToHsl, hslToRgb, rgbToOklch } from './color';

describe('json', () => {
	it('formats with 2-space indent', () => {
		const r = formatJson('{"b":1,"a":[1,2]}');
		expect(r.ok && r.value).toBe('{\n  "b": 1,\n  "a": [\n    1,\n    2\n  ]\n}');
	});
	it('minifies', () => {
		const r = formatJson(' { "a" : 1 } ', { indent: 'min' });
		expect(r.ok && r.value).toBe('{"a":1}');
	});
	it('sorts keys recursively', () => {
		const r = formatJson('{"b":{"d":1,"c":2},"a":3}', { indent: 'min', sortKeys: true });
		expect(r.ok && r.value).toBe('{"a":3,"b":{"c":2,"d":1}}');
	});
	it('reports line/column on error', () => {
		const r = formatJson('{\n  "a": 1,\n}');
		expect(r.ok).toBe(false);
		if (!r.ok) {
			expect(r.line).toBeGreaterThanOrEqual(1);
		}
	});
	it('validates without formatting', () => {
		expect(validateJson('[1,2,3]').ok).toBe(true);
		expect(validateJson('[1,2,').ok).toBe(false);
	});
	it('offsetToLineCol computes 1-based positions', () => {
		expect(offsetToLineCol('ab\ncd', 3)).toEqual({ line: 2, column: 1 });
		expect(offsetToLineCol('ab\ncd', 0)).toEqual({ line: 1, column: 1 });
	});
});

describe('base64', () => {
	it('round-trips unicode', () => {
		const enc = encodeBase64('héllo 世界 🎉');
		expect(enc.ok).toBe(true);
		if (enc.ok) {
			const dec = decodeBase64(enc.value);
			expect(dec.ok && dec.value).toBe('héllo 世界 🎉');
		}
	});
	it('encodes url-safe without padding', () => {
		const enc = encodeBase64('a?b>c', true);
		expect(enc.ok && !/[+/=]/.test(enc.value as string)).toBe(true);
	});
	it('decodes url-safe and unpadded input', () => {
		expect(normalizeBase64('aGVsbG8')).toBe('aGVsbG8=');
		const dec = decodeBase64('aGVsbG8');
		expect(dec.ok && dec.value).toBe('hello');
	});
	it('rejects invalid alphabet', () => {
		expect(decodeBase64('not base64!!').ok).toBe(false);
	});
	it('flags non-text payloads', () => {
		// 0x00 0x01 0x02 0xff — not valid UTF-8 text
		const r = decodeBase64('AAEC/w==');
		expect(r.ok).toBe(false);
	});
	it('isLikelyBase64Text accepts real encoded text and rejects prose', () => {
		expect(isLikelyBase64Text('aGVsbG8gd29ybGQh')).toBe(true);
		expect(isLikelyBase64Text('hello world')).toBe(false);
	});
});

describe('url', () => {
	it('encodes component mode', () => {
		expect(encodeUrl('a&b=c d')).toEqual({ ok: true, value: 'a%26b%3Dc%20d' });
	});
	it('full-URI mode preserves structure', () => {
		const r = encodeUrl('https://x.com/a b?q=1', false);
		expect(r.ok && r.value).toBe('https://x.com/a%20b?q=1');
	});
	it('decodes + as space', () => {
		expect(decodeUrl('a+b%20c')).toEqual({ ok: true, value: 'a b c' });
	});
	it('rejects malformed escapes', () => {
		expect(decodeUrl('%ZZ').ok).toBe(false);
	});
	it('parses URLs with params', () => {
		const r = parseUrl('https://example.com:8080/path?a=1&a=2&b=x%20y#frag');
		expect(r.ok).toBe(true);
		if (r.ok) {
			expect(r.value.hostname).toBe('example.com');
			expect(r.value.port).toBe('8080');
			expect(r.value.params).toEqual([
				{ key: 'a', value: '1' },
				{ key: 'a', value: '2' },
				{ key: 'b', value: 'x y' }
			]);
		}
	});
	it('assumes https for bare domains', () => {
		const r = parseUrl('example.com/x');
		expect(r.ok && r.value.protocol).toBe('https:');
	});
});

// header {"alg":"HS256","typ":"JWT"} payload {"sub":"123","name":"Ada","iat":1516239022,"exp":1516242622}
const JWT =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
	'eyJzdWIiOiIxMjMiLCJuYW1lIjoiQWRhIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyNDI2MjJ9.' +
	'sig';

describe('jwt', () => {
	it('decodes header and payload', () => {
		const r = decodeJwt(JWT, 1516240000_000);
		expect(r.ok).toBe(true);
		if (r.ok) {
			expect(r.value.header.alg).toBe('HS256');
			expect(r.value.payload.name).toBe('Ada');
			expect(r.value.expired).toBe(false);
			expect(r.value.expiresAt).toBe('2018-01-18T02:30:22.000Z');
		}
	});
	it('flags expiry against injected clock', () => {
		const r = decodeJwt(JWT, 1616242622_000);
		expect(r.ok && r.value.expired).toBe(true);
	});
	it('strips Bearer prefix', () => {
		expect(decodeJwt('Bearer ' + JWT, 0).ok).toBe(true);
	});
	it('rejects non-JWT input', () => {
		expect(decodeJwt('abc.def').ok).toBe(false);
		expect(isLikelyJwt('hello.world.foo')).toBe(false);
		expect(isLikelyJwt(JWT)).toBe(true);
	});
});

describe('timestamp', () => {
	it('parses seconds', () => {
		const r = parseTimestamp('1700000000', 0);
		expect(r.ok).toBe(true);
		if (r.ok) {
			expect(r.value.unit).toBe('seconds');
			expect(r.value.iso).toBe('2023-11-14T22:13:20.000Z');
		}
	});
	it('parses milliseconds by magnitude', () => {
		const r = parseTimestamp('1700000000000', 0);
		expect(r.ok && r.value.unit).toBe('milliseconds');
		expect(r.ok && r.value.unixSeconds).toBe(1700000000);
	});
	it('parses ISO strings', () => {
		const r = parseTimestamp('2023-11-14T22:13:20Z', 0);
		expect(r.ok && r.value.unixSeconds).toBe(1700000000);
	});
	it('rejects nonsense', () => {
		expect(parseTimestamp('not a date').ok).toBe(false);
	});
	it('relative formatting', () => {
		expect(formatRelative(-90_000)).toBe('1 minute ago');
		expect(formatRelative(2 * 24 * 3600_000)).toBe('in 2 days');
	});
	it('isLikelyTimestamp bounds', () => {
		expect(isLikelyTimestamp('1700000000')).toBe(true);
		expect(isLikelyTimestamp('12345')).toBe(false);
	});
});

const seq = (...vals: number[]): RandomFn => {
	return (bytes) => {
		for (let i = 0; i < bytes.length; i++) bytes[i] = vals[i % vals.length];
		return bytes;
	};
};

describe('uuid', () => {
	it('v4 sets version and variant bits', () => {
		const id = uuidV4(seq(0));
		expect(id).toBe('00000000-0000-4000-8000-000000000000');
		expect(isUuid(id)).toBe(true);
	});
	it('v7 leads with the timestamp', () => {
		const id = uuidV7(0x0123456789ab, seq(0xff));
		expect(id.startsWith('01234567-89ab-7')).toBe(true);
		expect(isUuid(id)).toBe(true);
	});
	it('ulid is 26 chars and time-sortable', () => {
		const a = ulid(1000, seq(0));
		const b = ulid(2000, seq(0));
		expect(a).toHaveLength(26);
		expect(a < b).toBe(true);
	});
	it('nanoid has requested length', () => {
		expect(nanoid(21, seq(1, 2, 3))).toHaveLength(21);
	});
	it('batch generation respects count limits', () => {
		const r = generateIds({ kind: 'uuid-v4', count: 3 }, seq(7));
		expect(r.ok && (r.value as string[]).length).toBe(3);
		expect(generateIds({ kind: 'uuid-v4', count: 0 }).ok).toBe(false);
		expect(generateIds({ kind: 'uuid-v4', count: 5000 }).ok).toBe(false);
	});
});

describe('hash', () => {
	it('MD5 matches known vectors', async () => {
		expect((await hashText('', 'MD5'))).toEqual({ ok: true, value: 'd41d8cd98f00b204e9800998ecf8427e' });
		expect((await hashText('abc', 'MD5'))).toEqual({ ok: true, value: '900150983cd24fb0d6963f7d28e17f72' });
		expect(await hashText('The quick brown fox jumps over the lazy dog', 'MD5')).toEqual({
			ok: true,
			value: '9e107d9d372bb6826bd81d3542a419d6'
		});
	});
	it('SHA-256 matches known vector', async () => {
		expect(await hashText('abc', 'SHA-256')).toEqual({
			ok: true,
			value: 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'
		});
	});
	it('HMAC-SHA256 matches RFC 4231 vector', async () => {
		// RFC 4231 test case 2: key "Jefe", data "what do ya want for nothing?"
		expect(await hmacText('what do ya want for nothing?', 'Jefe', 'SHA-256')).toEqual({
			ok: true,
			value: '5bdcc146bf60754e6a042426089575c75a003f089d2739839dec58b964ec3843'
		});
	});
	it('HMAC requires a key', async () => {
		expect((await hmacText('data', '', 'SHA-256')).ok).toBe(false);
	});
});

describe('diff', () => {
	it('marks additions and deletions', () => {
		const { lines, stats } = diffLines('a\nb\nc', 'a\nx\nc');
		expect(stats).toEqual({ added: 1, removed: 1, unchanged: 2 });
		expect(lines.map((l) => l.type)).toEqual(['same', 'del', 'add', 'same']);
	});
	it('handles pure insertion', () => {
		const { stats } = diffLines('a\nc', 'a\nb\nc');
		expect(stats).toEqual({ added: 1, removed: 0, unchanged: 2 });
	});
	it('identical inputs produce no changes', () => {
		const { stats } = diffLines('x\ny', 'x\ny');
		expect(stats.added + stats.removed).toBe(0);
	});
	it('tracks original line numbers', () => {
		const { lines } = diffLines('a\nb', 'b');
		const del = lines.find((l) => l.type === 'del');
		expect(del?.left).toBe(1);
	});
});

describe('regex', () => {
	it('finds all matches with positions', () => {
		const r = testRegex('\\d+', '', 'a1b22c333');
		expect(r.ok).toBe(true);
		if (r.ok) {
			expect(r.value.count).toBe(3);
			expect(r.value.matches[1]).toMatchObject({ text: '22', index: 3, end: 5 });
		}
	});
	it('captures named groups', () => {
		const r = testRegex('(?<year>\\d{4})-(\\d{2})', '', '2026-07');
		expect(r.ok).toBe(true);
		if (r.ok) {
			expect(r.value.matches[0].groups).toContainEqual({ name: 'year', value: '2026' });
		}
	});
	it('reports syntax errors', () => {
		expect(testRegex('(', '', 'x').ok).toBe(false);
	});
	it('survives empty-width matches', () => {
		const r = testRegex('a*', '', 'bab');
		expect(r.ok).toBe(true);
	});
	it('replaces globally', () => {
		expect(replaceRegex('o', '', 'foo', '0')).toEqual({ ok: true, value: 'f00' });
	});
});

describe('color', () => {
	it('parses hex and produces all formats', () => {
		const r = parseColor('#4C8DFF');
		expect(r.ok).toBe(true);
		if (r.ok) {
			expect(r.value.rgb).toBe('rgb(76 141 255)');
			expect(r.value.hex).toBe('#4c8dff');
			expect(r.value.oklch).toMatch(/^oklch\(/);
		}
	});
	it('parses shorthand hex with alpha', () => {
		const r = parseColor('#f008');
		expect(r.ok && r.value.alpha).toBeCloseTo(0.53, 1);
	});
	it('parses rgb() and hsl() syntax', () => {
		const r1 = parseColor('rgb(255, 0, 0)');
		expect(r1.ok && r1.value.hex).toBe('#ff0000');
		const r2 = parseColor('hsl(120 100% 50%)');
		expect(r2.ok && r2.value.hex).toBe('#00ff00');
	});
	it('round-trips rgb → hsl → rgb', () => {
		const [h, s, l] = rgbToHsl(76, 141, 255);
		const [r, g, b] = hslToRgb(h, s, l);
		expect(Math.abs(r - 76)).toBeLessThanOrEqual(1);
		expect(Math.abs(g - 141)).toBeLessThanOrEqual(1);
		expect(Math.abs(b - 255)).toBeLessThanOrEqual(1);
	});
	it('oklch of white is L≈1 C≈0', () => {
		const [L, C] = rgbToOklch(255, 255, 255);
		expect(L).toBeCloseTo(1, 2);
		expect(C).toBeCloseTo(0, 2);
	});
	it('rejects invalid input', () => {
		expect(parseColor('#12345').ok).toBe(false);
		expect(parseColor('nonsense').ok).toBe(false);
	});
});
