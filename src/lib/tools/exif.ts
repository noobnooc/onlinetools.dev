import { type ToolResult, ok, err } from './types';

export type ImageKind = 'jpeg' | 'png' | 'webp';

export interface MetaTag {
	/** Group: EXIF, GPS, PNG text, … */
	group: string;
	name: string;
	value: string;
}

export interface ImageMeta {
	kind: ImageKind;
	tags: MetaTag[];
	/** Decimal degrees when GPS coordinates are present. */
	gps?: { lat: number; lon: number };
	/** Byte size of removable metadata segments. */
	metadataBytes: number;
}

/* ---------- TIFF / EXIF ---------- */

const TAG_NAMES: Record<number, string> = {
	0x010e: 'Image description',
	0x010f: 'Camera make',
	0x0110: 'Camera model',
	0x0112: 'Orientation',
	0x011a: 'X resolution',
	0x011b: 'Y resolution',
	0x0131: 'Software',
	0x0132: 'Modify date',
	0x013b: 'Artist',
	0x8298: 'Copyright',
	0x829a: 'Exposure time',
	0x829d: 'F number',
	0x8822: 'Exposure program',
	0x8827: 'ISO',
	0x9003: 'Date taken',
	0x9004: 'Date digitized',
	0x9201: 'Shutter speed',
	0x9202: 'Aperture',
	0x9204: 'Exposure bias',
	0x9207: 'Metering mode',
	0x9209: 'Flash',
	0x920a: 'Focal length',
	0x927c: 'Maker note',
	0x9286: 'User comment',
	0xa002: 'Pixel width',
	0xa003: 'Pixel height',
	0xa405: 'Focal length (35mm)',
	0xa430: 'Owner name',
	0xa431: 'Body serial number',
	0xa432: 'Lens info',
	0xa433: 'Lens make',
	0xa434: 'Lens model',
	0xa435: 'Lens serial number'
};

const GPS_TAG_NAMES: Record<number, string> = {
	0x0000: 'GPS version',
	0x0001: 'Latitude ref',
	0x0002: 'Latitude',
	0x0003: 'Longitude ref',
	0x0004: 'Longitude',
	0x0005: 'Altitude ref',
	0x0006: 'Altitude',
	0x0007: 'GPS time (UTC)',
	0x001d: 'GPS date',
	0x001b: 'Processing method'
};

const ORIENTATIONS: Record<number, string> = {
	1: 'Normal',
	2: 'Mirror horizontal',
	3: 'Rotate 180°',
	4: 'Mirror vertical',
	5: 'Mirror horizontal, rotate 270°',
	6: 'Rotate 90° CW',
	7: 'Mirror horizontal, rotate 90°',
	8: 'Rotate 270° CW'
};

interface RawTag {
	id: number;
	value: string | number | number[];
}

function readTiff(view: DataView): { ifd0: RawTag[]; exif: RawTag[]; gps: RawTag[] } | null {
	if (view.byteLength < 8) return null;
	const byteOrder = view.getUint16(0);
	let little: boolean;
	if (byteOrder === 0x4949) little = true;
	else if (byteOrder === 0x4d4d) little = false;
	else return null;
	if (view.getUint16(2, little) !== 42) return null;

	const u16 = (o: number) => view.getUint16(o, little);
	const u32 = (o: number) => view.getUint32(o, little);
	const i32 = (o: number) => view.getInt32(o, little);

	const TYPE_SIZES: Record<number, number> = { 1: 1, 2: 1, 3: 2, 4: 4, 5: 8, 7: 1, 9: 4, 10: 8 };

	function readIfd(offset: number): { tags: RawTag[]; pointers: Record<number, number> } {
		const tags: RawTag[] = [];
		const pointers: Record<number, number> = {};
		if (offset + 2 > view.byteLength) return { tags, pointers };
		const count = u16(offset);
		for (let i = 0; i < count; i++) {
			const base = offset + 2 + i * 12;
			if (base + 12 > view.byteLength) break;
			const id = u16(base);
			const type = u16(base + 2);
			const num = u32(base + 4);
			const size = (TYPE_SIZES[type] ?? 1) * num;
			const valueOffset = size <= 4 ? base + 8 : u32(base + 8);
			if (valueOffset + size > view.byteLength) continue;

			if (id === 0x8769 || id === 0x8825) {
				pointers[id] = u32(base + 8);
				continue;
			}

			let value: RawTag['value'];
			switch (type) {
				case 2: {
					// ASCII, NUL-terminated.
					const bytes = new Uint8Array(view.buffer, view.byteOffset + valueOffset, size);
					value = new TextDecoder('utf-8')
						.decode(bytes)
						.replace(/\0+$/g, '')
						.trim();
					break;
				}
				case 3: {
					const vals = Array.from({ length: num }, (_, k) => u16(valueOffset + k * 2));
					value = vals.length === 1 ? vals[0] : vals;
					break;
				}
				case 4: {
					const vals = Array.from({ length: num }, (_, k) => u32(valueOffset + k * 4));
					value = vals.length === 1 ? vals[0] : vals;
					break;
				}
				case 5:
				case 10: {
					const vals: number[] = [];
					for (let k = 0; k < num; k++) {
						const numr = type === 5 ? u32(valueOffset + k * 8) : i32(valueOffset + k * 8);
						const den = type === 5 ? u32(valueOffset + k * 8 + 4) : i32(valueOffset + k * 8 + 4);
						vals.push(den === 0 ? 0 : numr / den);
					}
					value = vals.length === 1 ? vals[0] : vals;
					break;
				}
				case 1:
				case 7: {
					value = num <= 16 ? Array.from(new Uint8Array(view.buffer, view.byteOffset + valueOffset, num)) : `(${num} bytes)`;
					break;
				}
				case 9: {
					const vals = Array.from({ length: num }, (_, k) => i32(valueOffset + k * 4));
					value = vals.length === 1 ? vals[0] : vals;
					break;
				}
				default:
					value = `(type ${type}, ${num} items)`;
			}
			tags.push({ id, value });
		}
		return { tags, pointers };
	}

	const ifd0Offset = u32(4);
	const ifd0 = readIfd(ifd0Offset);
	const exif = ifd0.pointers[0x8769] !== undefined ? readIfd(ifd0.pointers[0x8769]) : { tags: [], pointers: {} };
	const gps = ifd0.pointers[0x8825] !== undefined ? readIfd(ifd0.pointers[0x8825]) : { tags: [], pointers: {} };
	return { ifd0: ifd0.tags, exif: exif.tags, gps: gps.tags };
}

function formatTagValue(id: number, value: RawTag['value']): string {
	if (id === 0x0112 && typeof value === 'number') {
		return ORIENTATIONS[value] ?? String(value);
	}
	if (id === 0x829a && typeof value === 'number' && value > 0 && value < 1) {
		return `1/${Math.round(1 / value)} s`;
	}
	if (id === 0x829d && typeof value === 'number') return `f/${+value.toFixed(2)}`;
	if (id === 0x920a && typeof value === 'number') return `${+value.toFixed(1)} mm`;
	if (Array.isArray(value)) return value.map((v) => (typeof v === 'number' ? +v.toFixed(4) : v)).join(', ');
	if (typeof value === 'number') return String(+value.toFixed(4));
	return value;
}

function tagsFrom(raw: RawTag[], group: string, names: Record<number, string>): MetaTag[] {
	return raw
		.filter((t) => t.value !== '' && !(Array.isArray(t.value) && t.value.length === 0))
		.map((t) => ({
			group,
			name: names[t.id] ?? `Tag 0x${t.id.toString(16).padStart(4, '0')}`,
			value: formatTagValue(t.id, t.value)
		}));
}

function gpsDecimal(gps: RawTag[]): { lat: number; lon: number } | undefined {
	const find = (id: number) => gps.find((t) => t.id === id)?.value;
	const latRef = find(0x0001);
	const lat = find(0x0002);
	const lonRef = find(0x0003);
	const lon = find(0x0004);
	if (!Array.isArray(lat) || !Array.isArray(lon) || lat.length < 3 || lon.length < 3) return undefined;
	const toDec = (dms: number[]) => dms[0] + dms[1] / 60 + dms[2] / 3600;
	let latD = toDec(lat as number[]);
	let lonD = toDec(lon as number[]);
	if (latRef === 'S') latD = -latD;
	if (lonRef === 'W') lonD = -lonD;
	return { lat: +latD.toFixed(6), lon: +lonD.toFixed(6) };
}

/* ---------- JPEG ---------- */

function isJpeg(bytes: Uint8Array): boolean {
	return bytes.length > 3 && bytes[0] === 0xff && bytes[1] === 0xd8;
}

interface JpegSegment {
	marker: number;
	start: number;
	length: number; // full segment incl. marker bytes
}

function jpegSegments(bytes: Uint8Array): JpegSegment[] {
	const segs: JpegSegment[] = [];
	let i = 2;
	while (i + 4 <= bytes.length) {
		if (bytes[i] !== 0xff) break;
		const marker = bytes[i + 1];
		// SOS: image data follows until EOI — stop scanning.
		if (marker === 0xda) break;
		if (marker === 0xd8 || marker === 0xd9 || (marker >= 0xd0 && marker <= 0xd7)) {
			segs.push({ marker, start: i, length: 2 });
			i += 2;
			continue;
		}
		const len = (bytes[i + 2] << 8) | bytes[i + 3];
		segs.push({ marker, start: i, length: 2 + len });
		i += 2 + len;
	}
	return segs;
}

const EXIF_HEADER = [0x45, 0x78, 0x69, 0x66, 0x00, 0x00]; // "Exif\0\0"

function isExifSegment(bytes: Uint8Array, seg: JpegSegment): boolean {
	if (seg.marker !== 0xe1) return false;
	return EXIF_HEADER.every((b, k) => bytes[seg.start + 4 + k] === b);
}

function isXmpSegment(bytes: Uint8Array, seg: JpegSegment): boolean {
	if (seg.marker !== 0xe1) return false;
	const head = new TextDecoder('ascii').decode(bytes.slice(seg.start + 4, seg.start + 4 + 28));
	return head.startsWith('http://ns.adobe.com/xap/1.0/');
}

/** Removable metadata in a JPEG: EXIF/XMP APP1, APP13 (IPTC), comments. */
function isJpegMetaSegment(bytes: Uint8Array, seg: JpegSegment): boolean {
	if (seg.marker === 0xed || seg.marker === 0xfe) return true; // APP13 / COM
	return isExifSegment(bytes, seg) || isXmpSegment(bytes, seg);
}

/* ---------- PNG ---------- */

const PNG_SIG = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

function isPng(bytes: Uint8Array): boolean {
	return bytes.length > 8 && PNG_SIG.every((b, i) => bytes[i] === b);
}

interface PngChunk {
	type: string;
	start: number;
	length: number; // full chunk incl. length/type/crc
	dataStart: number;
	dataLength: number;
}

function pngChunks(bytes: Uint8Array): PngChunk[] {
	const chunks: PngChunk[] = [];
	let i = 8;
	const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
	while (i + 12 <= bytes.length) {
		const dataLength = view.getUint32(i);
		const type = new TextDecoder('ascii').decode(bytes.slice(i + 4, i + 8));
		chunks.push({ type, start: i, length: 12 + dataLength, dataStart: i + 8, dataLength });
		i += 12 + dataLength;
		if (type === 'IEND') break;
	}
	return chunks;
}

const PNG_META_CHUNKS = new Set(['tEXt', 'zTXt', 'iTXt', 'eXIf', 'tIME']);

/* ---------- WebP ---------- */

function isWebp(bytes: Uint8Array): boolean {
	return (
		bytes.length > 12 &&
		bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
		bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
	);
}

interface RiffChunk {
	fourcc: string;
	start: number;
	length: number; // incl. header + padding
	dataStart: number;
	dataLength: number;
}

function riffChunks(bytes: Uint8Array): RiffChunk[] {
	const chunks: RiffChunk[] = [];
	const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
	let i = 12;
	while (i + 8 <= bytes.length) {
		const fourcc = new TextDecoder('ascii').decode(bytes.slice(i, i + 4));
		const dataLength = view.getUint32(i + 4, true);
		const padded = dataLength + (dataLength % 2);
		chunks.push({ fourcc, start: i, length: 8 + padded, dataStart: i + 8, dataLength });
		i += 8 + padded;
	}
	return chunks;
}

/* ---------- public API ---------- */

export function detectImageKind(bytes: Uint8Array): ImageKind | null {
	if (isJpeg(bytes)) return 'jpeg';
	if (isPng(bytes)) return 'png';
	if (isWebp(bytes)) return 'webp';
	return null;
}

export function readImageMeta(bytes: Uint8Array): ToolResult<ImageMeta> {
	const kind = detectImageKind(bytes);
	if (!kind) return err('Unsupported file — JPEG, PNG and WebP are supported');
	const tags: MetaTag[] = [];
	let gps: ImageMeta['gps'];
	let metadataBytes = 0;

	const parseTiffAt = (offset: number, length: number) => {
		const view = new DataView(bytes.buffer, bytes.byteOffset + offset, length);
		const tiff = readTiff(view);
		if (tiff) {
			tags.push(...tagsFrom(tiff.ifd0, 'EXIF', TAG_NAMES));
			tags.push(...tagsFrom(tiff.exif, 'EXIF', TAG_NAMES));
			tags.push(...tagsFrom(tiff.gps, 'GPS', GPS_TAG_NAMES));
			gps = gpsDecimal(tiff.gps) ?? gps;
		}
	};

	if (kind === 'jpeg') {
		for (const seg of jpegSegments(bytes)) {
			if (isExifSegment(bytes, seg)) {
				parseTiffAt(seg.start + 4 + 6, seg.length - 4 - 6);
				metadataBytes += seg.length;
			} else if (isXmpSegment(bytes, seg)) {
				tags.push({ group: 'XMP', name: 'XMP packet', value: `${seg.length} bytes` });
				metadataBytes += seg.length;
			} else if (seg.marker === 0xed) {
				tags.push({ group: 'IPTC', name: 'Photoshop/IPTC block', value: `${seg.length} bytes` });
				metadataBytes += seg.length;
			} else if (seg.marker === 0xfe) {
				const text = new TextDecoder('utf-8').decode(bytes.slice(seg.start + 4, seg.start + seg.length));
				tags.push({ group: 'JPEG', name: 'Comment', value: text.slice(0, 200) });
				metadataBytes += seg.length;
			}
		}
	} else if (kind === 'png') {
		for (const chunk of pngChunks(bytes)) {
			if (chunk.type === 'tEXt' || chunk.type === 'iTXt') {
				const data = bytes.slice(chunk.dataStart, chunk.dataStart + chunk.dataLength);
				const nul = data.indexOf(0);
				const key = new TextDecoder('latin1').decode(data.slice(0, nul === -1 ? undefined : nul));
				let text = '';
				if (nul !== -1) {
					const rest = data.slice(nul + 1);
					// iTXt: skip compression flag/method + language/translated-keyword fields.
					if (chunk.type === 'iTXt') {
						let p = 2;
						for (let f = 0; f < 2; f++) {
							const z = rest.indexOf(0, p);
							p = z === -1 ? rest.length : z + 1;
						}
						text = new TextDecoder('utf-8').decode(rest.slice(p));
					} else {
						text = new TextDecoder('latin1').decode(rest);
					}
				}
				tags.push({ group: 'PNG text', name: key || chunk.type, value: text.slice(0, 300) });
				metadataBytes += chunk.length;
			} else if (chunk.type === 'zTXt') {
				const data = bytes.slice(chunk.dataStart, chunk.dataStart + chunk.dataLength);
				const nul = data.indexOf(0);
				const key = new TextDecoder('latin1').decode(data.slice(0, nul === -1 ? undefined : nul));
				tags.push({ group: 'PNG text', name: key || 'zTXt', value: `(compressed, ${chunk.dataLength} bytes)` });
				metadataBytes += chunk.length;
			} else if (chunk.type === 'eXIf') {
				parseTiffAt(chunk.dataStart, chunk.dataLength);
				metadataBytes += chunk.length;
			} else if (chunk.type === 'tIME') {
				if (chunk.dataLength >= 7) {
					const v = new DataView(bytes.buffer, bytes.byteOffset + chunk.dataStart, 7);
					const when = `${v.getUint16(0)}-${String(v.getUint8(2)).padStart(2, '0')}-${String(v.getUint8(3)).padStart(2, '0')} ${String(v.getUint8(4)).padStart(2, '0')}:${String(v.getUint8(5)).padStart(2, '0')}:${String(v.getUint8(6)).padStart(2, '0')} UTC`;
					tags.push({ group: 'PNG', name: 'Last modified', value: when });
				}
				metadataBytes += chunk.length;
			}
		}
	} else {
		for (const chunk of riffChunks(bytes)) {
			if (chunk.fourcc === 'EXIF') {
				// Some encoders include the Exif\0\0 preamble inside the chunk.
				let off = chunk.dataStart;
				let len = chunk.dataLength;
				if (EXIF_HEADER.every((b, k) => bytes[off + k] === b)) {
					off += 6;
					len -= 6;
				}
				parseTiffAt(off, len);
				metadataBytes += chunk.length;
			} else if (chunk.fourcc === 'XMP ') {
				tags.push({ group: 'XMP', name: 'XMP packet', value: `${chunk.dataLength} bytes` });
				metadataBytes += chunk.length;
			}
		}
	}
	return ok({ kind, tags, gps, metadataBytes });
}

/** Losslessly remove metadata segments. Pixels are untouched. */
export function stripImageMeta(bytes: Uint8Array): ToolResult<Uint8Array> {
	const kind = detectImageKind(bytes);
	if (!kind) return err('Unsupported file — JPEG, PNG and WebP are supported');

	if (kind === 'jpeg') {
		const drop = jpegSegments(bytes).filter((s) => isJpegMetaSegment(bytes, s));
		if (drop.length === 0) return ok(bytes);
		const keep: Uint8Array[] = [];
		let pos = 0;
		for (const seg of drop) {
			keep.push(bytes.slice(pos, seg.start));
			pos = seg.start + seg.length;
		}
		keep.push(bytes.slice(pos));
		return ok(concat(keep));
	}

	if (kind === 'png') {
		const chunks = pngChunks(bytes);
		const keep: Uint8Array[] = [bytes.slice(0, 8)];
		for (const chunk of chunks) {
			if (!PNG_META_CHUNKS.has(chunk.type)) {
				keep.push(bytes.slice(chunk.start, chunk.start + chunk.length));
			}
		}
		return ok(concat(keep));
	}

	// WebP: drop EXIF/XMP chunks, clear the VP8X flag bits, fix the RIFF size.
	const chunks = riffChunks(bytes);
	const keep: Uint8Array[] = [];
	for (const chunk of chunks) {
		if (chunk.fourcc === 'EXIF' || chunk.fourcc === 'XMP ') continue;
		const copy = bytes.slice(chunk.start, chunk.start + chunk.length);
		if (chunk.fourcc === 'VP8X' && copy.length >= 9) {
			copy[8] &= ~0b0000_1100; // clear EXIF (bit 3) and XMP (bit 2) flags
		}
		keep.push(copy);
	}
	const body = concat(keep);
	const out = new Uint8Array(12 + body.length);
	out.set(bytes.slice(0, 12));
	out.set(body, 12);
	new DataView(out.buffer).setUint32(4, 4 + body.length, true);
	return ok(out);
}

function concat(parts: Uint8Array[]): Uint8Array {
	const total = parts.reduce((n, p) => n + p.length, 0);
	const out = new Uint8Array(total);
	let pos = 0;
	for (const p of parts) {
		out.set(p, pos);
		pos += p.length;
	}
	return out;
}
