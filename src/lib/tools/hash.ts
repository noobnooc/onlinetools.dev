import { type ToolResult, ok, err } from './types';

export type HashAlgorithm = 'MD5' | 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512';

export const HASH_ALGORITHMS: HashAlgorithm[] = ['MD5', 'SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'];

function bytesToHex(bytes: Uint8Array): string {
	return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

/* MD5 — compact implementation of RFC 1321 (Web Crypto does not provide MD5). */
function md5Bytes(input: Uint8Array): Uint8Array {
	const s = [
		7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9,
		14, 20, 5, 9, 14, 20, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 6, 10, 15,
		21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21
	];
	const K = new Uint32Array(64);
	for (let i = 0; i < 64; i++) K[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 2 ** 32);

	const msgLen = input.length;
	const padded = new Uint8Array((((msgLen + 8) >> 6) + 1) << 6);
	padded.set(input);
	padded[msgLen] = 0x80;
	const bitLen = msgLen * 8;
	new DataView(padded.buffer).setUint32(padded.length - 8, bitLen >>> 0, true);
	new DataView(padded.buffer).setUint32(padded.length - 4, Math.floor(bitLen / 2 ** 32), true);

	let a0 = 0x67452301;
	let b0 = 0xefcdab89;
	let c0 = 0x98badcfe;
	let d0 = 0x10325476;
	const view = new DataView(padded.buffer);

	for (let off = 0; off < padded.length; off += 64) {
		let A = a0;
		let B = b0;
		let C = c0;
		let D = d0;
		for (let i = 0; i < 64; i++) {
			let F: number;
			let g: number;
			if (i < 16) {
				F = (B & C) | (~B & D);
				g = i;
			} else if (i < 32) {
				F = (D & B) | (~D & C);
				g = (5 * i + 1) % 16;
			} else if (i < 48) {
				F = B ^ C ^ D;
				g = (3 * i + 5) % 16;
			} else {
				F = C ^ (B | ~D);
				g = (7 * i) % 16;
			}
			F = (F + A + K[i] + view.getUint32(off + g * 4, true)) >>> 0;
			A = D;
			D = C;
			C = B;
			B = (B + ((F << s[i]) | (F >>> (32 - s[i])))) >>> 0;
		}
		a0 = (a0 + A) >>> 0;
		b0 = (b0 + B) >>> 0;
		c0 = (c0 + C) >>> 0;
		d0 = (d0 + D) >>> 0;
	}

	const out = new Uint8Array(16);
	const dv = new DataView(out.buffer);
	dv.setUint32(0, a0, true);
	dv.setUint32(4, b0, true);
	dv.setUint32(8, c0, true);
	dv.setUint32(12, d0, true);
	return out;
}

export async function hashText(input: string, algorithm: HashAlgorithm): Promise<ToolResult> {
	const bytes = new TextEncoder().encode(input);
	if (algorithm === 'MD5') return ok(bytesToHex(md5Bytes(bytes)));
	try {
		const digest = await crypto.subtle.digest(algorithm, bytes);
		return ok(bytesToHex(new Uint8Array(digest)));
	} catch {
		return err(`Hashing with ${algorithm} failed`);
	}
}

export async function hmacText(
	input: string,
	key: string,
	algorithm: Exclude<HashAlgorithm, 'MD5'>
): Promise<ToolResult> {
	if (key === '') return err('HMAC requires a secret key');
	try {
		const cryptoKey = await crypto.subtle.importKey(
			'raw',
			new TextEncoder().encode(key),
			{ name: 'HMAC', hash: algorithm },
			false,
			['sign']
		);
		const sig = await crypto.subtle.sign('HMAC', cryptoKey, new TextEncoder().encode(input));
		return ok(bytesToHex(new Uint8Array(sig)));
	} catch {
		return err(`HMAC with ${algorithm} failed`);
	}
}

export { md5Bytes, bytesToHex };
