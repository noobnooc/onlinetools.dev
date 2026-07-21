import { describe, expect, it } from 'vitest';
import { decodeJwt, isLikelyJwt } from './jwt';
import { encodeBase64 } from './base64';

// header {"alg":"HS256","typ":"JWT"}
// payload {"sub":"123","name":"Ada","iat":1516239022,"exp":1516242622}
const JWT =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
	'eyJzdWIiOiIxMjMiLCJuYW1lIjoiQWRhIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyNDI2MjJ9.' +
	'sig';

function makeJwt(header: object, payload: object): string {
	const seg = (o: object) => {
		const r = encodeBase64(JSON.stringify(o), true);
		return r.ok ? r.value : '';
	};
	return `${seg(header)}.${seg(payload)}.fakesig`;
}

describe('decodeJwt', () => {
	it('decodes header and payload', () => {
		const r = decodeJwt(JWT, 1516240000_000);
		expect(r.ok).toBe(true);
		if (r.ok) {
			expect(r.value.header).toEqual({ alg: 'HS256', typ: 'JWT' });
			expect(r.value.payload.name).toBe('Ada');
			expect(r.value.signature).toBe('sig');
		}
	});
	it('derives readable time claims', () => {
		const r = decodeJwt(JWT, 1516240000_000);
		expect(r.ok).toBe(true);
		if (r.ok) {
			expect(r.value.issuedAt).toBe('2018-01-18T01:30:22.000Z');
			expect(r.value.expiresAt).toBe('2018-01-18T02:30:22.000Z');
			expect(r.value.notBefore).toBeUndefined();
		}
	});
	it('compares exp against the injected clock', () => {
		const before = decodeJwt(JWT, 1516242621_000);
		const after = decodeJwt(JWT, 1516242623_000);
		expect(before.ok && before.value.expired).toBe(false);
		expect(after.ok && after.value.expired).toBe(true);
	});
	it('leaves expired undefined when there is no exp claim', () => {
		const token = makeJwt({ alg: 'none' }, { sub: 'x' });
		const r = decodeJwt(token, 0);
		expect(r.ok && r.value.expired).toBeUndefined();
	});
	it('handles nbf', () => {
		const token = makeJwt({ alg: 'HS256' }, { nbf: 2000000000 });
		const r = decodeJwt(token, 0);
		expect(r.ok && r.value.notBefore).toBe('2033-05-18T03:33:20.000Z');
	});
	it('strips a Bearer prefix, case-insensitively', () => {
		expect(decodeJwt('Bearer ' + JWT, 0).ok).toBe(true);
		expect(decodeJwt('bearer ' + JWT, 0).ok).toBe(true);
	});
	it('accepts an empty signature segment (alg=none tokens)', () => {
		const [h, p] = JWT.split('.');
		expect(decodeJwt(`${h}.${p}.`, 0).ok).toBe(true);
	});
	it('round-trips unicode claims', () => {
		const token = makeJwt({ alg: 'HS256' }, { name: '田中 🎉' });
		const r = decodeJwt(token, 0);
		expect(r.ok && r.value.payload.name).toBe('田中 🎉');
	});
	it('rejects wrong segment counts with a count in the message', () => {
		const r = decodeJwt('abc.def');
		expect(r.ok).toBe(false);
		if (!r.ok) expect(r.error).toMatch(/2/);
		expect(decodeJwt('a.b.c.d').ok).toBe(false);
	});
	it('rejects segments that are not base64url JSON', () => {
		expect(decodeJwt('!!!.eyJ9.x').ok).toBe(false);
		expect(decodeJwt('eyJhbGciOiJIUzI1NiJ9.!!!.x').ok).toBe(false);
	});
	it('rejects JSON-scalar segments (payload must be an object)', () => {
		const scalar = encodeBase64('"just-a-string"', true);
		if (scalar.ok) {
			expect(decodeJwt(`eyJhbGciOiJIUzI1NiJ9.${scalar.value}.x`).ok).toBe(false);
		}
	});
	it('rejects empty input', () => {
		expect(decodeJwt('').ok).toBe(false);
	});
});

describe('isLikelyJwt', () => {
	it('accepts real tokens, with or without Bearer', () => {
		expect(isLikelyJwt(JWT)).toBe(true);
		expect(isLikelyJwt('Bearer ' + JWT)).toBe(true);
	});
	it('rejects three-part strings that are not JWTs', () => {
		expect(isLikelyJwt('hello.world.foo')).toBe(false);
		expect(isLikelyJwt('a.b.c')).toBe(false);
	});
	it('rejects plain text and base64 blobs', () => {
		expect(isLikelyJwt('aGVsbG8gd29ybGQ=')).toBe(false);
		expect(isLikelyJwt('not a token at all')).toBe(false);
	});
});

/* ---------- sign & verify ---------- */

import { signJwt, verifyJwt } from './jwt';

const PAYLOAD = '{"sub": "123", "name": "Ada"}';

describe('signJwt / verifyJwt HS*', () => {
	it('signs and verifies HS256', async () => {
		const signed = await signJwt(PAYLOAD, 'HS256', 'secret');
		expect(signed.ok).toBe(true);
		if (signed.ok) {
			const decoded = decodeJwt(signed.value);
			expect(decoded.ok).toBe(true);
			if (decoded.ok) {
				expect(decoded.value.header).toEqual({ alg: 'HS256', typ: 'JWT' });
				expect(decoded.value.payload.name).toBe('Ada');
			}
			const good = await verifyJwt(signed.value, 'secret');
			expect(good).toEqual({
				ok: true,
				value: { valid: true, alg: 'HS256', detail: 'Signature is valid for the supplied key' }
			});
			const bad = await verifyJwt(signed.value, 'wrong');
			expect(bad.ok && bad.value.valid === false).toBe(true);
		}
	});
	it('signs HS384 and HS512', async () => {
		for (const alg of ['HS384', 'HS512'] as const) {
			const signed = await signJwt(PAYLOAD, alg, 's3cr3t');
			expect(signed.ok).toBe(true);
			if (signed.ok) {
				const v = await verifyJwt(signed.value, 's3cr3t');
				expect(v.ok && v.value.valid).toBe(true);
			}
		}
	});
	it('rejects invalid payload JSON and empty secret', async () => {
		expect((await signJwt('{oops', 'HS256', 'x')).ok).toBe(false);
		expect((await signJwt(PAYLOAD, 'HS256', '')).ok).toBe(false);
		expect((await signJwt('[1,2]', 'HS256', 'x')).ok).toBe(false);
	});
});

describe('signJwt / verifyJwt asymmetric', () => {
	async function exportPem(key: CryptoKey, kind: 'pkcs8' | 'spki'): Promise<string> {
		const der = new Uint8Array(await crypto.subtle.exportKey(kind, key));
		let bin = '';
		for (const b of der) bin += String.fromCharCode(b);
		const b64 = btoa(bin).replace(/(.{64})/g, '$1\n');
		const label = kind === 'pkcs8' ? 'PRIVATE KEY' : 'PUBLIC KEY';
		return `-----BEGIN ${label}-----\n${b64}\n-----END ${label}-----`;
	}

	it('signs RS256 with PKCS8 and verifies with SPKI', async () => {
		const pair = await crypto.subtle.generateKey(
			{ name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]) },
			true,
			['sign', 'verify']
		);
		const priv = await exportPem(pair.privateKey, 'pkcs8');
		const pub = await exportPem(pair.publicKey, 'spki');
		const signed = await signJwt(PAYLOAD, 'RS256', priv);
		expect(signed.ok).toBe(true);
		if (signed.ok) {
			const v = await verifyJwt(signed.value, pub);
			expect(v.ok && v.value.valid).toBe(true);
		}
	});
	it('signs ES256 and verifies', async () => {
		const pair = await crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, true, ['sign', 'verify']);
		const priv = await exportPem(pair.privateKey, 'pkcs8');
		const pub = await exportPem(pair.publicKey, 'spki');
		const signed = await signJwt(PAYLOAD, 'ES256', priv);
		expect(signed.ok).toBe(true);
		if (signed.ok) {
			const v = await verifyJwt(signed.value, pub);
			expect(v.ok && v.value.valid).toBe(true);
		}
	});
	it('gives a helpful error for PKCS1 PEM', async () => {
		const r = await signJwt(PAYLOAD, 'RS256', '-----BEGIN RSA PRIVATE KEY-----\nAAAA\n-----END RSA PRIVATE KEY-----');
		expect(r.ok).toBe(false);
		if (!r.ok) expect(r.error).toContain('PKCS#8');
	});
	it('flags alg none as invalid rather than erroring', async () => {
		const header = encodeBase64(JSON.stringify({ alg: 'none' }), true);
		const payload = encodeBase64('{}', true);
		expect(header.ok && payload.ok).toBe(true);
		if (header.ok && payload.ok) {
			const r = await verifyJwt(`${header.value}.${payload.value}.`, 'x');
			expect(r.ok && r.value.valid === false && r.value.detail.includes('none')).toBe(true);
		}
	});
});
