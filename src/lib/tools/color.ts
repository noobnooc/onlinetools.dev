import { type ToolResult, ok, err } from './types';

export interface ColorFormats {
	hex: string;
	rgb: string;
	hsl: string;
	oklch: string;
	/** Raw channels for building UI. */
	r: number;
	g: number;
	b: number;
	alpha: number;
}

function clamp(v: number, min: number, max: number): number {
	return Math.min(max, Math.max(min, v));
}

function round(v: number, places = 2): number {
	const f = 10 ** places;
	return Math.round(v * f) / f;
}

export function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
	const rn = r / 255;
	const gn = g / 255;
	const bn = b / 255;
	const max = Math.max(rn, gn, bn);
	const min = Math.min(rn, gn, bn);
	const l = (max + min) / 2;
	if (max === min) return [0, 0, l * 100];
	const d = max - min;
	const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
	let h: number;
	if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
	else if (max === gn) h = ((bn - rn) / d + 2) / 6;
	else h = ((rn - gn) / d + 4) / 6;
	return [h * 360, s * 100, l * 100];
}

export function hslToRgb(h: number, s: number, l: number): [number, number, number] {
	const hn = (((h % 360) + 360) % 360) / 360;
	const sn = clamp(s, 0, 100) / 100;
	const ln = clamp(l, 0, 100) / 100;
	if (sn === 0) {
		const v = Math.round(ln * 255);
		return [v, v, v];
	}
	const q = ln < 0.5 ? ln * (1 + sn) : ln + sn - ln * sn;
	const p = 2 * ln - q;
	const hue2rgb = (t: number) => {
		let tn = t;
		if (tn < 0) tn += 1;
		if (tn > 1) tn -= 1;
		if (tn < 1 / 6) return p + (q - p) * 6 * tn;
		if (tn < 1 / 2) return q;
		if (tn < 2 / 3) return p + (q - p) * (2 / 3 - tn) * 6;
		return p;
	};
	return [
		Math.round(hue2rgb(hn + 1 / 3) * 255),
		Math.round(hue2rgb(hn) * 255),
		Math.round(hue2rgb(hn - 1 / 3) * 255)
	];
}

/* sRGB → OKLab → OKLCH (Björn Ottosson's reference coefficients). */
function srgbToLinear(c: number): number {
	const cn = c / 255;
	return cn <= 0.04045 ? cn / 12.92 : ((cn + 0.055) / 1.055) ** 2.4;
}

export function rgbToOklch(r: number, g: number, b: number): [number, number, number] {
	const lr = srgbToLinear(r);
	const lg = srgbToLinear(g);
	const lb = srgbToLinear(b);
	const l_ = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
	const m_ = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
	const s_ = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
	const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
	const A = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
	const B = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;
	const C = Math.sqrt(A * A + B * B);
	let H = (Math.atan2(B, A) * 180) / Math.PI;
	if (H < 0) H += 360;
	return [L, C, C < 1e-6 ? 0 : H];
}

const NAMED: Record<string, string> = {
	black: '#000000',
	white: '#ffffff',
	red: '#ff0000',
	green: '#008000',
	blue: '#0000ff',
	yellow: '#ffff00',
	cyan: '#00ffff',
	magenta: '#ff00ff',
	orange: '#ffa500',
	purple: '#800080',
	gray: '#808080',
	grey: '#808080',
	rebeccapurple: '#663399',
	tomato: '#ff6347',
	teal: '#008080',
	navy: '#000080',
	transparent: '#00000000'
};

/** Parse hex/rgb()/hsl()/named colors into channel values. */
export function parseColor(input: string): ToolResult<ColorFormats> {
	let s = input.trim().toLowerCase();
	if (s === '') return err('Input is empty');
	if (s in NAMED) s = NAMED[s];

	let r: number | undefined;
	let g: number | undefined;
	let b: number | undefined;
	let alpha = 1;

	const hex = s.match(/^#?([0-9a-f]{3,8})$/);
	if (hex) {
		const h = hex[1];
		if (h.length === 3 || h.length === 4) {
			r = parseInt(h[0] + h[0], 16);
			g = parseInt(h[1] + h[1], 16);
			b = parseInt(h[2] + h[2], 16);
			if (h.length === 4) alpha = parseInt(h[3] + h[3], 16) / 255;
		} else if (h.length === 6 || h.length === 8) {
			r = parseInt(h.slice(0, 2), 16);
			g = parseInt(h.slice(2, 4), 16);
			b = parseInt(h.slice(4, 6), 16);
			if (h.length === 8) alpha = parseInt(h.slice(6, 8), 16) / 255;
		} else {
			return err('Hex colors have 3, 4, 6 or 8 digits');
		}
	}

	const rgbMatch = s.match(/^rgba?\(\s*(\d{1,3})[\s,]+(\d{1,3})[\s,]+(\d{1,3})(?:[\s,/]+([\d.]+%?))?\s*\)$/);
	if (rgbMatch) {
		r = clamp(Number(rgbMatch[1]), 0, 255);
		g = clamp(Number(rgbMatch[2]), 0, 255);
		b = clamp(Number(rgbMatch[3]), 0, 255);
		if (rgbMatch[4]) {
			alpha = rgbMatch[4].endsWith('%') ? Number(rgbMatch[4].slice(0, -1)) / 100 : Number(rgbMatch[4]);
		}
	}

	const hslMatch = s.match(/^hsla?\(\s*([\d.]+)(?:deg)?[\s,]+([\d.]+)%[\s,]+([\d.]+)%(?:[\s,/]+([\d.]+%?))?\s*\)$/);
	if (hslMatch) {
		[r, g, b] = hslToRgb(Number(hslMatch[1]), Number(hslMatch[2]), Number(hslMatch[3]));
		if (hslMatch[4]) {
			alpha = hslMatch[4].endsWith('%') ? Number(hslMatch[4].slice(0, -1)) / 100 : Number(hslMatch[4]);
		}
	}

	if (r === undefined || g === undefined || b === undefined) {
		return err('Not a recognizable color (try #hex, rgb(), hsl(), or a named color)');
	}
	alpha = clamp(alpha, 0, 1);

	const [h, sPct, l] = rgbToHsl(r, g, b);
	const [L, C, H] = rgbToOklch(r, g, b);
	const hexOut =
		'#' +
		[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('') +
		(alpha < 1 ? Math.round(alpha * 255).toString(16).padStart(2, '0') : '');

	return ok({
		hex: hexOut,
		rgb: alpha < 1 ? `rgb(${r} ${g} ${b} / ${round(alpha)})` : `rgb(${r} ${g} ${b})`,
		hsl:
			alpha < 1
				? `hsl(${round(h, 1)} ${round(sPct, 1)}% ${round(l, 1)}% / ${round(alpha)})`
				: `hsl(${round(h, 1)} ${round(sPct, 1)}% ${round(l, 1)}%)`,
		oklch:
			alpha < 1
				? `oklch(${round(L, 4)} ${round(C, 4)} ${round(H, 1)} / ${round(alpha)})`
				: `oklch(${round(L, 4)} ${round(C, 4)} ${round(H, 1)})`,
		r,
		g,
		b,
		alpha
	});
}

export function isLikelyColor(input: string): boolean {
	const s = input.trim();
	return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(s) ||
		/^(rgb|hsl)a?\(/.test(s.toLowerCase());
}
