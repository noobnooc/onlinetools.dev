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

export function isLikelyJwt(input: string): boolean {
	const token = input.trim().replace(/^Bearer\s+/i, '');
	if (!/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]*$/.test(token)) return false;
	const header = decodeSegment(token.split('.')[0]);
	return header !== null && ('alg' in header || 'typ' in header);
}
