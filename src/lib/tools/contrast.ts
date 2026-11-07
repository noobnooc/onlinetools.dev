import { type ToolResult, ok, err } from './types';
import { parseColor, relativeLuminance, rgbToOklch, oklchToRgb, type ColorFormats } from './color';

/**
 * WCAG 2.x contrast checks. The ratio is (L1 + 0.05) / (L2 + 0.05) on
 * relative luminance; the thresholds come from success criteria 1.4.3
 * (AA text), 1.4.6 (AAA text) and 1.4.11 (non-text UI components).
 */

export interface Rgb {
	r: number;
	g: number;
	b: number;
}

export interface ContrastCheck {
	id: 'aa' | 'aa-large' | 'aaa' | 'aaa-large' | 'ui';
	/** Minimum ratio for this check. */
	min: number;
	pass: boolean;
}

export interface ContrastReport {
	/** Exact ratio, 1–21. Compare against thresholds with this, never the rounded one. */
	ratio: number;
	/** Two decimals, rounded down so a failing pair never displays as passing (4.496 → "4.49"). */
	ratioText: string;
	/** Text color after compositing any transparency over the background. */
	fg: ColorFormats;
	bg: ColorFormats;
	/** The opaque text color actually seen, as #rrggbb. */
	fgSeen: string;
	/** The opaque background actually seen, as #rrggbb. */
	bgSeen: string;
	checks: ContrastCheck[];
	notes: string[];
}

export const THRESHOLDS: Array<Omit<ContrastCheck, 'pass'>> = [
	{ id: 'aa', min: 4.5 },
	{ id: 'aa-large', min: 3 },
	{ id: 'aaa', min: 7 },
	{ id: 'aaa-large', min: 4.5 },
	{ id: 'ui', min: 3 }
];

export function contrastRatio(a: Rgb, b: Rgb): number {
	const la = relativeLuminance(a.r, a.g, a.b);
	const lb = relativeLuminance(b.r, b.g, b.b);
	return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/** Truncate (not round) to two decimals: WCAG thresholds are not met by rounding up. */
export function formatRatio(ratio: number): string {
	return (Math.floor(ratio * 100 + 1e-9) / 100).toFixed(2);
}

function hex(c: Rgb): string {
	return '#' + [c.r, c.g, c.b].map((v) => v.toString(16).padStart(2, '0')).join('');
}

/** Alpha-composite `top` over an opaque `bottom`, rounded to 8-bit channels. */
export function composite(top: Rgb, alpha: number, bottom: Rgb): Rgb {
	const mix = (t: number, u: number) => Math.round(t * alpha + u * (1 - alpha));
	return { r: mix(top.r, bottom.r), g: mix(top.g, bottom.g), b: mix(top.b, bottom.b) };
}

const WHITE: Rgb = { r: 255, g: 255, b: 255 };

/** Check a text color against a background color. */
export function checkContrast(fgInput: string, bgInput: string): ToolResult<ContrastReport> {
	if (fgInput.trim() === '') return err('Enter a text color');
	if (bgInput.trim() === '') return err('Enter a background color');
	const fg = parseColor(fgInput);
	if (!fg.ok) return err(`Text color: ${fg.error}`);
	const bg = parseColor(bgInput);
	if (!bg.ok) return err(`Background: ${bg.error}`);

	const notes: string[] = [];
	let bgSeen: Rgb = bg.value;
	if (bg.value.alpha < 1) {
		// WCAG measures what is on screen; a see-through background shows whatever
		// is behind it. White (the default page) is the only honest assumption.
		bgSeen = composite(bg.value, bg.value.alpha, WHITE);
		notes.push('The background is transparent, so it was placed over white. Check against the real page color behind it.');
	}
	let fgSeen: Rgb = fg.value;
	if (fg.value.alpha < 1) {
		fgSeen = composite(fg.value, fg.value.alpha, bgSeen);
		notes.push(`The text color is ${Math.round(fg.value.alpha * 100)}% opaque, so it was blended with the background (${hex(fgSeen)}).`);
	}

	const ratio = contrastRatio(fgSeen, bgSeen);
	return ok({
		ratio,
		ratioText: formatRatio(ratio),
		fg: fg.value,
		bg: bg.value,
		fgSeen: hex(fgSeen),
		bgSeen: hex(bgSeen),
		checks: THRESHOLDS.map((t) => ({ ...t, pass: ratio >= t.min })),
		notes
	});
}

export interface Suggestion {
	hex: string;
	ratio: number;
	direction: 'darker' | 'lighter';
}

/**
 * The colors closest to `moving` (same OKLCH hue and chroma, only lightness
 * changed) that reach `target` against `fixed`: at most one darker and one
 * lighter. Chroma is reduced where needed to stay inside sRGB. Each
 * candidate is checked after rounding to 8-bit channels, so the hex it
 * returns really does pass.
 */
export function suggestColors(moving: Rgb, fixed: Rgb, target: number): Suggestion[] {
	const [L0, C0, H] = rgbToOklch(moving.r, moving.g, moving.b);
	const out: Suggestion[] = [];
	const STEP = 0.0025;
	for (const direction of ['darker', 'lighter'] as const) {
		const sign = direction === 'darker' ? -1 : 1;
		for (let L = L0; L >= -1e-9 && L <= 1 + 1e-9; L += sign * STEP) {
			const c = inGamut(Math.min(1, Math.max(0, L)), C0, H);
			if (contrastRatio(c, fixed) >= target && isOnSide(c, fixed, direction)) {
				const h = hex(c);
				if (h !== hex(moving)) out.push({ hex: h, ratio: contrastRatio(c, fixed), direction });
				break;
			}
		}
	}
	return out;
}

/** The candidate must be darker (or lighter) than the fixed color, not merely different. */
function isOnSide(c: Rgb, fixed: Rgb, direction: 'darker' | 'lighter'): boolean {
	const lc = relativeLuminance(c.r, c.g, c.b);
	const lf = relativeLuminance(fixed.r, fixed.g, fixed.b);
	return direction === 'darker' ? lc < lf : lc > lf;
}

/** OKLCH → 8-bit sRGB, lowering chroma by bisection until every channel fits. */
function inGamut(L: number, C: number, H: number): Rgb {
	const fits = (c: number) => oklchToRgb(L, c, H).every((v) => v >= -1e-4 && v <= 1 + 1e-4);
	let chroma = C;
	if (!fits(chroma)) {
		let lo = 0;
		let hi = C;
		for (let i = 0; i < 20; i++) {
			const mid = (lo + hi) / 2;
			if (fits(mid)) lo = mid;
			else hi = mid;
		}
		chroma = lo;
	}
	const [r, g, b] = oklchToRgb(L, chroma, H).map((v) => Math.min(255, Math.max(0, Math.round(v * 255))));
	return { r, g, b };
}

/**
 * Pull a text/background pair out of free text: "#333 on #fff", "#333, #fff",
 * two lines, or `color: #333; background: #fff`. Returns the distinct colors
 * found, in order (at most two). One color means only the text color is known.
 */
export function extractColors(text: string): string[] {
	const token =
		/#[0-9a-f]{8}\b|#[0-9a-f]{6}\b|#[0-9a-f]{3,4}\b|(?:rgba?|hsla?|oklch)\([^)]*\)|\b[a-z]{3,20}\b/gi;
	const found: string[] = [];
	const seen = new Set<string>();
	for (const m of text.matchAll(token)) {
		const parsed = parseColor(m[0]);
		// Words are only kept when they are CSS color names; "on", "and", "color" etc. fall out here.
		if (!parsed.ok) continue;
		if (/^[a-z]+$/i.test(m[0]) && m[0].toLowerCase() === 'transparent') continue;
		if (seen.has(parsed.value.hex)) continue;
		seen.add(parsed.value.hex);
		found.push(m[0]);
		if (found.length === 2) break;
	}
	return found;
}

/** True for short input that names exactly two colors, like "#333 on #fff". */
export function isLikelyColorPair(input: string): boolean {
	const s = input.trim();
	if (s.length > 120 || s.split('\n').length > 3) return false;
	const tokens = s.match(/#[0-9a-f]{3,8}\b|(?:rgba?|hsla?|oklch)\([^)]*\)/gi) ?? [];
	return tokens.length === 2 && extractColors(s).length === 2;
}
