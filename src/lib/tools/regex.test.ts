import { describe, expect, it } from 'vitest';
import { testRegex, replaceRegex } from './regex';

describe('testRegex', () => {
	it('finds all matches with positions', () => {
		const r = testRegex('\\d+', '', 'a1b22c333');
		expect(r.ok).toBe(true);
		if (r.ok) {
			expect(r.value.count).toBe(3);
			expect(r.value.matches[0]).toMatchObject({ text: '1', index: 1, end: 2 });
			expect(r.value.matches[1]).toMatchObject({ text: '22', index: 3, end: 5 });
			expect(r.value.matches[2]).toMatchObject({ text: '333', index: 6, end: 9 });
		}
	});
	it('captures numbered groups, including non-participating ones', () => {
		const r = testRegex('(a)(b)?', '', 'ac');
		expect(r.ok).toBe(true);
		if (r.ok) {
			expect(r.value.matches[0].groups[0]).toEqual({ name: null, value: 'a' });
			expect(r.value.matches[0].groups[1]).toEqual({ name: null, value: undefined });
		}
	});
	it('captures named groups alongside numbered ones', () => {
		const r = testRegex('(?<year>\\d{4})-(\\d{2})', '', '2026-07');
		expect(r.ok).toBe(true);
		if (r.ok) {
			const groups = r.value.matches[0].groups;
			expect(groups).toContainEqual({ name: 'year', value: '2026' });
			expect(groups).toContainEqual({ name: null, value: '2026' });
			expect(groups).toContainEqual({ name: null, value: '07' });
		}
	});
	it('respects the i and m flags', () => {
		const ci = testRegex('abc', 'i', 'ABC');
		expect(ci.ok && ci.value.count).toBe(1);
		const multi = testRegex('^b$', 'm', 'a\nb\nc');
		expect(multi.ok && multi.value.count).toBe(1);
	});
	it('supports dotall and unicode property escapes', () => {
		const s = testRegex('a.b', 's', 'a\nb');
		expect(s.ok && s.value.count).toBe(1);
		const u = testRegex('\\p{Script=Han}+', 'u', 'abc 中文 def');
		expect(u.ok && u.value.matches[0]?.text).toBe('中文');
	});
	it('supports lookbehind', () => {
		const r = testRegex('(?<=\\$)\\d+', '', 'price: $42');
		expect(r.ok && r.value.matches[0]?.text).toBe('42');
	});
	it('survives empty-width matches without hanging', () => {
		const r = testRegex('a*', '', 'bab');
		expect(r.ok).toBe(true);
		if (r.ok) expect(r.value.count).toBeGreaterThan(0);
	});
	it('caps runaway match counts at 10000', () => {
		const r = testRegex('.', '', 'x'.repeat(20000));
		expect(r.ok && r.value.count).toBeLessThanOrEqual(10000);
	});
	it('reports engine syntax errors verbatim-ish', () => {
		const r = testRegex('(', '', 'x');
		expect(r.ok).toBe(false);
		if (!r.ok) expect(r.error.length).toBeGreaterThan(0);
		expect(testRegex('[z-a]', '', 'x').ok).toBe(false);
	});
	it('rejects invalid or duplicate flags', () => {
		expect(testRegex('a', 'x', 'a').ok).toBe(false);
		expect(testRegex('a', 'gg', 'a').ok).toBe(false);
	});
	it('rejects an empty pattern', () => {
		expect(testRegex('', 'g', 'abc').ok).toBe(false);
	});
	it('matches nothing against an empty test string without error', () => {
		const r = testRegex('\\d', '', '');
		expect(r.ok && r.value.count).toBe(0);
	});
});

describe('replaceRegex', () => {
	it('replaces globally by default', () => {
		expect(replaceRegex('o', '', 'foo boo', '0')).toEqual({ ok: true, value: 'f00 b00' });
	});
	it('supports group references in the replacement', () => {
		const r = replaceRegex('(\\w+)@(\\w+)', '', 'user@host', '$2/$1');
		expect(r.ok && r.value).toBe('host/user');
	});
	it('supports named group references', () => {
		const r = replaceRegex('(?<a>x)', '', 'x', '[$<a>]');
		expect(r.ok && r.value).toBe('[x]');
	});
	it('propagates syntax errors', () => {
		expect(replaceRegex('(', '', 'x', 'y').ok).toBe(false);
	});
});
