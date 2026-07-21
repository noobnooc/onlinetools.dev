import { TOOLS, CATEGORY_LABELS } from '$lib/tools/registry';

/**
 * English — the canonical message catalog. The registry already carries
 * English tool names/descriptions, so they are derived, not duplicated.
 * Every other locale file mirrors this shape (checked by the Messages type).
 */
const en = {
	code: 'en',
	name: 'English',
	ui: {
		// Chrome
		search: 'Search',
		overview: 'Overview',
		toggleTheme: 'Toggle color theme',
		themeSystem: 'Follow system',
		themeDark: 'Dark',
		themeLight: 'Light',
		themeTitle: 'Theme: {mode} — click to switch',
		footerPrivacy: 'Runs in your browser — nothing you paste is uploaded',
		allTools: 'All tools',
		changelog: 'Changelog',
		releaseDate: 'Release date',
		language: 'Language',
		openNav: 'Open navigation',
		searchTools: 'Search tools',

		// Home
		homeTitle: 'onlinetools.dev — Developer tools that run in your browser',
		homeMetaDescription:
			'Fast, keyboard-first developer tools that run entirely in your browser. Format JSON, decode JWTs and Base64, convert timestamps, test regex — no upload, no signup, works offline.',
		homeEyebrow: '{n} tools · local-first',
		homeHeading: 'Developer tools that run in your browser',
		homeSub: 'No upload, no signup, no waiting.',
		pasteToDetect: 'paste to detect',
		worksOffline: 'works offline',
		shortcuts: 'shortcuts',
		searchPlaceholder: 'Search {n} tools, or paste anything…',
		startHere: 'Start here',
		smartPaste: 'Smart Paste',
		smartPasteDesc:
			'Paste anything, anywhere — the content type is detected and the right tool is one keystroke away.',
		keyboardFirst: 'Keyboard-first, end to end',
		keyboardFirstDesc: 'Find, run, copy and share without touching the mouse.',
		kbdAnyTool: 'any tool',
		kbdCopyResult: 'copy result',
		kbdConfirm: 'confirm',
		kbdAllShortcuts: 'all shortcuts',

		// Tools index page
		toolsTitle: 'All developer tools — onlinetools.dev',
		toolsMetaDescription:
			'Browse every tool on onlinetools.dev: JSON, YAML, Base64, JWT, timestamps, cron, regex, diff, UUID, hashing, QR codes and more — all running locally in your browser.',
		toolsBlurb: '{n} tools, every one computed in your browser. More arriving steadily — see the',

		// Tool page shell
		toolTitle: '{name} — Free & Private | onlinetools.dev',
		toolMetaSuffix: 'Runs entirely in your browser — no upload, no signup, works offline.',
		runsLocally: 'Runs locally',
		runsLocallyTitle:
			'This tool computes everything in your browser. Your input is never uploaded.',
		aboutTool: 'About this tool',
		faqHeading: 'Frequently asked questions',
		relatedTools: 'Related tools',
		breadcrumbTools: 'tools',

		// Shared tool components
		sample: 'Sample',
		line: 'line',
		output: 'Output',
		copy: 'Copy',
		copied: 'Copied',
		download: 'Download',
		share: 'Share',
		linkCopied: 'Link copied',
		continueWith: 'Continue with',
		suggested: 'suggested',
		shareTooLarge:
			'Input too large for a URL — share links are capped so they stay portable. Content never leaves this machine.',
		emptyHint: 'Output appears here as you type',

		// Command palette
		palettePlaceholder: 'Search tools, or paste content to act on it…',
		noMatch: 'No matching tool',
		navigate: 'navigate',
		open: 'open',
		close: 'close',

		// Smart paste
		detected: 'Detected',
		chars: 'chars',

		// Shortcut help
		shortcutsTitle: 'Keyboard shortcuts',
		scPalette: 'Open command palette',
		scCopy: 'Copy result',
		scEsc: 'Close panel / dismiss suggestion',
		scHelp: 'This shortcut reference',
		scPaste: 'Smart Paste — detect content and suggest tools',
		scNav: 'Navigate and confirm in panels'
	},
	tl: {
		// Shared controls
		direction: 'Direction',
		encode: 'Encode',
		decode: 'Decode',
		mode: 'Mode',
		count: 'Count',
		lengthLbl: 'Length',
		uppercase: 'Uppercase',
		lowercase: 'Lowercase',
		regenerate: 'Regenerate',

		// Base64
		b64InputEnc: 'Text to encode',
		b64InputDec: 'Base64 to decode',
		b64PhEnc: 'Any text, unicode included',
		b64UrlSafe: 'URL-safe (no padding)',

		// Bcrypt
		bcHash: 'Hash',
		bcVerify: 'Verify',
		bcHashT: 'Hash a password',
		bcVerifyT: 'Verify a password against a hash',
		bcPassword: 'Password',
		bcCost: 'Cost factor',
		bcHashLbl: 'Bcrypt hash',
		bcPh: 'stays in your browser',
		bcVersion: 'Version',
		bcCostShort: 'Cost',
		bcSalt: 'Salt',
		bcNote:
			'Hashing runs in your browser — nothing is transmitted. Browser JS is slower than native bcrypt, so treat timings as an upper bound.',

		// Case converter
		caseInput: 'Text or identifier (one per line)',
		caseEmpty: 'All nine styles appear here as you type',

		// Color
		colorInput: 'Color',
		colorFormats: 'Formats',
		colorRgb: 'RGB channels',
		colorContrast: 'Text contrast (WCAG)',

		// Cron
		cronInput: 'Cron expression',
		cronEvalIn: 'evaluated in',
		cronNext: 'Next 5 runs',
		cronNone: 'No runs within the next 5 years',

		// Diff
		diffOriginal: 'Original',
		diffChanged: 'Changed',
		diffLbl: 'Diff',
		diffUnchanged: 'unchanged',
		diffEmpty: 'The line-by-line diff appears here',

		// Hash
		hashInput: 'Text to hash',
		hashPh: 'Any text — hashes update as you type',
		hashHmac: 'HMAC secret key',
		hashOptional: '(optional)',
		hashHmacPh: 'Leave empty for plain hashes',
		hashDigests: 'Digests',
		hashEmpty: 'Digests update live as you type',
		hashNote:
			'MD5 and SHA-1 are shown for legacy checksums only — use SHA-256 or stronger for anything security-relevant.',

		// HTML entities
		heAll: 'Encode all non-ASCII',
		heNumeric: 'Numeric only',
		heInputEnc: 'Text to escape',
		heInputDec: 'HTML with entities',

		// Image tools (shared)
		imgDrop: 'Drop an image, click to browse, or paste from the clipboard',
		imgLocal: 'Stays in your browser — nothing is uploaded',
		imgReplace: 'Drop, click or paste to replace',
		imgSource: 'Source image',
		imgOriginal: 'Original',
		imgDimensions: 'Dimensions',
		imgDownload: 'Download {fmt}',
		imgErrNotImage: 'Not a recognized image format (PNG, JPEG, WebP, GIF, SVG, BMP, ICO, AVIF)',
		imgErrDecode: 'The browser could not decode this image',
		imgErrEncode: 'The browser could not encode this image',
		imgErrFormat: 'This browser cannot encode {fmt} — try PNG or JPEG',

		// Image ↔ Base64
		i2bToB64: 'Image → Base64',
		i2bFromB64: 'Base64 → image',
		i2bInput: 'Data URL or raw Base64',
		i2bDataUrl: 'Data URL',
		i2bRawB64: 'Raw Base64',
		i2bCss: 'CSS background',
		i2bHtml: 'HTML <img>',
		i2bEncodedSize: 'Base64 size',
		i2bOverhead: '+{pct}% vs binary',
		i2bNote:
			'Inlining saves a request but bloats the document and defeats caching — best for icons and other assets under ~10 KB.',

		// Image converter
		icTarget: 'Convert to',
		icQuality: 'Quality',
		icConverted: 'Converted',
		icSmaller: 'smaller than original',
		icLarger: 'larger than original',
		icBgNote: 'JPEG has no transparency — transparent areas are flattened onto white.',
		icNote:
			"Conversion uses your browser's canvas encoder, so exact file sizes vary slightly between browsers.",

		// Favicon generator
		fgAppleBg: 'Apple icon background',
		fgFiles: 'Generated files',
		fgHtml: 'HTML <link> tags',
		fgSmall: 'Source is {px}px — icons above that size will be upscaled and may look soft',
		fgNote:
			'The ICO packs 16, 32 and 48 px. Apple touch icons cannot be transparent, so theirs is flattened onto the chosen background; PWA icons keep their alpha. Non-square sources are center-cropped.',

		// Image resizer
		irBy: 'Resize by',
		irWidth: 'Width',
		irHeight: 'Height',
		irPercent: 'Percent',
		irFormat: 'Format',
		irKeep: 'Keep',
		irResized: 'Resized',
		irScale: 'Scale',
		irNote:
			'Downscaling uses high-quality smoothing. Upscaling cannot invent detail — expect softness beyond 2×.',

		// JSON → CSV
		jcInput: 'JSON array of objects',
		jcDelimiter: 'Delimiter',
		jcComma: 'Comma',
		jcSemicolon: 'Semicolon (EU Excel)',
		jcTab: 'Tab',

		// JSON formatter
		jfInput: 'JSON input',
		jfIndent: 'Indent',
		jfIndentation: 'Indentation',
		jfSp2: '2 spaces',
		jfSp4: '4 spaces',
		jfTabs: 'Tabs',
		jfMin: 'Minified — no whitespace',
		jfSortKeys: 'Sort keys',
		jfText: 'Text',
		jfTree: 'Tree',
		jfTreeHint: 'Hover a node to copy its JSONPath — try it in the',
		jfTreeLink: 'JSONPath tester',

		// JSONPath
		jpExpr: 'JSONPath expression',
		jpDoc: 'JSON document',
		jpMatches: 'Matches',
		jpResults: 'Result values',

		// JSON → TypeScript
		jtInput: 'JSON sample',
		jtRoot: 'Root type name',
		jtNote:
			'Inferred from this one sample — mark fields optional and widen nullables where your data varies.',

		// JSON ↔ YAML ↔ TOML
		jyFrom: 'From',
		jySource: 'Source format',
		jyAutoT: 'Detect the source format from the content',
		jyTarget: 'Target format',
		jyInput: 'Input',
		jyUnknown: 'unknown format',

		// JWT
		jwtAnatomy: 'Token anatomy',
		jwtHeader: 'header',
		jwtPayload: 'payload',
		jwtSignature: 'signature (not verified)',
		jwtIssued: 'Issued',
		jwtExpires: 'Expires',
		jwtNotBefore: 'Not before',
		jwtLifetime: 'Lifetime',
		jwtNote:
			"Decoding only reads the token — it does not verify the signature. Verify signatures server-side with the issuer's keys.",

		// Lorem
		loremUnit: 'Unit',
		loremWords: 'Words',
		loremSentences: 'Sentences',
		loremParagraphs: 'Paragraphs',
		loremClassic: 'Start with “Lorem ipsum…”',

		// Password
		pwWeak: 'Weak',
		pwFair: 'Fair',
		pwStrong: 'Strong',
		pwExcellent: 'Excellent',
		pwNoLookalikes: 'No look-alikes (0O1lI)',
		pwEntropy: 'Entropy',
		pwBits: 'bits',
		pwNote: '≥ 80 bits withstands offline cracking of fast hashes; ≥ 100 bits is effectively unguessable.',
		pwOut: 'Passwords',
		pwCrypto: 'Generated with crypto.getRandomValues, in your browser only. Nothing is stored or transmitted.',

		// QR
		qrContent: 'Content',
		qrEc: 'Error correction',
		qrEcT: 'Survives {pct} damage',
		qrSvg: 'SVG (vector, print)',
		qrPng: 'PNG (chat, slides)',
		qrNote: 'The content is encoded directly — no redirect service, nothing expires, no scan tracking.',

		// Regex
		rxPattern: 'Pattern',
		rxTest: 'Test string',
		rxTestPh: 'Paste text to test the pattern against',
		rxHighlighted: 'Highlighted',
		rxMatches: 'Matches',
		rxMatched: 'Matched text',

		// Slug
		slugInput: 'Title (one per line)',
		slugSep: 'Separator',
		slugHyphen: 'Hyphen',
		slugUnderscore: 'Underscore',
		slugMax: 'Max length',
		slugOut: 'Slug',

		// Sort lines
		slInput: 'Lines',
		slPh: 'one per line',
		slSort: 'Sort',
		slKeep: 'Keep order',
		slAsc: 'Ascending',
		slDesc: 'Descending',
		slNatural: 'Natural — numbers in order',
		slLength: 'By line length',
		slShuffle: 'Shuffle',
		slDedupe: 'Dedupe',
		slIgnoreCase: 'Ignore case',
		slTrim: 'Trim',
		slDropEmpty: 'Drop empty',

		// Timestamp
		tsInput: 'Timestamp or date',
		tsNow: 'Current unix time:',
		tsNowT: 'Use current time as input',
		tsRelative: 'Relative',
		tsUnixS: 'Unix seconds',
		tsUnixMs: 'Unix milliseconds',
		tsZones: 'Across timezones',
		tsNote: "The marker shows each zone's local hour on a 24h strip — dimmed ends are 21:00–07:00.",

		// User-Agent
		uaInput: 'User-Agent string',
		uaBrowser: 'Browser',
		uaEngine: 'Engine',
		uaOs: 'Operating system',
		uaDevice: 'Device',
		uaNote:
			"The “Sample” button inserts your own browser's User-Agent. Use feature detection, not UA sniffing, for runtime decisions.",

		// Unicode
		uniInput: 'Text to inspect',
		uniPh: 'Paste anything — invisible characters become visible here',
		uniGraphemes: 'Graphemes',
		uniGraphemesHint: 'what users see',
		uniCodePoints: 'Code points',
		uniUtf16: 'UTF-16 units',
		uniUtf16Hint: 'JS .length',
		uniUtf8: 'UTF-8 bytes',
		uniLimit: 'Showing the first 300 characters.',

		// URL parser
		upInput: 'URL',
		upProtocol: 'Protocol',
		upHost: 'Host',
		upHostname: 'Hostname',
		upPort: 'Port',
		upPath: 'Path',
		upFragment: 'Fragment',
		upOrigin: 'Origin',
		upQuery: 'Query parameters',
		upDefault: '(default)',
		upNone: '(none)',
		upEmpty: 'URL components appear here',

		// URL encode/decode
		urlComponent: 'Component mode (encodeURIComponent)',
		urlInputDec: 'Encoded text to decode',

		// UUID
		uuidOut: 'Generated IDs',
		uuidFormat: 'ID format',
		uuidHintV4: 'random',
		uuidHintV7: 'time-ordered',
		uuidHintUlid: 'time-ordered, base32',
		uuidHintNano: 'short, url-safe',
		uuidNote:
			'Generated with crypto.getRandomValues — cryptographically secure, created in your browser, never logged anywhere.',

		// Word counter
		wcWords: 'Words',
		wcChars: 'Characters',
		wcCharsHint: '{n} without spaces',
		wcReading: 'Reading time',
		wcReadingHint: 'at 220 wpm',
		wcLines: 'Lines',
		wcSentences: 'Sentences',
		wcParagraphs: 'Paragraphs',
		wcAvg: 'Avg word length'
	},
	categories: CATEGORY_LABELS,
	tools: Object.fromEntries(
		TOOLS.map((t) => [t.slug, { name: t.name, description: t.description }])
	)
};

export default en;
