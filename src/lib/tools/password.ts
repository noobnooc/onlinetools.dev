import { type ToolResult, ok, err } from './types';
import type { RandomFn } from './uuid';

export interface PasswordOptions {
	length: number;
	lower?: boolean;
	upper?: boolean;
	digits?: boolean;
	symbols?: boolean;
	/** Exclude look-alikes: 0O1lI|`'" */
	excludeAmbiguous?: boolean;
	count?: number;
}

const SETS = {
	lower: 'abcdefghijklmnopqrstuvwxyz',
	upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
	digits: '0123456789',
	symbols: '!@#$%^&*()-_=+[]{};:,.<>?/~'
};

const AMBIGUOUS = new Set('0O1lI|`\'"');

const defaultRandom: RandomFn = (bytes) => {
	crypto.getRandomValues(bytes);
	return bytes;
};

/** Unbiased random index via rejection sampling. */
function randomIndex(max: number, random: RandomFn): number {
	const limit = Math.floor(256 / max) * max;
	const buf = new Uint8Array(1);
	for (;;) {
		random(buf);
		if (buf[0] < limit) return buf[0] % max;
	}
}

export function generatePasswords(
	options: PasswordOptions,
	random: RandomFn = defaultRandom
): ToolResult<{ passwords: string[]; entropyBits: number; poolSize: number }> {
	const length = Math.floor(options.length);
	if (!Number.isFinite(length) || length < 4 || length > 256) {
		return err('Length must be between 4 and 256');
	}
	const count = Math.floor(options.count ?? 1);
	if (count < 1 || count > 100) return err('Count must be between 1 and 100');

	const activeSets: string[] = [];
	if (options.lower !== false) activeSets.push(SETS.lower);
	if (options.upper !== false) activeSets.push(SETS.upper);
	if (options.digits !== false) activeSets.push(SETS.digits);
	if (options.symbols === true) activeSets.push(SETS.symbols);
	if (activeSets.length === 0) return err('Enable at least one character set');

	const filter = (s: string) =>
		options.excludeAmbiguous ? [...s].filter((c) => !AMBIGUOUS.has(c)).join('') : s;
	const sets = activeSets.map(filter).filter((s) => s.length > 0);
	const pool = sets.join('');

	const passwords: string[] = [];
	for (let p = 0; p < count; p++) {
		// Guarantee at least one char from each enabled set, then fill from the pool.
		const chars: string[] = sets.map((s) => s[randomIndex(s.length, random)]);
		while (chars.length < length) {
			chars.push(pool[randomIndex(pool.length, random)]);
		}
		// Fisher–Yates so the guaranteed characters aren't always in front.
		for (let i = chars.length - 1; i > 0; i--) {
			const j = randomIndex(i + 1, random);
			[chars[i], chars[j]] = [chars[j], chars[i]];
		}
		passwords.push(chars.slice(0, length).join(''));
	}
	const entropyBits = Math.round(length * Math.log2(pool.length));
	return ok({ passwords, entropyBits, poolSize: pool.length });
}

export type Strength = 'weak' | 'fair' | 'strong' | 'excellent';

export function strengthOf(entropyBits: number): Strength {
	if (entropyBits < 45) return 'weak';
	if (entropyBits < 70) return 'fair';
	if (entropyBits < 100) return 'strong';
	return 'excellent';
}
