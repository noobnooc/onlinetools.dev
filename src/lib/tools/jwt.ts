import { type ToolResult, ok, err } from './types';
import { normalizeBase64 } from './base64';

export interface DecodedJwt {
	header: Record<string, unknown>;
	payload: Record<string, unknown>;
	signature: string;
	/** Derived, human-relevant claim info. */
	issuedAt?: string;
	expiresAt?: string;
	notBefore?: string;
	expired?: boolean;
}

function decodeSegment(segment: string): Record<string, unknown> | null {
	try {
		const bytes = atob(normalizeBase64(segment));
		const text = new TextDecoder('utf-8', { fatal: true }).decode(
			Uint8Array.from(bytes, (c) => c.charCodeAt(0))
		);
		const parsed = JSON.parse(text);
		if (parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed)) {
			return parsed as Record<string, unknown>;
		}
		return null;
	} catch {
		return null;
	}
}

/** `now` is injectable for deterministic tests (ms since epoch). */
export function decodeJwt(input: string, now?: number): ToolResult<DecodedJwt> {
	const token = input.trim().replace(/^Bearer\s+/i, '');
	if (token === '') return err('Input is empty');
	const parts = token.split('.');
	if (parts.length !== 3) {
		return err(`A JWT has 3 dot-separated segments; found ${parts.length}`);
	}
	const header = decodeSegment(parts[0]);
	if (!header) return err('Header segment is not valid Base64URL-encoded JSON');
	const payload = decodeSegment(parts[1]);
	if (!payload) return err('Payload segment is not valid Base64URL-encoded JSON');

	const result: DecodedJwt = { header, payload, signature: parts[2] };
	const toIso = (v: unknown) =>
		typeof v === 'number' && Number.isFinite(v) ? new Date(v * 1000).toISOString() : undefined;
	result.issuedAt = toIso(payload.iat);
	result.expiresAt = toIso(payload.exp);
	result.notBefore = toIso(payload.nbf);
	if (typeof payload.exp === 'number') {
		result.expired = payload.exp * 1000 < (now ?? Date.now());
	}
	return ok(result);
}

/* ---------- sign & verify (WebCrypto) ---------- */

export type JwtAlg = 'HS256' | 'HS384' | 'HS512' | 'RS256' | 'RS384' | 'RS512' | 'ES256' | 'ES384';

export const SIGN_ALGS: JwtAlg[] = ['HS256', 'HS384', 'HS512', 'RS256', 'RS384', 'RS512', 'ES256', 'ES384'];

const HASH_FOR: Record<JwtAlg, string> = {
	HS256: 'SHA-256', HS384: 'SHA-384', HS512: 'SHA-512',
	RS256: 'SHA-256', RS384: 'SHA-384', RS512: 'SHA-512',
	ES256: 'SHA-256', ES384: 'SHA-384'
};

const CURVE_FOR: Record<string, string> = { ES256: 'P-256', ES384: 'P-384' };

function b64urlEncodeBytes(bytes: Uint8Array): string {
	let bin = '';
	for (const b of bytes) bin += String.fromCharCode(b);
	return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function b64urlEncodeJson(value: unknown): string {
	return b64urlEncodeBytes(new TextEncoder().encode(JSON.stringify(value)));
}

function b64urlDecodeBytes(s: string): Uint8Array {
	const bin = atob(normalizeBase64(s));
	return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

function pemToBytes(pem: string, expected: 'PRIVATE KEY' | 'PUBLIC KEY'): ToolResult<Uint8Array> {
	const trimmed = pem.trim();
	if (/BEGIN RSA (PRIVATE|PUBLIC) KEY/.test(trimmed)) {
		return err('PKCS#1 keys ("BEGIN RSA … KEY") are not supported — convert to PKCS#8 / SPKI, e.g. openssl pkcs8 -topk8 -nocrypt');
	}
	if (/BEGIN CERTIFICATE/.test(trimmed)) {
		return err('This is a certificate — paste the public key instead (openssl x509 -pubkey -noout)');
	}
	const m = trimmed.match(/-----BEGIN ([A-Z ]+)-----([\s\S]+?)-----END \1-----/);
	if (!m) return err(`Expected a PEM block (-----BEGIN ${expected}-----)`);
	if (m[1] === 'EC PRIVATE KEY') {
		return err('SEC1 EC keys are not supported — convert to PKCS#8: openssl pkcs8 -topk8 -nocrypt');
	}
	if (m[1] !== expected) {
		return err(`Expected ${expected}, found ${m[1]}`);
	}
	try {
		return ok(b64urlDecodeBytes(m[2].replace(/\s+/g, '')));
	} catch {
		return err('PEM body is not valid Base64');
	}
}

async function importKeyFor(
	alg: JwtAlg,
	keyMaterial: string,
	usage: 'sign' | 'verify'
): Promise<ToolResult<CryptoKey>> {
	const subtle = globalThis.crypto?.subtle;
	if (!subtle) return err('WebCrypto is unavailable in this environment');
	try {
		if (alg.startsWith('HS')) {
			if (keyMaterial === '') return err('Secret is empty');
			const key = await subtle.importKey(
				'raw',
				new TextEncoder().encode(keyMaterial),
				{ name: 'HMAC', hash: HASH_FOR[alg] },
				false,
				[usage]
			);
			return ok(key);
		}
		const pem = pemToBytes(keyMaterial, usage === 'sign' ? 'PRIVATE KEY' : 'PUBLIC KEY');
		if (!pem.ok) return pem as ToolResult<CryptoKey>;
		const params = alg.startsWith('RS')
			? { name: 'RSASSA-PKCS1-v1_5', hash: HASH_FOR[alg] }
			: { name: 'ECDSA', namedCurve: CURVE_FOR[alg] };
		const key = await subtle.importKey(
			usage === 'sign' ? 'pkcs8' : 'spki',
			pem.value.buffer as ArrayBuffer,
			params,
			false,
			[usage]
		);
		return ok(key);
	} catch (e) {
		const msg = e instanceof Error ? e.message : String(e);
		return err(`Could not import the key — ${msg || 'is it the right type for ' + alg + '?'}`);
	}
}

function signParams(alg: JwtAlg): AlgorithmIdentifier | EcdsaParams {
	if (alg.startsWith('ES')) return { name: 'ECDSA', hash: HASH_FOR[alg] };
	if (alg.startsWith('RS')) return { name: 'RSASSA-PKCS1-v1_5' };
	return { name: 'HMAC' };
}

/** Sign a JWT. `payloadJson` must be a JSON object; header is `{alg, typ}` plus `extraHeader`. */
export async function signJwt(
	payloadJson: string,
	alg: JwtAlg,
	keyMaterial: string
): Promise<ToolResult> {
	let payload: unknown;
	try {
		payload = JSON.parse(payloadJson);
	} catch (e) {
		return err('Payload: ' + (e instanceof Error ? e.message : 'invalid JSON'));
	}
	if (payload === null || typeof payload !== 'object' || Array.isArray(payload)) {
		return err('Payload must be a JSON object');
	}
	const keyRes = await importKeyFor(alg, keyMaterial, 'sign');
	if (!keyRes.ok) return keyRes as ToolResult;
	const signingInput =
		b64urlEncodeJson({ alg, typ: 'JWT' }) + '.' + b64urlEncodeJson(payload);
	try {
		const sig = await globalThis.crypto.subtle.sign(
			signParams(alg),
			keyRes.value,
			new TextEncoder().encode(signingInput)
		);
		return ok(signingInput + '.' + b64urlEncodeBytes(new Uint8Array(sig)));
	} catch (e) {
		return err('Signing failed — ' + (e instanceof Error ? e.message : String(e)));
	}
}

export interface VerifyOutcome {
	valid: boolean;
	alg: string;
	detail: string;
}

/** Verify a JWT signature with a shared secret (HS) or a public key PEM (RS/ES). */
export async function verifyJwt(token: string, keyMaterial: string): Promise<ToolResult<VerifyOutcome>> {
	const t = token.trim().replace(/^Bearer\s+/i, '');
	const parts = t.split('.');
	if (parts.length !== 3) return err(`A JWT has 3 dot-separated segments; found ${parts.length}`);
	const header = decodeSegment(parts[0]);
	if (!header) return err('Header segment is not valid Base64URL-encoded JSON');
	const alg = String(header.alg ?? '');
	if (alg === 'none') {
		return ok({ valid: false, alg, detail: 'alg is "none" — the token is unsigned and must be rejected' });
	}
	if (!SIGN_ALGS.includes(alg as JwtAlg)) {
		return err(`Algorithm ${alg || '(missing)'} is not supported here — supported: ${SIGN_ALGS.join(', ')}`);
	}
	const keyRes = await importKeyFor(alg as JwtAlg, keyMaterial, 'verify');
	if (!keyRes.ok) return keyRes as ToolResult<VerifyOutcome>;
	let sig: Uint8Array;
	try {
		sig = b64urlDecodeBytes(parts[2]);
	} catch {
		return err('Signature segment is not valid Base64URL');
	}
	try {
		const valid = await globalThis.crypto.subtle.verify(
			signParams(alg as JwtAlg),
			keyRes.value,
			sig.buffer as ArrayBuffer,
			new TextEncoder().encode(parts[0] + '.' + parts[1])
		);
		return ok({
			valid,
			alg,
			detail: valid ? 'Signature is valid for the supplied key' : 'Signature does NOT match the supplied key'
		});
	} catch (e) {
		return err('Verification failed — ' + (e instanceof Error ? e.message : String(e)));
	}
}

export function isLikelyJwt(input: string): boolean {
	const token = input.trim().replace(/^Bearer\s+/i, '');
	if (!/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]*$/.test(token)) return false;
	const header = decodeSegment(token.split('.')[0]);
	return header !== null && ('alg' in header || 'typ' in header);
}
