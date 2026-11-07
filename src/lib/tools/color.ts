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

function linearToSrgb(c: number): number {
	return c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;
}

/**
 * OKLCH → sRGB channels in 0–1, unclamped: a value outside 0–1 means the
 * color is outside the sRGB gamut.
 */
export function oklchToRgb(L: number, C: number, H: number): [number, number, number] {
	const h = (H * Math.PI) / 180;
	const A = C * Math.cos(h);
	const B = C * Math.sin(h);
	const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
	const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
	const s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;
	return [
		linearToSrgb(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
		linearToSrgb(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
		linearToSrgb(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s)
	];
}

/** WCAG 2.x relative luminance of an sRGB color (channels 0–255). */
export function relativeLuminance(r: number, g: number, b: number): number {
	return 0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b);
}

function parseAlpha(v: string): number {
	return v.endsWith('%') ? Number(v.slice(0, -1)) / 100 : Number(v);
}

/** The 148 CSS named colors (CSS Color 4), plus `transparent`. */
const NAMED: Record<string, string> = {
	aliceblue: '#f0f8ff',
	antiquewhite: '#faebd7',
	aqua: '#00ffff',
	aquamarine: '#7fffd4',
	azure: '#f0ffff',
	beige: '#f5f5dc',
	bisque: '#ffe4c4',
	black: '#000000',
	blanchedalmond: '#ffebcd',
	blue: '#0000ff',
	blueviolet: '#8a2be2',
	brown: '#a52a2a',
	burlywood: '#deb887',
	cadetblue: '#5f9ea0',
	chartreuse: '#7fff00',
	chocolate: '#d2691e',
	coral: '#ff7f50',
	cornflowerblue: '#6495ed',
	cornsilk: '#fff8dc',
	crimson: '#dc143c',
	cyan: '#00ffff',
	darkblue: '#00008b',
	darkcyan: '#008b8b',
	darkgoldenrod: '#b8860b',
	darkgray: '#a9a9a9',
	darkgreen: '#006400',
	darkgrey: '#a9a9a9',
	darkkhaki: '#bdb76b',
	darkmagenta: '#8b008b',
	darkolivegreen: '#556b2f',
	darkorange: '#ff8c00',
	darkorchid: '#9932cc',
	darkred: '#8b0000',
	darksalmon: '#e9967a',
	darkseagreen: '#8fbc8f',
	darkslateblue: '#483d8b',
	darkslategray: '#2f4f4f',
	darkslategrey: '#2f4f4f',
	darkturquoise: '#00ced1',
	darkviolet: '#9400d3',
	deeppink: '#ff1493',
	deepskyblue: '#00bfff',
	dimgray: '#696969',
	dimgrey: '#696969',
	dodgerblue: '#1e90ff',
	firebrick: '#b22222',
	floralwhite: '#fffaf0',
	forestgreen: '#228b22',
	fuchsia: '#ff00ff',
	gainsboro: '#dcdcdc',
	ghostwhite: '#f8f8ff',
	gold: '#ffd700',
	goldenrod: '#daa520',
	gray: '#808080',
	green: '#008000',
	greenyellow: '#adff2f',
	grey: '#808080',
	honeydew: '#f0fff0',
	hotpink: '#ff69b4',
	indianred: '#cd5c5c',
	indigo: '#4b0082',
	ivory: '#fffff0',
	khaki: '#f0e68c',
	lavender: '#e6e6fa',
	lavenderblush: '#fff0f5',
	lawngreen: '#7cfc00',
	lemonchiffon: '#fffacd',
	lightblue: '#add8e6',
	lightcoral: '#f08080',
	lightcyan: '#e0ffff',
	lightgoldenrodyellow: '#fafad2',
	lightgray: '#d3d3d3',
	lightgreen: '#90ee90',
	lightgrey: '#d3d3d3',
	lightpink: '#ffb6c1',
	lightsalmon: '#ffa07a',
	lightseagreen: '#20b2aa',
	lightskyblue: '#87cefa',
	lightslategray: '#778899',
	lightslategrey: '#778899',
	lightsteelblue: '#b0c4de',
	lightyellow: '#ffffe0',
	lime: '#00ff00',
	limegreen: '#32cd32',
	linen: '#faf0e6',
	magenta: '#ff00ff',
	maroon: '#800000',
	mediumaquamarine: '#66cdaa',
	mediumblue: '#0000cd',
	mediumorchid: '#ba55d3',
	mediumpurple: '#9370db',
	mediumseagreen: '#3cb371',
	mediumslateblue: '#7b68ee',
	mediumspringgreen: '#00fa9a',
	mediumturquoise: '#48d1cc',
	mediumvioletred: '#c71585',
	midnightblue: '#191970',
	mintcream: '#f5fffa',
	mistyrose: '#ffe4e1',
	moccasin: '#ffe4b5',
	navajowhite: '#ffdead',
	navy: '#000080',
	oldlace: '#fdf5e6',
	olive: '#808000',
	olivedrab: '#6b8e23',
	orange: '#ffa500',
	orangered: '#ff4500',
	orchid: '#da70d6',
	palegoldenrod: '#eee8aa',
	palegreen: '#98fb98',
	paleturquoise: '#afeeee',
	palevioletred: '#db7093',
	papayawhip: '#ffefd5',
	peachpuff: '#ffdab9',
	peru: '#cd853f',
	pink: '#ffc0cb',
	plum: '#dda0dd',
	powderblue: '#b0e0e6',
	purple: '#800080',
	rebeccapurple: '#663399',
	red: '#ff0000',
	rosybrown: '#bc8f8f',
	royalblue: '#4169e1',
	saddlebrown: '#8b4513',
	salmon: '#fa8072',
	sandybrown: '#f4a460',
	seagreen: '#2e8b57',
	seashell: '#fff5ee',
	sienna: '#a0522d',
	silver: '#c0c0c0',
	skyblue: '#87ceeb',
	slateblue: '#6a5acd',
	slategray: '#708090',
	slategrey: '#708090',
	snow: '#fffafa',
	springgreen: '#00ff7f',
	steelblue: '#4682b4',
	tan: '#d2b48c',
	teal: '#008080',
	thistle: '#d8bfd8',
	tomato: '#ff6347',
	turquoise: '#40e0d0',
	violet: '#ee82ee',
	wheat: '#f5deb3',
	white: '#ffffff',
	whitesmoke: '#f5f5f5',
	yellow: '#ffff00',
	yellowgreen: '#9acd32',
	transparent: '#00000000'
};

/** Parse hex/rgb()/hsl()/oklch()/named colors into channel values. */
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

	// Channels may be integers, decimals or percentages (`rgb(50% 0% 100%)`).
	const rgbMatch = s.match(
		/^rgba?\(\s*([\d.]+%?)[\s,]+([\d.]+%?)[\s,]+([\d.]+%?)(?:[\s,/]+([\d.]+%?))?\s*\)$/
	);
	if (rgbMatch) {
		const channel = (v: string) =>
			clamp(Math.round(v.endsWith('%') ? (Number(v.slice(0, -1)) / 100) * 255 : Number(v)), 0, 255);
		r = channel(rgbMatch[1]);
		g = channel(rgbMatch[2]);
		b = channel(rgbMatch[3]);
		if ([r, g, b].some(Number.isNaN)) return err('rgb() channels must be numbers');
		if (rgbMatch[4]) alpha = parseAlpha(rgbMatch[4]);
	}

	const hslMatch = s.match(/^hsla?\(\s*([\d.]+)(?:deg)?[\s,]+([\d.]+)%[\s,]+([\d.]+)%(?:[\s,/]+([\d.]+%?))?\s*\)$/);
	if (hslMatch) {
		[r, g, b] = hslToRgb(Number(hslMatch[1]), Number(hslMatch[2]), Number(hslMatch[3]));
		if (hslMatch[4]) alpha = parseAlpha(hslMatch[4]);
	}

	// oklch(L C H): L as 0–1 or a percentage, C as a number or a percentage of 0.4.
	const oklchMatch = s.match(
		/^oklch\(\s*([\d.]+%?)\s+([\d.]+%?)\s+([\d.]+)(?:deg)?(?:\s*\/\s*([\d.]+%?))?\s*\)$/
	);
	if (oklchMatch) {
		const L = oklchMatch[1].endsWith('%') ? Number(oklchMatch[1].slice(0, -1)) / 100 : Number(oklchMatch[1]);
		const C = oklchMatch[2].endsWith('%') ? (Number(oklchMatch[2].slice(0, -1)) / 100) * 0.4 : Number(oklchMatch[2]);
		const H = Number(oklchMatch[3]);
		if ([L, C, H].some(Number.isNaN)) return err('oklch() values must be numbers');
		// Out-of-gamut colors are clipped per channel, as browsers render them in sRGB.
		[r, g, b] = oklchToRgb(L, C, H).map((v) => clamp(Math.round(v * 255), 0, 255));
		if (oklchMatch[4]) alpha = parseAlpha(oklchMatch[4]);
	}

	if (r === undefined || g === undefined || b === undefined) {
		return err('Not a recognizable color (try #hex, rgb(), hsl(), oklch(), or a named color)');
	}
	if (Number.isNaN(alpha)) return err('Alpha must be a number between 0 and 1');
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
		/^(rgba?|hsla?|oklch)\(/.test(s.toLowerCase());
}
