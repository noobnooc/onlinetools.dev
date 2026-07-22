/**
 * Brand asset generator — renders every raster brand asset from the two
 * source SVGs in /static plus an OG-image template defined here.
 *
 *   node scripts/generate-brand-assets.mjs
 *
 * Outputs (all into /static):
 *   apple-touch-icon.png   180×180  full-bleed (iOS applies its own mask)
 *   icon-192.png           192×192  PWA icon (purpose: any)
 *   icon-512.png           512×512  PWA icon (purpose: any)
 *   icon-maskable-512.png  512×512  PWA icon (purpose: maskable)
 *   favicon.ico            16/32/48 PNG-encoded ICO for legacy consumers
 *   og.png                 1200×630 Open Graph / Twitter card image
 *
 * Fonts (Inter, JetBrains Mono) are fetched once into scripts/.fonts via
 * curl (honors proxy env vars) and cached there; the directory is
 * gitignored. Rendering uses @resvg/resvg-js — no browser needed.
 */

import { Resvg } from '@resvg/resvg-js';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const STATIC = join(ROOT, 'static');
const FONT_DIR = join(dirname(fileURLToPath(import.meta.url)), '.fonts');

/* ------------------------------------------------------------------ */
/* Brand tokens — keep in sync with src/app.css (dark theme values).   */
/* ------------------------------------------------------------------ */
const C = {
	canvas: '#060709',
	bg: '#0B0D10',
	surface: '#12151A',
	border: '#262B33',
	text: '#E6E9EE',
	dim: '#8A919E',
	accent: '#4C8DFF',
	ok: '#3ECF8E'
};

/* ------------------------------------------------------------------ */
/* Fonts                                                               */
/* ------------------------------------------------------------------ */

// Static-weight TTFs served by the Google Fonts css2 API. The legacy
// user agent makes the API answer with plain TrueType URLs.
const FONTS = [
	{ file: 'Inter-400.ttf', css: 'family=Inter:wght@400' },
	{ file: 'Inter-600.ttf', css: 'family=Inter:wght@600' },
	{ file: 'Inter-700.ttf', css: 'family=Inter:wght@700' },
	{ file: 'JetBrainsMono-400.ttf', css: 'family=JetBrains+Mono:wght@400' },
	{ file: 'JetBrainsMono-500.ttf', css: 'family=JetBrains+Mono:wght@500' }
];

function curl(args) {
	return execFileSync('curl', ['-sS', ...args], { maxBuffer: 64 * 1024 * 1024 });
}

function ensureFonts() {
	mkdirSync(FONT_DIR, { recursive: true });
	for (const f of FONTS) {
		const path = join(FONT_DIR, f.file);
		if (existsSync(path)) continue;
		console.log(`fetching ${f.file} …`);
		const css = curl([
			'-A',
			'Mozilla/4.0',
			`https://fonts.googleapis.com/css2?${f.css}`
		]).toString();
		const url = css.match(/https:\/\/[^)]+\.ttf/)?.[0];
		if (!url) throw new Error(`no TTF URL in css2 response for ${f.css}`);
		writeFileSync(path, curl([url]));
	}
	return FONTS.map((f) => join(FONT_DIR, f.file));
}

/* ------------------------------------------------------------------ */
/* Rendering helpers                                                   */
/* ------------------------------------------------------------------ */

let fontFiles = [];

function renderPng(svg, width) {
	const resvg = new Resvg(svg, {
		fitTo: { mode: 'width', value: width },
		font: { fontFiles, loadSystemFonts: false, defaultFontFamily: 'Inter' }
	});
	return resvg.render().asPng();
}

/** Pack pre-rendered PNGs into a .ico container (PNG entries, Vista+). */
function packIco(entries) {
	const header = Buffer.alloc(6);
	header.writeUInt16LE(0, 0); // reserved
	header.writeUInt16LE(1, 2); // type: icon
	header.writeUInt16LE(entries.length, 4);
	const dir = Buffer.alloc(16 * entries.length);
	let offset = 6 + dir.length;
	entries.forEach(({ size, png }, i) => {
		const o = i * 16;
		dir.writeUInt8(size >= 256 ? 0 : size, o); // width
		dir.writeUInt8(size >= 256 ? 0 : size, o + 1); // height
		dir.writeUInt8(0, o + 2); // palette
		dir.writeUInt8(0, o + 3); // reserved
		dir.writeUInt16LE(1, o + 4); // color planes
		dir.writeUInt16LE(32, o + 6); // bits per pixel
		dir.writeUInt32LE(png.length, o + 8);
		dir.writeUInt32LE(offset, o + 12);
		offset += png.length;
	});
	return Buffer.concat([header, dir, ...entries.map((e) => e.png)]);
}

/* ------------------------------------------------------------------ */
/* OG image template                                                   */
/* ------------------------------------------------------------------ */

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** The brand mark as an inline group, scaled to `size` at (x, y). */
function mark(x, y, size, radius = 14.5) {
	const s = size / 64;
	return `<g transform="translate(${x} ${y}) scale(${s})">
		<rect width="64" height="64" rx="${radius}" fill="${C.bg}"/>
		<circle cx="32" cy="32" r="13" fill="none" stroke="${C.accent}" stroke-width="6"/>
		<circle cx="32" cy="32" r="5.5" fill="${C.ok}"/>
	</g>`;
}

/** Technical-drawing "+" registration mark centered at (x, y). */
function plus(x, y, r = 9) {
	return `<g stroke="${C.dim}" stroke-opacity="0.45" stroke-width="2">
		<line x1="${x - r}" y1="${y}" x2="${x + r}" y2="${y}"/>
		<line x1="${x}" y1="${y - r}" x2="${x}" y2="${y + r}"/>
	</g>`;
}

function ogSvg({ eyebrow, line1, line2, sub, chips }) {
	// Layout constants — a bordered content card floating on the recessed
	// canvas, mirroring the app shell.
	const W = 1200;
	const H = 630;
	const card = { x: 64, y: 64, w: 1072, h: 502, r: 24 };
	const padX = 120; // card inner left edge for content

	// Chip row: JetBrains Mono advance is 0.6 em; measure and lay out.
	const chipFs = 17;
	const chipH = 44;
	const chipPad = 18;
	const chipGap = 12;
	const chipY = 478;
	const charW = chipFs * 0.6;
	let cx = padX;
	let chipEls = '';
	for (const chip of chips) {
		const dotW = chip.dot ? 16 : 0;
		const w = chip.label.length * charW + chipPad * 2 + dotW;
		const color = chip.dot ? C.ok : C.dim;
		chipEls += `<g>
			<rect x="${cx}" y="${chipY}" width="${w.toFixed(1)}" height="${chipH}" rx="10"
				fill="${chip.dot ? C.ok : C.surface}" fill-opacity="${chip.dot ? 0.08 : 1}"
				stroke="${chip.dot ? C.ok : C.border}" stroke-opacity="${chip.dot ? 0.35 : 1}"/>
			${chip.dot ? `<circle cx="${(cx + chipPad + 4).toFixed(1)}" cy="${chipY + chipH / 2}" r="4" fill="${C.ok}"/>` : ''}
			<text x="${(cx + chipPad + dotW).toFixed(1)}" y="${chipY + chipH / 2 + chipFs * 0.36}"
				font-family="JetBrains Mono" font-size="${chipFs}" fill="${color}">${esc(chip.label)}</text>
		</g>`;
		cx += w + chipGap;
	}

	return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
	<rect width="${W}" height="${H}" fill="${C.canvas}"/>

	<!-- Content card -->
	<rect x="${card.x}" y="${card.y}" width="${card.w}" height="${card.h}" rx="${card.r}"
		fill="${C.bg}" stroke="${C.border}" stroke-width="2"/>
	${plus(card.x, card.y)}
	${plus(card.x + card.w, card.y)}
	${plus(card.x, card.y + card.h)}
	${plus(card.x + card.w, card.y + card.h)}

	<!-- Header: mark + wordmark, eyebrow on the right -->
	${mark(padX, 112, 56, 13)}
	<text x="${padX + 76}" y="150" font-family="Inter" font-weight="600" font-size="30"
		fill="${C.text}">onlinetools.dev</text>
	<text x="1080" y="148" text-anchor="end" font-family="JetBrains Mono" font-size="18"
		fill="${C.dim}">${esc(eyebrow)}</text>
	<line x1="${padX}" y1="208" x2="1080" y2="208" stroke="${C.border}" stroke-width="1"/>

	<!-- Headline -->
	<text x="${padX}" y="308" font-family="Inter" font-weight="700" font-size="66"
		letter-spacing="-1.5" fill="${C.text}">${esc(line1)}</text>
	<text x="${padX}" y="386" font-family="Inter" font-weight="700" font-size="66"
		letter-spacing="-1.5" fill="${C.accent}">${esc(line2)}</text>

	<!-- Subline -->
	<text x="${padX}" y="442" font-family="Inter" font-size="26" fill="${C.dim}">${esc(sub)}</text>

	<!-- Tool chips -->
	${chipEls}
</svg>`;
}

/* ------------------------------------------------------------------ */
/* Raster app-icon sources. These stay on the dark tile — like the OG   */
/* image, they are fixed app-tile surfaces with no live color scheme,   */
/* so they are rendered here rather than from the theme-adaptive         */
/* favicon.svg (whose prefers-color-scheme CSS a rasterizer can't pick). */
/* ------------------------------------------------------------------ */

// Rounded dark tile — PWA "any" icons and the legacy favicon.ico.
const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
	<rect width="64" height="64" rx="14.5" fill="${C.bg}"/>
	<circle cx="32" cy="32" r="13" fill="none" stroke="${C.accent}" stroke-width="6"/>
	<circle cx="32" cy="32" r="5.5" fill="${C.ok}"/>
</svg>`;

// Full-bleed dark tile for the apple-touch-icon (iOS masks it itself).
const appleSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
	<rect width="64" height="64" fill="${C.bg}"/>
	<circle cx="32" cy="32" r="13" fill="none" stroke="${C.accent}" stroke-width="6"/>
	<circle cx="32" cy="32" r="5.5" fill="${C.ok}"/>
</svg>`;

/* ------------------------------------------------------------------ */
/* Main                                                                */
/* ------------------------------------------------------------------ */

fontFiles = ensureFonts();

const maskableSvg = readFileSync(join(STATIC, 'icon-maskable.svg'), 'utf8');

const out = (name, buf) => {
	writeFileSync(join(STATIC, name), buf);
	console.log(`static/${name}  ${(buf.length / 1024).toFixed(1)} kB`);
};

out('icon-192.png', renderPng(iconSvg, 192));
out('icon-512.png', renderPng(iconSvg, 512));
out('icon-maskable-512.png', renderPng(maskableSvg, 512));
out('apple-touch-icon.png', renderPng(appleSvg, 180));
out(
	'favicon.ico',
	packIco([16, 32, 48].map((size) => ({ size, png: renderPng(iconSvg, size) })))
);

out(
	'og.png',
	renderPng(
		ogSvg({
			eyebrow: '27 tools · local-first',
			line1: 'Developer tools that run',
			line2: 'in your browser.',
			sub: 'No upload, no signup, no waiting — everything runs locally, even offline.',
			chips: [
				{ label: 'runs locally', dot: true },
				{ label: 'JSON' },
				{ label: 'Base64' },
				{ label: 'JWT' },
				{ label: 'Regex' },
				{ label: 'Cron' },
				{ label: 'UUID' },
				{ label: '+ 21 more' }
			]
		}),
		1200
	)
);
