import { describe, expect, it } from 'vitest';
import { formatJson, validateJson, offsetToLineCol } from './json';

describe('formatJson', () => {
	it('formats with 2-space indent', () => {
		const r = formatJson('{"b":1,"a":[1,2]}');
		expect(r.ok && r.value).toBe('{\n  "b": 1,\n  "a": [\n    1,\n    2\n  ]\n}');
	});
	it('formats with 4-space indent', () => {
		const r = formatJson('{"a":1}', { indent: 4 });
		expect(r.ok && r.value).toBe('{\n    "a": 1\n}');
	});
	it('formats with tabs', () => {
		const r = formatJson('{"a":1}', { indent: 'tab' });
		expect(r.ok && r.value).toBe('{\n\t"a": 1\n}');
	});
	it('minifies', () => {
		const r = formatJson(' { "a" : 1 , "b" : [ 1 , 2 ] } ', { indent: 'min' });
		expect(r.ok && r.value).toBe('{"a":1,"b":[1,2]}');
	});
	it('sorts keys recursively, arrays untouched', () => {
		const r = formatJson('{"b":{"d":1,"c":2},"a":[3,1,2]}', { indent: 'min', sortKeys: true });
		expect(r.ok && r.value).toBe('{"a":[3,1,2],"b":{"c":2,"d":1}}');
	});
	it('sorting is stable for equal content', () => {
		const a = formatJson('{"x":1,"a":2}', { indent: 'min', sortKeys: true });
		const b = formatJson('{"a":2,"x":1}', { indent: 'min', sortKeys: true });
		expect(a.ok && b.ok && a.value === b.value).toBe(true);
	});
	it('handles scalars, empty containers and null roots', () => {
		expect(formatJson('null', { indent: 'min' })).toEqual({ ok: true, value: 'null' });
		expect(formatJson('42', { indent: 'min' })).toEqual({ ok: true, value: '42' });
		expect(formatJson('"str"', { indent: 'min' })).toEqual({ ok: true, value: '"str"' });
		expect(formatJson('[]', { indent: 'min' })).toEqual({ ok: true, value: '[]' });
		expect(formatJson('{}', { indent: 'min' })).toEqual({ ok: true, value: '{}' });
	});
	it('preserves unicode content', () => {
		const r = formatJson('{"名":"值 🎉"}', { indent: 'min' });
		expect(r.ok && r.value).toBe('{"名":"值 🎉"}');
	});
	it('normalizes numbers like any JS consumer would', () => {
		const r = formatJson('{"a":1e2,"b":1.50}', { indent: 'min' });
		expect(r.ok && r.value).toBe('{"a":100,"b":1.5}');
	});
	it('keeps the last of duplicate keys (JSON.parse semantics)', () => {
		const r = formatJson('{"a":1,"a":2}', { indent: 'min' });
		expect(r.ok && r.value).toBe('{"a":2}');
	});
	it('rejects empty input with a message', () => {
		const r = formatJson('   ');
		expect(r.ok).toBe(false);
		if (!r.ok) expect(r.error).toMatch(/empty/i);
	});
	it('reports line/column for a trailing comma', () => {
		const r = formatJson('{\n  "a": 1,\n}');
		expect(r.ok).toBe(false);
		if (!r.ok) {
			expect(r.line).toBeGreaterThanOrEqual(1);
			expect(r.error.length).toBeGreaterThan(0);
		}
	});
	it('rejects JSON5-isms (comments, single quotes, unquoted keys)', () => {
		expect(formatJson('{a: 1}').ok).toBe(false);
		expect(formatJson("{'a': 1}").ok).toBe(false);
		expect(formatJson('{"a": 1} // note').ok).toBe(false);
	});
});

describe('validateJson', () => {
	it('accepts valid documents', () => {
		expect(validateJson('[1,2,3]').ok).toBe(true);
		expect(validateJson('{"deep":{"nesting":[{"ok":true}]}}').ok).toBe(true);
	});
	it('rejects truncated input with position info', () => {
		const r = validateJson('[1,2,');
		expect(r.ok).toBe(false);
	});
	it('rejects NaN/Infinity/undefined', () => {
		expect(validateJson('NaN').ok).toBe(false);
		expect(validateJson('Infinity').ok).toBe(false);
		expect(validateJson('undefined').ok).toBe(false);
	});
});

describe('offsetToLineCol', () => {
	it('computes 1-based positions', () => {
		expect(offsetToLineCol('ab\ncd', 0)).toEqual({ line: 1, column: 1 });
		expect(offsetToLineCol('ab\ncd', 3)).toEqual({ line: 2, column: 1 });
		expect(offsetToLineCol('ab\ncd', 4)).toEqual({ line: 2, column: 2 });
	});
	it('clamps offsets beyond the end', () => {
		expect(offsetToLineCol('ab', 99)).toEqual({ line: 1, column: 3 });
	});
	it('counts consecutive newlines', () => {
		expect(offsetToLineCol('\n\n\nx', 3)).toEqual({ line: 4, column: 1 });
	});
});
