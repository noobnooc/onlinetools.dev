import { describe, expect, it } from 'vitest';
import { validateXml, formatXml, minifyXml, xmlToJson, jsonToXml, isLikelyXml } from './xml';

const SAMPLE = `<?xml version="1.0"?><catalog><book id="1"><title>Svelte</title><price currency="USD">20</price></book><!-- promo --><book id="2"><title>Kit</title></book></catalog>`;

describe('validateXml', () => {
	it('accepts well-formed XML', () => {
		expect(validateXml(SAMPLE).ok).toBe(true);
	});
	it('reports position for mismatched tags', () => {
		const r = validateXml('<a><b></a>');
		expect(r.ok).toBe(false);
		if (!r.ok) expect(r.line).toBeGreaterThan(0);
	});
	it('rejects empty input', () => {
		expect(validateXml('').ok).toBe(false);
	});
});

describe('formatXml', () => {
	it('indents nested elements and inlines text-only elements', () => {
		const r = formatXml(SAMPLE);
		expect(r.ok).toBe(true);
		if (r.ok) {
			const lines = r.value.split('\n');
			expect(lines[0]).toBe('<?xml version="1.0"?>');
			expect(r.value).toContain('  <book id="1">');
			expect(r.value).toContain('    <title>Svelte</title>');
			expect(r.value).toContain('<!-- promo -->');
		}
	});
	it('preserves CDATA sections', () => {
		const r = formatXml('<a><![CDATA[x < y]]></a>');
		expect(r.ok).toBe(true);
		if (r.ok) expect(r.value).toContain('<![CDATA[x < y]]>');
	});
	it('propagates validation errors', () => {
		expect(formatXml('<a>').ok).toBe(false);
	});
});

describe('minifyXml', () => {
	it('strips comments and inter-element whitespace', () => {
		const r = minifyXml('<a>\n  <b>text</b>\n  <!-- gone -->\n</a>');
		expect(r).toEqual({ ok: true, value: '<a><b>text</b></a>' });
	});
});

describe('xmlToJson / jsonToXml', () => {
	it('converts elements and attributes to JSON', () => {
		const r = xmlToJson('<user id="7"><name>Ada</name></user>');
		expect(r.ok).toBe(true);
		if (r.ok) {
			const obj = JSON.parse(r.value);
			expect(obj.user['@_id']).toBe(7);
			expect(obj.user.name).toBe('Ada');
		}
	});
	it('round-trips through jsonToXml', () => {
		const r = jsonToXml('{"user": {"@_id": 7, "name": "Ada"}}');
		expect(r.ok).toBe(true);
		if (r.ok) {
			expect(r.value).toContain('<user id="7">');
			expect(r.value).toContain('<name>Ada</name>');
		}
	});
	it('rejects a top-level array', () => {
		expect(jsonToXml('[1,2]').ok).toBe(false);
	});
});

describe('isLikelyXml', () => {
	it('accepts XML documents', () => {
		expect(isLikelyXml(SAMPLE)).toBe(true);
		expect(isLikelyXml('<note><to>You</to></note>')).toBe(true);
	});
	it('rejects HTML, JSON and plain text', () => {
		expect(isLikelyXml('<!doctype html><html><body></body></html>')).toBe(false);
		expect(isLikelyXml('{"a": 1}')).toBe(false);
		expect(isLikelyXml('just text')).toBe(false);
		expect(isLikelyXml('<a><b></a>')).toBe(false);
	});
});
