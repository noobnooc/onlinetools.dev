import { describe, expect, it } from 'vitest';
import {
	BG_MODEL,
	compositeAlpha,
	coverage,
	maskToAlpha,
	parseHexColor,
	toModelInput
} from './bgremove';

describe('toModelInput', () => {
	it('lays pixels out planar (all R, then all G, then all B) and normalizes', () => {
		// Two pixels: pure red, then mid-gray.
		const rgba = new Uint8ClampedArray([255, 0, 0, 255, 128, 128, 128, 255]);
		const out = toModelInput(rgba, 2, 1);
		expect(out.length).toBe(6);
		const norm = (v: number, c: number) => (v / 255 - BG_MODEL.mean[c]) / BG_MODEL.std[c];
		expect(out[0]).toBeCloseTo(norm(255, 0));
		expect(out[1]).toBeCloseTo(norm(128, 0));
		expect(out[2]).toBeCloseTo(norm(0, 1));
		expect(out[3]).toBeCloseTo(norm(128, 1));
		expect(out[4]).toBeCloseTo(norm(0, 2));
		expect(out[5]).toBeCloseTo(norm(128, 2));
	});

	it('ignores the alpha channel', () => {
		const a = toModelInput(new Uint8ClampedArray([10, 20, 30, 255]), 1, 1);
		const b = toModelInput(new Uint8ClampedArray([10, 20, 30, 0]), 1, 1);
		expect(a).toEqual(b);
	});
});

describe('maskToAlpha', () => {
	it('stretches the map so its extremes become 0 and 255', () => {
		const r = maskToAlpha(new Float32Array([0.1, 0.3, 0.5]));
		expect(r.ok).toBe(true);
		if (!r.ok) return;
		expect([...r.value]).toEqual([0, 128, 255]);
	});

	it('rejects a flat map — nothing stands out', () => {
		expect(maskToAlpha(new Float32Array([0.5, 0.5, 0.5])).ok).toBe(false);
		expect(maskToAlpha(new Float32Array([])).ok).toBe(false);
	});

	it('rejects non-finite values rather than producing garbage', () => {
		const r = maskToAlpha([NaN, 0.2, 0.9]);
		expect(r.ok).toBe(false);
		if (!r.ok) expect(r.error).toBe('run');
	});
});

describe('compositeAlpha', () => {
	it('writes the mask into the alpha channel when the background is transparent', () => {
		const rgba = new Uint8ClampedArray([200, 100, 50, 255, 200, 100, 50, 255]);
		compositeAlpha(rgba, [255, 0], null);
		expect([...rgba]).toEqual([200, 100, 50, 255, 200, 100, 50, 0]);
	});

	it('respects transparency already present in the source', () => {
		const rgba = new Uint8ClampedArray([200, 100, 50, 128]);
		compositeAlpha(rgba, [255], null);
		expect(rgba[3]).toBe(128);
	});

	it('flattens onto a solid color and makes the pixel opaque', () => {
		const rgba = new Uint8ClampedArray([200, 100, 50, 255]);
		compositeAlpha(rgba, [0], { r: 255, g: 255, b: 255 });
		expect([...rgba]).toEqual([255, 255, 255, 255]);
		const half = new Uint8ClampedArray([200, 100, 0, 255]);
		compositeAlpha(half, [255 / 2], { r: 0, g: 0, b: 0 });
		expect([...half]).toEqual([100, 50, 0, 255]);
	});

	it('refuses a mask that does not match the pixel count', () => {
		expect(() => compositeAlpha(new Uint8ClampedArray(8), [255], null)).toThrow(RangeError);
	});
});

describe('parseHexColor', () => {
	it('parses long and short forms, with or without the hash', () => {
		expect(parseHexColor('#ffffff')).toEqual({ r: 255, g: 255, b: 255 });
		expect(parseHexColor('#0af')).toEqual({ r: 0, g: 170, b: 255 });
		expect(parseHexColor('123456')).toEqual({ r: 0x12, g: 0x34, b: 0x56 });
	});

	it('rejects anything else', () => {
		expect(parseHexColor('white')).toBeNull();
		expect(parseHexColor('#12345')).toBeNull();
		expect(parseHexColor('')).toBeNull();
	});
});

describe('coverage', () => {
	it('is the mean alpha as a fraction', () => {
		expect(coverage([255, 0, 255, 0])).toBeCloseTo(0.5);
		expect(coverage([])).toBe(0);
	});
});
