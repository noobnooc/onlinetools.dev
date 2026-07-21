import { describe, expect, it } from 'vitest';
import {
	ICO_SIZES,
	PNG_SET,
	coverCrop,
	crc32,
	faviconHtmlSnippet,
	packIco,
	packZip,
	readIcoDirectory,
	webManifest
} from './favicon';

const fakePng = (n: number) => Uint8Array.from({ length: n }, (_, i) => (i * 7) % 256);

describe('packIco', () => {
	it('packs entries with a correct directory', () => {
		const entries = [
			{ size: 16, png: fakePng(100) },
			{ size: 32, png: fakePng(200) },
			{ size: 48, png: fakePng(300) }
		];
		const r = packIco(entries);
		expect(r.ok).toBe(true);
		if (!r.ok) return;
		// Header + 3 dir entries + payloads.
		expect(r.value.length).toBe(6 + 48 + 600);
		const dir = readIcoDirectory(r.value);
		expect(dir).toEqual({
			ok: true,
			value: [
				{ size: 16, bytes: 100 },
				{ size: 32, bytes: 200 },
				{ size: 48, bytes: 300 }
			]
		});
	});

	it('embeds payloads verbatim at the recorded offsets', () => {
		const png = fakePng(64);
		const r = packIco([{ size: 32, png }]);
		expect(r.ok).toBe(true);
		if (!r.ok) return;
		expect([...r.value.subarray(6 + 16)]).toEqual([...png]);
	});

	it('encodes 256px as width byte 0', () => {
		const r = packIco([{ size: 256, png: fakePng(10) }]);
		expect(r.ok).toBe(true);
		if (!r.ok) return;
		expect(r.value[6]).toBe(0);
		const dir = readIcoDirectory(r.value);
		if (dir.ok) expect(dir.value[0].size).toBe(256);
	});

	it('rejects empty input and oversized entries', () => {
		expect(packIco([]).ok).toBe(false);
		expect(packIco([{ size: 300, png: fakePng(4) }]).ok).toBe(false);
	});
});

describe('crc32', () => {
	it('matches known vectors', () => {
		expect(crc32(new TextEncoder().encode(''))).toBe(0);
		expect(crc32(new TextEncoder().encode('123456789'))).toBe(0xcbf43926);
	});
});

describe('packZip', () => {
	it('produces a well-formed store-only archive', () => {
		const entries = [
			{ name: 'a.png', data: fakePng(50) },
			{ name: 'dir/b.txt', data: new TextEncoder().encode('hello') }
		];
		const r = packZip(entries);
		expect(r.ok).toBe(true);
		if (!r.ok) return;
		const zip = r.value;
		const view = new DataView(zip.buffer);
		// Local header signature at 0, EOCD signature at the end.
		expect(view.getUint32(0, true)).toBe(0x04034b50);
		expect(view.getUint32(zip.length - 22, true)).toBe(0x06054b50);
		// EOCD entry count.
		expect(view.getUint16(zip.length - 22 + 8, true)).toBe(2);
		// First entry: method store, name follows header.
		expect(view.getUint16(8, true)).toBe(0);
		expect(new TextDecoder().decode(zip.subarray(30, 35))).toBe('a.png');
		// Stored data verbatim.
		expect([...zip.subarray(35, 85)]).toEqual([...fakePng(50)]);
	});

	it('is deterministic', () => {
		const entries = [{ name: 'x', data: fakePng(9) }];
		const a = packZip(entries);
		const b = packZip(entries);
		expect(a).toEqual(b);
	});

	it('rejects empty input', () => {
		expect(packZip([]).ok).toBe(false);
	});
});

describe('favicon fileset', () => {
	it('snippet references every generated file', () => {
		const html = faviconHtmlSnippet();
		expect(html).toContain('/favicon.ico');
		expect(html).toContain('/favicon-16x16.png');
		expect(html).toContain('/favicon-32x32.png');
		expect(html).toContain('/apple-touch-icon.png');
		expect(html).toContain('/site.webmanifest');
	});

	it('manifest parses and lists the PWA icons', () => {
		const m = JSON.parse(webManifest());
		expect(m.icons.map((i: { sizes: string }) => i.sizes)).toEqual(['192x192', '512x512']);
	});

	it('PNG set covers the ICO sizes and standard names', () => {
		const sizes = PNG_SET.map((p) => p.size);
		for (const s of [16, 32]) expect(sizes).toContain(s);
		expect(ICO_SIZES).toEqual([16, 32, 48]);
	});
});

describe('coverCrop', () => {
	it('centers the largest square', () => {
		expect(coverCrop(1600, 900)).toEqual({ sx: 350, sy: 0, s: 900 });
		expect(coverCrop(900, 1600)).toEqual({ sx: 0, sy: 350, s: 900 });
		expect(coverCrop(512, 512)).toEqual({ sx: 0, sy: 0, s: 512 });
	});
});
