import { type ToolResult, ok, err } from './types';

/** Raster/vector kinds this site recognizes by magic bytes. */
export type ImageKind = 'png' | 'jpeg' | 'webp' | 'gif' | 'svg' | 'bmp' | 'ico' | 'avif';

export const IMAGE_MIME: Record<ImageKind, string> = {
	png: 'image/png',
	jpeg: 'image/jpeg',
	webp: 'image/webp',
	gif: 'image/gif',
	svg: 'image/svg+xml',
	bmp: 'image/bmp',
	ico: 'image/x-icon',
	avif: 'image/avif'
};

/** Display names with canonical casing ("WebP", not "WEBP"). */
export const IMAGE_LABEL: Record<ImageKind, string> = {
	png: 'PNG',
	jpeg: 'JPEG',
	webp: 'WebP',
	gif: 'GIF',
	svg: 'SVG',
	bmp: 'BMP',
	ico: 'ICO',
	avif: 'AVIF'
};

export const IMAGE_EXT: Record<ImageKind, string> = {
	png: 'png',
	jpeg: 'jpg',
	webp: 'webp',
	gif: 'gif',
	svg: 'svg',
	bmp: 'bmp',
	ico: 'ico',
	avif: 'avif'
};

export function kindForMime(mime: string): ImageKind | null {
	const m = mime.toLowerCase();
	if (m === 'image/jpg') return 'jpeg';
	if (m === 'image/vnd.microsoft.icon') return 'ico';
	for (const [kind, k] of Object.entries(IMAGE_MIME)) {
		if (k === m) return kind as ImageKind;
	}
	return null;
}

/** Identify an image format from its leading bytes, independent of filename. */
export function sniffImageType(bytes: Uint8Array): ImageKind | null {
	const at = (i: number) => bytes[i] ?? -1;
	const ascii = (start: number, s: string) =>
		[...s].every((ch, i) => at(start + i) === ch.charCodeAt(0));
	if (at(0) === 0x89 && ascii(1, 'PNG')) return 'png';
	if (at(0) === 0xff && at(1) === 0xd8 && at(2) === 0xff) return 'jpeg';
	if (ascii(0, 'RIFF') && ascii(8, 'WEBP')) return 'webp';
	if (ascii(0, 'GIF87a') || ascii(0, 'GIF89a')) return 'gif';
	if (ascii(0, 'BM')) return 'bmp';
	if (at(0) === 0 && at(1) === 0 && at(2) === 1 && at(3) === 0) return 'ico';
	if (ascii(4, 'ftyp') && (ascii(8, 'avif') || ascii(8, 'avis'))) return 'avif';
	// SVG is text: allow BOM/whitespace, then <svg or an XML prolog.
	const head = new TextDecoder('utf-8', { fatal: false })
		.decode(bytes.subarray(0, 256))
		.replace(/^\uFEFF/, '')
		.trimStart()
		.toLowerCase();
	if (head.startsWith('<svg') || (head.startsWith('<?xml') && head.includes('<svg'))) return 'svg';
	return null;
}

export function bytesToBase64(bytes: Uint8Array): string {
	let binary = '';
	const chunk = 0x8000;
	for (let i = 0; i < bytes.length; i += chunk) {
		binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
	}
	return btoa(binary);
}

export function base64ToBytes(input: string): ToolResult<Uint8Array> {
	let s = input.replace(/\s+/g, '').replace(/-/g, '+').replace(/_/g, '/');
	const pad = s.length % 4;
	if (pad === 2) s += '==';
	else if (pad === 3) s += '=';
	if (s === '') return err('Input is empty');
	if (!/^[A-Za-z0-9+/]*={0,2}$/.test(s) || s.length % 4 === 1) {
		return err('Not valid Base64: contains characters outside the Base64 alphabet');
	}
	try {
		const binary = atob(s);
		const bytes = new Uint8Array(binary.length);
		for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
		return ok(bytes);
	} catch {
		return err('Not valid Base64');
	}
}

export interface ParsedImageData {
	kind: ImageKind;
	mime: string;
	bytes: Uint8Array;
	base64: string;
	dataUrl: string;
}

/**
 * Accept a data: URL (base64 or percent-encoded) or a bare Base64 string and
 * return the decoded image. The declared mime is cross-checked against magic
 * bytes — the sniffed type wins, so mislabeled data URLs still round-trip.
 */
export function parseImageInput(input: string): ToolResult<ParsedImageData> {
	const s = input.trim();
	if (s === '') return err('Input is empty');
	let payload = s;
	let declaredMime = '';
	const m = /^data:([^;,]*)((?:;[^;,]*)*),([\s\S]*)$/.exec(s);
	if (m) {
		declaredMime = m[1];
		const isBase64 = m[2].split(';').includes('base64');
		if (!isBase64) {
			try {
				const text = decodeURIComponent(m[3]);
				const bytes = new TextEncoder().encode(text);
				return finishParse(bytes, declaredMime);
			} catch {
				return err('Data URL payload is not valid percent-encoding');
			}
		}
		payload = m[3];
	}
	const decoded = base64ToBytes(payload);
	if (!decoded.ok) return decoded;
	return finishParse(decoded.value, declaredMime);
}

function finishParse(bytes: Uint8Array, declaredMime: string): ToolResult<ParsedImageData> {
	const sniffed = sniffImageType(bytes);
	const kind = sniffed ?? (declaredMime ? kindForMime(declaredMime) : null);
	if (!kind) {
		return err('Decoded bytes are not a recognized image format (PNG, JPEG, WebP, GIF, SVG, BMP, ICO, AVIF)');
	}
	const mime = IMAGE_MIME[kind];
	const base64 = bytesToBase64(bytes);
	return ok({ kind, mime, bytes, base64, dataUrl: buildDataUrl(mime, base64) });
}

export function buildDataUrl(mime: string, base64: string): string {
	return `data:${mime};base64,${base64}`;
}

export function cssSnippet(dataUrl: string): string {
	return `background-image: url("${dataUrl}");`;
}

export function htmlSnippet(dataUrl: string, width?: number, height?: number): string {
	const size = width && height ? ` width="${width}" height="${height}"` : '';
	return `<img src="${dataUrl}"${size} alt="">`;
}

/** Size in bytes of the Base64 encoding of n bytes (with padding). */
export function base64EncodedSize(n: number): number {
	return 4 * Math.ceil(n / 3);
}

export type ResizeMode = 'width' | 'height' | 'percent';

/**
 * Compute target dimensions preserving aspect ratio. Rounded to whole pixels,
 * never below 1×1.
 */
export function resizeDimensions(
	original: { width: number; height: number },
	mode: ResizeMode,
	value: number
): ToolResult<{ width: number; height: number }> {
	if (!Number.isFinite(value) || value <= 0) return err('Enter a value greater than 0');
	if (original.width <= 0 || original.height <= 0) return err('Source image has no pixels');
	let width: number;
	let height: number;
	if (mode === 'width') {
		width = Math.round(value);
		height = Math.round((value / original.width) * original.height);
	} else if (mode === 'height') {
		height = Math.round(value);
		width = Math.round((value / original.height) * original.width);
	} else {
		width = Math.round((original.width * value) / 100);
		height = Math.round((original.height * value) / 100);
	}
	width = Math.max(1, width);
	height = Math.max(1, height);
	if (width > 16384 || height > 16384) {
		return err('Target exceeds 16384px — most browsers cannot allocate a canvas that large');
	}
	return ok({ width, height });
}

/** True when the input looks like an image data: URL — used by Smart Paste. */
export function isLikelyImageDataUrl(input: string): boolean {
	return /^data:image\/[a-z0-9.+-]+[;,]/i.test(input.trim());
}
