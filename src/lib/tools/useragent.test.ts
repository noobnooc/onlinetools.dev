import { describe, expect, it } from 'vitest';
import { parseUserAgent } from './useragent';

const CHROME_MAC =
	'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';
const SAFARI_IPHONE =
	'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1';
const FIREFOX_WIN =
	'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:127.0) Gecko/20100101 Firefox/127.0';
const EDGE_WIN =
	'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0';
const CURL = 'curl/8.6.0';

describe('parseUserAgent', () => {
	it('identifies desktop Chrome on macOS', () => {
		const r = parseUserAgent(CHROME_MAC);
		expect(r.ok).toBe(true);
		if (r.ok) {
			expect(r.value.browser.name).toBe('Chrome');
			expect(r.value.browser.version).toMatch(/^126/);
			expect(r.value.engine.name).toBe('Blink');
			expect(r.value.os.name).toMatch(/mac ?os/i);
			expect(r.value.device.type).toBe('desktop');
		}
	});
	it('identifies mobile Safari on iPhone as a mobile device', () => {
		const r = parseUserAgent(SAFARI_IPHONE);
		expect(r.ok).toBe(true);
		if (r.ok) {
			expect(r.value.browser.name).toMatch(/Safari/);
			expect(r.value.os.name).toBe('iOS');
			expect(r.value.device.type).toBe('mobile');
			expect(r.value.device.model).toBe('iPhone');
		}
	});
	it('identifies Firefox and its Gecko engine', () => {
		const r = parseUserAgent(FIREFOX_WIN);
		expect(r.ok && r.value.browser.name).toBe('Firefox');
		expect(r.ok && r.value.engine.name).toBe('Gecko');
		expect(r.ok && r.value.os.name).toBe('Windows');
	});
	it('distinguishes Edge from the Chrome it impersonates', () => {
		const r = parseUserAgent(EDGE_WIN);
		expect(r.ok && r.value.browser.name).toMatch(/Edge/);
	});
	it('recognizes non-browser clients like curl', () => {
		const r = parseUserAgent(CURL);
		// ua-parser-js knows curl as a CLI "browser"; the tool shouldn't error.
		if (r.ok) {
			expect(r.value.browser.name.toLowerCase()).toContain('curl');
		} else {
			expect(r.error).toMatch(/recognized/);
		}
	});
	it('trims surrounding whitespace', () => {
		expect(parseUserAgent(`  ${CHROME_MAC}  `).ok).toBe(true);
	});
	it('rejects empty, oversized and unrecognizable input', () => {
		expect(parseUserAgent('').ok).toBe(false);
		expect(parseUserAgent('x'.repeat(3000)).ok).toBe(false);
		expect(parseUserAgent('hello world this is not a UA').ok).toBe(false);
	});
});
