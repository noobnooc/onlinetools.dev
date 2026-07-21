import { describe, expect, it } from 'vitest';
import { parseCron, nextRuns } from './cron';

function fields(expr: string) {
	const r = parseCron(expr);
	if (!r.ok) throw new Error(r.error);
	return r.value.fields;
}

function runs(expr: string, from: Date, count = 5): Date[] {
	const r = parseCron(expr);
	if (!r.ok) throw new Error(r.error);
	return nextRuns(r.value, from.getTime(), count).map((t) => new Date(t));
}

describe('parseCron — field syntax', () => {
	it('parses plain values and wildcards', () => {
		const f = fields('30 9 * * 1-5');
		expect(f[0].values).toEqual([30]);
		expect(f[1].values).toEqual([9]);
		expect(f[2].any).toBe(true);
		expect(f[4].values).toEqual([1, 2, 3, 4, 5]);
	});
	it('parses lists and mixed lists/ranges', () => {
		expect(fields('0,15,30,45 * * * *')[0].values).toEqual([0, 15, 30, 45]);
		expect(fields('* * * * 1,3,5-6')[4].values).toEqual([1, 3, 5, 6]);
	});
	it('parses steps over wildcards, ranges and starts', () => {
		expect(fields('*/15 * * * *')[0].values).toEqual([0, 15, 30, 45]);
		expect(fields('10-30/10 * * * *')[0].values).toEqual([10, 20, 30]);
		expect(fields('5/15 * * * *')[0].values).toEqual([5, 20, 35, 50]);
	});
	it('resolves month and weekday names, case-insensitively', () => {
		expect(fields('* * * JAN,jul *')[3].values).toEqual([1, 7]);
		expect(fields('* * * * mon-fri')[4].values).toEqual([1, 2, 3, 4, 5]);
		expect(fields('* * * jan-mar *')[3].values).toEqual([1, 2, 3]);
	});
	it('treats 7 as Sunday', () => {
		expect(fields('0 0 * * 7')[4].values).toEqual([0]);
	});
	it('expands @macros', () => {
		expect(fields('@daily')[1].values).toEqual([0]);
		expect(fields('@hourly')[0].values).toEqual([0]);
		expect(fields('@weekly')[4].values).toEqual([0]);
		expect(fields('@monthly')[2].values).toEqual([1]);
		expect(fields('@yearly')[3].values).toEqual([1]);
	});
});

describe('parseCron — validation', () => {
	it('rejects out-of-range values naming the field', () => {
		const r = parseCron('61 * * * *');
		expect(r.ok).toBe(false);
		if (!r.ok) expect(r.error).toMatch(/minute/);
		expect(parseCron('* 24 * * *').ok).toBe(false);
		expect(parseCron('* * 0 * *').ok).toBe(false);
		expect(parseCron('* * 32 * *').ok).toBe(false);
		expect(parseCron('* * * 13 *').ok).toBe(false);
		expect(parseCron('* * * * 8').ok).toBe(false);
	});
	it('rejects wrong field counts, flagging Quartz-style input', () => {
		expect(parseCron('* * * *').ok).toBe(false);
		const six = parseCron('0 0 0 * * *');
		expect(!six.ok && six.error).toMatch(/Quartz/);
	});
	it('rejects inverted ranges, zero steps and unknown names', () => {
		expect(parseCron('30-10 * * * *').ok).toBe(false);
		expect(parseCron('*/0 * * * *').ok).toBe(false);
		expect(parseCron('* * * foo *').ok).toBe(false);
		expect(parseCron('@fortnightly').ok).toBe(false);
		expect(parseCron('').ok).toBe(false);
	});
});

describe('parseCron — description', () => {
	it('describes fixed times', () => {
		const r = parseCron('30 9 * * 1-5');
		expect(r.ok && r.value.description).toMatch(/09:30/);
		expect(r.ok && r.value.description).toMatch(/Monday/);
		expect(r.ok && r.value.description).toMatch(/Friday/);
	});
	it('describes step minutes and hourly runs', () => {
		const step = parseCron('*/15 * * * *');
		expect(step.ok && step.value.description).toMatch(/every 15 minutes/i);
		const hourly = parseCron('0 * * * *');
		expect(hourly.ok && hourly.value.description).toMatch(/every hour/i);
	});
	it('mentions months when restricted', () => {
		const r = parseCron('0 0 1 jan *');
		expect(r.ok && r.value.description).toMatch(/January/);
	});
});

describe('nextRuns', () => {
	// All computed in local time with explicit local Date constructions.
	it('finds the same-day run when still ahead', () => {
		const [first] = runs('30 9 * * *', new Date(2026, 0, 1, 8, 0));
		expect(first.getHours()).toBe(9);
		expect(first.getMinutes()).toBe(30);
		expect(first.getDate()).toBe(1);
	});
	it('rolls to the next day when passed', () => {
		const [first] = runs('30 9 * * *', new Date(2026, 0, 1, 10, 0));
		expect(first.getDate()).toBe(2);
	});
	it('daily runs are 24h apart', () => {
		const r = runs('0 3 * * *', new Date(2026, 5, 1), 3);
		expect(r[1].getTime() - r[0].getTime()).toBe(24 * 3600_000);
		expect(r[2].getTime() - r[1].getTime()).toBe(24 * 3600_000);
	});
	it('never returns the from-instant itself', () => {
		const from = new Date(2026, 0, 1, 9, 30, 0, 0);
		const [first] = runs('30 9 * * *', from);
		expect(first.getTime()).toBeGreaterThan(from.getTime());
		expect(first.getDate()).toBe(2);
	});
	it('respects day-of-week restrictions', () => {
		// 2026-07-20 is a Monday.
		const [first] = runs('0 12 * * 0', new Date(2026, 6, 20));
		expect(first.getDay()).toBe(0);
		expect(first.getDate()).toBe(26);
	});
	it('dom OR dow when both are restricted (classic cron rule)', () => {
		// From Mon 2026-07-20: matches every Monday AND every 1st.
		const r = runs('0 12 1 * 1', new Date(2026, 6, 20, 0, 0), 4);
		const days = r.map((d) => `${d.getMonth() + 1}/${d.getDate()}`);
		expect(days).toContain('7/20'); // Monday
		expect(days).toContain('8/1'); // 1st of August (a Saturday)
	});
	it('skips months without the requested day', () => {
		// Feb has no 31st; from Feb 1 the next 31st is Mar 31.
		const [first] = runs('0 0 31 * *', new Date(2026, 1, 1));
		expect(first.getMonth()).toBe(2);
		expect(first.getDate()).toBe(31);
	});
	it('finds Feb 29 only in leap years', () => {
		const [first] = runs('0 0 29 2 *', new Date(2026, 2, 1));
		expect(first.getFullYear()).toBe(2028);
		expect(first.getMonth()).toBe(1);
		expect(first.getDate()).toBe(29);
	});
	it('crosses year boundaries for month restrictions', () => {
		const [first] = runs('0 0 1 jan *', new Date(2026, 6, 1));
		expect(first.getFullYear()).toBe(2027);
		expect(first.getMonth()).toBe(0);
	});
	it('returns the requested count', () => {
		expect(runs('* * * * *', new Date(2026, 0, 1), 5)).toHaveLength(5);
		expect(runs('0 0 1 1 *', new Date(2026, 0, 2), 3)).toHaveLength(3);
	});
});
