import { type ToolResult, ok, err } from './types';

/**
 * Favicon packaging: an ICO container packer and a store-only ZIP packer.
 * Both write modern, PNG-based archives entirely in memory — no encoder
 * beyond what the canvas already produced.
 */

/** Sizes embedded in favicon.ico — the classic tab/bookmark set. */
export const ICO_SIZES = [16, 32, 48] as const;

/** The standalone PNG set: tab icons, Apple touch icon, PWA manifest icons. */
export const PNG_SET = [
	{ size: 16, name: 'favicon-16x16.png' },
	{ size: 32, name: 'favicon-32x32.png' },
	{ size: 180, name: 'apple-touch-icon.png' },
	{ size: 192, name: 'android-chrome-192x192.png' },
	{ size: 512, name: 'android-chrome-512x512.png' }
] as const;

export interface IcoEntry {
	/** Square pixel size (1–256). */
	size: number;
	/** PNG-encoded image bytes at exactly that size. */
	png: Uint8Array;
}

/**
 * Pack PNG images into an .ico container. Windows Vista+ and every browser
 * accept PNG-compressed entries, so the payloads are embedded verbatim.
 */
export function packIco(entries: IcoEntry[]): ToolResult<Uint8Array> {
	if (entries.length === 0) return err('No images to pack');
	if (entries.length > 0xffff) return err('Too many images for one ICO');
	for (const e of entries) {
		if (e.size < 1 || e.size > 256) return err('ICO entries must be 1–256 pixels');
	}
	const headerSize = 6 + 16 * entries.length;
	const total = headerSize + entries.reduce((n, e) => n + e.png.length, 0);
	const out = new Uint8Array(total);
	const view = new DataView(out.buffer);
	view.setUint16(0, 0, true); // reserved
	view.setUint16(2, 1, true); // type: icon
	view.setUint16(4, entries.length, true);
	let dir = 6;
	let offset = headerSize;
	for (const e of entries) {
		out[dir] = e.size === 256 ? 0 : e.size; // width (0 means 256)
		out[dir + 1] = e.size === 256 ? 0 : e.size; // height
		out[dir + 2] = 0; // palette colors
		out[dir + 3] = 0; // reserved
		view.setUint16(dir + 4, 1, true); // color planes
		view.setUint16(dir + 6, 32, true); // bits per pixel
		view.setUint32(dir + 8, e.png.length, true);
		view.setUint32(dir + 12, offset, true);
		out.set(e.png, offset);
		offset += e.png.length;
		dir += 16;
	}
	return ok(out);
}

/** Parse an ICO directory back into (size, byteLength) pairs — for tests. */
export function readIcoDirectory(ico: Uint8Array): ToolResult<Array<{ size: number; bytes: number }>> {
	const view = new DataView(ico.buffer, ico.byteOffset, ico.byteLength);
	if (ico.length < 6 || view.getUint16(2, true) !== 1) return err('Not an ICO file');
	const count = view.getUint16(4, true);
	const out: Array<{ size: number; bytes: number }> = [];
	for (let i = 0; i < count; i++) {
		const dir = 6 + i * 16;
		if (dir + 16 > ico.length) return err('Truncated ICO directory');
		const w = ico[dir];
		out.push({ size: w === 0 ? 256 : w, bytes: view.getUint32(dir + 8, true) });
	}
	return ok(out);
}

// CRC-32 (IEEE), table-based — required by the ZIP format.
const CRC_TABLE = (() => {
	const table = new Uint32Array(256);
	for (let n = 0; n < 256; n++) {
		let c = n;
		for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
		table[n] = c >>> 0;
	}
	return table;
})();

export function crc32(data: Uint8Array): number {
	let crc = 0xffffffff;
	for (let i = 0; i < data.length; i++) {
		crc = CRC_TABLE[(crc ^ data[i]) & 0xff] ^ (crc >>> 8);
	}
	return (crc ^ 0xffffffff) >>> 0;
}

export interface ZipEntry {
	name: string;
	data: Uint8Array;
}

/**
 * Build a store-only (no compression) ZIP. PNGs are already compressed, so
 * stored entries cost almost nothing and need no deflate implementation.
 * Timestamps are fixed for deterministic output.
 */
export function packZip(entries: ZipEntry[]): ToolResult<Uint8Array> {
	if (entries.length === 0) return err('No files to pack');
	const encoder = new TextEncoder();
	const locals: Uint8Array[] = [];
	const centrals: Uint8Array[] = [];
	let offset = 0;
	for (const entry of entries) {
		const name = encoder.encode(entry.name);
		if (name.length > 0xffff) return err('File name too long');
		const crc = crc32(entry.data);
		const local = new Uint8Array(30 + name.length + entry.data.length);
		const lv = new DataView(local.buffer);
		lv.setUint32(0, 0x04034b50, true);
		lv.setUint16(4, 20, true); // version needed
		lv.setUint16(6, 0x0800, true); // UTF-8 names
		lv.setUint16(8, 0, true); // method: store
		lv.setUint16(10, 0, true); // time
		lv.setUint16(12, 0x2921, true); // date: 2000-09-01, arbitrary fixed
		lv.setUint32(14, crc, true);
		lv.setUint32(18, entry.data.length, true);
		lv.setUint32(22, entry.data.length, true);
		lv.setUint16(26, name.length, true);
		lv.setUint16(28, 0, true);
		local.set(name, 30);
		local.set(entry.data, 30 + name.length);
		locals.push(local);

		const central = new Uint8Array(46 + name.length);
		const cv = new DataView(central.buffer);
		cv.setUint32(0, 0x02014b50, true);
		cv.setUint16(4, 20, true);
		cv.setUint16(6, 20, true);
		cv.setUint16(8, 0x0800, true);
		cv.setUint16(10, 0, true);
		cv.setUint16(12, 0, true);
		cv.setUint16(14, 0x2921, true);
		cv.setUint32(16, crc, true);
		cv.setUint32(20, entry.data.length, true);
		cv.setUint32(24, entry.data.length, true);
		cv.setUint16(28, name.length, true);
		cv.setUint32(42, offset, true);
		central.set(name, 46);
		centrals.push(central);
		offset += local.length;
	}
	const centralSize = centrals.reduce((n, c) => n + c.length, 0);
	const eocd = new Uint8Array(22);
	const ev = new DataView(eocd.buffer);
	ev.setUint32(0, 0x06054b50, true);
	ev.setUint16(8, entries.length, true);
	ev.setUint16(10, entries.length, true);
	ev.setUint32(12, centralSize, true);
	ev.setUint32(16, offset, true);
	const total = offset + centralSize + 22;
	const out = new Uint8Array(total);
	let pos = 0;
	for (const chunk of [...locals, ...centrals, eocd]) {
		out.set(chunk, pos);
		pos += chunk.length;
	}
	return ok(out);
}

/** The <link>/manifest markup that goes with the generated file set. */
export function faviconHtmlSnippet(): string {
	return [
		'<link rel="icon" href="/favicon.ico" sizes="32x32">',
		'<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">',
		'<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">',
		'<link rel="apple-touch-icon" href="/apple-touch-icon.png">',
		'<link rel="manifest" href="/site.webmanifest">'
	].join('\n');
}

/** Minimal web app manifest referencing the generated PWA icons. */
export function webManifest(): string {
	return JSON.stringify(
		{
			name: '',
			short_name: '',
			icons: [
				{ src: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
				{ src: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' }
			],
			theme_color: '#ffffff',
			background_color: '#ffffff',
			display: 'standalone'
		},
		null,
		'\t'
	);
}

/**
 * Cover-crop geometry: the largest centered square of the source, so
 * non-square images fill each icon without letterboxing.
 */
export function coverCrop(width: number, height: number): { sx: number; sy: number; s: number } {
	const s = Math.min(width, height);
	return { sx: Math.floor((width - s) / 2), sy: Math.floor((height - s) / 2), s };
}
