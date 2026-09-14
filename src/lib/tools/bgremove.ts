import { type ToolResult, ok, err } from './types';

/**
 * The segmentation model shipped with the site: U²-Net-p, the 4.6 MB
 * "small" variant of U²-Net (Apache-2.0), exported with a fixed 320×320
 * input — the same weights rembg calls `u2netp`. It predicts a saliency
 * map: how much each pixel belongs to the thing that stands out.
 */
export const BG_MODEL = {
	url: '/models/u2netp.onnx',
	/** Exact file size, so the download bar has a denominator. */
	bytes: 4574861,
	size: 320,
	/** ImageNet statistics the network was trained with. */
	mean: [0.485, 0.456, 0.406],
	std: [0.229, 0.224, 0.225]
} as const;

export interface RGB {
	r: number;
	g: number;
	b: number;
}

/**
 * RGBA pixels (as canvas hands them out) → planar NCHW float32 input,
 * normalized per channel. Alpha is ignored; the model only sees color.
 */
export function toModelInput(
	rgba: ArrayLike<number>,
	width: number,
	height: number
): Float32Array {
	const n = width * height;
	const out = new Float32Array(3 * n);
	const { mean, std } = BG_MODEL;
	for (let i = 0; i < n; i++) {
		const p = i * 4;
		out[i] = (rgba[p] / 255 - mean[0]) / std[0];
		out[n + i] = (rgba[p + 1] / 255 - mean[1]) / std[1];
		out[2 * n + i] = (rgba[p + 2] / 255 - mean[2]) / std[2];
	}
	return out;
}

/**
 * Turn the network's raw saliency map into 0–255 alpha. The output range
 * drifts from image to image (it is a sigmoid, but rarely spans the full
 * 0–1), so it is min-max stretched first — the same post-processing rembg
 * applies. A flat map means the model found nothing to separate.
 */
export function maskToAlpha(mask: ArrayLike<number>): ToolResult<Uint8ClampedArray> {
	if (mask.length === 0) return err('flatMask');
	let lo = Infinity;
	let hi = -Infinity;
	for (let i = 0; i < mask.length; i++) {
		const v = mask[i];
		if (!Number.isFinite(v)) return err('run'); // a broken run, not an empty scene
		if (v < lo) lo = v;
		if (v > hi) hi = v;
	}
	if (hi - lo < 1e-6) return err('flatMask');
	const scale = 255 / (hi - lo);
	const alpha = new Uint8ClampedArray(mask.length);
	for (let i = 0; i < mask.length; i++) alpha[i] = Math.round((mask[i] - lo) * scale);
	return alpha.length ? ok(alpha) : err('flatMask');
}

/**
 * Composite in place: each pixel keeps its color weighted by the alpha
 * mask, either as true transparency (`background` null — the alpha channel
 * carries the cut-out) or flattened over a solid color for formats without
 * alpha. Existing transparency in the source is respected.
 */
export function compositeAlpha(
	rgba: Uint8ClampedArray,
	alpha: ArrayLike<number>,
	background: RGB | null
): Uint8ClampedArray {
	const n = alpha.length;
	if (rgba.length !== n * 4) throw new RangeError('alpha length does not match pixel count');
	for (let i = 0; i < n; i++) {
		const p = i * 4;
		const a = (alpha[i] * rgba[p + 3]) / 255;
		if (background) {
			const t = a / 255;
			rgba[p] = Math.round(rgba[p] * t + background.r * (1 - t));
			rgba[p + 1] = Math.round(rgba[p + 1] * t + background.g * (1 - t));
			rgba[p + 2] = Math.round(rgba[p + 2] * t + background.b * (1 - t));
			rgba[p + 3] = 255;
		} else {
			rgba[p + 3] = Math.round(a);
		}
	}
	return rgba;
}

/** `#rgb` or `#rrggbb` (what an <input type="color"> yields) → channels. */
export function parseHexColor(hex: string): RGB | null {
	const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim());
	if (!m) return null;
	let h = m[1];
	if (h.length === 3) h = [...h].map((c) => c + c).join('');
	const v = parseInt(h, 16);
	return { r: (v >> 16) & 255, g: (v >> 8) & 255, b: v & 255 };
}

/**
 * How large the cut-out is as a fraction of the frame, from the alpha
 * mask — a sanity signal shown next to the result.
 */
export function coverage(alpha: ArrayLike<number>): number {
	if (alpha.length === 0) return 0;
	let sum = 0;
	for (let i = 0; i < alpha.length; i++) sum += alpha[i];
	return sum / (alpha.length * 255);
}
