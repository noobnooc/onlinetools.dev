import { describe, expect, it } from 'vitest';
import { generatePasswords, strengthOf } from './password';

describe('generatePasswords', () => {
	it('honors length and count', () => {
		const r = generatePasswords({ length: 16, count: 3 });
		expect(r.ok).toBe(true);
		if (r.ok) {
			expect(r.value.passwords).toHaveLength(3);
			for (const pw of r.value.passwords) expect(pw).toHaveLength(16);
		}
	});
	it('guarantees at least one character from every enabled set', () => {
		for (let i = 0; i < 20; i++) {
			const r = generatePasswords({ length: 8, lower: true, upper: true, digits: true, symbols: true });
			expect(r.ok).toBe(true);
			if (r.ok) {
				const pw = r.value.passwords[0];
				expect(/[a-z]/.test(pw)).toBe(true);
				expect(/[A-Z]/.test(pw)).toBe(true);
				expect(/[0-9]/.test(pw)).toBe(true);
				expect(/[^A-Za-z0-9]/.test(pw)).toBe(true);
			}
		}
	});
	it('respects disabled sets', () => {
		const r = generatePasswords({ length: 64, upper: false, digits: false, symbols: false });
		expect(r.ok && /^[a-z]+$/.test((r.value as { passwords: string[] }).passwords[0])).toBe(true);
	});
	it('excludes look-alike characters when asked', () => {
		const r = generatePasswords({ length: 200, excludeAmbiguous: true });
		expect(r.ok).toBe(true);
		if (r.ok) expect(/[0O1lI]/.test(r.value.passwords[0])).toBe(false);
	});
	it('computes entropy from length × log2(pool)', () => {
		// Defaults: lower+upper+digits = 62 chars; 20 × log2(62) ≈ 119.08 → 119
		const r = generatePasswords({ length: 20 });
		expect(r.ok && r.value.entropyBits).toBe(119);
		expect(r.ok && r.value.poolSize).toBe(62);
	});
	it('minimum viable length still fits one char per enabled set', () => {
		const r = generatePasswords({ length: 4, symbols: true });
		expect(r.ok).toBe(true);
		if (r.ok) expect(r.value.passwords[0]).toHaveLength(4);
	});
	it('rejects impossible options', () => {
		expect(generatePasswords({ length: 3 }).ok).toBe(false);
		expect(generatePasswords({ length: 300 }).ok).toBe(false);
		expect(generatePasswords({ length: 16, count: 0 }).ok).toBe(false);
		expect(generatePasswords({ length: 16, count: 200 }).ok).toBe(false);
		expect(
			generatePasswords({ length: 16, lower: false, upper: false, digits: false, symbols: false }).ok
		).toBe(false);
	});
	it('passwords differ across draws (sanity)', () => {
		const r = generatePasswords({ length: 24, count: 10 });
		expect(r.ok && new Set((r.value as { passwords: string[] }).passwords).size).toBe(10);
	});
});

describe('strengthOf', () => {
	it('maps entropy bands to labels at documented thresholds', () => {
		expect(strengthOf(0)).toBe('weak');
		expect(strengthOf(44)).toBe('weak');
		expect(strengthOf(45)).toBe('fair');
		expect(strengthOf(69)).toBe('fair');
		expect(strengthOf(70)).toBe('strong');
		expect(strengthOf(99)).toBe('strong');
		expect(strengthOf(100)).toBe('excellent');
	});
});
