import { type ToolResult, ok, err } from './types';

export type RandomFn = (bytes: Uint8Array) => Uint8Array;

const defaultRandom: RandomFn = (bytes) => {
	crypto.getRandomValues(bytes);
	return bytes;
};

/** RFC 4122 v4 UUID. Random source injectable for deterministic tests. */
export function uuidV4(random: RandomFn = defaultRandom): string {
	const bytes = random(new Uint8Array(16));
	bytes[6] = (bytes[6] & 0x0f) | 0x40;
	bytes[8] = (bytes[8] & 0x3f) | 0x80;
	const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
	return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

/** UUID v7: unix-ms timestamp + random. Time and randomness injectable for tests. */
export function uuidV7(timeMs?: number, random: RandomFn = defaultRandom): string {
	const t = timeMs ?? Date.now();
	const bytes = random(new Uint8Array(16));
	bytes[0] = (t / 2 ** 40) & 0xff;
	bytes[1] = (t / 2 ** 32) & 0xff;
	bytes[2] = (t / 2 ** 24) & 0xff;
	bytes[3] = (t / 2 ** 16) & 0xff;
	bytes[4] = (t / 2 ** 8) & 0xff;
	bytes[5] = t & 0xff;
	bytes[6] = (bytes[6] & 0x0f) | 0x70;
	bytes[8] = (bytes[8] & 0x3f) | 0x80;
	const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
	return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

const CROCKFORD = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

/** ULID. Time and randomness injectable for tests. */
export function ulid(timeMs?: number, random: RandomFn = defaultRandom): string {
	let t = timeMs ?? Date.now();
	let time = '';
	for (let i = 0; i < 10; i++) {
		time = CROCKFORD[t % 32] + time;
		t = Math.floor(t / 32);
	}
	const bytes = random(new Uint8Array(10));
	let rand = '';
	// 80 random bits → 16 base32 chars
	let buffer = 0;
	let bits = 0;
	for (const byte of bytes) {
		buffer = (buffer << 8) | byte;
		bits += 8;
		while (bits >= 5) {
			rand += CROCKFORD[(buffer >>> (bits - 5)) & 31];
			bits -= 5;
		}
	}
	return time + rand;
}

const NANO_ALPHABET = 'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict';

export function nanoid(size = 21, random: RandomFn = defaultRandom): string {
	const bytes = random(new Uint8Array(size));
	let id = '';
	for (let i = 0; i < size; i++) id += NANO_ALPHABET[bytes[i] & 63];
	return id;
}

export interface UuidBatchOptions {
	kind: 'uuid-v4' | 'uuid-v7' | 'ulid' | 'nanoid';
	count: number;
	uppercase?: boolean;
}

export function generateIds(options: UuidBatchOptions, random: RandomFn = defaultRandom, timeMs?: number): ToolResult<string[]> {
	const count = Math.floor(options.count);
	if (!Number.isFinite(count) || count < 1 || count > 1000) {
		return err('Count must be between 1 and 1000');
	}
	const out: string[] = [];
	for (let i = 0; i < count; i++) {
		let id: string;
		switch (options.kind) {
			case 'uuid-v4':
				id = uuidV4(random);
				break;
			case 'uuid-v7':
				id = uuidV7(timeMs, random);
				break;
			case 'ulid':
				id = ulid(timeMs, random);
				break;
			case 'nanoid':
				id = nanoid(21, random);
				break;
		}
		out.push(options.uppercase ? id.toUpperCase() : id);
	}
	return ok(out);
}

export function isUuid(input: string): boolean {
	return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
		input.trim()
	);
}
