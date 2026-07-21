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
