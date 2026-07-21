import { describe, expect, it } from 'vitest';
import {
	base64EncodedSize,
	base64ToBytes,
	buildDataUrl,
	bytesToBase64,
	cssSnippet,
	htmlSnippet,
	isLikelyImageDataUrl,
	kindForMime,
	parseImageInput,
	resizeDimensions,
	sniffImageType
} from './image';

// Real headers of a 1×1 image in each format, enough for sniffing.
const PNG = Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const JPEG = Uint8Array.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46]);
const GIF = new TextEncoder().encode('GIF89a\x01\x00');
const WEBP = new TextEncoder().encode('RIFF\x1a\x00\x00\x00WEBPVP8 ');
const BMP = new TextEncoder().encode('BM\x3a\x00\x00\x00');
const ICO = Uint8Array.from([0, 0, 1, 0, 1, 0]);
const AVIF = new TextEncoder().encode('\x00\x00\x00\x1cftypavif');
const SVG = new TextEncoder().encode('  <svg xmlns="http://www.w3.org/2000/svg"></svg>');
const SVG_XML = new TextEncoder().encode('<?xml version="1.0"?>\n<svg></svg>');

// A complete, valid 1×1 transparent PNG.
const TINY_PNG_B64 =
	'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

describe('sniffImageType', () => {
	it('identifies formats by magic bytes', () => {
		expect(sniffImageType(PNG)).toBe('png');
		expect(sniffImageType(JPEG)).toBe('jpeg');
		expect(sniffImageType(GIF)).toBe('gif');
		expect(sniffImageType(WEBP)).toBe('webp');
		expect(sniffImageType(BMP)).toBe('bmp');
		expect(sniffImageType(ICO)).toBe('ico');
		expect(sniffImageType(AVIF)).toBe('avif');
		expect(sniffImageType(SVG)).toBe('svg');
		expect(sniffImageType(SVG_XML)).toBe('svg');
	});

	it('rejects non-image bytes', () => {
		expect(sniffImageType(new TextEncoder().encode('hello world'))).toBeNull();
		expect(sniffImageType(new Uint8Array(0))).toBeNull();
		// RIFF but not WEBP (a WAV file).
		expect(sniffImageType(new TextEncoder().encode('RIFF\x00\x00\x00\x00WAVE'))).toBeNull();
	});
});

describe('base64 round-trip', () => {
	it('encodes and decodes bytes', () => {
		const bytes = Uint8Array.from({ length: 300 }, (_, i) => i % 256);
		const b64 = bytesToBase64(bytes);
		const back = base64ToBytes(b64);
		expect(back.ok).toBe(true);
		if (back.ok) expect([...back.value]).toEqual([...bytes]);
	});

	it('accepts URL-safe alphabet and missing padding', () => {
		const r = base64ToBytes('_-8');
		expect(r.ok).toBe(true);
		if (r.ok) expect([...r.value]).toEqual([0xff, 0xef]);
	});

	it('rejects garbage', () => {
		expect(base64ToBytes('not base64!!').ok).toBe(false);
		expect(base64ToBytes('').ok).toBe(false);
	});

	it('computes encoded size with padding', () => {
		expect(base64EncodedSize(1)).toBe(4);
		expect(base64EncodedSize(3)).toBe(4);
		expect(base64EncodedSize(4)).toBe(8);
		expect(base64EncodedSize(0)).toBe(0);
	});
});

describe('parseImageInput', () => {
	it('parses a base64 data URL', () => {
		const r = parseImageInput(`data:image/png;base64,${TINY_PNG_B64}`);
		expect(r.ok).toBe(true);
		if (r.ok) {
			expect(r.value.kind).toBe('png');
			expect(r.value.mime).toBe('image/png');
			expect(r.value.base64).toBe(TINY_PNG_B64);
		}
	});

	it('parses bare base64 by sniffing the bytes', () => {
		const r = parseImageInput(TINY_PNG_B64);
		expect(r.ok).toBe(true);
		if (r.ok) expect(r.value.kind).toBe('png');
	});

	it('trusts magic bytes over a wrong declared mime', () => {
		const r = parseImageInput(`data:image/jpeg;base64,${TINY_PNG_B64}`);
		expect(r.ok).toBe(true);
		if (r.ok) expect(r.value.mime).toBe('image/png');
	});

	it('parses percent-encoded SVG data URLs', () => {
		const r = parseImageInput('data:image/svg+xml,%3Csvg%20xmlns%3D%22a%22%3E%3C%2Fsvg%3E');
		expect(r.ok).toBe(true);
		if (r.ok) expect(r.value.kind).toBe('svg');
	});

	it('tolerates whitespace and line breaks in the payload', () => {
		const wrapped = TINY_PNG_B64.replace(/(.{40})/g, '$1\n');
		const r = parseImageInput(`data:image/png;base64,${wrapped}`);
		expect(r.ok).toBe(true);
	});

	it('rejects base64 that is not an image', () => {
		const r = parseImageInput(btoa('just some text, definitely not pixels'));
		expect(r.ok).toBe(false);
	});

	it('rejects empty and malformed input', () => {
		expect(parseImageInput('').ok).toBe(false);
		expect(parseImageInput('data:image/png;base64,@@@').ok).toBe(false);
	});
});

describe('snippets', () => {
	it('builds data URL, CSS and HTML snippets', () => {
		const url = buildDataUrl('image/png', 'AAAA');
		expect(url).toBe('data:image/png;base64,AAAA');
		expect(cssSnippet(url)).toBe('background-image: url("data:image/png;base64,AAAA");');
		expect(htmlSnippet(url, 10, 20)).toBe(
			'<img src="data:image/png;base64,AAAA" width="10" height="20" alt="">'
		);
		expect(htmlSnippet(url)).toBe('<img src="data:image/png;base64,AAAA" alt="">');
	});
});

describe('resizeDimensions', () => {
	const orig = { width: 1600, height: 900 };

	it('resizes by width keeping aspect', () => {
		expect(resizeDimensions(orig, 'width', 800)).toEqual({
			ok: true,
			value: { width: 800, height: 450 }
		});
	});

	it('resizes by height keeping aspect', () => {
		expect(resizeDimensions(orig, 'height', 450)).toEqual({
			ok: true,
			value: { width: 800, height: 450 }
		});
	});

	it('resizes by percent', () => {
		expect(resizeDimensions(orig, 'percent', 50)).toEqual({
			ok: true,
			value: { width: 800, height: 450 }
		});
	});

	it('never goes below 1×1', () => {
		const r = resizeDimensions({ width: 1000, height: 10 }, 'width', 20);
		expect(r).toEqual({ ok: true, value: { width: 20, height: 1 } });
	});

	it('rejects zero, negative and absurd targets', () => {
		expect(resizeDimensions(orig, 'width', 0).ok).toBe(false);
		expect(resizeDimensions(orig, 'percent', -5).ok).toBe(false);
		expect(resizeDimensions(orig, 'width', 999999).ok).toBe(false);
	});
});

describe('detection helpers', () => {
	it('recognizes image data URLs', () => {
		expect(isLikelyImageDataUrl(`data:image/png;base64,${TINY_PNG_B64}`)).toBe(true);
		expect(isLikelyImageDataUrl('data:image/svg+xml,%3Csvg%3E')).toBe(true);
		expect(isLikelyImageDataUrl('data:text/plain;base64,aGk=')).toBe(false);
		expect(isLikelyImageDataUrl('https://example.com/a.png')).toBe(false);
	});

	it('maps mimes to kinds', () => {
		expect(kindForMime('image/jpg')).toBe('jpeg');
		expect(kindForMime('image/vnd.microsoft.icon')).toBe('ico');
		expect(kindForMime('image/png')).toBe('png');
		expect(kindForMime('text/plain')).toBeNull();
	});
});
