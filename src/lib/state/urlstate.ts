/**
 * State-as-URL: tool input and options serialize into the location hash so any
 * tool state can be shared by copying the address. Content is base64url-encoded
 * in the fragment (never sent to the server). Long inputs are refused with a
 * hint instead of producing multi-hundred-KB URLs.
 */

export const MAX_SHARED_INPUT = 16_000;

export function encodeState(obj: Record<string, string>): string {
	const json = JSON.stringify(obj);
	const bytes = new TextEncoder().encode(json);
	let binary = '';
	for (const b of bytes) binary += String.fromCharCode(b);
	return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function decodeState(hash: string): Record<string, string> | null {
	if (!hash) return null;
	const raw = hash.startsWith('#s=') ? hash.slice(3) : hash.startsWith('s=') ? hash.slice(2) : null;
	if (!raw) return null;
	try {
		let b64 = raw.replace(/-/g, '+').replace(/_/g, '/');
		const pad = b64.length % 4;
		if (pad === 2) b64 += '==';
		else if (pad === 3) b64 += '=';
		const binary = atob(b64);
		const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
		const parsed = JSON.parse(new TextDecoder().decode(bytes));
		if (parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed)) {
			const out: Record<string, string> = {};
			for (const [k, v] of Object.entries(parsed)) {
				if (typeof v === 'string') out[k] = v;
			}
			return out;
		}
		return null;
	} catch {
		return null;
	}
}

/** Build a shareable URL for the current tool state, or null if too large. */
export function shareUrl(base: string, state: Record<string, string>): string | null {
	const total = Object.values(state).reduce((n, v) => n + v.length, 0);
	if (total > MAX_SHARED_INPUT) return null;
	return `${base}#s=${encodeState(state)}`;
}
