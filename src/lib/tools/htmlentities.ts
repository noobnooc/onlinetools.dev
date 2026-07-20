import { type ToolResult, ok, err } from './types';

const NAMED_TO_CHAR: Record<string, string> = {
	amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
	copy: '©', reg: '®', trade: '™', deg: '°', plusmn: '±', para: '¶',
	sect: '§', middot: '·', laquo: '«', raquo: '»', ldquo: '“',
	rdquo: '”', lsquo: '‘', rsquo: '’', ndash: '–',
	mdash: '—', hellip: '…', euro: '€', pound: '£', yen: '¥',
	cent: '¢', times: '×', divide: '÷', frac12: '½', frac14: '¼',
	frac34: '¾', sup2: '²', sup3: '³', micro: 'µ', bull: '•', dagger: '†',
	Dagger: '‡', permil: '‰', prime: '′', Prime: '″', larr: '←', uarr: '↑',
	rarr: '→', darr: '↓', harr: '↔', infin: '∞', ne: '≠', le: '≤', ge: '≥',
	asymp: '≈', radic: '√', sum: '∑', minus: '−', lowast: '∗', alpha: 'α',
	beta: 'β', gamma: 'γ', delta: 'δ', pi: 'π', sigma: 'σ', omega: 'ω',
	lambda: 'λ', mu: 'μ', Omega: 'Ω', shy: '­'
};

const CHAR_TO_NAMED: Record<string, string> = {};
for (const [name, ch] of Object.entries(NAMED_TO_CHAR)) {
	if (!(ch in CHAR_TO_NAMED)) CHAR_TO_NAMED[ch] = name;
}

export interface EntityEncodeOptions {
	/** Encode every non-ASCII character too, not just &<>"'. */
	all?: boolean;
	/** Prefer numeric (&#x...;) over named entities. */
	numeric?: boolean;
}

export function encodeEntities(input: string, options: EntityEncodeOptions = {}): string {
	const essential = new Set(['&', '<', '>', '"', "'"]);
	let out = '';
	for (const ch of input) {
		const cp = ch.codePointAt(0) ?? 0;
		const mustEncode = essential.has(ch) || (options.all === true && cp > 0x7e);
		if (!mustEncode) {
			out += ch;
			continue;
		}
		const named = CHAR_TO_NAMED[ch];
		if (named && options.numeric !== true) out += `&${named};`;
		else out += `&#x${cp.toString(16).toUpperCase()};`;
	}
	return out;
}

export function decodeEntities(input: string): ToolResult {
	let sawInvalid: string | null = null;
	const out = input.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z][a-zA-Z0-9]*);/g, (full, body: string) => {
		if (body.startsWith('#x') || body.startsWith('#X')) {
			const cp = parseInt(body.slice(2), 16);
			return Number.isFinite(cp) && cp <= 0x10ffff ? String.fromCodePoint(cp) : full;
		}
		if (body.startsWith('#')) {
			const cp = parseInt(body.slice(1), 10);
			return Number.isFinite(cp) && cp <= 0x10ffff ? String.fromCodePoint(cp) : full;
		}
		if (body in NAMED_TO_CHAR) return NAMED_TO_CHAR[body];
		sawInvalid = `&${body};`;
		return full;
	});
	if (sawInvalid) {
		return ok(out); // pass through unknown entities untouched; not fatal
	}
	return ok(out);
}

export { NAMED_TO_CHAR };
