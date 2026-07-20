import { describe, expect, it } from 'vitest';
import { parseTimestamp, isLikelyTimestamp, formatRelative } from './timestamp';

describe('parseTimestamp', () => {
	it('parses unix seconds', () => {
		const r = parseTimestamp('1700000000', 0);
		expect(r.ok).toBe(true);
		if (r.ok) {
			expect(r.value.unit).toBe('seconds');
			expect(r.value.iso).toBe('2023-11-14T22:13:20.000Z');
			expect(r.value.unixMilliseconds).toBe(1700000000000);
		}
	});
	it('parses unix milliseconds by magnitude (≥ 1e11)', () => {
		const r = parseTimestamp('1700000000000', 0);
		expect(r.ok && r.value.unit).toBe('milliseconds');
		expect(r.ok && r.value.unixSeconds).toBe(1700000000);
		const boundary = parseTimestamp('100000000000', 0);
		expect(boundary.ok && boundary.value.unit).toBe('milliseconds');
		expect(boundary.ok && boundary.value.iso).toBe('1973-03-03T09:46:40.000Z');
	});
	it('parses zero and negative (pre-1970) timestamps', () => {
		const zero = parseTimestamp('0', 0);
		expect(zero.ok && zero.value.iso).toBe('1970-01-01T00:00:00.000Z');
		const neg = parseTimestamp('-86400', 0);
		expect(neg.ok && neg.value.iso).toBe('1969-12-31T00:00:00.000Z');
	});
	it('parses ISO 8601 with and without offset', () => {
		const utc = parseTimestamp('2023-11-14T22:13:20Z', 0);
		expect(utc.ok && utc.value.unixSeconds).toBe(1700000000);
		const offset = parseTimestamp('2023-11-15T06:13:20+08:00', 0);
		expect(offset.ok && offset.value.unixSeconds).toBe(1700000000);
		const dateOnly = parseTimestamp('2023-11-14', 0);
		expect(dateOnly.ok && dateOnly.value.unit).toBe('iso');
	});
	it('classifies non-ISO date strings', () => {
		const r = parseTimestamp('Nov 14 2023 22:13:20 UTC', 0);
		expect(r.ok && r.value.unit).toBe('date-string');
	});
	it('handles the far future within JS Date range', () => {
		const r = parseTimestamp('9999999999', 0); // year 2286, still seconds
		expect(r.ok && r.value.unit).toBe('seconds');
		expect(r.ok && new Date(r.value.epochMs).getUTCFullYear()).toBe(2286);
	});
	it('11 digits below 1e11 still read as (far-future) seconds', () => {
		const r = parseTimestamp('99999999999', 0);
		expect(r.ok && r.value.unit).toBe('seconds');
		expect(r.ok && new Date(r.value.epochMs).getUTCFullYear()).toBe(5138);
	});
	it('rejects timestamps beyond the representable date range', () => {
		expect(parseTimestamp('99999999999999999', 0).ok).toBe(false);
	});
	it('rejects nonsense', () => {
		expect(parseTimestamp('not a date').ok).toBe(false);
		expect(parseTimestamp('').ok).toBe(false);
		expect(parseTimestamp('!!wat!!').ok).toBe(false);
	});
});

describe('formatRelative', () => {
	it('covers every unit, singular and plural', () => {
		expect(formatRelative(500)).toBe('now');
		expect(formatRelative(-1000)).toBe('1 second ago');
		expect(formatRelative(-90_000)).toBe('1 minute ago');
		expect(formatRelative(-2 * 3600_000)).toBe('2 hours ago');
		expect(formatRelative(2 * 24 * 3600_000)).toBe('in 2 days');
		expect(formatRelative(45 * 24 * 3600_000)).toBe('in 1 month');
		expect(formatRelative(-800 * 24 * 3600_000)).toBe('2 years ago');
	});
});

describe('isLikelyTimestamp', () => {
	it('accepts 10-digit seconds and 13-digit millis in a plausible year range', () => {
		expect(isLikelyTimestamp('1700000000')).toBe(true);
		expect(isLikelyTimestamp('1700000000000')).toBe(true);
	});
	it('rejects short numbers, huge numbers and text', () => {
		expect(isLikelyTimestamp('12345')).toBe(false);
		expect(isLikelyTimestamp('123456789012345')).toBe(false);
		expect(isLikelyTimestamp('20231114')).toBe(false); // year 1970 in seconds — implausible
		expect(isLikelyTimestamp('hello')).toBe(false);
	});
});
