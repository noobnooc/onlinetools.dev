import { type ToolResult, ok, err } from './types';
import jsQR from 'jsqr';

/** What the decoded payload looks like, best guess from well-known prefixes. */
export type QrPayloadKind =
	| 'url'
	| 'wifi'
	| 'vcard'
	| 'mecard'
	| 'email'
	| 'tel'
	| 'sms'
	| 'geo'
	| 'otp'
	| 'event'
	| 'text';

export interface WifiConfig {
	ssid: string;
	password: string;
	/** WPA, WEP, nopass or whatever the T field says. */
	security: string;
	hidden: boolean;
}

export interface DecodedQr {
	text: string;
	kind: QrPayloadKind;
	/** QR symbol version 1–40; modules per side = version × 4 + 17. */
	version: number;
	moduleCount: number;
	/** Parsed fields when the payload is a WIFI: config. */
	wifi?: WifiConfig;
}

export function classifyQrPayload(text: string): QrPayloadKind {
	const t = text.trim();
	if (/^WIFI:/i.test(t)) return 'wifi';
	if (/^BEGIN:VCARD/i.test(t)) return 'vcard';
	if (/^MECARD:/i.test(t)) return 'mecard';
	if (/^(mailto:|MATMSG:)/i.test(t)) return 'email';
	if (/^tel:/i.test(t)) return 'tel';
	if (/^sms(to)?:/i.test(t)) return 'sms';
	if (/^geo:/i.test(t)) return 'geo';
	if (/^otpauth:\/\//i.test(t)) return 'otp';
	if (/^BEGIN:(VCALENDAR|VEVENT)/i.test(t)) return 'event';
	if (/^https?:\/\/\S+$/i.test(t)) return 'url';
	return 'text';
}

/** Undo WIFI:-syntax backslash escaping (\; \, \: \" \\). */
function unescapeWifi(value: string): string {
	return value.replace(/\\(.)/g, '$1');
}

/**
 * Parse a WIFI:T:WPA;S:name;P:secret;H:true;; payload (the format Android
 * and iOS generate). Returns null when the payload isn't one.
 */
export function parseWifiPayload(text: string): WifiConfig | null {
	const t = text.trim();
	if (!/^WIFI:/i.test(t)) return null;
	const body = t.slice(5);
	const fields = new Map<string, string>();
	// Split on ; but honor backslash escapes inside values.
	let key = '';
	let value = '';
	let inValue = false;
	for (let i = 0; i < body.length; i++) {
		const ch = body[i];
		if (ch === '\\' && i + 1 < body.length) {
			(inValue ? (value += ch + body[i + 1]) : (key += ch + body[i + 1]));
			i++;
		} else if (!inValue && ch === ':') {
			inValue = true;
		} else if (ch === ';') {
			if (key !== '') fields.set(key.toUpperCase(), unescapeWifi(value));
			key = '';
			value = '';
			inValue = false;
		} else {
			inValue ? (value += ch) : (key += ch);
		}
	}
	if (key !== '') fields.set(key.toUpperCase(), unescapeWifi(value));
	const ssid = fields.get('S') ?? '';
	if (ssid === '') return null;
	return {
		ssid,
		password: fields.get('P') ?? '',
		security: fields.get('T') ?? 'nopass',
		hidden: (fields.get('H') ?? '').toLowerCase() === 'true'
	};
}

/**
 * Decode a QR code from raw RGBA pixels. Tries both normal and inverted
 * (light-on-dark) codes. Multi-byte text is re-decoded from the raw byte
 * stream as UTF-8 so CJK and emoji survive even when the encoder didn't
 * set an ECI header.
 */
export function decodeQr(
	data: Uint8ClampedArray,
	width: number,
	height: number
): ToolResult<DecodedQr> {
	if (width <= 0 || height <= 0) return err('empty');
	const code = jsQR(data, width, height, { inversionAttempts: 'attemptBoth' });
	if (!code || (code.data === '' && code.binaryData.length === 0)) return err('notFound');
	let text = code.data;
	if (code.binaryData.length > 0) {
		try {
			text = new TextDecoder('utf-8', { fatal: true }).decode(new Uint8Array(code.binaryData));
		} catch {
			// Not valid UTF-8 — keep jsQR's own interpretation.
		}
	}
	const kind = classifyQrPayload(text);
	return ok({
		text,
		kind,
		version: code.version,
		moduleCount: code.version * 4 + 17,
		wifi: kind === 'wifi' ? (parseWifiPayload(text) ?? undefined) : undefined
	});
}
