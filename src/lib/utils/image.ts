import { type ToolResult, ok, err } from '$lib/tools/types';
import {
	type ImageKind,
	IMAGE_MIME,
	buildDataUrl,
	bytesToBase64,
	sniffImageType,
	kindForMime
} from '$lib/tools/image';

/** A decoded image file plus everything the image tools need to know about it. */
export interface LoadedImage {
	name: string;
	kind: ImageKind;
	mime: string;
	bytes: Uint8Array;
	base64: string;
	dataUrl: string;
	width: number;
	height: number;
}

/** Decode dimensions by letting the browser parse the data URL. */
export function measureImage(dataUrl: string): Promise<{ width: number; height: number } | null> {
	return new Promise((resolve) => {
		const img = new Image();
		img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
		img.onerror = () => resolve(null);
		img.src = dataUrl;
	});
}

/** Read a File the user dropped/picked and verify it is an image we can show. */
export async function readImageFile(file: File): Promise<ToolResult<LoadedImage>> {
	const bytes = new Uint8Array(await file.arrayBuffer());
	const kind = sniffImageType(bytes) ?? kindForMime(file.type);
	if (!kind) return err('notImage');
	const mime = IMAGE_MIME[kind];
	const base64 = bytesToBase64(bytes);
	const dataUrl = buildDataUrl(mime, base64);
	const dims = await measureImage(dataUrl);
	if (!dims) return err('cannotDecode');
	return ok({ name: file.name, kind, mime, bytes, base64, dataUrl, ...dims });
}

export type EncodeKind = 'png' | 'jpeg' | 'webp';

export interface EncodedImage {
	blob: Blob;
	dataUrl: string;
	width: number;
	height: number;
}

/**
 * Draw the source data URL onto a canvas at the given size and re-encode.
 * Lossy formats get a background fill, since JPEG has no alpha channel.
 * Fails when the browser cannot encode the target format (the canvas then
 * silently falls back to PNG — detected via the result's actual mime).
 */
export async function encodeImage(
	sourceDataUrl: string,
	width: number,
	height: number,
	target: EncodeKind,
	quality: number,
	background = '#ffffff'
): Promise<ToolResult<EncodedImage>> {
	const img = new Image();
	const loaded = await new Promise<boolean>((resolve) => {
		img.onload = () => resolve(true);
		img.onerror = () => resolve(false);
		img.src = sourceDataUrl;
	});
	if (!loaded) return err('cannotDecode');
	const canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;
	const ctx = canvas.getContext('2d');
	if (!ctx) return err('cannotDecode');
	if (target === 'jpeg') {
		ctx.fillStyle = background;
		ctx.fillRect(0, 0, width, height);
	}
	ctx.imageSmoothingEnabled = true;
	ctx.imageSmoothingQuality = 'high';
	ctx.drawImage(img, 0, 0, width, height);
	const mime = IMAGE_MIME[target];
	const blob = await new Promise<Blob | null>((resolve) =>
		canvas.toBlob(resolve, mime, quality / 100)
	);
	if (!blob) return err('cannotEncode');
	if (blob.type !== mime) return err('formatUnsupported');
	const dataUrl = canvas.toDataURL(mime, quality / 100);
	return ok({ blob, dataUrl, width, height });
}

export function downloadBlob(blob: Blob, filename: string) {
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = filename;
	a.click();
	URL.revokeObjectURL(url);
}

/** Strip the extension from a filename, for building output names. */
export function baseName(name: string): string {
	const dot = name.lastIndexOf('.');
	return dot > 0 ? name.slice(0, dot) : name || 'image';
}
