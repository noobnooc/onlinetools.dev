export type ToolCategory =
	| 'encoding'
	| 'json'
	| 'text'
	| 'time'
	| 'generators'
	| 'crypto'
	| 'web'
	| 'image';

export const CATEGORY_LABELS: Record<ToolCategory, string> = {
	encoding: 'Encoding',
	json: 'JSON & Data',
	text: 'Text',
	time: 'Date & Time',
	generators: 'Generators',
	crypto: 'Hashing & Crypto',
	web: 'Web',
	image: 'Image'
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
		related: ['url-encode-decode', 'jwt-decoder', 'json-formatter', 'hash-generator', 'uuid-generator', 'image-to-base64']
	},
	{
		slug: 'image-to-base64',
		name: 'Image ↔ Base64 Converter',
		description: 'Turn images into Base64 data URLs and back — with CSS and HTML snippets',
		category: 'image',
		aliases: ['image to base64', 'base64 image', 'data url', 'data uri', 'img to base64'],
		keywords: ['image to base64', 'base64 to image', 'data url generator', 'image data uri'],
		related: ['image-converter', 'image-resizer', 'favicon-generator', 'base64-decode', 'qr-code-generator', 'color-converter']
	},
	{
		slug: 'image-converter',
		name: 'Image Format Converter',
		description: 'Convert images between PNG, JPEG and WebP with a quality dial',
		category: 'image',
		aliases: ['png to webp', 'jpg to png', 'webp converter', 'convert image', 'image format'],
		keywords: ['image converter', 'png to webp', 'jpeg to webp', 'webp to png', 'convert image online'],
		related: ['image-resizer', 'image-to-base64', 'favicon-generator', 'qr-code-generator', 'color-converter', 'base64-decode']
	},
	{
		slug: 'image-resizer',
		name: 'Image Resizer',
		description: 'Resize images by width, height or percentage — sharp and entirely offline',
		category: 'image',
		aliases: ['resize image', 'image resize', 'scale image', 'shrink image', 'image compressor'],
		keywords: ['image resizer', 'resize image online', 'scale image', 'compress image'],
		related: ['image-converter', 'image-to-base64', 'favicon-generator', 'qr-code-generator', 'color-converter', 'base64-decode']
	},
	{
		slug: 'favicon-generator',
		name: 'Favicon Generator',
		description: 'Turn any image into favicon.ico plus the full PNG and manifest icon set',
		category: 'image',
		aliases: ['favicon', 'ico', 'png to ico', 'favicon.ico', 'apple touch icon'],
		keywords: ['favicon generator', 'png to ico', 'favicon.ico generator', 'apple touch icon generator'],
		related: ['image-resizer', 'image-converter', 'image-to-base64', 'qr-code-generator', 'color-converter', 'slug-generator']
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
	},
	{
		slug: 'case-converter',
		name: 'Case Converter',
		description: 'Switch between camelCase, snake_case, kebab-case, PascalCase and more',
		category: 'text',
		aliases: ['camel', 'snake', 'kebab', 'pascal', 'naming', 'case'],
		keywords: ['case converter', 'camelcase to snake_case', 'text case', 'naming convention'],
		related: ['slug-generator', 'sort-lines', 'word-counter', 'json-to-typescript', 'regex-tester', 'diff-checker']
	},
	{
		slug: 'word-counter',
		name: 'Word Counter',
		description: 'Count words, characters, sentences, bytes and reading time as you type',
		category: 'text',
		aliases: ['wc', 'count words', 'character count', 'char count'],
		keywords: ['word counter', 'character counter', 'word count online', 'reading time'],
		related: ['case-converter', 'sort-lines', 'lorem-ipsum-generator', 'unicode-inspector', 'diff-checker', 'slug-generator']
	},
	{
		slug: 'lorem-ipsum-generator',
		name: 'Lorem Ipsum Generator',
		description: 'Generate placeholder words, sentences or paragraphs for mockups',
		category: 'text',
		aliases: ['lorem', 'ipsum', 'placeholder text', 'dummy text'],
		keywords: ['lorem ipsum generator', 'placeholder text', 'dummy text generator'],
		related: ['word-counter', 'slug-generator', 'case-converter', 'uuid-generator', 'password-generator', 'qr-code-generator']
	},
	{
		slug: 'slug-generator',
		name: 'Slug Generator',
		description: 'Turn titles into clean URL slugs with separator and length options',
		category: 'text',
		aliases: ['slugify', 'url slug', 'permalink'],
		keywords: ['slug generator', 'slugify online', 'url slug', 'title to slug'],
		related: ['case-converter', 'url-encode-decode', 'lorem-ipsum-generator', 'word-counter', 'url-parser', 'uuid-generator']
	},
	{
		slug: 'sort-lines',
		name: 'Sort & Dedupe Lines',
		description: 'Sort lines alphabetically or naturally, remove duplicates and empties',
		category: 'text',
		aliases: ['dedupe', 'unique lines', 'sort text', 'remove duplicates'],
		keywords: ['sort lines online', 'remove duplicate lines', 'dedupe text', 'sort alphabetically'],
		related: ['diff-checker', 'word-counter', 'case-converter', 'json-formatter', 'regex-tester', 'slug-generator']
	},
	{
		slug: 'html-entities',
		name: 'HTML Entities Encode / Decode',
		description: 'Escape text for HTML or decode &amp;-style entities back to characters',
		category: 'encoding',
		aliases: ['html escape', 'html encode', 'entities', 'amp'],
		keywords: ['html entities', 'html encode', 'html decode', 'escape html'],
		related: ['url-encode-decode', 'unicode-inspector', 'base64-decode', 'json-formatter', 'regex-tester', 'slug-generator']
	},
	{
		slug: 'unicode-inspector',
		name: 'Unicode Character Inspector',
		description: 'See code points, UTF-8/UTF-16 bytes and escapes for every character',
		category: 'encoding',
		aliases: ['unicode', 'code point', 'utf8', 'utf-8', 'char inspector'],
		keywords: ['unicode inspector', 'code point lookup', 'utf-8 encoder', 'character encoding'],
		related: ['html-entities', 'base64-decode', 'word-counter', 'url-encode-decode', 'json-formatter', 'case-converter']
	},
	{
		slug: 'cron-parser',
		name: 'Cron Expression Parser',
		description: 'Explain any cron schedule in plain English with the next run times',
		category: 'time',
		aliases: ['cron', 'crontab', 'cron schedule', 'cron expression'],
		keywords: ['cron parser', 'cron expression', 'crontab generator', 'cron next run'],
		related: ['timestamp-converter', 'regex-tester', 'json-formatter', 'uuid-generator', 'hash-generator', 'sort-lines']
	},
	{
		slug: 'password-generator',
		name: 'Password Generator',
		description: 'Random passwords with charset options and an honest entropy meter',
		category: 'generators',
		aliases: ['password', 'random password', 'passphrase', 'pwgen'],
		keywords: ['password generator', 'strong password', 'random password generator'],
		related: ['uuid-generator', 'bcrypt-generator', 'hash-generator', 'qr-code-generator', 'base64-decode', 'lorem-ipsum-generator']
	},
	{
		slug: 'qr-code-generator',
		name: 'QR Code Generator',
		description: 'Generate crisp QR codes as SVG or PNG — no watermark, no upload',
		category: 'generators',
		aliases: ['qr', 'qrcode', 'qr code'],
		keywords: ['qr code generator', 'free qr code', 'qr code svg', 'url to qr'],
		related: ['url-parser', 'password-generator', 'uuid-generator', 'image-to-base64', 'slug-generator', 'color-converter']
	},
	{
		slug: 'json-to-yaml',
		name: 'JSON ↔ YAML ↔ TOML Converter',
		description: 'Convert between JSON, YAML and TOML with format auto-detection',
		category: 'json',
		aliases: ['yaml', 'toml', 'yaml to json', 'json to toml', 'yml'],
		keywords: ['json to yaml', 'yaml to json', 'toml converter', 'yaml converter'],
		related: ['json-formatter', 'json-to-csv', 'json-to-typescript', 'jsonpath-tester', 'diff-checker', 'base64-decode']
	},
	{
		slug: 'json-to-csv',
		name: 'JSON → CSV Converter',
		description: 'Flatten arrays of JSON objects into CSV with proper escaping',
		category: 'json',
		aliases: ['csv', 'json csv', 'export csv'],
		keywords: ['json to csv', 'json to csv converter', 'json array to csv'],
		related: ['json-formatter', 'json-to-yaml', 'json-to-typescript', 'jsonpath-tester', 'sort-lines', 'diff-checker']
	},
	{
		slug: 'json-to-typescript',
		name: 'JSON → TypeScript Types',
		description: 'Infer TypeScript interfaces from a JSON sample instantly',
		category: 'json',
		aliases: ['ts types', 'typescript interface', 'json to ts', 'json2ts'],
		keywords: ['json to typescript', 'json to interface', 'generate typescript types'],
		related: ['json-formatter', 'json-to-yaml', 'jsonpath-tester', 'json-to-csv', 'case-converter', 'diff-checker']
	},
	{
		slug: 'jsonpath-tester',
		name: 'JSONPath Tester',
		description: 'Query JSON with JSONPath expressions and see every match with its path',
		category: 'json',
		aliases: ['jsonpath', 'json query', 'json path'],
		keywords: ['jsonpath tester', 'jsonpath online', 'json query', 'jsonpath evaluator'],
		related: ['json-formatter', 'json-to-yaml', 'json-to-typescript', 'json-to-csv', 'regex-tester', 'jwt-decoder']
	},
	{
		slug: 'bcrypt-generator',
		name: 'Bcrypt Hash & Verify',
		description: 'Hash passwords with bcrypt and check hashes against plaintext',
		category: 'crypto',
		aliases: ['bcrypt', 'bcrypt hash', 'bcrypt check', 'password hash'],
		keywords: ['bcrypt generator', 'bcrypt online', 'bcrypt verify', 'bcrypt hash'],
		related: ['hash-generator', 'password-generator', 'jwt-decoder', 'uuid-generator', 'base64-decode', 'json-formatter']
	},
	{
		slug: 'user-agent-parser',
		name: 'User-Agent Parser',
		description: 'Identify browser, engine, OS and device from a User-Agent string',
		category: 'web',
		aliases: ['ua', 'useragent', 'user agent', 'browser detect'],
		keywords: ['user agent parser', 'ua parser', 'user agent lookup', 'browser detection'],
		related: ['url-parser', 'jwt-decoder', 'regex-tester', 'json-formatter', 'timestamp-converter', 'hash-generator']
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
