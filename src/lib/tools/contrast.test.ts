import { describe, expect, it } from 'vitest';
import {
	checkContrast,
	contrastRatio,
	formatRatio,
	suggestColors,
	extractColors,
	isLikelyColorPair,
	composite
} from './contrast';
import { parseColor } from './color';

const rgb = (s: string) => {
	const r = parseColor(s);
	if (!r.ok) throw new Error(r.error);
	return r.value;
};

describe('contrastRatio', () => {
	it('is 21 for black on white and 1 for identical colors', () => {
		expect(contrastRatio(rgb('#000'), rgb('#fff'))).toBeCloseTo(21, 6);
		expect(contrastRatio(rgb('#777'), rgb('#777'))).toBe(1);
	});
	it('is symmetric', () => {
		expect(contrastRatio(rgb('#3672f0'), rgb('#fff'))).toBeCloseTo(contrastRatio(rgb('#fff'), rgb('#3672f0')), 10);
	});
	it('matches known reference pairs', () => {
		// #767676 is the classic lightest gray that passes AA on white.
		expect(contrastRatio(rgb('#767676'), rgb('#fff'))).toBeCloseTo(4.54, 2);
		expect(contrastRatio(rgb('#777777'), rgb('#fff'))).toBeCloseTo(4.48, 2);
		expect(contrastRatio(rgb('#0000ff'), rgb('#fff'))).toBeCloseTo(8.59, 2);
	});
});

describe('formatRatio', () => {
	it('truncates so a failing ratio never reads as passing', () => {
		expect(formatRatio(4.4999)).toBe('4.49');
		expect(formatRatio(4.5)).toBe('4.50');
		expect(formatRatio(21)).toBe('21.00');
	});
});

describe('checkContrast', () => {
	it('grades every level', () => {
		const r = checkContrast('#767676', '#ffffff');
		expect(r.ok).toBe(true);
		if (!r.ok) return;
		const pass = Object.fromEntries(r.value.checks.map((c) => [c.id, c.pass]));
		expect(pass).toEqual({ aa: true, 'aa-large': true, aaa: false, 'aaa-large': true, ui: true });
		expect(r.value.ratioText).toBe('4.54');
		expect(r.value.notes).toEqual([]);
	});
	it('fails AA just under 4.5', () => {
		const r = checkContrast('#777', 'white');
		expect(r.ok && r.value.checks.find((c) => c.id === 'aa')?.pass).toBe(false);
	});
	it('blends a semi-transparent text color with the background', () => {
		const r = checkContrast('rgb(0 0 0 / 0.5)', '#fff');
		expect(r.ok).toBe(true);
		if (!r.ok) return;
		expect(r.value.fgSeen).toBe('#808080');
		expect(r.value.notes[0]).toMatch(/50% opaque/);
		expect(r.value.ratio).toBeCloseTo(contrastRatio(rgb('#808080'), rgb('#fff')), 6);
	});
	it('places a transparent background over white and says so', () => {
		const r = checkContrast('#000', '#00000000');
		expect(r.ok && r.value.bgSeen).toBe('#ffffff');
		expect(r.ok && r.value.notes.length).toBe(1);
	});
	it('accepts every input format, including oklch() and named colors', () => {
		expect(checkContrast('oklch(0.5 0.1 250)', 'rebeccapurple').ok).toBe(true);
		expect(checkContrast('hsl(0 0% 20%)', 'rgb(100% 100% 100%)').ok).toBe(true);
	});
	it('names the field that is wrong', () => {
		const a = checkContrast('#12345', '#fff');
		expect(!a.ok && a.error).toMatch(/^Text color:/);
		const b = checkContrast('#000', 'nope');
		expect(!b.ok && b.error).toMatch(/^Background:/);
		expect(checkContrast('', '#fff').ok).toBe(false);
		expect(checkContrast('#000', '  ').ok).toBe(false);
	});
});

describe('composite', () => {
	it('mixes channels by alpha', () => {
		expect(composite({ r: 255, g: 0, b: 0 }, 0.5, { r: 0, g: 0, b: 255 })).toEqual({ r: 128, g: 0, b: 128 });
		expect(composite({ r: 10, g: 20, b: 30 }, 1, { r: 0, g: 0, b: 0 })).toEqual({ r: 10, g: 20, b: 30 });
	});
});

describe('suggestColors', () => {
	it('finds a darker and a lighter color that pass, and they really pass after rounding', () => {
		const bg = rgb('#808080');
		const s = suggestColors(rgb('#909090'), bg, 3);
		expect(s.map((x) => x.direction).sort()).toEqual(['darker', 'lighter']);
		for (const x of s) expect(contrastRatio(rgb(x.hex), bg)).toBeGreaterThanOrEqual(3);
	});
	it('keeps the hue: a failing blue stays blue', () => {
		const s = suggestColors(rgb('#4c8dff'), rgb('#ffffff'), 4.5);
		const darker = s.find((x) => x.direction === 'darker');
		expect(darker).toBeDefined();
		const c = rgb(darker!.hex);
		expect(c.b).toBeGreaterThan(c.r);
		expect(c.b).toBeGreaterThan(c.g);
		expect(contrastRatio(c, rgb('#fff'))).toBeGreaterThanOrEqual(4.5);
		// Nothing lighter than white exists.
		expect(s.find((x) => x.direction === 'lighter')).toBeUndefined();
	});
	it('stays close: the darker gray for AA on white is #767676 or very near it', () => {
		const s = suggestColors(rgb('#999999'), rgb('#ffffff'), 4.5);
		const c = rgb(s.find((x) => x.direction === 'darker')!.hex);
		expect(c.r).toBeGreaterThanOrEqual(0x70);
		expect(c.r).toBeLessThanOrEqual(0x76);
	});
	it('returns nothing when the target is unreachable', () => {
		expect(suggestColors(rgb('#777'), rgb('#777'), 22)).toEqual([]);
	});
});

describe('extractColors', () => {
	it('reads pairs written many ways', () => {
		expect(extractColors('#333 on #fff')).toEqual(['#333', '#fff']);
		expect(extractColors('color: #333333; background: white;')).toEqual(['#333333', 'white']);
		expect(extractColors('rgb(0 0 0)\nhsl(0 0% 100%)')).toEqual(['rgb(0 0 0)', 'hsl(0 0% 100%)']);
	});
	it('ignores ordinary words and duplicates', () => {
		expect(extractColors('text and background')).toEqual([]);
		expect(extractColors('hex: #4c8dff\nrgb: rgb(76 141 255)')).toEqual(['#4c8dff']);
	});
	it('stops at two colors', () => {
		expect(extractColors('#111 #222 #333')).toEqual(['#111', '#222']);
	});
});

describe('isLikelyColorPair', () => {
	it('accepts two explicit colors', () => {
		expect(isLikelyColorPair('#333 on #fff')).toBe(true);
		expect(isLikelyColorPair('rgb(0 0 0), #ffffff')).toBe(true);
	});
	it('rejects single colors, prose and long text', () => {
		expect(isLikelyColorPair('#333')).toBe(false);
		expect(isLikelyColorPair('#333 #333')).toBe(false);
		expect(isLikelyColorPair('red on white')).toBe(false);
		expect(isLikelyColorPair('#333 on #fff\n'.repeat(5))).toBe(false);
	});
});
