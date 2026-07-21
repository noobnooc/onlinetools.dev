import { type ToolResult, ok, err } from './types';

export interface BaseViews {
	binary: string;
	octal: string;
	decimal: string;
	hex: string;
	/** Present when a custom output base (not 2/8/10/16) was requested. */
	custom?: string;
	negative: boolean;
	bits: number;
}

const DIGITS = '0123456789abcdefghijklmnopqrstuvwxyz';

/** Strip a 0x/0o/0b prefix and return the base it implies. */
function splitPrefix(raw: string): { digits: string; base: number | null } {
	const m = raw.match(/^0([xob])(.+)$/i);
	if (!m) return { digits: raw, base: null };
	const base = m[1].toLowerCase() === 'x' ? 16 : m[1].toLowerCase() === 'o' ? 8 : 2;
	return { digits: m[2], base };
}

export function parseInBase(input: string, base: number | 'auto'): ToolResult<bigint> {
	let s = input.trim().toLowerCase().replace(/[\s_]/g, '');
	if (s === '') return err('Input is empty');
	let negative = false;
	if (s.startsWith('-')) {
		negative = true;
		s = s.slice(1);
	}
	const { digits, base: prefixBase } = splitPrefix(s);
	let b: number;
	if (base === 'auto') {
		b = prefixBase ?? 10;
	} else {
		b = base;
		// A prefix is only consumed when it matches the chosen base.
		if (prefixBase !== null && prefixBase !== base) {
			return err(`Input has a base-${prefixBase} prefix but base ${base} was selected`);
		}
	}
	if (b < 2 || b > 36) return err('Base must be between 2 and 36');
	const body = digits;
	if (body === '') return err('No digits after the prefix');
	let value = 0n;
	const bigBase = BigInt(b);
	for (const ch of body) {
		const d = DIGITS.indexOf(ch);
		if (d === -1 || d >= b) {
			return err(`"${ch}" is not a valid digit in base ${b}`);
		}
		value = value * bigBase + BigInt(d);
	}
	return ok(negative ? -value : value);
}

export function toBase(value: bigint, base: number): string {
	if (base < 2 || base > 36) return '';
	return value < 0n ? '-' + (-value).toString(base) : value.toString(base);
}

/** All standard representations of a number parsed from `input` in `base`. */
export function baseViews(input: string, base: number | 'auto', customBase?: number): ToolResult<BaseViews> {
	const parsed = parseInBase(input, base);
	if (!parsed.ok) return parsed;
	const v = parsed.value;
	const abs = v < 0n ? -v : v;
	const views: BaseViews = {
		binary: toBase(v, 2),
		octal: toBase(v, 8),
		decimal: toBase(v, 10),
		hex: toBase(v, 16),
		negative: v < 0n,
		bits: abs === 0n ? 1 : abs.toString(2).length
	};
	if (customBase !== undefined && ![2, 8, 10, 16].includes(customBase)) {
		if (customBase < 2 || customBase > 36) return err('Output base must be between 2 and 36');
		views.custom = toBase(v, customBase);
	}
	return ok(views);
}

/** Group digits for display: 4 for bin/hex, 3 for decimal/octal. */
export function groupDigits(s: string, base: number): string {
	const neg = s.startsWith('-');
	const body = neg ? s.slice(1) : s;
	const size = base === 10 || base === 8 ? 3 : 4;
	const out: string[] = [];
	for (let i = body.length; i > 0; i -= size) {
		out.unshift(body.slice(Math.max(0, i - size), i));
	}
	return (neg ? '-' : '') + out.join(' ');
}
