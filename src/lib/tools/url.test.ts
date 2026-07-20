import { describe, expect, it } from 'vitest';
import { encodeUrl, decodeUrl, parseUrl } from './url';

describe('encodeUrl', () => {
	it('component mode escapes delimiters', () => {
		expect(encodeUrl('a&b=c d')).toEqual({ ok: true, value: 'a%26b%3Dc%20d' });
		expect(encodeUrl('a/b?c#d')).toEqual({ ok: true, value: 'a%2Fb%3Fc%23d' });
	});
	it('full-URI mode preserves structure', () => {
		const r = encodeUrl('https://x.com/a b?q=1&r=2#frag', false);
		expect(r.ok && r.value).toBe('https://x.com/a%20b?q=1&r=2#frag');
	});
	it('encodes unicode as UTF-8 percent triples', () => {
		expect(encodeUrl('中')).toEqual({ ok: true, value: '%E4%B8%AD' });
		expect(encodeUrl('é')).toEqual({ ok: true, value: '%C3%A9' });
	});
	it('handles empty input', () => {
		expect(encodeUrl('')).toEqual({ ok: true, value: '' });
	});
	it('errors on lone surrogates instead of crashing', () => {
		expect(encodeUrl('\uD800').ok).toBe(false);
	});
});

describe('decodeUrl', () => {
	it('decodes percent escapes', () => {
		expect(decodeUrl('a%26b%3Dc')).toEqual({ ok: true, value: 'a&b=c' });
	});
	it('treats + as space (query-string semantics)', () => {
		expect(decodeUrl('a+b%20c')).toEqual({ ok: true, value: 'a b c' });
	});
	it('decodes UTF-8 sequences', () => {
		expect(decodeUrl('%E4%BD%A0%E5%A5%BD')).toEqual({ ok: true, value: '你好' });
	});
	it('unwraps double encoding in two passes', () => {
		const once = decodeUrl('%2520');
		expect(once.ok && once.value).toBe('%20');
		if (once.ok) expect(decodeUrl(once.value)).toEqual({ ok: true, value: ' ' });
	});
	it('rejects malformed escapes', () => {
		expect(decodeUrl('%ZZ').ok).toBe(false);
		expect(decodeUrl('50%').ok).toBe(false);
	});
});

describe('parseUrl', () => {
	it('parses every component', () => {
		const r = parseUrl('https://example.com:8080/path/to?a=1&a=2&b=x%20y#frag');
		expect(r.ok).toBe(true);
		if (r.ok) {
			expect(r.value.protocol).toBe('https:');
			expect(r.value.hostname).toBe('example.com');
			expect(r.value.host).toBe('example.com:8080');
			expect(r.value.port).toBe('8080');
			expect(r.value.pathname).toBe('/path/to');
			expect(r.value.hash).toBe('#frag');
			expect(r.value.origin).toBe('https://example.com:8080');
			expect(r.value.params).toEqual([
				{ key: 'a', value: '1' },
				{ key: 'a', value: '2' },
				{ key: 'b', value: 'x y' }
			]);
		}
	});
	it('drops default ports (WHATWG normalization)', () => {
		const r = parseUrl('https://example.com:443/x');
		expect(r.ok && r.value.port).toBe('');
		expect(r.ok && r.value.host).toBe('example.com');
	});
	it('normalizes ./ and ../ path segments', () => {
		const r = parseUrl('https://example.com/a/b/../c/./d');
		expect(r.ok && r.value.pathname).toBe('/a/c/d');
	});
	it('lowercases scheme and host', () => {
		const r = parseUrl('HTTPS://EXAMPLE.com/Path');
		expect(r.ok && r.value.hostname).toBe('example.com');
		expect(r.ok && r.value.pathname).toBe('/Path');
	});
	it('assumes https for bare domains', () => {
		const r = parseUrl('example.com/x?y=1');
		expect(r.ok && r.value.protocol).toBe('https:');
	});
	it('handles IPv6 hosts', () => {
		const r = parseUrl('http://[::1]:3000/api');
		expect(r.ok && r.value.hostname).toBe('[::1]');
		expect(r.ok && r.value.port).toBe('3000');
	});
	it('parses non-http schemes', () => {
		const r = parseUrl('ftp://files.example.com/pub');
		expect(r.ok && r.value.protocol).toBe('ftp:');
	});
	it('rejects empty and hopeless input', () => {
		expect(parseUrl('').ok).toBe(false);
		// '%' is invalid in a host outside a proper percent escape.
		expect(parseUrl('%%%').ok).toBe(false);
	});
});
