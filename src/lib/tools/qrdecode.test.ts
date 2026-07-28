import { describe, expect, it } from 'vitest';
import { generateQr } from './qr';
import { classifyQrPayload, decodeQr, parseWifiPayload } from './qrdecode';

/** Rasterize a generator matrix into RGBA pixels the way a screenshot would look. */
function rasterize(content: string, scale = 4, invert = false) {
	const r = generateQr(content);
	if (!r.ok) throw new Error(r.error);
	const { matrix, moduleCount } = r.value;
	const quiet = 4;
	const size = (moduleCount + quiet * 2) * scale;
	const data = new Uint8ClampedArray(size * size * 4);
	for (let y = 0; y < size; y++) {
		for (let x = 0; x < size; x++) {
			const mx = Math.floor(x / scale) - quiet;
			const my = Math.floor(y / scale) - quiet;
			let dark = mx >= 0 && my >= 0 && mx < moduleCount && my < moduleCount && matrix[my][mx];
			if (invert) dark = !dark;
			const v = dark ? 0 : 255;
			const i = (y * size + x) * 4;
			data[i] = data[i + 1] = data[i + 2] = v;
			data[i + 3] = 255;
		}
	}
	return { data, size };
}

function roundTrip(content: string) {
	const { data, size } = rasterize(content);
	return decodeQr(data, size, size);
}

describe('decodeQr', () => {
	it('round-trips ascii content from generated pixels', () => {
		const r = roundTrip('hello world');
		expect(r.ok).toBe(true);
		if (r.ok) expect(r.value.text).toBe('hello world');
	});
	it('round-trips URLs and classifies them', () => {
		const r = roundTrip('https://onlinetools.dev/t/qr-code-decoder');
		expect(r.ok).toBe(true);
		if (r.ok) {
			expect(r.value.text).toBe('https://onlinetools.dev/t/qr-code-decoder');
			expect(r.value.kind).toBe('url');
		}
	});
	it('round-trips CJK and emoji as UTF-8', () => {
		const content = '二维码解码 🎌 test';
		const r = roundTrip(content);
		expect(r.ok).toBe(true);
		if (r.ok) expect(r.value.text).toBe(content);
	});
	it('decodes inverted (light-on-dark) codes', () => {
		const { data, size } = rasterize('inverted', 4, true);
		const r = decodeQr(data, size, size);
		expect(r.ok).toBe(true);
		if (r.ok) expect(r.value.text).toBe('inverted');
	});
	it('reports version and module count consistently', () => {
		const r = roundTrip('x'.repeat(200));
		expect(r.ok).toBe(true);
		if (r.ok) {
			expect(r.value.moduleCount).toBe(r.value.version * 4 + 17);
			expect(r.value.version).toBeGreaterThan(1);
		}
	});
	it('parses WiFi payloads into fields', () => {
		const r = roundTrip('WIFI:T:WPA;S:My Café;P:p\\;a\\:s\\,s;H:true;;');
		expect(r.ok).toBe(true);
		if (r.ok) {
			expect(r.value.kind).toBe('wifi');
			expect(r.value.wifi).toEqual({
				ssid: 'My Café',
				password: 'p;a:s,s',
				security: 'WPA',
				hidden: true
			});
		}
	});
	it('fails cleanly on an image with no QR code', () => {
		const size = 80;
		const data = new Uint8ClampedArray(size * size * 4);
		for (let i = 0; i < data.length; i += 4) {
			data[i] = data[i + 1] = data[i + 2] = (i / 4) % 251;
			data[i + 3] = 255;
		}
		const r = decodeQr(data, size, size);
		expect(r.ok).toBe(false);
	});
	it('rejects empty dimensions', () => {
		expect(decodeQr(new Uint8ClampedArray(0), 0, 0).ok).toBe(false);
	});
});

describe('classifyQrPayload', () => {
	it.each([
		['https://example.com', 'url'],
		['http://example.com/path?q=1', 'url'],
		['WIFI:S:net;;', 'wifi'],
		['BEGIN:VCARD\nVERSION:3.0\nFN:A\nEND:VCARD', 'vcard'],
		['MECARD:N:Doe;;', 'mecard'],
		['mailto:a@b.c', 'email'],
		['MATMSG:TO:a@b.c;;', 'email'],
		['tel:+15551234', 'tel'],
		['sms:+15551234', 'sms'],
		['SMSTO:+15551234:hi', 'sms'],
		['geo:52.5,13.4', 'geo'],
		['otpauth://totp/x?secret=ABC', 'otp'],
		['BEGIN:VEVENT\nSUMMARY:x\nEND:VEVENT', 'event'],
		['just some text', 'text'],
		['https:// not a url', 'text']
	] as const)('%s → %s', (payload, kind) => {
		expect(classifyQrPayload(payload)).toBe(kind);
	});
});

describe('parseWifiPayload', () => {
	it('parses a plain payload with defaults', () => {
		expect(parseWifiPayload('WIFI:S:home;;')).toEqual({
			ssid: 'home',
			password: '',
			security: 'nopass',
			hidden: false
		});
	});
	it('is case-insensitive on the prefix and keys', () => {
		const w = parseWifiPayload('wifi:t:WEP;s:net;p:secret;;');
		expect(w?.security).toBe('WEP');
		expect(w?.password).toBe('secret');
	});
	it('unescapes backslash sequences', () => {
		expect(parseWifiPayload('WIFI:S:a\\\\b\\;c;P:x\\:y;;')?.ssid).toBe('a\\b;c');
	});
	it('returns null for non-wifi or ssid-less payloads', () => {
		expect(parseWifiPayload('hello')).toBeNull();
		expect(parseWifiPayload('WIFI:T:WPA;;')).toBeNull();
	});
});
