import { describe, expect, it } from 'vitest';
import { bcryptHash, bcryptVerify, bcryptInfo } from './bcrypt';

// Cost 4 everywhere — this is correctness testing, not benchmarking.
describe('bcryptHash', () => {
	it('produces a structurally valid 60-char hash', async () => {
		const r = await bcryptHash('s3cret', 4);
		expect(r.ok).toBe(true);
		if (r.ok) {
			expect(r.value.hash).toHaveLength(60);
			expect(r.value.hash).toMatch(/^\$2[abxy]\$04\$/);
			expect(r.value.rounds).toBe(4);
			expect(r.value.ms).toBeGreaterThanOrEqual(0);
		}
	}, 20000);
	it('salts: same password twice gives different hashes', async () => {
		const a = await bcryptHash('same', 4);
		const b = await bcryptHash('same', 4);
		expect(a.ok && b.ok && a.value.hash !== b.value.hash).toBe(true);
	}, 20000);
	it('handles unicode passwords', async () => {
		const r = await bcryptHash('пароль密码🔒', 4);
		expect(r.ok).toBe(true);
		if (r.ok) {
			const v = await bcryptVerify('пароль密码🔒', r.value.hash);
			expect(v.ok && v.value).toBe(true);
		}
	}, 20000);
	it('rejects empty passwords and out-of-range cost', async () => {
		expect((await bcryptHash('', 10)).ok).toBe(false);
		expect((await bcryptHash('x', 3)).ok).toBe(false);
		expect((await bcryptHash('x', 16)).ok).toBe(false);
	});
});

describe('bcryptVerify', () => {
	it('accepts the right password and rejects the wrong one', async () => {
		const h = await bcryptHash('correct horse', 4);
		expect(h.ok).toBe(true);
		if (h.ok) {
			const good = await bcryptVerify('correct horse', h.value.hash);
			expect(good.ok && good.value).toBe(true);
			const bad = await bcryptVerify('battery staple', h.value.hash);
			expect(bad.ok && bad.value).toBe(false);
		}
	}, 20000);
	it('tolerates surrounding whitespace on the hash', async () => {
		const h = await bcryptHash('x', 4);
		if (h.ok) {
			const v = await bcryptVerify('x', `  ${h.value.hash}  `);
			expect(v.ok && v.value).toBe(true);
		}
	}, 20000);
	it('rejects malformed hashes with a message, not a crash', async () => {
		for (const bad of ['not-a-hash', '$2b$10$tooshort', '$9z$10$' + 'a'.repeat(53), '']) {
			const r = await bcryptVerify('x', bad);
			expect(r.ok).toBe(false);
		}
	});
});

describe('bcryptInfo', () => {
	it('splits version, cost and salt from a hash', async () => {
		const h = await bcryptHash('x', 5);
		expect(h.ok).toBe(true);
		if (h.ok) {
			const info = bcryptInfo(h.value.hash);
			expect(info.ok).toBe(true);
			if (info.ok) {
				expect(info.value.version).toMatch(/^2[abxy]$/);
				expect(info.value.rounds).toBe(5);
				expect(info.value.salt).toHaveLength(22);
			}
		}
	}, 20000);
	it('parses well-known $2a$ hashes', () => {
		const r = bcryptInfo('$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy');
		expect(r.ok && r.value.version).toBe('2a');
		expect(r.ok && r.value.rounds).toBe(10);
	});
	it('rejects non-bcrypt strings', () => {
		expect(bcryptInfo('sha256:abcdef').ok).toBe(false);
	});
});
