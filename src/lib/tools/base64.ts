import { type ToolResult, ok, err } from './types';

function bytesToBase64(bytes: Uint8Array): string {
	let binary = '';
	const chunk = 0x8000;
	for (let i = 0; i < bytes.length; i += chunk) {
		binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
	}
	return btoa(binary);
}

function base64ToBytes(b64: string): Uint8Array {
	const binary = atob(b64);
	const bytes = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
	return bytes;
}

export function encodeBase64(input: string, urlSafe = false): ToolResult {
	const b64 = bytesToBase64(new TextEncoder().encode(input));
	return ok(urlSafe ? b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '') : b64);
}

/** Normalize URL-safe alphabet and missing padding before decoding. */
export function normalizeBase64(input: string): string {
	let s = input.trim().replace(/\s+/g, '').replace(/-/g, '+').replace(/_/g, '/');
	const pad = s.length % 4;
	if (pad === 2) s += '==';
	else if (pad === 3) s += '=';
	return s;
}

export function decodeBase64(input: string): ToolResult {
	const normalized = normalizeBase64(input);
	if (normalized === '') return err('Input is empty');
	if (!/^[A-Za-z0-9+/]*={0,2}$/.test(normalized) || normalized.length % 4 === 1) {
		return err('Not valid Base64: contains characters outside the Base64 alphabet');
	}
	let bytes: Uint8Array;
	try {
		bytes = base64ToBytes(normalized);
	} catch {
		return err('Not valid Base64');
	}
	try {
		return ok(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
	} catch {
		return err('Decoded bytes are not valid UTF-8 text (this may be binary data)');
	}
}

/** True when the input looks like Base64 and decodes to printable UTF-8. */
export function isLikelyBase64Text(input: string): boolean {
	const s = input.trim();
	if (s.length < 8 || /\s/.test(s)) return false;
	if (!/^[A-Za-z0-9+/=_-]+$/.test(s)) return false;
	const decoded = decodeBase64(s);
	if (!decoded.ok) return false;
	// Reject results that are mostly control characters.
	const printable = decoded.value.replace(/[\p{C}]/gu, '');
	return printable.length / decoded.value.length > 0.9;
}
