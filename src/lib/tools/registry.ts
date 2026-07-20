export type ToolCategory =
	| 'encoding'
	| 'json'
	| 'text'
	| 'time'
	| 'generators'
	| 'crypto'
	| 'web';

export const CATEGORY_LABELS: Record<ToolCategory, string> = {
	encoding: 'Encoding',
	json: 'JSON & Data',
	text: 'Text',
	time: 'Date & Time',
	generators: 'Generators',
	crypto: 'Hashing & Crypto',
	web: 'Web'
};

export interface ToolMeta {
	slug: string;
	name: string;
	/** Short imperative description used in cards, palette and meta description. */
	description: string;
	category: ToolCategory;
	/** Palette aliases and common misspellings. */
	aliases: string[];
	keywords: string[];
	related: string[];
}

export const TOOLS: ToolMeta[] = [
	{
		slug: 'json-formatter',
		name: 'JSON Formatter & Validator',
		description: 'Format, validate and minify JSON with precise error positions',
		category: 'json',
		aliases: ['json', 'json beautify', 'json pretty', 'jsonlint'],
		keywords: ['json format', 'json validator', 'pretty print json', 'minify json'],
		related: ['base64-decode', 'jwt-decoder', 'url-encode-decode', 'diff-checker', 'uuid-generator', 'regex-tester']
	},
	{
		slug: 'base64-decode',
		name: 'Base64 Encode / Decode',
		description: 'Encode text to Base64 or decode Base64 to text, URL-safe included',
		category: 'encoding',
		aliases: ['b64', 'base 64', 'base64 encode', 'atob', 'btoa'],
		keywords: ['base64 decode', 'base64 encode', 'base64 converter'],
		related: ['url-encode-decode', 'jwt-decoder', 'json-formatter', 'hash-generator', 'uuid-generator', 'regex-tester']
	},
	{
		slug: 'timestamp-converter',
		name: 'Unix Timestamp Converter',
		description: 'Convert unix timestamps to human dates and back, with relative time',
		category: 'time',
		aliases: ['ts', 'unix time', 'epoch', 'epoch converter', 'unixtime'],
		keywords: ['timestamp converter', 'unix timestamp', 'epoch time', 'timestamp to date'],
		related: ['uuid-generator', 'json-formatter', 'jwt-decoder', 'hash-generator', 'diff-checker', 'url-parser']
	},
	{
		slug: 'jwt-decoder',
		name: 'JWT Decoder',
		description: 'Decode JWT header and payload, check expiry — fully offline',
		category: 'encoding',
		aliases: ['jwt', 'json web token', 'jwt decode', 'jwt debugger'],
		keywords: ['jwt decoder', 'decode jwt', 'jwt debugger', 'json web token'],
		related: ['base64-decode', 'json-formatter', 'timestamp-converter', 'hash-generator', 'url-encode-decode', 'uuid-generator']
	},
	{
		slug: 'regex-tester',
		name: 'Regex Tester',
		description: 'Test regular expressions with live match highlighting and groups',
		category: 'web',
		aliases: ['regex', 'regexp', 'regular expression', 're test'],
		keywords: ['regex tester', 'regex online', 'regular expression tester', 'regex match'],
		related: ['diff-checker', 'json-formatter', 'url-parser', 'base64-decode', 'color-converter', 'timestamp-converter']
	},
	{
		slug: 'diff-checker',
		name: 'Text Diff Checker',
		description: 'Compare two texts line by line and see additions and deletions',
		category: 'text',
		aliases: ['diff', 'compare', 'text compare', 'difference'],
		keywords: ['diff checker', 'text compare', 'compare two texts', 'text difference'],
		related: ['json-formatter', 'regex-tester', 'base64-decode', 'url-encode-decode', 'hash-generator', 'timestamp-converter']
	},
	{
		slug: 'url-encode-decode',
		name: 'URL Encode / Decode',
		description: 'Percent-encode or decode URL components and query strings',
		category: 'encoding',
		aliases: ['url encode', 'url decode', 'percent encoding', 'urlencode'],
		keywords: ['url encode', 'url decode', 'percent encoding', 'encodeURIComponent'],
		related: ['url-parser', 'base64-decode', 'json-formatter', 'jwt-decoder', 'regex-tester', 'diff-checker']
	},
	{
		slug: 'url-parser',
		name: 'URL Parser',
		description: 'Break a URL into protocol, host, path and query parameters',
		category: 'web',
		aliases: ['parse url', 'query string', 'url inspector', 'query params'],
		keywords: ['url parser', 'parse url online', 'query string parser'],
		related: ['url-encode-decode', 'json-formatter', 'regex-tester', 'base64-decode', 'jwt-decoder', 'timestamp-converter']
	},
	{
		slug: 'uuid-generator',
		name: 'UUID Generator',
		description: 'Generate UUID v4/v7, ULID and Nano ID — single or in bulk',
		category: 'generators',
		aliases: ['uuid', 'guid', 'ulid', 'nanoid', 'unique id'],
		keywords: ['uuid generator', 'uuid v4', 'uuid v7', 'ulid generator', 'guid generator'],
		related: ['hash-generator', 'timestamp-converter', 'json-formatter', 'base64-decode', 'jwt-decoder', 'regex-tester']
	},
	{
		slug: 'hash-generator',
		name: 'Hash Generator',
		description: 'MD5, SHA-1, SHA-256, SHA-512 and HMAC — computed in your browser',
		category: 'crypto',
		aliases: ['hash', 'md5', 'sha256', 'sha', 'checksum', 'hmac'],
		keywords: ['hash generator', 'sha256 online', 'md5 hash', 'hmac generator'],
		related: ['uuid-generator', 'base64-decode', 'jwt-decoder', 'json-formatter', 'timestamp-converter', 'diff-checker']
	},
	{
		slug: 'color-converter',
		name: 'Color Converter',
		description: 'Convert colors between HEX, RGB, HSL and OKLCH with live preview',
		category: 'web',
		aliases: ['color', 'colour', 'hex to rgb', 'hsl', 'oklch'],
		keywords: ['color converter', 'hex to rgb', 'rgb to hsl', 'oklch converter'],
		related: ['regex-tester', 'json-formatter', 'url-parser', 'diff-checker', 'uuid-generator', 'base64-decode']
	}
];

export const TOOL_BY_SLUG = new Map(TOOLS.map((t) => [t.slug, t]));

export function getTool(slug: string): ToolMeta | undefined {
	return TOOL_BY_SLUG.get(slug);
}

/** Simple scored fuzzy search across name, slug, aliases and keywords. */
export function searchTools(query: string): ToolMeta[] {
	const q = query.trim().toLowerCase();
	if (q === '') return TOOLS;
	const scored = TOOLS.map((tool) => {
		let score = 0;
		const name = tool.name.toLowerCase();
		if (name.startsWith(q)) score += 100;
		else if (name.includes(q)) score += 60;
		if (tool.slug.includes(q)) score += 50;
		for (const alias of tool.aliases) {
			if (alias === q) score += 90;
			else if (alias.startsWith(q)) score += 70;
			else if (alias.includes(q)) score += 30;
		}
		for (const kw of tool.keywords) {
			if (kw.includes(q)) score += 20;
		}
		// Subsequence match on name as a weak fallback ("jsfmt" → "json formatter").
		if (score === 0) {
			let qi = 0;
			for (const ch of name) if (ch === q[qi]) qi++;
			if (qi === q.length) score += 10;
		}
		return { tool, score };
	});
	return scored
		.filter((s) => s.score > 0)
		.sort((a, b) => b.score - a.score)
		.map((s) => s.tool);
}
