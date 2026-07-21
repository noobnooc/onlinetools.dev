import { describe, expect, it } from 'vitest';
import { formatAffinity, FORMAT_FALLBACKS, EXTENSION_FORMATS, type DataFormat } from './formats';
import { TOOLS } from '$lib/tools/registry';

describe('format affinity', () => {
	it('gives exact matches full affinity', () => {
		expect(formatAffinity('json', ['json'])).toBe(1);
	});
	it('ranks exact matches above text fallback', () => {
		expect(formatAffinity('json', ['json'])).toBeGreaterThan(formatAffinity('json', ['text']));
	});
	it('discounts later accept positions slightly', () => {
		expect(formatAffinity('csv', ['json', 'csv'])).toBeLessThan(formatAffinity('csv', ['csv']));
		expect(formatAffinity('csv', ['json', 'csv'])).toBeGreaterThan(0.9);
	});
	it('walks multi-step fallback chains with decay', () => {
		// jwt → base64 → text
		const exact = formatAffinity('jwt', ['jwt']);
		const b64 = formatAffinity('jwt', ['base64']);
		const text = formatAffinity('jwt', ['text']);
		expect(exact).toBeGreaterThan(b64);
		expect(b64).toBeGreaterThan(text);
		expect(text).toBeGreaterThan(0);
	});
	it('never routes images into text tools', () => {
		expect(formatAffinity('image', ['text'])).toBe(0);
	});
	it('fallback chains all terminate without cycles', () => {
		for (const [format, chain] of Object.entries(FORMAT_FALLBACKS)) {
			expect(chain).not.toContain(format);
			for (const f of chain) expect(FORMAT_FALLBACKS[f]).not.toContain(format);
		}
	});
	it('extension hints only use known formats', () => {
		const known = new Set(Object.keys(FORMAT_FALLBACKS));
		for (const { format } of Object.values(EXTENSION_FORMATS)) {
			expect(known.has(format)).toBe(true);
		}
	});
	it('every tool accepts list only uses known formats', () => {
		const known = new Set(Object.keys(FORMAT_FALLBACKS) as DataFormat[]);
		for (const tool of TOOLS) {
			for (const f of tool.accepts ?? []) expect(known.has(f)).toBe(true);
		}
	});
});
