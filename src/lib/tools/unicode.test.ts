import { describe, expect, it } from 'vitest';
import { inspectChars, unicodeSummary } from './unicode';

describe('inspectChars', () => {
	it('reports code point, UTF-8 and UTF-16 for BMP characters', () => {
		const [info] = inspectChars('€');
		expect(info.codePointHex).toBe('U+20AC');
		expect(info.utf8).toBe('E2 82 AC');
		expect(info.utf16).toBe('\\u20AC');
		expect(info.jsEscape).toBe('\\u20AC');
		expect(info.htmlEntity).toBe('&#x20AC;');
	});
	it('ASCII is one byte and one unit', () => {
		const [info] = inspectChars('A');
		expect(info.utf8).toBe('41');
		expect(info.codePoint).toBe(65);
		expect(info.category).toBe('Uppercase letter');
	});
	it('astral characters get surrogate pairs and brace escapes', () => {
		const [info] = inspectChars('🎉');
		expect(info.codePoint).toBe(0x1f389);
		expect(info.utf16.split(' ')).toHaveLength(2);
		expect(info.jsEscape).toBe('\\u{1F389}');
		expect(info.utf8.split(' ')).toHaveLength(4);
	});
	it('categorizes digits, spaces, punctuation and symbols', () => {
		expect(inspectChars('7')[0].category).toBe('Decimal digit');
		expect(inspectChars(' ')[0].category).toBe('Space separator');
		expect(inspectChars('-')[0].category).toBe('Dash punctuation');
		expect(inspectChars('$')[0].category).toBe('Currency symbol');
		expect(inspectChars('+')[0].category).toBe('Math symbol');
	});
	it('flags invisible characters', () => {
		expect(inspectChars('​')[0].category).toMatch(/Format/);
		expect(inspectChars('\u0007')[0].category).toBe('Control'); // BEL
		expect(inspectChars('﻿')[0].category).toMatch(/Format/);
	});
	it('iterates by code points, not UTF-16 units', () => {
		const infos = inspectChars('a🎉b');
		expect(infos).toHaveLength(3);
		expect(infos.map((i) => i.char)).toEqual(['a', '🎉', 'b']);
	});
	it('respects the limit parameter', () => {
		expect(inspectChars('abcdef', 3)).toHaveLength(3);
	});
});

describe('unicodeSummary', () => {
	it('the four counts diverge exactly as unicode dictates', () => {
		// é as e + combining acute: 1 grapheme, 2 code points, 2 units, 3 bytes
		const s = unicodeSummary('é');
		expect(s.graphemes).toBe(1);
		expect(s.codePoints).toBe(2);
		expect(s.utf16Units).toBe(2);
		expect(s.utf8Bytes).toBe(3);
	});
	it('emoji: 1 grapheme, 1 code point, 2 units, 4 bytes', () => {
		const s = unicodeSummary('🎉');
		expect(s).toEqual({ graphemes: 1, codePoints: 1, utf16Units: 2, utf8Bytes: 4 });
	});
	it('ZWJ family emoji is one grapheme of many code points', () => {
		const s = unicodeSummary('👨‍👩‍👧');
		expect(s.graphemes).toBe(1);
		expect(s.codePoints).toBe(5); // 3 people + 2 ZWJ
	});
	it('empty input is all zeros', () => {
		expect(unicodeSummary('')).toEqual({ graphemes: 0, codePoints: 0, utf16Units: 0, utf8Bytes: 0 });
	});
});
