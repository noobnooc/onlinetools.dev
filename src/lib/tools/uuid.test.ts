import { describe, expect, it } from 'vitest';
import { uuidV4, uuidV7, ulid, nanoid, generateIds, isUuid, type RandomFn } from './uuid';

const seq = (...vals: number[]): RandomFn => {
	return (bytes) => {
		for (let i = 0; i < bytes.length; i++) bytes[i] = vals[i % vals.length];
		return bytes;
	};
};

describe('uuidV4', () => {
	it('sets version and variant bits over zeroed randomness', () => {
		expect(uuidV4(seq(0))).toBe('00000000-0000-4000-8000-000000000000');
	});
	it('sets version and variant bits over saturated randomness', () => {
		const id = uuidV4(seq(0xff));
		expect(id[14]).toBe('4'); // version nibble
		expect(['8', '9', 'a', 'b']).toContain(id[19]); // variant nibble
	});
	it('produces canonical shape with real randomness', () => {
		const id = uuidV4();
		expect(isUuid(id)).toBe(true);
		expect(id).toHaveLength(36);
	});
	it('does not repeat (sanity over 1000 draws)', () => {
		const seen = new Set(Array.from({ length: 1000 }, () => uuidV4()));
		expect(seen.size).toBe(1000);
	});
});

describe('uuidV7', () => {
	it('encodes the millisecond timestamp in the first 48 bits', () => {
		const id = uuidV7(0x0123456789ab, seq(0xff));
		expect(id.startsWith('01234567-89ab-7')).toBe(true);
	});
	it('timestamp round-trips out of the hex', () => {
		const t = 1700000000000;
		const id = uuidV7(t, seq(0));
		const decoded = parseInt(id.replace(/-/g, '').slice(0, 12), 16);
		expect(decoded).toBe(t);
	});
	it('sorts by generation time', () => {
		const a = uuidV7(1000, seq(0xff));
		const b = uuidV7(2000, seq(0x00));
		expect(a < b).toBe(true);
	});
	it('is a valid RFC UUID', () => {
		expect(isUuid(uuidV7())).toBe(true);
	});
});

describe('ulid', () => {
	it('matches the spec example time encoding (verified independently)', () => {
		// 1469922850259 ms encodes to "01ARZ3NDEK" — cross-checked with a
		// separate BigInt base32 implementation.
		expect(ulid(1469922850259, seq(0)).slice(0, 10)).toBe('01ARZ3NDEK');
	});
	it('is 26 chars of Crockford base32', () => {
		const id = ulid();
		expect(id).toHaveLength(26);
		expect(/^[0-9A-HJKMNP-TV-Z]{26}$/.test(id)).toBe(true);
	});
	it('epoch zero encodes to all-zero time part', () => {
		expect(ulid(0, seq(0))).toBe('0'.repeat(26));
	});
	it('sorts lexicographically by time', () => {
		expect(ulid(1000, seq(0xff)) < ulid(2000, seq(0))).toBe(true);
	});
});

describe('nanoid', () => {
	it('honors requested length', () => {
		expect(nanoid(21, seq(1, 2, 3))).toHaveLength(21);
		expect(nanoid(8, seq(9))).toHaveLength(8);
	});
	it('only uses url-safe characters', () => {
		expect(/^[A-Za-z0-9_-]+$/.test(nanoid())).toBe(true);
	});
});

describe('generateIds', () => {
	it('generates the requested count of each kind', () => {
		for (const kind of ['uuid-v4', 'uuid-v7', 'ulid', 'nanoid'] as const) {
			const r = generateIds({ kind, count: 5 });
			expect(r.ok).toBe(true);
			if (r.ok) expect(r.value).toHaveLength(5);
		}
	});
	it('applies uppercase', () => {
		const r = generateIds({ kind: 'uuid-v4', count: 1, uppercase: true }, seq(0xab));
		expect(r.ok && r.value[0]).toBe(r.ok ? r.value[0].toUpperCase() : '');
	});
	it('rejects counts outside 1..1000', () => {
		expect(generateIds({ kind: 'uuid-v4', count: 0 }).ok).toBe(false);
		expect(generateIds({ kind: 'uuid-v4', count: 1001 }).ok).toBe(false);
		expect(generateIds({ kind: 'uuid-v4', count: NaN }).ok).toBe(false);
	});
});

describe('isUuid', () => {
	it('accepts v1–v8 with correct variant', () => {
		expect(isUuid('123e4567-e89b-42d3-a456-426614174000')).toBe(true);
		expect(isUuid('017F22E2-79B0-7CC3-98C4-DC0C0C07398F')).toBe(true); // v7, uppercase
	});
	it('rejects malformed candidates', () => {
		expect(isUuid('123e4567e89b42d3a456426614174000')).toBe(false); // no dashes
		expect(isUuid('123e4567-e89b-92d3-a456-426614174000')).toBe(false); // version 9
		expect(isUuid('123e4567-e89b-42d3-c456-426614174000')).toBe(false); // bad variant
		expect(isUuid('not-a-uuid')).toBe(false);
	});
});
