import { describe, expect, it } from 'vitest';
import { detectImageKind, readImageMeta, stripImageMeta } from './exif';

/* ---------- synthetic file builders ---------- */

class ByteWriter {
	bytes: number[] = [];
	u8(...vals: number[]) {
		this.bytes.push(...vals);
		return this;
	}
	u16be(v: number) {
		return this.u8((v >> 8) & 0xff, v & 0xff);
	}
	u16le(v: number) {
		return this.u8(v & 0xff, (v >> 8) & 0xff);
	}
	u32be(v: number) {
		return this.u8((v >>> 24) & 0xff, (v >>> 16) & 0xff, (v >>> 8) & 0xff, v & 0xff);
	}
	u32le(v: number) {
		return this.u8(v & 0xff, (v >> 8) & 0xff, (v >> 16) & 0xff, (v >>> 24) & 0xff);
	}
	ascii(s: string) {
		for (const c of s) this.u8(c.charCodeAt(0));
		return this;
	}
	out(): Uint8Array {
		return new Uint8Array(this.bytes);
	}
}

/** Little-endian TIFF: Make="Ada", Orientation=6, GPS lat 48°51'30"N lon 2°17'40"E. */
function buildTiff(): Uint8Array {
	const w = new ByteWriter();
	w.ascii('II').u16le(42).u32le(8);
	// IFD0 @8: 3 entries → 2 + 3*12 + 4 = 42 bytes; GPS IFD @ 8+42 = 50.
	w.u16le(3);
	w.u16le(0x010f).u16le(2).u32le(4).ascii('Ada').u8(0); // Make, inline ASCII
	w.u16le(0x0112).u16le(3).u32le(1).u16le(6).u16le(0); // Orientation = 6
	w.u16le(0x8825).u16le(4).u32le(1).u32le(50); // GPS IFD pointer
	w.u32le(0); // next IFD
	// GPS IFD @50: 4 entries → 2 + 4*12 + 4 = 54 bytes; external data @ 50+54 = 104.
	w.u16le(4);
	w.u16le(0x0001).u16le(2).u32le(2).ascii('N').u8(0).u16le(0); // LatRef
	w.u16le(0x0002).u16le(5).u32le(3).u32le(104); // Lat rationals @104
	w.u16le(0x0003).u16le(2).u32le(2).ascii('E').u8(0).u16le(0); // LonRef
	w.u16le(0x0004).u16le(5).u32le(3).u32le(128); // Lon rationals @128
	w.u32le(0);
	// Lat 48/1, 51/1, 30/1 @104 (24 bytes)
	w.u32le(48).u32le(1).u32le(51).u32le(1).u32le(30).u32le(1);
	// Lon 2/1, 17/1, 40/1 @128
	w.u32le(2).u32le(1).u32le(17).u32le(1).u32le(40).u32le(1);
	return w.out();
}

function buildJpeg(withExif: boolean): Uint8Array {
	const w = new ByteWriter();
	w.u8(0xff, 0xd8); // SOI
	// APP0 JFIF (kept by strip)
	const jfif = new ByteWriter().ascii('JFIF').u8(0, 1, 2, 0, 0, 0, 1, 0, 1, 0, 0).out();
	w.u8(0xff, 0xe0).u16be(2 + jfif.length).u8(...jfif);
	if (withExif) {
		const tiff = buildTiff();
		w.u8(0xff, 0xe1).u16be(2 + 6 + tiff.length).ascii('Exif').u8(0, 0).u8(...tiff);
		// COM segment
		const comment = new ByteWriter().ascii('shot on holiday').out();
		w.u8(0xff, 0xfe).u16be(2 + comment.length).u8(...comment);
	}
	// SOS + fake entropy data + EOI
	w.u8(0xff, 0xda).u16be(4).u8(0, 0);
	w.u8(1, 2, 3, 4);
	w.u8(0xff, 0xd9);
	return w.out();
}

function pngChunk(type: string, data: Uint8Array): Uint8Array {
	const w = new ByteWriter();
	w.u32be(data.length).ascii(type).u8(...data).u32be(0); // CRC not validated by the parser
	return w.out();
}

function buildPng(withText: boolean): Uint8Array {
	const w = new ByteWriter();
	w.u8(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a);
	w.u8(...pngChunk('IHDR', new Uint8Array(13)));
	if (withText) {
		w.u8(...pngChunk('tEXt', new ByteWriter().ascii('Author').u8(0).ascii('Ada Lovelace').out()));
		w.u8(...pngChunk('eXIf', buildTiff()));
	}
	w.u8(...pngChunk('IDAT', new Uint8Array([1, 2, 3])));
	w.u8(...pngChunk('IEND', new Uint8Array(0)));
	return w.out();
}

function buildWebp(withExif: boolean): Uint8Array {
	const chunks = new ByteWriter();
	// VP8X: flags byte with EXIF bit (0x08) when metadata present.
	chunks.ascii('VP8X').u32le(10).u8(withExif ? 0x08 : 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
	if (withExif) {
		const tiff = buildTiff();
		chunks.ascii('EXIF').u32le(tiff.length + 6).ascii('Exif').u8(0, 0).u8(...tiff);
		if ((tiff.length + 6) % 2 === 1) chunks.u8(0);
	}
	chunks.ascii('VP8 ').u32le(4).u8(9, 9, 9, 9);
	const body = chunks.out();
	const w = new ByteWriter();
	w.ascii('RIFF').u32le(4 + body.length).ascii('WEBP').u8(...body);
	return w.out();
}

/* ---------- tests ---------- */

describe('detectImageKind', () => {
	it('detects jpeg, png and webp', () => {
		expect(detectImageKind(buildJpeg(true))).toBe('jpeg');
		expect(detectImageKind(buildPng(true))).toBe('png');
		expect(detectImageKind(buildWebp(true))).toBe('webp');
		expect(detectImageKind(new Uint8Array([1, 2, 3, 4]))).toBe(null);
	});
});

describe('readImageMeta', () => {
	it('reads EXIF tags and GPS from JPEG', () => {
		const r = readImageMeta(buildJpeg(true));
		expect(r.ok).toBe(true);
		if (r.ok) {
			const names = r.value.tags.map((t) => t.name);
			expect(names).toContain('Camera make');
			expect(names).toContain('Orientation');
			const make = r.value.tags.find((t) => t.name === 'Camera make');
			expect(make?.value).toBe('Ada');
			const orient = r.value.tags.find((t) => t.name === 'Orientation');
			expect(orient?.value).toBe('Rotate 90° CW');
			expect(r.value.gps).toEqual({ lat: 48.858333, lon: 2.294444 });
			expect(r.value.metadataBytes).toBeGreaterThan(0);
			const comment = r.value.tags.find((t) => t.name === 'Comment');
			expect(comment?.value).toBe('shot on holiday');
		}
	});
	it('reads PNG text chunks and eXIf', () => {
		const r = readImageMeta(buildPng(true));
		expect(r.ok).toBe(true);
		if (r.ok) {
			const author = r.value.tags.find((t) => t.group === 'PNG text');
			expect(author?.name).toBe('Author');
			expect(author?.value).toBe('Ada Lovelace');
			expect(r.value.tags.some((t) => t.name === 'Camera make')).toBe(true);
		}
	});
	it('reads WebP EXIF', () => {
		const r = readImageMeta(buildWebp(true));
		expect(r.ok).toBe(true);
		if (r.ok) {
			expect(r.value.tags.some((t) => t.name === 'Camera make')).toBe(true);
			expect(r.value.gps).toBeDefined();
		}
	});
	it('reports clean files as clean', () => {
		const r = readImageMeta(buildJpeg(false));
		expect(r.ok).toBe(true);
		if (r.ok) {
			expect(r.value.tags).toEqual([]);
			expect(r.value.metadataBytes).toBe(0);
		}
	});
});

describe('stripImageMeta', () => {
	it('removes JPEG metadata segments and keeps the image intact', () => {
		const stripped = stripImageMeta(buildJpeg(true));
		expect(stripped.ok).toBe(true);
		if (stripped.ok) {
			const reread = readImageMeta(stripped.value);
			expect(reread.ok).toBe(true);
			if (reread.ok) {
				expect(reread.value.tags).toEqual([]);
				expect(reread.value.metadataBytes).toBe(0);
			}
			// SOI + APP0 kept, entropy data + EOI kept.
			expect(stripped.value[0]).toBe(0xff);
			expect(stripped.value[1]).toBe(0xd8);
			expect(stripped.value[stripped.value.length - 1]).toBe(0xd9);
			expect(stripped.value.length).toBeLessThan(buildJpeg(true).length);
		}
	});
	it('removes PNG text/eXIf chunks and keeps IHDR/IDAT/IEND', () => {
		const stripped = stripImageMeta(buildPng(true));
		expect(stripped.ok).toBe(true);
		if (stripped.ok) {
			const reread = readImageMeta(stripped.value);
			expect(reread.ok && reread.value.tags.length === 0).toBe(true);
			expect(stripped.value.length).toBe(buildPng(false).length);
		}
	});
	it('removes WebP EXIF chunk and clears the VP8X flag', () => {
		const stripped = stripImageMeta(buildWebp(true));
		expect(stripped.ok).toBe(true);
		if (stripped.ok) {
			const reread = readImageMeta(stripped.value);
			expect(reread.ok && reread.value.tags.length === 0).toBe(true);
			// VP8X flags byte cleared.
			const flagIndex = 12 + 8;
			expect(stripped.value[flagIndex] & 0x0c).toBe(0);
			// RIFF size field consistent with the file length.
			const view = new DataView(stripped.value.buffer, stripped.value.byteOffset);
			expect(view.getUint32(4, true)).toBe(stripped.value.length - 8);
		}
	});
});
