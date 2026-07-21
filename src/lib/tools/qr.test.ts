import { describe, expect, it } from 'vitest';
import { generateQr } from './qr';

describe('generateQr', () => {
	it('produces a well-formed svg with quiet zone', () => {
		const r = generateQr('https://onlinetools.dev');
		expect(r.ok).toBe(true);
		if (r.ok) {
			expect(r.value.svg).toContain('<svg');
			expect(r.value.svg).toContain('viewBox="0 0');
			const size = r.value.moduleCount + 8; // 4-module quiet zone each side
			expect(r.value.svg).toContain(`viewBox="0 0 ${size} ${size}"`);
		}
	});
	it('matrix dimensions match moduleCount and QR version math', () => {
		const r = generateQr('test');
		expect(r.ok).toBe(true);
		if (r.ok) {
			const n = r.value.moduleCount;
			expect(r.value.matrix).toHaveLength(n);
			expect(r.value.matrix[0]).toHaveLength(n);
			expect((n - 17) % 4).toBe(0); // valid QR versions are 17+4k modules
			expect(n).toBeGreaterThanOrEqual(21);
		}
	});
	it('has finder patterns in three corners', () => {
		const r = generateQr('finder check');
		expect(r.ok).toBe(true);
		if (r.ok) {
			const m = r.value.matrix;
			const n = r.value.moduleCount;
			// Center of each finder pattern is dark.
			expect(m[3][3]).toBe(true);
			expect(m[3][n - 4]).toBe(true);
			expect(m[n - 4][3]).toBe(true);
		}
	});
	it('longer content produces a bigger symbol', () => {
		const short = generateQr('hi');
		const long = generateQr('x'.repeat(500));
		expect(short.ok && long.ok).toBe(true);
		if (short.ok && long.ok) {
			expect(long.value.moduleCount).toBeGreaterThan(short.value.moduleCount);
		}
	});
	it('higher error correction never shrinks the symbol', () => {
		const content = 'https://example.com/some/moderately/long/path?with=params';
		const l = generateQr(content, 'L');
		const h = generateQr(content, 'H');
		expect(l.ok && h.ok).toBe(true);
		if (l.ok && h.ok) expect(h.value.moduleCount).toBeGreaterThanOrEqual(l.value.moduleCount);
	});
	it('encodes unicode content', () => {
		expect(generateQr('こんにちは 🎌').ok).toBe(true);
	});
	it('encodes unicode as UTF-8, not Latin-1 truncation', () => {
		// '中' (U+4E2D) truncated to its low byte would equal '-' (0x2D).
		const zhong = generateQr('中');
		const dash = generateQr('-');
		expect(zhong.ok && dash.ok).toBe(true);
		if (zhong.ok && dash.ok) {
			expect(JSON.stringify(zhong.value.matrix)).not.toBe(JSON.stringify(dash.value.matrix));
		}
	});
	it('rejects empty and oversized input', () => {
		expect(generateQr('').ok).toBe(false);
		expect(generateQr('x'.repeat(3000)).ok).toBe(false);
	});
});
