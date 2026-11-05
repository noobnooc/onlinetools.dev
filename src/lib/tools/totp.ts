import { type ToolResult, ok, err } from './types';

/**
 * TOTP (RFC 6238) and HOTP (RFC 4226) one-time codes, computed with WebCrypto
 * HMAC. Input is either a bare Base32 secret or an `otpauth://` URI in the
 * Key Uri Format that authenticator apps read from 2FA QR codes.
 */

export type OtpAlgorithm = 'SHA-1' | 'SHA-256' | 'SHA-512';
export type OtpType = 'totp' | 'hotp';
export type OtpWarning = 'shortSecret' | 'nonDefault';

export const OTP_ALGORITHMS: OtpAlgorithm[] = ['SHA-1', 'SHA-256', 'SHA-512'];
export const OTP_DIGITS = [6, 7, 8] as const;

export interface OtpParams {
	type: OtpType;
	/** Canonical Base32: uppercase, no padding, no spaces. */
	secret: string;
	algorithm: OtpAlgorithm;
	digits: number;
	/** TOTP step in seconds. */
	period: number;
	/** HOTP moving factor. */
	counter: number;
	issuer: string;
	account: string;
}

export interface ParsedOtp {
	params: OtpParams;
	/** 'uri' when the input was an otpauth:// URI (its parameters win over options). */
	source: 'uri' | 'secret';
	bytes: Uint8Array;
	warnings: OtpWarning[];
}

export const DEFAULT_OPTIONS = { algorithm: 'SHA-1' as OtpAlgorithm, digits: 6, period: 30 };

const B32 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

/** Base32 (RFC 4648) without padding, the form authenticator apps show. */
export function encodeBase32(bytes: Uint8Array): string {
	let out = '';
	let buf = 0;
	let bits = 0;
	for (const b of bytes) {
		buf = (buf << 8) | b;
		bits += 8;
		while (bits >= 5) {
			out += B32[(buf >>> (bits - 5)) & 31];
			bits -= 5;
		}
	}
	if (bits > 0) out += B32[(buf << (5 - bits)) & 31];
	return out;
}

/**
 * Lenient on purpose: sites print secrets in groups ("JBSW Y3DP …"), in
 * lowercase, and with or without '=' padding. Anything else is an error that
 * points at the offending character.
 */
export function decodeBase32(input: string): ToolResult<Uint8Array> {
	const out: number[] = [];
	let buf = 0;
	let bits = 0;
	let seenPad = false;
	for (let i = 0; i < input.length; i++) {
		const ch = input[i];
		if (ch === ' ' || ch === '-' || ch === '\t') continue;
		if (ch === '=') {
			seenPad = true;
			continue;
		}
		const v = B32.indexOf(ch.toUpperCase());
		if (v === -1) {
			const hint = /[0189]/.test(ch) ? ` — Base32 has no ${ch}; did you mean ${ch === '0' ? 'O' : ch === '1' ? 'I or L' : ch === '8' ? 'B' : 'a letter'}?` : '';
			return err(`"${ch}" is not a Base32 character${hint}`, 1, i + 1);
		}
		if (seenPad) return err('Base32 padding (=) can only appear at the end', 1, i + 1);
		buf = ((buf << 5) | v) & 0xffff;
		bits += 5;
		if (bits >= 8) {
			out.push((buf >>> (bits - 8)) & 0xff);
			bits -= 8;
		}
	}
	if (out.length === 0) return err('The secret is empty');
	return ok(new Uint8Array(out));
}

function algorithmFrom(name: string): OtpAlgorithm | null {
	const n = name.toUpperCase().replace(/[^A-Z0-9]/g, '');
	if (n === 'SHA1') return 'SHA-1';
	if (n === 'SHA256') return 'SHA-256';
	if (n === 'SHA512') return 'SHA-512';
	return null;
}

function finish(params: OtpParams, source: ParsedOtp['source']): ToolResult<ParsedOtp> {
	const decoded = decodeBase32(params.secret);
	if (!decoded.ok) return decoded;
	const bytes = decoded.value;
	params.secret = encodeBase32(bytes);
	const warnings: OtpWarning[] = [];
	// RFC 4226 §4: at least 128 bits, 160 recommended.
	if (bytes.length < 16) warnings.push('shortSecret');
	if (
		params.algorithm !== DEFAULT_OPTIONS.algorithm ||
		params.digits !== DEFAULT_OPTIONS.digits ||
		(params.type === 'totp' && params.period !== DEFAULT_OPTIONS.period)
	)
		warnings.push('nonDefault');
	return ok({ params, source, bytes, warnings });
}

export interface SecretOptions {
	type?: OtpType;
	algorithm?: OtpAlgorithm;
	digits?: number;
	period?: number;
	counter?: number;
}

/**
 * Parse an otpauth:// URI or a bare Base32 secret. For a bare secret the
 * options supply what a URI would carry.
 */
export function parseOtpInput(input: string, opts: SecretOptions = {}): ToolResult<ParsedOtp> {
	const s = input.trim();
	if (!s) return err('Paste a Base32 secret or an otpauth:// URI');
	if (/^otpauth-migration:/i.test(s)) {
		return err('This is a Google Authenticator export (otpauth-migration://), not a single account. Export one account at a time, or decode the export QR to see its contents.');
	}
	if (/^otpauth:/i.test(s)) return parseOtpauthUri(s);
	const digits = opts.digits ?? DEFAULT_OPTIONS.digits;
	const period = opts.period ?? DEFAULT_OPTIONS.period;
	if (!(OTP_DIGITS as readonly number[]).includes(digits)) return err('Digits must be 6, 7 or 8');
	if (!Number.isInteger(period) || period < 1 || period > 86400) return err('Period must be a whole number of seconds (1–86400)');
	return finish(
		{
			type: opts.type ?? 'totp',
			secret: s,
			algorithm: opts.algorithm ?? DEFAULT_OPTIONS.algorithm,
			digits,
			period,
			counter: opts.counter ?? 0,
			issuer: '',
			account: ''
		},
		'secret'
	);
}

function parseOtpauthUri(s: string): ToolResult<ParsedOtp> {
	let url: URL;
	try {
		url = new URL(s);
	} catch {
		return err('This otpauth:// URI is malformed');
	}
	const type = url.hostname.toLowerCase();
	if (type !== 'totp' && type !== 'hotp') {
		return err(`Unknown OTP type "${url.hostname}" — expected otpauth://totp/… or otpauth://hotp/…`);
	}
	const q = url.searchParams;
	const secret = q.get('secret');
	if (!secret) return err('The URI has no secret= parameter');

	let label = '';
	try {
		label = decodeURIComponent(url.pathname.replace(/^\//, ''));
	} catch {
		label = url.pathname.replace(/^\//, '');
	}
	const colon = label.indexOf(':');
	const labelIssuer = colon >= 0 ? label.slice(0, colon).trim() : '';
	const account = (colon >= 0 ? label.slice(colon + 1) : label).trim();

	const algParam = q.get('algorithm');
	const algorithm = algParam ? algorithmFrom(algParam) : DEFAULT_OPTIONS.algorithm;
	if (!algorithm) return err(`Unsupported algorithm "${algParam}" — use SHA1, SHA256 or SHA512`);

	const digitsParam = q.get('digits');
	const digits = digitsParam ? Number(digitsParam) : DEFAULT_OPTIONS.digits;
	if (!(OTP_DIGITS as readonly number[]).includes(digits)) return err(`digits=${digitsParam} is not supported — use 6, 7 or 8`);

	const periodParam = q.get('period');
	const period = periodParam ? Number(periodParam) : DEFAULT_OPTIONS.period;
	if (!Number.isInteger(period) || period < 1 || period > 86400) return err(`period=${periodParam} must be a whole number of seconds`);

	const counterParam = q.get('counter');
	const counter = counterParam ? Number(counterParam) : 0;
	if (type === 'hotp' && counterParam === null) return err('A HOTP URI needs a counter= parameter');
	if (!Number.isSafeInteger(counter) || counter < 0) return err(`counter=${counterParam} must be a non-negative integer`);

	return finish(
		{
			type,
			secret,
			algorithm,
			digits,
			period,
			counter,
			// The issuer parameter wins over the label prefix (Key Uri Format).
			issuer: q.get('issuer')?.trim() || labelIssuer,
			account
		},
		'uri'
	);
}

/** Build the otpauth:// URI apps scan; default parameters are left out, as most issuers do. */
export function buildOtpauthUri(p: OtpParams): string {
	const label = p.issuer ? `${encodeURIComponent(p.issuer)}:${encodeURIComponent(p.account)}` : encodeURIComponent(p.account);
	const q: string[] = [`secret=${p.secret}`];
	if (p.issuer) q.push(`issuer=${encodeURIComponent(p.issuer)}`);
	if (p.algorithm !== 'SHA-1') q.push(`algorithm=${p.algorithm.replace('-', '')}`);
	if (p.digits !== 6) q.push(`digits=${p.digits}`);
	if (p.type === 'totp' && p.period !== 30) q.push(`period=${p.period}`);
	if (p.type === 'hotp') q.push(`counter=${p.counter}`);
	return `otpauth://${p.type}/${label}?${q.join('&')}`;
}

export type RandomBytesFn = (n: number) => Uint8Array;
const defaultRandomBytes: RandomBytesFn = (n) => crypto.getRandomValues(new Uint8Array(n));

/** A fresh 160-bit secret (RFC 4226's recommended length), Base32-encoded. */
export function generateSecret(bytes = 20, random: RandomBytesFn = defaultRandomBytes): string {
	return encodeBase32(random(bytes));
}

/** RFC 4226 HOTP: HMAC over the 8-byte big-endian counter, then dynamic truncation. */
export async function hotp(key: Uint8Array, counter: number, algorithm: OtpAlgorithm = 'SHA-1', digits = 6): Promise<string> {
	const msg = new Uint8Array(8);
	new DataView(msg.buffer).setBigUint64(0, BigInt(counter));
	const k = await crypto.subtle.importKey('raw', key as BufferSource, { name: 'HMAC', hash: algorithm }, false, ['sign']);
	const mac = new Uint8Array(await crypto.subtle.sign('HMAC', k, msg));
	const off = mac[mac.length - 1] & 0x0f;
	const bin = ((mac[off] & 0x7f) << 24) | (mac[off + 1] << 16) | (mac[off + 2] << 8) | mac[off + 3];
	return String(bin % 10 ** digits).padStart(digits, '0');
}

/** The TOTP time step for a Unix time in milliseconds. */
export function timeStep(nowMs: number, period: number): number {
	return Math.floor(nowMs / 1000 / period);
}

export function secondsLeft(nowMs: number, period: number): number {
	return period - (Math.floor(nowMs / 1000) % period);
}

export interface OtpWindow {
	/** Steps relative to now (TOTP) or to the stored counter (HOTP). */
	offset: number;
	counter: number;
	code: string;
}

/** Codes for the windows offset −range…+range around now (TOTP) or the counter (HOTP). */
export async function otpWindows(parsed: ParsedOtp, nowMs: number, range = 1): Promise<OtpWindow[]> {
	const { params, bytes } = parsed;
	const base = params.type === 'totp' ? timeStep(nowMs, params.period) : params.counter;
	const out: OtpWindow[] = [];
	// `0 - range` rather than `-range`: with range 0 the latter is -0.
	for (let offset = 0 - range; offset <= range; offset++) {
		const counter = base + offset;
		if (counter < 0) continue;
		out.push({ offset, counter, code: await hotp(bytes, counter, params.algorithm, params.digits) });
	}
	return out;
}

/**
 * Which window a code belongs to, searching outward from now so the nearest
 * match wins. null when it matches nothing within ±range.
 */
export async function findCode(parsed: ParsedOtp, code: string, nowMs: number, range = 10): Promise<number | null> {
	const want = code.replace(/\s/g, '');
	const windows = await otpWindows(parsed, nowMs, range);
	const hits = windows.filter((w) => w.code === want).sort((a, b) => Math.abs(a.offset) - Math.abs(b.offset));
	return hits.length ? hits[0].offset : null;
}

export function isLikelyOtpauth(input: string): boolean {
	return /^otpauth:\/\/(totp|hotp)\/[^\s]*\?[^\s]*secret=/i.test(input.trim());
}
