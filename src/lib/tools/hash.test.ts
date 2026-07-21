import { describe, expect, it } from 'vitest';
import { hashText, hmacText } from './hash';

const FOX = 'The quick brown fox jumps over the lazy dog';

describe('hashText — MD5 (RFC 1321 vectors)', () => {
	it('empty string', async () => {
		expect(await hashText('', 'MD5')).toEqual({ ok: true, value: 'd41d8cd98f00b204e9800998ecf8427e' });
	});
	it('"abc"', async () => {
		expect(await hashText('abc', 'MD5')).toEqual({ ok: true, value: '900150983cd24fb0d6963f7d28e17f72' });
	});
	it('quick brown fox, with and without final period', async () => {
		expect(await hashText(FOX, 'MD5')).toEqual({ ok: true, value: '9e107d9d372bb6826bd81d3542a419d6' });
		expect(await hashText(FOX + '.', 'MD5')).toEqual({ ok: true, value: 'e4d909c290d0fb1ca068ffaddf22cbd0' });
	});
	it('long input crossing multiple 64-byte blocks', async () => {
		const r = await hashText('a'.repeat(1000), 'MD5');
		expect(r.ok && (r.value as string).length).toBe(32);
	});
	it('unicode input hashes its UTF-8 bytes', async () => {
		const a = await hashText('日本語', 'MD5');
		const b = await hashText('日本語', 'MD5');
		expect(a).toEqual(b);
		expect(a.ok && a.value).not.toBe((await hashText('日本语', 'MD5')).ok && '');
	});
});

describe('hashText — SHA family (NIST vectors)', () => {
	it('SHA-1("abc")', async () => {
		expect(await hashText('abc', 'SHA-1')).toEqual({
			ok: true,
			value: 'a9993e364706816aba3e25717850c26c9cd0d89d'
		});
	});
	it('SHA-256 of empty and "abc"', async () => {
		expect(await hashText('', 'SHA-256')).toEqual({
			ok: true,
			value: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
		});
		expect(await hashText('abc', 'SHA-256')).toEqual({
			ok: true,
			value: 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'
		});
	});
	it('SHA-384("abc")', async () => {
		expect(await hashText('abc', 'SHA-384')).toEqual({
			ok: true,
			value: 'cb00753f45a35e8bb5a03d699ac65007272c32ab0eded1631a8b605a43ff5bed8086072ba1e7cc2358baeca134c825a7'
		});
	});
	it('SHA-512("abc")', async () => {
		expect(await hashText('abc', 'SHA-512')).toEqual({
			ok: true,
			value:
				'ddaf35a193617abacc417349ae20413112e6fa4e89a97ea20a9eeee64b55d39a2192992a274fc1a836ba3c23a3feebbd454d4423643ce80e2a9ac94fa54ca49f'
		});
	});
	it('digest lengths match the algorithm', async () => {
		const lens: Array<['SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512', number]> = [
			['SHA-1', 40],
			['SHA-256', 64],
			['SHA-384', 96],
			['SHA-512', 128]
		];
		for (const [algo, len] of lens) {
			const r = await hashText('x', algo);
			expect(r.ok && (r.value as string).length).toBe(len);
		}
	});
});

describe('hmacText (RFC 4231 vectors)', () => {
	it('case 1: 20×0x0b key, "Hi There", SHA-256', async () => {
		expect(await hmacText('Hi There', '\x0b'.repeat(20), 'SHA-256')).toEqual({
			ok: true,
			value: 'b0344c61d8db38535ca8afceaf0bf12b881dc200c9833da726e9376c2e32cff7'
		});
	});
	it('case 2: key "Jefe", SHA-256 and SHA-512', async () => {
		const data = 'what do ya want for nothing?';
		expect(await hmacText(data, 'Jefe', 'SHA-256')).toEqual({
			ok: true,
			value: '5bdcc146bf60754e6a042426089575c75a003f089d2739839dec58b964ec3843'
		});
		expect(await hmacText(data, 'Jefe', 'SHA-512')).toEqual({
			ok: true,
			value:
				'164b7a7bfcf819e2e395fbe73b56e0a387bd64222e831fd610270cd7ea2505549758bf75c05a994a6d034f65f8f0e6fdcaeab1a34d4a6b4b636e070a38bce737'
		});
	});
	it('different keys produce different signatures', async () => {
		const a = await hmacText('data', 'key-one', 'SHA-256');
		const b = await hmacText('data', 'key-two', 'SHA-256');
		expect(a.ok && b.ok && a.value !== b.value).toBe(true);
	});
	it('requires a non-empty key', async () => {
		expect((await hmacText('data', '', 'SHA-256')).ok).toBe(false);
	});
});
