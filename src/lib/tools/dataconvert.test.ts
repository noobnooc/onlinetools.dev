import { describe, expect, it } from 'vitest';
import {
	convertData,
	detectFormat,
	parseData,
	stringifyData,
	jsonToCsv,
	parseCsv,
	jsonToTypescript,
	queryJsonPath
} from './dataconvert';

describe('detectFormat', () => {
	it('detects JSON objects and arrays', () => {
		expect(detectFormat('{"a":1}')).toBe('json');
		expect(detectFormat('  [1, 2, 3]')).toBe('json');
	});
	it('detects YAML mappings', () => {
		expect(detectFormat('a: 1\nb: two')).toBe('yaml');
		expect(detectFormat('list:\n  - x\n  - y')).toBe('yaml');
	});
	it('detects TOML tables and key-value pairs', () => {
		expect(detectFormat('[server]\nhost = "x"')).toBe('toml');
		expect(detectFormat('title = "hello"\ncount = 3')).toBe('toml');
	});
	it('returns null for prose and empty input', () => {
		expect(detectFormat('just some words')).toBeNull();
		expect(detectFormat('')).toBeNull();
	});
});

describe('convertData', () => {
	const JSON_DOC = '{"name":"test","list":[1,2],"nested":{"a":true},"pi":3.14}';
	it('JSON → YAML → JSON round-trips', () => {
		const yaml = convertData(JSON_DOC, 'json', 'yaml');
		expect(yaml.ok && yaml.value).toContain('name: test');
		if (yaml.ok) {
			const back = convertData(yaml.value, 'yaml', 'json');
			expect(back.ok && JSON.parse(back.value as string)).toEqual(JSON.parse(JSON_DOC));
		}
	});
	it('JSON → TOML → JSON round-trips for table roots', () => {
		const toml = convertData(JSON_DOC, 'json', 'toml');
		expect(toml.ok && toml.value).toContain('name = "test"');
		if (toml.ok) {
			const back = convertData(toml.value, 'toml', 'json');
			expect(back.ok && JSON.parse(back.value as string)).toEqual(JSON.parse(JSON_DOC));
		}
	});
	it('YAML → TOML directly', () => {
		const r = convertData('server:\n  host: example.com\n  ports: [80, 443]', 'yaml', 'toml');
		expect(r.ok && r.value).toContain('[server]');
	});
	it('expands YAML anchors and aliases on conversion', () => {
		const r = convertData('base: &b\n  x: 1\ncopy: *b', 'yaml', 'json');
		expect(r.ok).toBe(true);
		if (r.ok) {
			const parsed = JSON.parse(r.value);
			expect(parsed.copy).toEqual({ x: 1 });
		}
	});
	it('rejects TOML with non-table roots and null values', () => {
		expect(convertData('[1,2]', 'json', 'toml').ok).toBe(false);
		expect(convertData('"scalar"', 'json', 'toml').ok).toBe(false);
	});
	it('reports parse errors from each format', () => {
		expect(convertData('{bad json', 'json', 'yaml').ok).toBe(false);
		expect(convertData('a: [1, 2', 'yaml', 'json').ok).toBe(false);
		expect(convertData('= no key', 'toml', 'json').ok).toBe(false);
	});
	it('parseData/stringifyData work standalone', () => {
		const p = parseData('x = 1', 'toml');
		expect(p.ok && (p.value as Record<string, unknown>).x).toBe(1);
		const s = stringifyData({ a: [1, 2] }, 'yaml');
		expect(s.ok && s.value).toContain('- 1');
	});
});

describe('jsonToCsv', () => {
	it('converts flat arrays with a header row', () => {
		const r = jsonToCsv('[{"a":1,"b":"x"},{"a":2,"b":"y"}]');
		expect(r.ok && r.value.csv).toBe('a,b\n1,x\n2,y');
	});
	it('flattens nested objects into dotted columns', () => {
		const r = jsonToCsv('[{"user":{"name":"Ada","address":{"city":"London"}}}]');
		expect(r.ok && r.value.columns).toEqual(['user.name', 'user.address.city']);
	});
	it('unions columns across heterogeneous rows', () => {
		const r = jsonToCsv('[{"a":1},{"b":2},{"a":3,"c":4}]');
		expect(r.ok && r.value.columns).toEqual(['a', 'b', 'c']);
		expect(r.ok && r.value.csv.split('\n')[1]).toBe('1,,');
	});
	it('escapes delimiters, quotes and newlines per RFC 4180', () => {
		const r = jsonToCsv('[{"t":"say \\"hi\\", now\\nplease"}]');
		expect(r.ok && r.value.csv).toContain('"say ""hi"", now\nplease"');
	});
	it('embeds arrays as JSON in one cell', () => {
		const r = jsonToCsv('[{"tags":["ml","crypto"]}]');
		expect(r.ok).toBe(true);
		if (r.ok) {
			expect(r.value.grid[1][0]).toBe('["ml","crypto"]');
			expect(r.value.csv.split('\n')[1]).toBe('"[""ml"",""crypto""]"');
		}
	});
	it('the exact UI sample stays column-aligned (regression)', () => {
		// This is the sample the tool ships; the array cell must remain ONE cell.
		const sample =
			'[{"name":"Ada","role":"admin","contact":{"email":"ada@example.com"}},' +
			'{"name":"Alan","role":"user","tags":["ml","crypto"]},' +
			'{"name":"Grace","contact":{"email":"grace@example.com","phone":"555-0199"}}]';
		const r = jsonToCsv(sample);
		expect(r.ok).toBe(true);
		if (r.ok) {
			expect(r.value.columns).toEqual(['name', 'role', 'contact.email', 'tags', 'contact.phone']);
			// Every grid row has exactly as many cells as there are columns.
			for (const row of r.value.grid) expect(row).toHaveLength(5);
			expect(r.value.grid[2]).toEqual(['Alan', 'user', '', '["ml","crypto"]', '']);
			// And parsing the emitted CSV reproduces the grid exactly.
			expect(parseCsv(r.value.csv)).toEqual(r.value.grid);
		}
	});
	it('csv → parseCsv round-trips hostile content', () => {
		const r = jsonToCsv('[{"a":"line1\\nline2","b":"has,comma","c":"has\\"quote"}]');
		expect(r.ok).toBe(true);
		if (r.ok) expect(parseCsv(r.value.csv)).toEqual(r.value.grid);
	});
	it('supports alternate delimiters', () => {
		const r = jsonToCsv('[{"a":"x,y","b":1}]', ';');
		expect(r.ok && r.value.csv.split('\n')[1]).toBe('x,y;1'); // comma needs no quoting with ; delimiter
		const tab = jsonToCsv('[{"a":"x","b":1}]', '\t');
		expect(tab.ok && tab.value.csv.split('\n')[1]).toBe('x\t1');
	});
	it('a single object becomes a one-row CSV', () => {
		const r = jsonToCsv('{"a":1}');
		expect(r.ok && r.value.rows).toBe(1);
		expect(r.ok && r.value.csv).toBe('a\n1');
	});
	it('null and missing values become empty cells; booleans stringify', () => {
		const r = jsonToCsv('[{"a":null,"b":true},{"b":false}]');
		expect(r.ok && r.value.csv).toBe('a,b\n,true\n,false');
	});
	it('unicode survives', () => {
		const r = jsonToCsv('[{"名前":"田中"}]');
		expect(r.ok && r.value.csv).toBe('名前\n田中');
	});
	it('rejects invalid JSON and empty arrays', () => {
		expect(jsonToCsv('{oops').ok).toBe(false);
		expect(jsonToCsv('[]').ok).toBe(false);
	});
});

describe('parseCsv', () => {
	it('parses quoted fields with embedded everything', () => {
		expect(parseCsv('a,"b,c",\"d\"\"e\"\n1,2,3')).toEqual([
			['a', 'b,c', 'd"e'],
			['1', '2', '3']
		]);
	});
	it('handles CRLF line endings', () => {
		expect(parseCsv('a,b\r\n1,2')).toEqual([
			['a', 'b'],
			['1', '2']
		]);
	});
});

describe('jsonToTypescript', () => {
	it('infers primitives, arrays, nesting and null', () => {
		const r = jsonToTypescript('{"id":1,"name":"x","ok":true,"gone":null,"tags":["a"],"meta":{"n":2}}', 'User');
		expect(r.ok).toBe(true);
		if (r.ok) {
			expect(r.value).toContain('export interface User {');
			expect(r.value).toContain('id: number;');
			expect(r.value).toContain('name: string;');
			expect(r.value).toContain('ok: boolean;');
			expect(r.value).toContain('gone: null;');
			expect(r.value).toContain('tags: string[];');
			expect(r.value).toMatch(/meta: \{\s*\n\s*n: number;/);
		}
	});
	it('unions mixed arrays and marks empty arrays unknown', () => {
		const r = jsonToTypescript('{"m":[1,"a"],"e":[]}');
		expect(r.ok && r.value).toContain('m: (number | string)[];');
		expect(r.ok && r.value).toContain('e: unknown[];');
	});
	it('unions differing object shapes inside arrays', () => {
		const r = jsonToTypescript('{"rows":[{"a":1},{"b":"x"}]}');
		expect(r.ok && r.value).toContain('|');
	});
	it('quotes non-identifier keys', () => {
		const r = jsonToTypescript('{"my-key":1,"valid_key":2}');
		expect(r.ok && r.value).toContain('"my-key": number;');
		expect(r.ok && r.value).toContain('valid_key: number;');
	});
	it('emits type aliases for non-object roots', () => {
		expect(jsonToTypescript('[1,2]', 'Nums')).toEqual({ ok: true, value: 'export type Nums = number[];' });
		expect(jsonToTypescript('"s"')).toEqual({ ok: true, value: 'export type Root = string;' });
	});
	it('empty object maps to Record<string, never>', () => {
		expect(jsonToTypescript('{}', 'Empty')).toEqual({
			ok: true,
			value: 'export type Empty = Record<string, never>;'
		});
	});
	it('falls back to Root for invalid type names', () => {
		const r = jsonToTypescript('{"a":1}', '123bad');
		expect(r.ok && r.value).toContain('interface Root');
	});
	it('rejects invalid JSON', () => {
		expect(jsonToTypescript('{nope').ok).toBe(false);
	});
});

describe('queryJsonPath', () => {
	const DOC = JSON.stringify({
		store: {
			book: [
				{ title: 'A', price: 10, tags: ['x'] },
				{ title: 'B', price: 20 }
			],
			bicycle: { price: 5 }
		}
	});
	it('$ returns the whole document', () => {
		const r = queryJsonPath(DOC, '$');
		expect(r.ok && r.value).toHaveLength(1);
		expect(r.ok && r.value[0].path).toBe('$');
	});
	it('resolves dot and bracket notation equivalently', () => {
		const dot = queryJsonPath(DOC, '$.store.book[0].title');
		const bracket = queryJsonPath(DOC, "$['store']['book'][0]['title']");
		expect(dot.ok && dot.value[0]?.value).toBe('A');
		expect(bracket.ok && bracket.value[0]?.value).toBe('A');
	});
	it('records the concrete path of every match', () => {
		const r = queryJsonPath(DOC, '$.store.book[*].price');
		expect(r.ok && r.value.map((m) => m.path)).toEqual([
			'$.store.book[0].price',
			'$.store.book[1].price'
		]);
	});
	it('supports wildcards on objects and arrays', () => {
		const obj = queryJsonPath(DOC, '$.store.*');
		expect(obj.ok && obj.value).toHaveLength(2);
		const arr = queryJsonPath(DOC, '$.store.book[*].title');
		expect(arr.ok && arr.value.map((m) => m.value)).toEqual(['A', 'B']);
	});
	it('supports recursive descent with names and wildcards', () => {
		const r = queryJsonPath(DOC, '$..price');
		expect(r.ok && r.value.map((m) => m.value).sort((a, b) => (a as number) - (b as number))).toEqual([5, 10, 20]);
		const all = queryJsonPath(DOC, '$..*');
		expect(all.ok && (all.value.length as number)).toBeGreaterThan(8);
	});
	it('supports negative indices and unions', () => {
		const neg = queryJsonPath(DOC, '$.store.book[-1].title');
		expect(neg.ok && neg.value[0]?.value).toBe('B');
		const idxUnion = queryJsonPath(DOC, '$.store.book[0,1]');
		expect(idxUnion.ok && idxUnion.value).toHaveLength(2);
		const keyUnion = queryJsonPath(DOC, "$.store['book','bicycle']");
		expect(keyUnion.ok && keyUnion.value).toHaveLength(2);
	});
	it('missing paths return zero matches, not errors', () => {
		const r = queryJsonPath(DOC, '$.store.nothing.here');
		expect(r.ok && r.value).toHaveLength(0);
		const oob = queryJsonPath(DOC, '$.store.book[99]');
		expect(oob.ok && oob.value).toHaveLength(0);
	});
	it('quoted keys can contain spaces and dots', () => {
		const doc = '{"a b": {"c.d": 1}}';
		const r = queryJsonPath(doc, "$['a b']['c.d']");
		expect(r.ok && r.value[0]?.value).toBe(1);
	});
	it('rejects filters, missing $ and syntax errors distinctly', () => {
		const filter = queryJsonPath(DOC, '$..book[?(@.price<10)]');
		expect(!filter.ok && filter.error).toMatch(/filter/i);
		expect(queryJsonPath(DOC, 'store.book').ok).toBe(false);
		expect(queryJsonPath(DOC, '$.store..').ok).toBe(true); // trailing recursive matches subtree
		expect(queryJsonPath(DOC, '$[unclosed').ok).toBe(false);
	});
	it('rejects invalid input JSON with a labeled error', () => {
		const r = queryJsonPath('{bad', '$');
		expect(!r.ok && r.error).toMatch(/Input JSON/);
	});
});
