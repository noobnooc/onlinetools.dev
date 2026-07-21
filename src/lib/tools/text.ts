import { type ToolResult, ok, err } from './types';

/* ---------- Case / naming-style conversion ---------- */

export type CaseStyle =
	| 'camel'
	| 'pascal'
	| 'snake'
	| 'kebab'
	| 'constant'
	| 'title'
	| 'sentence'
	| 'lower'
	| 'upper';

export const CASE_STYLES: Array<{ id: CaseStyle; label: string; example: string }> = [
	{ id: 'camel', label: 'camelCase', example: 'userAccountId' },
	{ id: 'pascal', label: 'PascalCase', example: 'UserAccountId' },
	{ id: 'snake', label: 'snake_case', example: 'user_account_id' },
	{ id: 'kebab', label: 'kebab-case', example: 'user-account-id' },
	{ id: 'constant', label: 'CONSTANT_CASE', example: 'USER_ACCOUNT_ID' },
	{ id: 'title', label: 'Title Case', example: 'User Account Id' },
	{ id: 'sentence', label: 'Sentence case', example: 'User account id' },
	{ id: 'lower', label: 'lower case', example: 'user account id' },
	{ id: 'upper', label: 'UPPER CASE', example: 'USER ACCOUNT ID' }
];

/** Split an identifier or phrase into lowercase word tokens. */
export function tokenize(input: string): string[] {
	return input
		.replace(/([a-z0-9])([A-Z])/g, '$1 $2')
		.replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
		.split(/[^A-Za-z0-9]+/)
		.filter((t) => t.length > 0)
		.map((t) => t.toLowerCase());
}

function capitalize(word: string): string {
	return word.charAt(0).toUpperCase() + word.slice(1);
}

export function convertCase(input: string, style: CaseStyle): string {
	// Convert line by line so batch input works naturally.
	return input
		.split('\n')
		.map((line) => {
			const words = tokenize(line);
			if (words.length === 0) return '';
			switch (style) {
				case 'camel':
					return words[0] + words.slice(1).map(capitalize).join('');
				case 'pascal':
					return words.map(capitalize).join('');
				case 'snake':
					return words.join('_');
				case 'kebab':
					return words.join('-');
				case 'constant':
					return words.join('_').toUpperCase();
				case 'title':
					return words.map(capitalize).join(' ');
				case 'sentence':
					return capitalize(words.join(' '));
				case 'lower':
					return words.join(' ');
				case 'upper':
					return words.join(' ').toUpperCase();
			}
		})
		.join('\n');
}

/* ---------- Text statistics ---------- */

export interface TextStats {
	characters: number;
	charactersNoSpaces: number;
	words: number;
	lines: number;
	sentences: number;
	paragraphs: number;
	bytes: number;
	/** Minutes at ~220 wpm, minimum 1 when there is any text. */
	readingMinutes: number;
}

export function textStats(input: string): TextStats {
	const characters = [...input].length;
	const charactersNoSpaces = [...input.replace(/\s/g, '')].length;
	const words = input.trim() === '' ? 0 : (input.trim().match(/\S+/g) ?? []).length;
	const lines = input === '' ? 0 : input.split('\n').length;
	const sentences = (input.match(/[.!?…]+(\s|$)/g) ?? []).length;
	const paragraphs =
		input.trim() === '' ? 0 : input.split(/\n\s*\n/).filter((p) => p.trim() !== '').length;
	const bytes = new TextEncoder().encode(input).length;
	const readingMinutes = words === 0 ? 0 : Math.max(1, Math.round(words / 220));
	return { characters, charactersNoSpaces, words, lines, sentences, paragraphs, bytes, readingMinutes };
}

/* ---------- Lorem ipsum ---------- */

const LOREM_WORDS =
	`lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum`.split(
		' '
	);

export type RandomInt = (maxExclusive: number) => number;

const defaultRandomInt: RandomInt = (max) => {
	const buf = new Uint32Array(1);
	crypto.getRandomValues(buf);
	return buf[0] % max;
};

export interface LoremOptions {
	unit: 'words' | 'sentences' | 'paragraphs';
	count: number;
	startClassic?: boolean;
}

export function loremIpsum(options: LoremOptions, rand: RandomInt = defaultRandomInt): ToolResult {
	const count = Math.floor(options.count);
	if (!Number.isFinite(count) || count < 1 || count > 1000) {
		return err('Count must be between 1 and 1000');
	}
	const word = () => LOREM_WORDS[rand(LOREM_WORDS.length)];
	const sentence = () => {
		const n = 6 + rand(10);
		const words = Array.from({ length: n }, word);
		return words[0].charAt(0).toUpperCase() + words[0].slice(1) + ' ' + words.slice(1).join(' ') + '.';
	};
	const paragraph = () => Array.from({ length: 3 + rand(4) }, sentence).join(' ');

	let out: string;
	if (options.unit === 'words') {
		out = Array.from({ length: count }, word).join(' ');
	} else if (options.unit === 'sentences') {
		out = Array.from({ length: count }, sentence).join(' ');
	} else {
		out = Array.from({ length: count }, paragraph).join('\n\n');
	}
	if (options.startClassic !== false) {
		const classic = 'Lorem ipsum dolor sit amet';
		if (options.unit === 'words') {
			const words = out.split(' ');
			out = (classic.toLowerCase() + ' ' + words.slice(5).join(' ')).trim();
		} else {
			out = classic + ', ' + out.charAt(0).toLowerCase() + out.slice(1);
		}
	}
	return ok(out);
}

/* ---------- Slug ---------- */

const DIACRITICS_MAP: Record<string, string> = {
	æ: 'ae', ø: 'o', ß: 'ss', đ: 'd', ð: 'd', þ: 'th', ł: 'l', œ: 'oe'
};

export interface SlugOptions {
	separator?: '-' | '_';
	lowercase?: boolean;
	maxLength?: number;
}

export function slugify(input: string, options: SlugOptions = {}): string {
	const sep = options.separator ?? '-';
	let s = input
		.normalize('NFKD')
		.replace(/[̀-ͯ]/g, '') // strip combining accents
		.replace(/[^\x00-\x7F]/g, (ch) => DIACRITICS_MAP[ch.toLowerCase()] ?? '');
	if (options.lowercase !== false) s = s.toLowerCase();
	s = s
		.replace(/['"’‘“”]/g, '')
		.replace(/[^A-Za-z0-9]+/g, sep)
		.replace(new RegExp(`\\${sep}{2,}`, 'g'), sep)
		.replace(new RegExp(`^\\${sep}|\\${sep}$`, 'g'), '');
	if (options.maxLength && s.length > options.maxLength) {
		s = s.slice(0, options.maxLength).replace(new RegExp(`\\${sep}[^\\${sep}]*$`), '');
	}
	return s;
}

/* ---------- Line dedupe / sort ---------- */

export interface LineToolOptions {
	dedupe?: boolean;
	caseInsensitiveDedupe?: boolean;
	trim?: boolean;
	removeEmpty?: boolean;
	sort?: 'none' | 'asc' | 'desc' | 'natural' | 'length' | 'shuffle';
}

export function processLines(
	input: string,
	options: LineToolOptions,
	rand: RandomInt = defaultRandomInt
): { output: string; inputLines: number; outputLines: number; removed: number } {
	let lines = input.split('\n');
	const inputLines = input === '' ? 0 : lines.length;
	if (options.trim) lines = lines.map((l) => l.trim());
	if (options.removeEmpty) lines = lines.filter((l) => l.trim() !== '');
	if (options.dedupe) {
		const seen = new Set<string>();
		lines = lines.filter((l) => {
			const key = options.caseInsensitiveDedupe ? l.toLowerCase() : l;
			if (seen.has(key)) return false;
			seen.add(key);
			return true;
		});
	}
	const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
	switch (options.sort) {
		case 'asc':
			lines = [...lines].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
			break;
		case 'desc':
			lines = [...lines].sort((a, b) => (a < b ? 1 : a > b ? -1 : 0));
			break;
		case 'natural':
			lines = [...lines].sort((a, b) => collator.compare(a, b));
			break;
		case 'length':
			lines = [...lines].sort((a, b) => a.length - b.length);
			break;
		case 'shuffle': {
			lines = [...lines];
			for (let i = lines.length - 1; i > 0; i--) {
				const j = rand(i + 1);
				[lines[i], lines[j]] = [lines[j], lines[i]];
			}
			break;
		}
	}
	const outputLines = lines.length === 1 && lines[0] === '' ? 0 : lines.length;
	return { output: lines.join('\n'), inputLines, outputLines, removed: inputLines - outputLines };
}
