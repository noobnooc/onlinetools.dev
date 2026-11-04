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
	it('names a JWE (5 segments, enc in the header) instead of counting segments', () => {
		const h = encodeBase64(JSON.stringify({ alg: 'RSA-OAEP-256', enc: 'A256GCM' }), true);
		if (!h.ok) throw new Error('encode failed');
		const r = decodeJwt(`${h.value}.a.b.c.d`);
		expect(r.ok).toBe(false);
		if (!r.ok) {
			expect(r.error).toMatch(/JWE/);
			expect(r.error).toMatch(/A256GCM/);
		}
		const other = decodeJwt('a.b.c.d.e');
		expect(!other.ok && other.error).toMatch(/found 5/);
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

import { signJwt, verifyJwt, stampTimeClaims, generateSecret, generateKeyPair, parseJwks, SIGN_ALGS, isHmacAlg } from './jwt';

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
				value: { valid: true, alg: 'HS256', time: null, detail: 'Signature is valid for the supplied key' }
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

describe('signJwt header', () => {
	it('merges a custom header and keeps alg first', async () => {
		const signed = await signJwt(PAYLOAD, 'HS256', 'secret', '{"kid": "key-1", "typ": "at+jwt"}');
		expect(signed.ok).toBe(true);
		if (signed.ok) {
			const d = decodeJwt(signed.value);
			expect(d.ok && d.value.header).toEqual({ alg: 'HS256', typ: 'at+jwt', kid: 'key-1' });
			expect(d.ok && Object.keys(d.value.header)[0]).toBe('alg');
		}
	});
	it('rejects a header whose alg disagrees with the selected one', async () => {
		const r = await signJwt(PAYLOAD, 'HS256', 'secret', '{"alg": "RS256"}');
		expect(r.ok).toBe(false);
		if (!r.ok) expect(r.error).toContain('RS256');
	});
	it('rejects a header that is not a JSON object', async () => {
		expect((await signJwt(PAYLOAD, 'HS256', 'secret', '[1]')).ok).toBe(false);
		expect((await signJwt(PAYLOAD, 'HS256', 'secret', '{nope')).ok).toBe(false);
	});
	it('signs non-ASCII claims as UTF-8', async () => {
		const signed = await signJwt('{"name": "李雷 🎉"}', 'HS256', 'secret');
		expect(signed.ok).toBe(true);
		if (signed.ok) {
			const d = decodeJwt(signed.value);
			expect(d.ok && d.value.payload.name).toBe('李雷 🎉');
		}
	});
});

describe('every asymmetric algorithm round-trips', () => {
	for (const alg of SIGN_ALGS.filter((a) => !isHmacAlg(a))) {
		it(`${alg}: PEM sign, PEM and JWK verify`, async () => {
			const pair = await generateKeyPair(alg);
			expect(pair.ok).toBe(true);
			if (!pair.ok) return;
			expect(pair.value.privatePem).toMatch(/^-----BEGIN PRIVATE KEY-----\n/);
			expect(pair.value.publicPem).toMatch(/-----END PUBLIC KEY-----$/);
			const signed = await signJwt(PAYLOAD, alg, pair.value.privatePem);
			expect(signed.ok).toBe(true);
			if (!signed.ok) return;
			const viaPem = await verifyJwt(signed.value, pair.value.publicPem);
			expect(viaPem.ok && viaPem.value.valid).toBe(true);
			const viaJwk = await verifyJwt(signed.value, pair.value.publicJwk);
			expect(viaJwk.ok && viaJwk.value.valid).toBe(true);
			const other = await generateKeyPair(alg);
			if (other.ok) {
				const wrong = await verifyJwt(signed.value, other.value.publicPem);
				expect(wrong.ok && wrong.value.valid).toBe(false);
			}
		});
	}
	it('refuses to generate a key pair for HS algorithms', async () => {
		expect((await generateKeyPair('HS256')).ok).toBe(false);
	});
});

describe('JWK and JWKS keys', () => {
	async function ecPair(kid?: string) {
		const pair = await crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, true, ['sign', 'verify']);
		const priv = { ...(await crypto.subtle.exportKey('jwk', pair.privateKey)), ...(kid ? { kid } : {}) };
		const pub = { ...(await crypto.subtle.exportKey('jwk', pair.publicKey)), ...(kid ? { kid } : {}) };
		return { priv, pub };
	}

	it('signs with a private JWK and copies its kid into the header', async () => {
		const { priv, pub } = await ecPair('k1');
		const signed = await signJwt(PAYLOAD, 'ES256', JSON.stringify(priv));
		expect(signed.ok).toBe(true);
		if (!signed.ok) return;
		const d = decodeJwt(signed.value);
		expect(d.ok && d.value.header.kid).toBe('k1');
		const v = await verifyJwt(signed.value, JSON.stringify(pub));
		expect(v.ok && v.value.valid && v.value.kid).toBe('k1');
	});
	it('picks the JWKS key by kid', async () => {
		const a = await ecPair('a');
		const b = await ecPair('b');
		const signed = await signJwt(PAYLOAD, 'ES256', JSON.stringify(b.priv));
		expect(signed.ok).toBe(true);
		if (!signed.ok) return;
		const v = await verifyJwt(signed.value, JSON.stringify({ keys: [a.pub, b.pub] }));
		expect(v.ok && v.value.valid).toBe(true);
		expect(v.ok && v.value.detail).toContain('kid "b"');
	});
	it('reports a kid that is not in the JWKS', async () => {
		const a = await ecPair('a');
		const b = await ecPair('b');
		const c = await ecPair('c');
		const signed = await signJwt(PAYLOAD, 'ES256', JSON.stringify(c.priv));
		if (!signed.ok) throw new Error(signed.error);
		const v = await verifyJwt(signed.value, JSON.stringify({ keys: [a.pub, b.pub] }));
		expect(v.ok).toBe(false);
		if (!v.ok) expect(v.error).toContain('"c"');
	});
	it('tries every compatible key when the token has no kid', async () => {
		const a = await ecPair();
		const b = await ecPair();
		const signed = await signJwt(PAYLOAD, 'ES256', JSON.stringify(b.priv));
		if (!signed.ok) throw new Error(signed.error);
		const v = await verifyJwt(signed.value, JSON.stringify({ keys: [a.pub, b.pub] }));
		expect(v.ok && v.value.valid).toBe(true);
	});
	it('verifies with a private JWK by using only its public half', async () => {
		const { priv } = await ecPair();
		const signed = await signJwt(PAYLOAD, 'ES256', JSON.stringify(priv));
		if (!signed.ok) throw new Error(signed.error);
		const v = await verifyJwt(signed.value, JSON.stringify(priv));
		expect(v.ok && v.value.valid).toBe(true);
	});
	it('explains a public JWK used for signing', async () => {
		const { pub } = await ecPair();
		const r = await signJwt(PAYLOAD, 'ES256', JSON.stringify(pub));
		expect(r.ok).toBe(false);
		if (!r.ok) expect(r.error).toContain('"d"');
	});
	it('explains a key of the wrong type or curve', async () => {
		const { priv } = await ecPair();
		const rsa = await signJwt(PAYLOAD, 'RS256', JSON.stringify(priv));
		expect(!rsa.ok && rsa.error).toContain('"RSA"');
		const curve = await signJwt(PAYLOAD, 'ES384', JSON.stringify(priv));
		expect(!curve.ok && curve.error).toContain('P-384');
	});
	it('signs and verifies HS256 with an oct JWK', async () => {
		const k = { kty: 'oct', k: 'c2VjcmV0' }; // "secret"
		const signed = await signJwt(PAYLOAD, 'HS256', JSON.stringify(k));
		if (!signed.ok) throw new Error(signed.error);
		const v = await verifyJwt(signed.value, 'secret');
		expect(v.ok && v.value.valid).toBe(true);
	});
	it('treats JSON-looking text without kty as a plain HS secret', async () => {
		const signed = await signJwt(PAYLOAD, 'HS256', '{"not":"a jwk"}');
		if (!signed.ok) throw new Error(signed.error);
		const v = await verifyJwt(signed.value, '{"not":"a jwk"}');
		expect(v.ok && v.value.valid).toBe(true);
	});
	it('parseJwks distinguishes JWK, JWKS, and non-JSON', () => {
		expect(parseJwks('-----BEGIN PUBLIC KEY-----')).toBeNull();
		expect(parseJwks('{"kty":"EC"}')).toEqual({ ok: true, value: [{ kty: 'EC' }] });
		expect(parseJwks('{"keys":[{"kty":"RSA"},{"x":1}]}')).toEqual({ ok: true, value: [{ kty: 'RSA' }] });
		expect(parseJwks('{"keys":[]}')?.ok).toBe(false);
		expect(parseJwks('{"foo":1}')?.ok).toBe(false);
	});
});

describe('verifyJwt safety checks', () => {
	it('refuses a public key for an HS token (algorithm confusion)', async () => {
		const signed = await signJwt(PAYLOAD, 'HS256', 'secret');
		if (!signed.ok) throw new Error(signed.error);
		const r = await verifyJwt(signed.value, '-----BEGIN PUBLIC KEY-----\nAAAA\n-----END PUBLIC KEY-----');
		expect(r.ok).toBe(false);
		if (!r.ok) expect(r.error).toContain('algorithm confusion');
	});
	it('treats alg "NONE" in any case as unsigned', async () => {
		const header = encodeBase64(JSON.stringify({ alg: 'NONE' }), true);
		const payload = encodeBase64('{}', true);
		if (!header.ok || !payload.ok) throw new Error('encode');
		const r = await verifyJwt(`${header.value}.${payload.value}.`, 'x');
		expect(r.ok && r.value.valid).toBe(false);
	});
	it('checks exp and nbf against the injected clock, with leeway', async () => {
		const signed = await signJwt('{"nbf": 1000, "exp": 2000}', 'HS256', 'secret');
		if (!signed.ok) throw new Error(signed.error);
		const early = await verifyJwt(signed.value, 'secret', 999_000);
		expect(early.ok && early.value.valid && early.value.time?.status).toBe('not-yet-valid');
		const during = await verifyJwt(signed.value, 'secret', 1500_000);
		expect(during.ok && during.value.time).toEqual({ status: 'ok', message: 'exp: valid until 1970-01-01T00:33:20Z' });
		const late = await verifyJwt(signed.value, 'secret', 2001_000);
		expect(late.ok && late.value.valid && late.value.time?.status).toBe('expired');
		const lenient = await verifyJwt(signed.value, 'secret', 2001_000, 60);
		expect(lenient.ok && lenient.value.time?.status).toBe('ok');
	});
});

describe('stampTimeClaims', () => {
	it('sets iat and exp from the clock and keeps other claims', () => {
		const r = stampTimeClaims('{"sub":"1","iat":1}', 1_700_000_000_500, 3600);
		expect(r.ok && JSON.parse(r.value)).toEqual({ sub: '1', iat: 1_700_000_000, exp: 1_700_003_600 });
	});
	it('can set only iat, and starts from {} when empty', () => {
		const r = stampTimeClaims('', 1_000_000, null);
		expect(r.ok && JSON.parse(r.value)).toEqual({ iat: 1000 });
	});
	it('rejects invalid JSON', () => {
		expect(stampTimeClaims('{', 0, null).ok).toBe(false);
	});
});

describe('generateSecret', () => {
	it('uses as many random bytes as the hash output', () => {
		const zeros = () => {};
		expect(generateSecret('HS256', zeros)).toBe('A'.repeat(43));
		expect(generateSecret('HS512', zeros)).toHaveLength(86);
		const a = generateSecret('HS256');
		expect(a).toMatch(/^[A-Za-z0-9_-]{43}$/);
		expect(generateSecret('HS256')).not.toBe(a);
	});
});
