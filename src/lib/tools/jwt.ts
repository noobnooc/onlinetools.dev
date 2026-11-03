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

export type JwtAlg =
	| 'HS256' | 'HS384' | 'HS512'
	| 'RS256' | 'RS384' | 'RS512'
	| 'PS256' | 'PS384' | 'PS512'
	| 'ES256' | 'ES384' | 'ES512'
	| 'EdDSA';

export const SIGN_ALGS: JwtAlg[] = [
	'HS256', 'HS384', 'HS512',
	'RS256', 'RS384', 'RS512',
	'PS256', 'PS384', 'PS512',
	'ES256', 'ES384', 'ES512',
	'EdDSA'
];

type Family = 'HS' | 'RS' | 'PS' | 'ES' | 'EdDSA';

export function algFamily(alg: JwtAlg): Family {
	return alg === 'EdDSA' ? 'EdDSA' : (alg.slice(0, 2) as Family);
}

/** True for algorithms that sign with a shared secret rather than a key pair. */
export function isHmacAlg(alg: JwtAlg): boolean {
	return algFamily(alg) === 'HS';
}

const HASH_FOR: Record<JwtAlg, string> = {
	HS256: 'SHA-256', HS384: 'SHA-384', HS512: 'SHA-512',
	RS256: 'SHA-256', RS384: 'SHA-384', RS512: 'SHA-512',
	PS256: 'SHA-256', PS384: 'SHA-384', PS512: 'SHA-512',
	ES256: 'SHA-256', ES384: 'SHA-384', ES512: 'SHA-512',
	EdDSA: ''
};

const CURVE_FOR: Record<string, string> = { ES256: 'P-256', ES384: 'P-384', ES512: 'P-521' };

/** The JWK `kty` (and `crv`) each family's keys must have. */
const KTY_FOR: Record<Family, string> = { HS: 'oct', RS: 'RSA', PS: 'RSA', ES: 'EC', EdDSA: 'OKP' };

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
	if (!m) return err(`Expected a PEM block (-----BEGIN ${expected}-----) or a JWK`);
	if (m[1] === 'EC PRIVATE KEY') {
		return err('SEC1 EC keys are not supported — convert to PKCS#8: openssl pkcs8 -topk8 -nocrypt');
	}
	if (m[1] === 'ENCRYPTED PRIVATE KEY') {
		return err('This private key is password-protected — decrypt it first: openssl pkcs8 -in key.pem -nocrypt');
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

function bytesToPem(bytes: ArrayBuffer, label: 'PRIVATE KEY' | 'PUBLIC KEY'): string {
	const b64 = btoa(String.fromCharCode(...new Uint8Array(bytes)));
	const lines = b64.match(/.{1,64}/g) ?? [];
	return `-----BEGIN ${label}-----\n${lines.join('\n')}\n-----END ${label}-----`;
}

function importParams(alg: JwtAlg): HmacImportParams | RsaHashedImportParams | EcKeyImportParams | Algorithm {
	switch (algFamily(alg)) {
		case 'HS':
			return { name: 'HMAC', hash: HASH_FOR[alg] };
		case 'RS':
			return { name: 'RSASSA-PKCS1-v1_5', hash: HASH_FOR[alg] };
		case 'PS':
			return { name: 'RSA-PSS', hash: HASH_FOR[alg] };
		case 'ES':
			return { name: 'ECDSA', namedCurve: CURVE_FOR[alg] };
		case 'EdDSA':
			return { name: 'Ed25519' };
	}
}

function signParams(alg: JwtAlg): AlgorithmIdentifier | EcdsaParams | RsaPssParams {
	switch (algFamily(alg)) {
		case 'ES':
			return { name: 'ECDSA', hash: HASH_FOR[alg] };
		case 'RS':
			return { name: 'RSASSA-PKCS1-v1_5' };
		// RFC 7518 §3.5: the salt is as long as the hash output.
		case 'PS':
			return { name: 'RSA-PSS', saltLength: Number(HASH_FOR[alg].slice(4)) / 8 };
		case 'EdDSA':
			return { name: 'Ed25519' };
		default:
			return { name: 'HMAC' };
	}
}

/* ---------- JWK / JWKS ---------- */

const PRIVATE_JWK_FIELDS = ['d', 'p', 'q', 'dp', 'dq', 'qi', 'oth'] as const;

/**
 * Read key text as a JWK or a JWKS. Returns null when the text isn't JSON at
 * all (so it can be treated as a PEM or a plain secret instead).
 */
export function parseJwks(text: string): ToolResult<JsonWebKey[]> | null {
	const trimmed = text.trim();
	if (!trimmed.startsWith('{')) return null;
	let parsed: unknown;
	try {
		parsed = JSON.parse(trimmed);
	} catch {
		return null;
	}
	if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) return null;
	const obj = parsed as Record<string, unknown>;
	if (Array.isArray(obj.keys)) {
		const keys = obj.keys.filter(
			(k): k is JsonWebKey => k !== null && typeof k === 'object' && typeof (k as JsonWebKey).kty === 'string'
		);
		if (keys.length === 0) return err('The JWKS has no keys with a "kty"');
		return ok(keys);
	}
	if (typeof obj.kty === 'string') return ok([obj as JsonWebKey]);
	return err('A JSON key must be a JWK (with "kty") or a JWKS ({"keys": [...]})');
}

/** Why a JWK can't be used with `alg`, or null when it can. */
function jwkMismatch(jwk: JsonWebKey, alg: JwtAlg): string | null {
	const family = algFamily(alg);
	const kty = KTY_FOR[family];
	if (jwk.kty !== kty) return `${alg} needs a "${kty}" key, this one is "${jwk.kty}"`;
	if (family === 'ES' && jwk.crv !== CURVE_FOR[alg]) {
		return `${alg} needs curve ${CURVE_FOR[alg]}, this key is ${jwk.crv ?? '(no crv)'}`;
	}
	if (family === 'EdDSA' && jwk.crv !== 'Ed25519') {
		return `EdDSA here supports Ed25519 keys only, this key is ${jwk.crv ?? '(no crv)'}`;
	}
	if (jwk.alg && jwk.alg !== alg) return `the key is marked for ${jwk.alg}, not ${alg}`;
	if (jwk.use && jwk.use !== 'sig') return `the key is marked use "${jwk.use}", not "sig"`;
	return null;
}

/**
 * WebCrypto rejects a JWK whose `alg`, `key_ops` or `ext` disagree with the
 * import call, so strip them once jwkMismatch has checked them. A private JWK
 * pasted for verification is reduced to its public half.
 */
function cleanJwk(jwk: JsonWebKey, usage: 'sign' | 'verify'): JsonWebKey {
	const out: Record<string, unknown> = { ...jwk };
	for (const f of ['alg', 'key_ops', 'ext', 'use', 'kid', 'x5c', 'x5t', 'x5u', 'x5t#S256']) delete out[f];
	if (usage === 'verify' && jwk.kty !== 'oct') for (const f of PRIVATE_JWK_FIELDS) delete out[f];
	return out as JsonWebKey;
}

function jwkKid(jwk: JsonWebKey): string | undefined {
	const kid = (jwk as { kid?: unknown }).kid;
	return typeof kid === 'string' ? kid : undefined;
}

async function importJwk(alg: JwtAlg, jwk: JsonWebKey, usage: 'sign' | 'verify'): Promise<ToolResult<CryptoKey>> {
	const mismatch = jwkMismatch(jwk, alg);
	if (mismatch) return err(`Key doesn't fit: ${mismatch}`);
	if (usage === 'sign') {
		const secretField = jwk.kty === 'oct' ? 'k' : 'd';
		if (!(secretField in jwk)) {
			return err(`This JWK has no "${secretField}" — signing needs the private key, not the public one`);
		}
	}
	try {
		const key = await globalThis.crypto.subtle.importKey('jwk', cleanJwk(jwk, usage), importParams(alg), false, [usage]);
		return ok(key);
	} catch (e) {
		const msg = e instanceof Error ? e.message : String(e);
		return err(`Could not import the JWK — ${msg || 'is it complete?'}`);
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
		if (isHmacAlg(alg)) {
			if (keyMaterial === '') return err('Secret is empty');
			const key = await subtle.importKey(
				'raw',
				new TextEncoder().encode(keyMaterial),
				importParams(alg),
				false,
				[usage]
			);
			return ok(key);
		}
		const pem = pemToBytes(keyMaterial, usage === 'sign' ? 'PRIVATE KEY' : 'PUBLIC KEY');
		if (!pem.ok) return pem as ToolResult<CryptoKey>;
		const key = await subtle.importKey(
			usage === 'sign' ? 'pkcs8' : 'spki',
			pem.value.buffer as ArrayBuffer,
			importParams(alg),
			false,
			[usage]
		);
		return ok(key);
	} catch (e) {
		const msg = e instanceof Error ? e.message : String(e);
		return err(`Could not import the key — ${msg || 'is it the right type for ' + alg + '?'}`);
	}
}

/** A key ready to use, with the JWK `kid` it came from (if any). */
interface ResolvedKey {
	key: CryptoKey;
	kid?: string;
}

/**
 * Turn whatever was pasted (secret, PEM, JWK, JWKS) into candidate keys for
 * `alg`. For a JWKS, a `kid` match narrows the set; otherwise every compatible
 * key is tried, which is what a verifier does with an unlabelled token.
 */
async function resolveKeys(
	alg: JwtAlg,
	keyMaterial: string,
	usage: 'sign' | 'verify',
	kid?: string
): Promise<ToolResult<ResolvedKey[]>> {
	const jwks = parseJwks(keyMaterial);
	// A secret may itself look like JSON; only treat it as a JWK if it is one.
	const isJwk = jwks !== null && (!isHmacAlg(alg) || (jwks.ok && jwks.value.some((k) => k.kty === 'oct')));
	if (!isJwk || jwks === null) {
		const r = await importKeyFor(alg, keyMaterial, usage);
		return r.ok ? ok([{ key: r.value }]) : (r as ToolResult<ResolvedKey[]>);
	}
	if (!jwks.ok) return jwks as ToolResult<ResolvedKey[]>;

	let keys = jwks.value;
	if (usage === 'sign') {
		if (keys.length > 1) {
			const priv = keys.filter((k) => ('d' in k || 'k' in k) && !jwkMismatch(k, alg));
			if (priv.length !== 1) return err('Paste a single private JWK to sign with, not a whole JWKS');
			keys = priv;
		}
		const r = await importJwk(alg, keys[0], 'sign');
		return r.ok ? ok([{ key: r.value, kid: jwkKid(keys[0]) }]) : (r as ToolResult<ResolvedKey[]>);
	}

	if (kid !== undefined && keys.some((k) => jwkKid(k) === kid)) {
		keys = keys.filter((k) => jwkKid(k) === kid);
	} else if (kid !== undefined && keys.length > 1 && keys.every((k) => jwkKid(k) !== undefined)) {
		return err(`No key in the JWKS has kid "${kid}" — the token was signed with a key that isn't in this set`);
	}
	const usable = keys.filter((k) => jwkMismatch(k, alg) === null);
	if (usable.length === 0) {
		const why = jwkMismatch(keys[0], alg);
		return err(keys.length === 1 ? `Key doesn't fit: ${why}` : `None of the ${keys.length} keys fit ${alg} (first: ${why})`);
	}
	const out: ResolvedKey[] = [];
	for (const k of usable) {
		const r = await importJwk(alg, k, 'verify');
		if (!r.ok) {
			if (usable.length === 1) return r as ToolResult<ResolvedKey[]>;
			continue;
		}
		out.push({ key: r.value, kid: jwkKid(k) });
	}
	if (out.length === 0) return err('None of the matching JWKs could be imported');
	return ok(out);
}

/* ---------- sign ---------- */

function parseJsonObject(text: string, what: string): ToolResult<Record<string, unknown>> {
	let value: unknown;
	try {
		value = JSON.parse(text);
	} catch (e) {
		return err(`${what}: ` + (e instanceof Error ? e.message : 'invalid JSON'));
	}
	if (value === null || typeof value !== 'object' || Array.isArray(value)) {
		return err(`${what} must be a JSON object`);
	}
	return ok(value as Record<string, unknown>);
}

/**
 * Sign a JWT. `payloadJson` must be a JSON object. The header is
 * `{alg, typ: "JWT"}` plus anything in `headerJson` (e.g. `kid`); a JWK key's
 * `kid` is added automatically unless the header sets one.
 */
export async function signJwt(
	payloadJson: string,
	alg: JwtAlg,
	keyMaterial: string,
	headerJson = ''
): Promise<ToolResult> {
	const payload = parseJsonObject(payloadJson, 'Payload');
	if (!payload.ok) return payload as ToolResult;
	let extra: Record<string, unknown> = {};
	if (headerJson.trim() !== '') {
		const h = parseJsonObject(headerJson, 'Header');
		if (!h.ok) return h as ToolResult;
		extra = h.value;
		if ('alg' in extra && extra.alg !== alg) {
			return err(`Header says alg "${String(extra.alg)}" but ${alg} is selected — remove alg from the header or pick ${String(extra.alg)}`);
		}
	}
	const keyRes = await resolveKeys(alg, keyMaterial, 'sign');
	if (!keyRes.ok) return keyRes as ToolResult;
	const { key, kid } = keyRes.value[0];
	const header: Record<string, unknown> = { alg, typ: 'JWT', ...extra };
	header.alg = alg;
	if (kid !== undefined && !('kid' in header)) header.kid = kid;
	const signingInput = b64urlEncodeJson(header) + '.' + b64urlEncodeJson(payload.value);
	try {
		const sig = await globalThis.crypto.subtle.sign(signParams(alg), key, new TextEncoder().encode(signingInput));
		return ok(signingInput + '.' + b64urlEncodeBytes(new Uint8Array(sig)));
	} catch (e) {
		return err('Signing failed — ' + (e instanceof Error ? e.message : String(e)));
	}
}

/**
 * Set `iat` to `now` and, if given, `exp` to `iat + expiresInSeconds` in a
 * payload, keeping every other claim. Used by the quick-claim buttons.
 */
export function stampTimeClaims(payloadJson: string, now: number, expiresInSeconds: number | null): ToolResult {
	const source = payloadJson.trim() === '' ? '{}' : payloadJson;
	const parsed = parseJsonObject(source, 'Payload');
	if (!parsed.ok) return parsed as ToolResult;
	const iat = Math.floor(now / 1000);
	const next: Record<string, unknown> = { ...parsed.value, iat };
	if (expiresInSeconds !== null) next.exp = iat + expiresInSeconds;
	return ok(JSON.stringify(next, null, 2));
}

export type RandomFill = (bytes: Uint8Array) => void;

const defaultFill: RandomFill = (b) => {
	globalThis.crypto.getRandomValues(b);
};

/**
 * A random HMAC secret: as many bytes as the hash output (RFC 7518 §3.2 asks
 * for at least that much), Base64URL-encoded so it pastes cleanly into config.
 */
export function generateSecret(alg: JwtAlg, fill: RandomFill = defaultFill): string {
	const bytes = new Uint8Array(isHmacAlg(alg) ? Number(HASH_FOR[alg].slice(4)) / 8 : 32);
	fill(bytes);
	return b64urlEncodeBytes(bytes);
}

export interface GeneratedKeyPair {
	privatePem: string;
	publicPem: string;
	/** The public key as a JWK, with `alg` and `use` set, ready for a JWKS. */
	publicJwk: string;
}

/** Generate a throwaway key pair for an asymmetric algorithm, as PEM and JWK. */
export async function generateKeyPair(alg: JwtAlg): Promise<ToolResult<GeneratedKeyPair>> {
	const subtle = globalThis.crypto?.subtle;
	if (!subtle) return err('WebCrypto is unavailable in this environment');
	if (isHmacAlg(alg)) return err(`${alg} uses a shared secret, not a key pair`);
	const family = algFamily(alg);
	const params =
		family === 'RS' || family === 'PS'
			? { ...importParams(alg), modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]) }
			: importParams(alg);
	try {
		const pair = (await subtle.generateKey(params, true, ['sign', 'verify'])) as CryptoKeyPair;
		const [pkcs8, spki, jwk] = await Promise.all([
			subtle.exportKey('pkcs8', pair.privateKey),
			subtle.exportKey('spki', pair.publicKey),
			subtle.exportKey('jwk', pair.publicKey)
		]);
		const { key_ops: _ops, ext: _ext, ...pub } = jwk;
		return ok({
			privatePem: bytesToPem(pkcs8, 'PRIVATE KEY'),
			publicPem: bytesToPem(spki, 'PUBLIC KEY'),
			publicJwk: JSON.stringify({ ...pub, alg, use: 'sig' }, null, 2)
		});
	} catch (e) {
		const msg = e instanceof Error ? e.message : String(e);
		return err(`This browser can't generate ${alg} keys — ${msg}`);
	}
}

/* ---------- verify ---------- */

export type ClaimStatus = 'ok' | 'expired' | 'not-yet-valid';

export interface VerifyOutcome {
	valid: boolean;
	alg: string;
	detail: string;
	/** The `kid` of the JWK that verified the token, when a JWK/JWKS was used. */
	kid?: string;
	/** exp / nbf checked against the clock; null when the token has neither. */
	time: { status: ClaimStatus; message: string } | null;
}

function checkTime(payload: Record<string, unknown> | null, now: number, leewaySec: number): VerifyOutcome['time'] {
	if (!payload) return null;
	const nowSec = now / 1000;
	const iso = (s: number) => new Date(s * 1000).toISOString().replace('.000Z', 'Z');
	const { exp, nbf } = payload;
	if (typeof exp === 'number' && Number.isFinite(exp) && nowSec > exp + leewaySec) {
		return { status: 'expired', message: `exp: expired at ${iso(exp)}` };
	}
	if (typeof nbf === 'number' && Number.isFinite(nbf) && nowSec < nbf - leewaySec) {
		return { status: 'not-yet-valid', message: `nbf: not valid until ${iso(nbf)}` };
	}
	if (typeof exp === 'number' && Number.isFinite(exp)) {
		return { status: 'ok', message: `exp: valid until ${iso(exp)}` };
	}
	if (typeof nbf === 'number' && Number.isFinite(nbf)) {
		return { status: 'ok', message: `nbf: valid since ${iso(nbf)}` };
	}
	return null;
}

/**
 * Verify a JWT signature with a shared secret (HS), a public key PEM, a JWK or
 * a JWKS (RS/PS/ES/EdDSA), and check exp/nbf against `now`. A good signature
 * on an expired token is still reported as a valid signature — the time check
 * is separate, the way server libraries report it.
 */
export async function verifyJwt(
	token: string,
	keyMaterial: string,
	now: number = Date.now(),
	leewaySec = 0
): Promise<ToolResult<VerifyOutcome>> {
	const t = token.trim().replace(/^Bearer\s+/i, '');
	const parts = t.split('.');
	if (parts.length !== 3) return err(`A JWT has 3 dot-separated segments; found ${parts.length}`);
	const header = decodeSegment(parts[0]);
	if (!header) return err('Header segment is not valid Base64URL-encoded JSON');
	const time = checkTime(decodeSegment(parts[1]), now, leewaySec);
	const alg = String(header.alg ?? '');
	if (alg.toLowerCase() === 'none') {
		return ok({ valid: false, alg, time, detail: 'alg is "none" — the token is unsigned and must be rejected' });
	}
	if (!SIGN_ALGS.includes(alg as JwtAlg)) {
		return err(`Algorithm ${alg || '(missing)'} is not supported here — supported: ${SIGN_ALGS.join(', ')}`);
	}
	if (isHmacAlg(alg as JwtAlg)) {
		const asJwk = parseJwks(keyMaterial);
		const looksAsymmetric =
			/-----BEGIN [A-Z ]*KEY-----/.test(keyMaterial) ||
			(asJwk?.ok === true && asJwk.value.every((k) => k.kty !== 'oct'));
		if (looksAsymmetric) {
			return err(
				`This token says ${alg}, which is verified with the shared secret. Accepting a public key here is the classic "algorithm confusion" bug — paste the secret instead.`
			);
		}
	}
	const kid = typeof header.kid === 'string' ? header.kid : undefined;
	const keyRes = await resolveKeys(alg as JwtAlg, keyMaterial, 'verify', kid);
	if (!keyRes.ok) return keyRes as ToolResult<VerifyOutcome>;
	let sig: Uint8Array;
	try {
		sig = b64urlDecodeBytes(parts[2]);
	} catch {
		return err('Signature segment is not valid Base64URL');
	}
	const data = new TextEncoder().encode(parts[0] + '.' + parts[1]);
	try {
		for (const candidate of keyRes.value) {
			const valid = await globalThis.crypto.subtle.verify(
				signParams(alg as JwtAlg),
				candidate.key,
				sig.buffer as ArrayBuffer,
				data
			);
			if (valid) {
				const which = candidate.kid !== undefined ? ` (kid "${candidate.kid}")` : '';
				return ok({ valid: true, alg, kid: candidate.kid, time, detail: `Signature is valid for the supplied key${which}` });
			}
		}
		const tried = keyRes.value.length > 1 ? ` (tried ${keyRes.value.length} keys)` : '';
		return ok({ valid: false, alg, time, detail: `Signature does NOT match the supplied key${tried}` });
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
