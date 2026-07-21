export interface CharInfo {
	char: string;
	codePoint: number;
	/** U+XXXX form. */
	codePointHex: string;
	utf8: string;
	utf16: string;
	jsEscape: string;
	htmlEntity: string;
	category: string;
}

const CATEGORY_CHECKS: Array<[RegExp, string]> = [
	[/\p{Lu}/u, 'Uppercase letter'],
	[/\p{Ll}/u, 'Lowercase letter'],
	[/\p{Lo}/u, 'Letter'],
	[/\p{Nd}/u, 'Decimal digit'],
	[/\p{No}|\p{Nl}/u, 'Number'],
	[/\p{Zs}/u, 'Space separator'],
	[/\p{Cc}/u, 'Control'],
	[/\p{Cf}/u, 'Format (invisible)'],
	[/\p{Pd}/u, 'Dash punctuation'],
	[/\p{Ps}|\p{Pe}/u, 'Bracket'],
	[/\p{P}/u, 'Punctuation'],
	[/\p{Sc}/u, 'Currency symbol'],
	[/\p{Sm}/u, 'Math symbol'],
	[/\p{Emoji_Presentation}/v, 'Emoji'],
	[/\p{S}/u, 'Symbol'],
	[/\p{M}/u, 'Combining mark']
];

function categoryOf(ch: string): string {
	for (const [re, label] of CATEGORY_CHECKS) {
		try {
			if (re.test(ch)) return label;
		} catch {
			// Older engines may lack a property — skip that check.
		}
	}
	return 'Other';
}

export function inspectChars(input: string, limit = 500): CharInfo[] {
	const out: CharInfo[] = [];
	for (const ch of input) {
		if (out.length >= limit) break;
		const cp = ch.codePointAt(0) ?? 0;
		const bytes = Array.from(new TextEncoder().encode(ch), (b) =>
			b.toString(16).toUpperCase().padStart(2, '0')
		);
		const units: string[] = [];
		for (let i = 0; i < ch.length; i++) {
			units.push('\\u' + ch.charCodeAt(i).toString(16).toUpperCase().padStart(4, '0'));
		}
		const hex = cp.toString(16).toUpperCase().padStart(4, '0');
		out.push({
			char: ch,
			codePoint: cp,
			codePointHex: 'U+' + hex,
			utf8: bytes.join(' '),
			utf16: units.join(' '),
			jsEscape: cp > 0xffff ? `\\u{${cp.toString(16).toUpperCase()}}` : '\\u' + hex,
			htmlEntity: `&#x${hex};`,
			category: categoryOf(ch)
		});
	}
	return out;
}

export function unicodeSummary(input: string): {
	codePoints: number;
	utf16Units: number;
	utf8Bytes: number;
	graphemes: number;
} {
	const codePoints = [...input].length;
	const utf16Units = input.length;
	const utf8Bytes = new TextEncoder().encode(input).length;
	let graphemes = codePoints;
	try {
		const seg = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
		graphemes = [...seg.segment(input)].length;
	} catch {
		// Segmenter unavailable — code points are a reasonable fallback.
	}
	return { codePoints, utf16Units, utf8Bytes, graphemes };
}
