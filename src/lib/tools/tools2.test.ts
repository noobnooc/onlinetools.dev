import { describe, expect, it } from 'vitest';
import { convertCase, tokenize, textStats, loremIpsum, slugify, processLines, type RandomInt } from './text';
import { encodeEntities, decodeEntities } from './htmlentities';
import { inspectChars, unicodeSummary } from './unicode';
import { parseCron, nextRuns } from './cron';
import { generatePasswords, strengthOf } from './password';
import { generateQr } from './qr';
import {
	convertData,
	detectFormat,
	jsonToCsv,
	jsonToTypescript,
	queryJsonPath
} from './dataconvert';
import { bcryptHash, bcryptVerify, bcryptInfo } from './bcrypt';
import { parseUserAgent } from './useragent';

const fixedRand: RandomInt = (max) => 0 % max;

describe('case converter', () => {
	it('tokenizes identifiers', () => {
		expect(tokenize('getUserByID')).toEqual(['get', 'user', 'by', 'id']);
		expect(tokenize('HTTP_response-code')).toEqual(['http', 'response', 'code']);
	});
	it('converts between styles', () => {
		expect(convertCase('user account id', 'camel')).toBe('userAccountId');
		expect(convertCase('userAccountId', 'snake')).toBe('user_account_id');
		expect(convertCase('user_account_id', 'pascal')).toBe('UserAccountId');
		expect(convertCase('UserAccountId', 'kebab')).toBe('user-account-id');
		expect(convertCase('user-account-id', 'constant')).toBe('USER_ACCOUNT_ID');
		expect(convertCase('USER_ACCOUNT_ID', 'title')).toBe('User Account Id');
	});
	it('handles multiline batch input', () => {
		expect(convertCase('first line\nsecondLine', 'snake')).toBe('first_line\nsecond_line');
	});
});

describe('text stats', () => {
	it('counts everything', () => {
		const s = textStats('Hello world. This is a test!\n\nSecond paragraph here.');
		expect(s.words).toBe(9);
		expect(s.sentences).toBe(3);
		expect(s.paragraphs).toBe(2);
		expect(s.lines).toBe(3);
	});
	it('counts unicode by code points and bytes separately', () => {
		const s = textStats('日本語');
		expect(s.characters).toBe(3);
		expect(s.bytes).toBe(9);
	});
	it('empty input is all zeros', () => {
		expect(textStats('').words).toBe(0);
		expect(textStats('').lines).toBe(0);
	});
});

describe('lorem ipsum', () => {
	it('generates the requested word count', () => {
		const r = loremIpsum({ unit: 'words', count: 10, startClassic: false }, fixedRand);
		expect(r.ok && (r.value as string).split(' ')).toHaveLength(10);
	});
	it('classic start begins with lorem ipsum', () => {
		const r = loremIpsum({ unit: 'sentences', count: 2 }, fixedRand);
		expect(r.ok && (r.value as string).startsWith('Lorem ipsum dolor sit amet')).toBe(true);
	});
	it('rejects silly counts', () => {
		expect(loremIpsum({ unit: 'words', count: 0 }).ok).toBe(false);
	});
});

describe('slugify', () => {
	it('slugs a title', () => {
		expect(slugify("Hello, World! It's 2026")).toBe('hello-world-its-2026');
	});
	it('transliterates diacritics', () => {
		expect(slugify('Crème brûlée à Paris')).toBe('creme-brulee-a-paris');
	});
	it('supports underscore separator', () => {
		expect(slugify('a b c', { separator: '_' })).toBe('a_b_c');
	});
	it('respects max length at word boundary', () => {
		expect(slugify('one two three four', { maxLength: 11 })).toBe('one-two');
	});
});

describe('line tools', () => {
	it('dedupes preserving order', () => {
		const r = processLines('b\na\nb\nc\na', { dedupe: true });
		expect(r.output).toBe('b\na\nc');
		expect(r.removed).toBe(2);
	});
	it('sorts naturally', () => {
		const r = processLines('item10\nitem2\nitem1', { sort: 'natural' });
		expect(r.output).toBe('item1\nitem2\nitem10');
	});
	it('trims and removes empties', () => {
		const r = processLines('  a  \n\n b ', { trim: true, removeEmpty: true });
		expect(r.output).toBe('a\nb');
	});
});

describe('html entities', () => {
	it('encodes essentials', () => {
		expect(encodeEntities('<a href="x">&</a>')).toBe('&lt;a href=&quot;x&quot;&gt;&amp;&lt;/a&gt;');
	});
	it('encodes non-ascii when asked, numerically', () => {
		expect(encodeEntities('café', { all: true, numeric: true })).toBe('caf&#xE9;');
	});
	it('decodes named, decimal and hex', () => {
		const r = decodeEntities('&lt;b&gt; &#169; &#xA9; &rarr;');
		expect(r.ok && r.value).toBe('<b> © © →');
	});
	it('round-trips', () => {
		const original = '<script>alert("x & y")</script>';
		const enc = encodeEntities(original);
		const dec = decodeEntities(enc);
		expect(dec.ok && dec.value).toBe(original);
	});
});

describe('unicode inspector', () => {
	it('reports code points and encodings', () => {
		const [info] = inspectChars('€');
		expect(info.codePointHex).toBe('U+20AC');
		expect(info.utf8).toBe('E2 82 AC');
		expect(info.utf16).toBe('\\u20AC');
	});
	it('handles astral plane characters', () => {
		const [info] = inspectChars('🎉');
		expect(info.codePoint).toBe(0x1f389);
		expect(info.utf16.split(' ')).toHaveLength(2);
		expect(info.jsEscape).toBe('\\u{1F389}');
	});
	it('summary distinguishes graphemes from code points', () => {
		const s = unicodeSummary('é'); // e + combining accent
		expect(s.codePoints).toBe(2);
		expect(s.graphemes).toBe(1);
	});
});

describe('cron', () => {
	it('parses a simple expression', () => {
		const r = parseCron('30 9 * * 1-5');
		expect(r.ok).toBe(true);
		if (r.ok) {
			expect(r.value.fields[0].values).toEqual([30]);
			expect(r.value.fields[4].values).toEqual([1, 2, 3, 4, 5]);
			expect(r.value.description).toMatch(/09:30/);
		}
	});
	it('supports steps, names and macros', () => {
		const r = parseCron('*/15 * * jan,jul sun');
		expect(r.ok).toBe(true);
		if (r.ok) {
			expect(r.value.fields[0].values).toEqual([0, 15, 30, 45]);
			expect(r.value.fields[3].values).toEqual([1, 7]);
			expect(r.value.fields[4].values).toEqual([0]);
		}
		const m = parseCron('@daily');
		expect(m.ok && m.value.fields[1].values).toEqual([0]);
	});
	it('treats 7 as Sunday', () => {
		const r = parseCron('0 0 * * 7');
		expect(r.ok && r.value.fields[4].values).toEqual([0]);
	});
	it('rejects bad input with a specific message', () => {
		expect(parseCron('61 * * * *').ok).toBe(false);
		expect(parseCron('* * * *').ok).toBe(false);
		const six = parseCron('0 0 0 * * *');
		expect(!six.ok && six.error).toMatch(/Quartz/);
	});
	it('computes next runs', () => {
		const r = parseCron('30 9 * * *');
		expect(r.ok).toBe(true);
		if (r.ok) {
			// 2026-01-01 00:00 local
			const from = new Date(2026, 0, 1, 0, 0, 0).getTime();
			const runs = nextRuns(r.value, from, 3);
			expect(runs).toHaveLength(3);
			const first = new Date(runs[0]);
			expect(first.getHours()).toBe(9);
			expect(first.getMinutes()).toBe(30);
			expect(first.getDate()).toBe(1);
			expect(runs[1] - runs[0]).toBe(24 * 3600_000);
		}
	});
	it('respects day-of-week restrictions in next runs', () => {
		const r = parseCron('0 12 * * 0');
		expect(r.ok).toBe(true);
		if (r.ok) {
			const from = new Date(2026, 6, 20, 0, 0, 0).getTime(); // Monday 2026-07-20
			const [next] = nextRuns(r.value, from, 1);
			expect(new Date(next).getDay()).toBe(0);
		}
	});
});

describe('password generator', () => {
	it('generates requested length and count', () => {
		const r = generatePasswords({ length: 16, count: 3, symbols: true });
		expect(r.ok).toBe(true);
		if (r.ok) {
			expect(r.value.passwords).toHaveLength(3);
			expect(r.value.passwords[0]).toHaveLength(16);
			expect(r.value.entropyBits).toBeGreaterThan(80);
		}
	});
	it('includes at least one char from each enabled set', () => {
		const r = generatePasswords({ length: 8, digits: true, upper: true, lower: true });
		expect(r.ok).toBe(true);
		if (r.ok) {
			for (const pw of r.value.passwords) {
				expect(/[a-z]/.test(pw)).toBe(true);
				expect(/[A-Z]/.test(pw)).toBe(true);
				expect(/[0-9]/.test(pw)).toBe(true);
			}
		}
	});
	it('excludes ambiguous characters when asked', () => {
		const r = generatePasswords({ length: 64, excludeAmbiguous: true });
		expect(r.ok && !/[0O1lI]/.test((r.value as { passwords: string[] }).passwords[0])).toBe(true);
	});
	it('maps entropy to strength labels', () => {
		expect(strengthOf(30)).toBe('weak');
		expect(strengthOf(60)).toBe('fair');
		expect(strengthOf(90)).toBe('strong');
		expect(strengthOf(130)).toBe('excellent');
	});
});

describe('qr code', () => {
	it('produces an svg with finder patterns', () => {
		const r = generateQr('https://onlinetools.dev');
		expect(r.ok).toBe(true);
		if (r.ok) {
			expect(r.value.svg).toContain('<svg');
			expect(r.value.moduleCount).toBeGreaterThanOrEqual(21);
			expect(r.value.matrix[0][0]).toBe(true); // finder pattern corner is dark
		}
	});
	it('rejects empty and oversized input', () => {
		expect(generateQr('').ok).toBe(false);
		expect(generateQr('x'.repeat(3000)).ok).toBe(false);
	});
});

describe('data conversion', () => {
	it('converts JSON to YAML and back', () => {
		const json = '{"name":"test","list":[1,2],"nested":{"a":true}}';
		const yaml = convertData(json, 'json', 'yaml');
		expect(yaml.ok && yaml.value).toContain('name: test');
		if (yaml.ok) {
			const back = convertData(yaml.value, 'yaml', 'json');
			expect(back.ok && JSON.parse(back.value as string)).toEqual(JSON.parse(json));
		}
	});
	it('converts to TOML and rejects non-table roots', () => {
		const r = convertData('{"title":"x","owner":{"name":"y"}}', 'json', 'toml');
		expect(r.ok && r.value).toContain('title = "x"');
		expect(convertData('[1,2]', 'json', 'toml').ok).toBe(false);
	});
	it('detects formats', () => {
		expect(detectFormat('{"a":1}')).toBe('json');
		expect(detectFormat('a: 1\nb: 2')).toBe('yaml');
		expect(detectFormat('[server]\nhost = "x"')).toBe('toml');
	});
	it('reports yaml errors', () => {
		expect(convertData('a: [1, 2', 'yaml', 'json').ok).toBe(false);
	});
});

describe('json to csv', () => {
	it('flattens objects and unions columns', () => {
		const r = jsonToCsv('[{"a":1,"b":{"c":2}},{"a":3,"d":"x,y"}]');
		expect(r.ok).toBe(true);
		if (r.ok) {
			const lines = r.value.csv.split('\n');
			expect(lines[0]).toBe('a,b.c,d');
			expect(lines[1]).toBe('1,2,');
			expect(lines[2]).toBe('3,,"x,y"');
		}
	});
	it('escapes quotes and newlines', () => {
		const r = jsonToCsv('[{"t":"say \\"hi\\"\\nplease"}]');
		expect(r.ok && r.value.csv).toContain('"say ""hi""\nplease"');
	});
});

describe('json to typescript', () => {
	it('infers interfaces with nesting and arrays', () => {
		const r = jsonToTypescript('{"id":1,"tags":["a"],"meta":{"ok":true},"opt":null}', 'User');
		expect(r.ok).toBe(true);
		if (r.ok) {
			expect(r.value).toContain('export interface User {');
			expect(r.value).toContain('id: number;');
			expect(r.value).toContain('tags: string[];');
			expect(r.value).toContain('opt: null;');
		}
	});
	it('quotes non-identifier keys and handles mixed arrays', () => {
		const r = jsonToTypescript('{"my-key":[1,"a"]}');
		expect(r.ok && r.value).toContain('"my-key": (number | string)[];');
	});
});

describe('jsonpath', () => {
	const DOC = '{"store":{"book":[{"title":"A","price":10},{"title":"B","price":20}],"bicycle":{"price":5}}}';
	it('resolves dot and bracket paths', () => {
		const r = queryJsonPath(DOC, '$.store.book[0].title');
		expect(r.ok && r.value[0]).toEqual({ path: '$.store.book[0].title', value: 'A' });
	});
	it('supports wildcards', () => {
		const r = queryJsonPath(DOC, '$.store.book[*].price');
		expect(r.ok && r.value.map((m) => m.value)).toEqual([10, 20]);
	});
	it('supports recursive descent', () => {
		const r = queryJsonPath(DOC, '$..price');
		expect(r.ok && r.value.map((m) => m.value).sort()).toEqual([10, 20, 5].sort());
	});
	it('supports negative indices and unions', () => {
		const r = queryJsonPath(DOC, '$.store.book[-1].title');
		expect(r.ok && r.value[0]?.value).toBe('B');
		const u = queryJsonPath(DOC, "$.store['book','bicycle']");
		expect(u.ok && u.value).toHaveLength(2);
	});
	it('errors on filters and bad syntax', () => {
		expect(queryJsonPath(DOC, '$..book[?(@.price<10)]').ok).toBe(false);
		expect(queryJsonPath(DOC, 'store.book').ok).toBe(false);
	});
});

describe('bcrypt', () => {
	it('hashes and verifies (low cost for test speed)', async () => {
		const h = await bcryptHash('s3cret', 4);
		expect(h.ok).toBe(true);
		if (h.ok) {
			const good = await bcryptVerify('s3cret', h.value.hash);
			expect(good.ok && good.value).toBe(true);
			const bad = await bcryptVerify('wrong', h.value.hash);
			expect(bad.ok && bad.value).toBe(false);
		}
	}, 20000);
	it('parses hash structure', () => {
		const r = bcryptInfo('$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy');
		expect(r.ok && r.value.rounds).toBe(10);
	});
	it('rejects malformed hashes', async () => {
		expect((await bcryptVerify('x', 'not-a-hash')).ok).toBe(false);
	});
});

describe('user agent', () => {
	const CHROME =
		'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';
	it('parses a desktop chrome UA', () => {
		const r = parseUserAgent(CHROME);
		expect(r.ok).toBe(true);
		if (r.ok) {
			expect(r.value.browser.name).toBe('Chrome');
			expect(r.value.os.name).toMatch(/mac/i);
			expect(r.value.engine.name).toBe('Blink');
		}
	});
	it('rejects unrecognizable input', () => {
		expect(parseUserAgent('hello world').ok).toBe(false);
	});
});
