import { describe, expect, it } from 'vitest';
import { parseInBase, baseViews, groupDigits } from './numberbase';

describe('parseInBase', () => {
	it('parses decimal by default in auto mode', () => {
		expect(parseInBase('255', 'auto')).toEqual({ ok: true, value: 255n });
	});
	it('honors 0x / 0b / 0o prefixes in auto mode', () => {
		expect(parseInBase('0xff', 'auto')).toEqual({ ok: true, value: 255n });
		expect(parseInBase('0b1010', 'auto')).toEqual({ ok: true, value: 10n });
		expect(parseInBase('0o17', 'auto')).toEqual({ ok: true, value: 15n });
	});
	it('accepts an explicit base without prefix', () => {
		expect(parseInBase('ff', 16)).toEqual({ ok: true, value: 255n });
		expect(parseInBase('z', 36)).toEqual({ ok: true, value: 35n });
	});
	it('rejects digits outside the base', () => {
		const r = parseInBase('129', 8);
		expect(r.ok).toBe(false);
	});
	it('rejects a prefix that contradicts the explicit base', () => {
		expect(parseInBase('0xff', 2).ok).toBe(false);
	});
	it('handles negatives and separators', () => {
		expect(parseInBase('-1_000', 10)).toEqual({ ok: true, value: -1000n });
		expect(parseInBase('1010 1010', 2)).toEqual({ ok: true, value: 170n });
	});
	it('handles numbers beyond 2^53 exactly', () => {
		expect(parseInBase('18446744073709551615', 10)).toEqual({
			ok: true,
			value: 18446744073709551615n
		});
	});
});

describe('baseViews', () => {
	it('produces all four standard views', () => {
		const r = baseViews('255', 10);
		expect(r.ok).toBe(true);
		if (r.ok) {
			expect(r.value.binary).toBe('11111111');
			expect(r.value.octal).toBe('377');
			expect(r.value.decimal).toBe('255');
			expect(r.value.hex).toBe('ff');
			expect(r.value.bits).toBe(8);
		}
	});
	it('adds a custom base when requested', () => {
		const r = baseViews('100', 10, 36);
		expect(r.ok && r.value.custom === '2s').toBe(true);
	});
	it('keeps the sign', () => {
		const r = baseViews('-10', 10);
		expect(r.ok && r.value.hex === '-a' && r.value.negative).toBe(true);
	});
});

describe('groupDigits', () => {
	it('groups binary in 4s and decimal in 3s', () => {
		expect(groupDigits('11111111', 2)).toBe('1111 1111');
		expect(groupDigits('1234567', 10)).toBe('1 234 567');
	});
	it('keeps the minus sign out of grouping', () => {
		expect(groupDigits('-123456', 10)).toBe('-123 456');
	});
});
