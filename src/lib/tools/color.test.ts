import { describe, expect, it } from 'vitest';
import { parseColor, rgbToHsl, hslToRgb, rgbToOklch, isLikelyColor } from './color';

describe('parseColor — input formats', () => {
	it('parses 6-digit hex with and without #', () => {
		const r = parseColor('#4C8DFF');
		expect(r.ok && r.value.rgb).toBe('rgb(76 141 255)');
		const bare = parseColor('4c8dff');
		expect(bare.ok && bare.value.hex).toBe('#4c8dff');
	});
	it('parses 3-digit shorthand by digit doubling', () => {
		const r = parseColor('#abc');
		expect(r.ok && r.value.hex).toBe('#aabbcc');
	});
	it('parses 4- and 8-digit hex with alpha', () => {
		const four = parseColor('#f008');
		expect(four.ok && four.value.alpha).toBeCloseTo(0x88 / 255, 2);
		const eight = parseColor('#ff000080');
		expect(eight.ok && eight.value.alpha).toBeCloseTo(0.5, 1);
		expect(eight.ok && eight.value.hex).toBe('#ff000080');
	});
	it('parses rgb() in legacy and modern syntax', () => {
		expect(parseColor('rgb(255, 0, 0)').ok && parseColor('rgb(255, 0, 0)')).toMatchObject({
			value: { hex: '#ff0000' }
		});
		const modern = parseColor('rgb(0 128 255 / 0.5)');
		expect(modern.ok && modern.value.alpha).toBeCloseTo(0.5, 2);
		const pct = parseColor('rgba(0, 0, 0, 50%)');
		expect(pct.ok && pct.value.alpha).toBeCloseTo(0.5, 2);
	});
	it('clamps out-of-range rgb channels', () => {
		const r = parseColor('rgb(300 0 0)');
		expect(r.ok && r.value.r).toBe(255);
	});
	it('parses hsl() including deg suffix and alpha', () => {
		const r = parseColor('hsl(120 100% 50%)');
		expect(r.ok && r.value.hex).toBe('#00ff00');
		const deg = parseColor('hsl(240deg 100% 50%)');
		expect(deg.ok && deg.value.hex).toBe('#0000ff');
		const withAlpha = parseColor('hsl(0 100% 50% / 0.25)');
		expect(withAlpha.ok && withAlpha.value.alpha).toBeCloseTo(0.25, 2);
	});
	it('parses named colors, case-insensitively', () => {
		expect(parseColor('tomato').ok).toBe(true);
		const white = parseColor('WHITE');
		expect(white.ok && white.value.hex).toBe('#ffffff');
	});
	it('rejects invalid input with a helpful message', () => {
		for (const bad of ['#12345', '#gggggg', 'nonsense', 'rgb(1,2)', '']) {
			const r = parseColor(bad);
			expect(r.ok).toBe(false);
		}
	});
});

describe('parseColor — output formats', () => {
	it('emits all four formats in modern CSS syntax', () => {
		const r = parseColor('#4c8dff');
		expect(r.ok).toBe(true);
		if (r.ok) {
			expect(r.value.hex).toBe('#4c8dff');
			expect(r.value.rgb).toBe('rgb(76 141 255)');
			expect(r.value.hsl).toMatch(/^hsl\(\d+(\.\d+)? \d+(\.\d+)?% \d+(\.\d+)?%\)$/);
			expect(r.value.oklch).toMatch(/^oklch\(0\.\d+ 0\.\d+ \d+(\.\d+)?\)$/);
		}
	});
	it('carries alpha into every format with slash syntax', () => {
		const r = parseColor('rgb(76 141 255 / 0.5)');
		expect(r.ok).toBe(true);
		if (r.ok) {
			expect(r.value.rgb).toContain('/ 0.5');
			expect(r.value.hsl).toContain('/ 0.5');
			expect(r.value.oklch).toContain('/ 0.5');
			expect(r.value.hex).toHaveLength(9);
		}
	});
});

describe('color math', () => {
	it('rgb → hsl → rgb round-trips within 1 step', () => {
		for (const [r, g, b] of [
			[76, 141, 255],
			[255, 0, 0],
			[0, 0, 0],
			[255, 255, 255],
			[17, 200, 90]
		] as const) {
			const [h, s, l] = rgbToHsl(r, g, b);
			const [r2, g2, b2] = hslToRgb(h, s, l);
			expect(Math.abs(r2 - r)).toBeLessThanOrEqual(1);
			expect(Math.abs(g2 - g)).toBeLessThanOrEqual(1);
			expect(Math.abs(b2 - b)).toBeLessThanOrEqual(1);
		}
	});
	it('grayscale has zero saturation and hue 0', () => {
		expect(rgbToHsl(128, 128, 128)).toEqual([0, 0, expect.any(Number)]);
	});
	it('hslToRgb wraps hues beyond 360 and below 0', () => {
		expect(hslToRgb(480, 100, 50)).toEqual(hslToRgb(120, 100, 50));
		expect(hslToRgb(-240, 100, 50)).toEqual(hslToRgb(120, 100, 50));
	});
	it('OKLCH matches published reference values for sRGB red', () => {
		const [L, C, H] = rgbToOklch(255, 0, 0);
		expect(L).toBeCloseTo(0.628, 2);
		expect(C).toBeCloseTo(0.2577, 2);
		expect(H).toBeCloseTo(29.23, 0);
	});
	it('OKLCH of white is L≈1 C≈0; black is L=0', () => {
		const [wL, wC] = rgbToOklch(255, 255, 255);
		expect(wL).toBeCloseTo(1, 2);
		expect(wC).toBeCloseTo(0, 2);
		const [bL] = rgbToOklch(0, 0, 0);
		expect(bL).toBeCloseTo(0, 3);
	});
});

describe('isLikelyColor', () => {
	it('accepts hex and functional notations', () => {
		expect(isLikelyColor('#4c8dff')).toBe(true);
		expect(isLikelyColor('#abc')).toBe(true);
		expect(isLikelyColor('rgb(1 2 3)')).toBe(true);
		expect(isLikelyColor('hsla(1, 2%, 3%, 0.5)')).toBe(true);
	});
	it('rejects plain words and wrong-length hex', () => {
		expect(isLikelyColor('tomato')).toBe(false); // named colors are too ambiguous for paste detection
		expect(isLikelyColor('#12345')).toBe(false);
		expect(isLikelyColor('123456')).toBe(false); // bare hex without # is likely a number
	});
});
