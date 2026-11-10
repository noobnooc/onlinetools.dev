import { describe, expect, it } from 'vitest';
import { encodeUrl, decodeUrl, parseUrl, queryToJson, jsonToQuery } from './url';

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

describe('queryToJson', () => {
	const parse = (s: string) => {
		const r = queryToJson(s);
		if (!r.ok) throw new Error(r.error);
		return JSON.parse(r.value);
	};
	it('reads a full URL, a ?query and a bare query', () => {
		const want = { q: 'hello world', page: '2' };
		expect(parse('https://example.com/search?q=hello+world&page=2#top')).toEqual(want);
		expect(parse('?q=hello%20world&page=2')).toEqual(want);
		expect(parse('q=hello+world&page=2')).toEqual(want);
	});
	it('collects repeated keys into an array', () => {
		expect(parse('tag=a&tag=b&tag=c')).toEqual({ tag: ['a', 'b', 'c'] });
	});
	it('expands bracket notation', () => {
		expect(parse('tags[]=a&tags[]=b&user[name]=Ada&user[address][city]=London')).toEqual({
			tags: ['a', 'b'],
			user: { name: 'Ada', address: { city: 'London' } }
		});
		expect(parse('items[0][id]=1&items[0][qty]=2&items[1][id]=7')).toEqual({
			items: [{ id: '1', qty: '2' }, { id: '7' }]
		});
		expect(parse('a[5]=x')).toEqual({ a: { '5': 'x' } });
	});
	it('decodes percent-encoded brackets and UTF-8', () => {
		expect(parse('user%5Bname%5D=%E4%BD%A0%E5%A5%BD')).toEqual({ user: { name: '你好' } });
	});
	it('keeps empty values and flag-style keys', () => {
		expect(parse('a=&b')).toEqual({ a: '', b: '' });
	});
	it('does not treat __proto__ specially', () => {
		const v = parse('__proto__[x]=1');
		expect(Object.hasOwn(v, '__proto__')).toBe(true);
		expect(({} as Record<string, unknown>).x).toBeUndefined();
	});
	it('errors helpfully', () => {
		expect(queryToJson('').ok).toBe(false);
		expect(queryToJson('https://example.com/path')).toMatchObject({ ok: false, error: 'This URL has no query string' });
		expect(queryToJson('a=1&a[b]=2').ok).toBe(false);
		expect(queryToJson('a[b]=1&a=2').ok).toBe(false);
		expect(queryToJson('a[]=1&a[5]=2').ok).toBe(false);
	});
});

describe('jsonToQuery', () => {
	it('serializes scalars, arrays and nested objects', () => {
		const r = jsonToQuery(
			JSON.stringify({ q: 'hello world', page: 2, safe: true, empty: null, tag: ['a', 'b'], user: { name: 'Ada' } })
		);
		expect(r).toEqual({ ok: true, value: 'q=hello+world&page=2&safe=true&empty=&tag=a&tag=b&user[name]=Ada' });
	});
	it('indexes arrays of objects and encodes reserved characters', () => {
		const r = jsonToQuery(JSON.stringify({ items: [{ id: 1 }, { id: 2 }], 'a&b': 'c=d', city: 'São Paulo' }));
		expect(r).toEqual({ ok: true, value: 'items[0][id]=1&items[1][id]=2&a%26b=c%3Dd&city=S%C3%A3o+Paulo' });
	});
	it('round-trips through queryToJson', () => {
		const obj = { q: 'x y', tag: ['a', 'b'], user: { name: 'Ada', address: { city: 'London' } }, items: [{ id: '1' }, { id: '2' }] };
		const qs = jsonToQuery(JSON.stringify(obj));
		expect(qs.ok).toBe(true);
		const back = qs.ok ? queryToJson(qs.value) : qs;
		expect(back.ok && JSON.parse(back.value)).toEqual(obj);
	});
	it('rejects non-objects', () => {
		expect(jsonToQuery('[1,2]').ok).toBe(false);
		expect(jsonToQuery('"x"').ok).toBe(false);
		expect(jsonToQuery('{bad').ok).toBe(false);
	});
});
