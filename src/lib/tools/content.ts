/**
 * Per-tool SEO content. Every entry is written individually — no shared
 * template sentences — so tool pages don't read as programmatically
 * generated thin content.
 */

export interface ToolFaq {
	q: string;
	a: string;
}

export interface ToolContent {
	/** Intro paragraphs rendered in the "About this tool" section. */
	about: string[];
	faqs: ToolFaq[];
}

export const TOOL_CONTENT: Record<string, ToolContent> = {
	'json-formatter': {
		about: [
			"Paste any JSON — an API response, a config file, a log line — and this formatter pretty-prints it with your choice of indentation, or minifies it for embedding. Parsing uses the browser's native JSON engine, so what validates here is exactly what JavaScript and every JSON-compliant parser will accept.",
			'When the input is invalid, the error is annotated with the exact line and column where parsing failed, instead of a vague "unexpected token" somewhere. Combined with the monospaced editor, hunting a missing comma in a 500-line payload becomes a ten-second job. You can also sort object keys alphabetically, which helps before diffing two payloads.',
			'Formatting runs entirely in your browser. Payloads containing tokens, customer records or internal URLs never leave your machine — there is no server that could log them.'
		],
		faqs: [
			{
				q: 'Why does my JSON fail with "Unexpected token" even though it looks fine?',
				a: "The usual culprits are trailing commas after the last item, single quotes instead of double quotes, unquoted keys, or comments. All of these are fine in JavaScript object literals (or JSON5) but not in strict JSON. The line/column marker points at the first offending character."
			},
			{
				q: 'Is there a size limit?',
				a: 'No hard limit — parsing is local, so it depends on your machine. Documents up to tens of megabytes format fine in a modern browser; beyond that the tab may slow down because the whole document is held in memory.'
			},
			{
				q: 'Does formatting change my data?',
				a: 'Only whitespace, unless you enable key sorting. Numbers are re-serialized by the JavaScript engine, so 1e2 becomes 100 and integers beyond IEEE-754 double precision are normalized — the same thing any JS-based consumer of your JSON would do.'
			},
			{
				q: 'Can I validate JSON without reformatting it?',
				a: 'Yes — the status badge above the input updates as you type and reports whether the document parses, its size, and where the first error is. You only need the Format action when you want the output rewritten.'
			}
		]
	},

	'base64-decode': {
		about: [
			'Base64 turns arbitrary bytes into a 64-character alphabet that survives being pasted into JSON, URLs, HTTP headers and email. This tool converts in both directions: type or paste text to encode it, or paste an encoded blob to get the original back. UTF-8 is handled correctly both ways, so emoji and non-Latin scripts round-trip without mangling.',
			'The decoder is forgiving on purpose: it accepts the URL-safe alphabet (- and _ in place of + and /), strips whitespace and line breaks, and restores missing padding before decoding — the three things that most often make stricter decoders reject perfectly recoverable input. If the decoded bytes are not valid UTF-8 text it says so instead of printing garbage, which usually means the payload was binary data such as an image.',
			'Everything happens in the page. Decoding a token or credential here does not transmit it anywhere.'
		],
		faqs: [
			{
				q: 'Why does my Base64 string end with = signs?',
				a: "Base64 encodes 3 bytes into 4 characters, so when the input length isn't a multiple of 3 the output is padded with = to keep groups aligned. Padding carries no data; this decoder restores it automatically if it was stripped."
			},
			{
				q: 'What is the difference between standard and URL-safe Base64?',
				a: 'Standard Base64 uses + and /, which have special meaning in URLs and must themselves be escaped. The URL-safe variant (RFC 4648 §5) swaps them for - and _ and usually drops padding. JWTs, for example, use the URL-safe form. The encoder here offers both; the decoder accepts either automatically.'
			},
			{
				q: 'Is Base64 encryption?',
				a: 'No. Base64 is a reversible encoding with no key — anyone can decode it. It protects data from transport corruption, not from being read. If you need confidentiality, encrypt first and encode the ciphertext.'
			},
			{
				q: 'Why does decoding say the result is not valid UTF-8?',
				a: 'The string decoded successfully, but the resulting bytes are not text — often a PNG, a PDF, or compressed/encrypted data. Decoding such content to a text box would show mojibake, so the tool flags it instead.'
			}
		]
	},

	'timestamp-converter': {
		about: [
			'Unix time counts seconds since 1970-01-01T00:00:00 UTC, and it shows up everywhere: database rows, JWT claims, log files, API responses. This converter accepts a timestamp in seconds or milliseconds — it detects which by magnitude — as well as ISO 8601 strings and most human-readable dates, and shows every representation at once: ISO, UTC, your local time, relative time, and both unix precisions.',
			'The unit ambiguity is the classic trap: 1700000000 is November 2023 in seconds but January 1970 in milliseconds. The detected unit is displayed explicitly, and you can override it with one click when the guess is wrong — no more mentally counting digits.',
			'Conversion is instant and local, and the current-time display keeps ticking so the page doubles as an epoch clock while you work.'
		],
		faqs: [
			{
				q: 'How does the tool decide between seconds and milliseconds?',
				a: 'By magnitude: values of 11 digits or more are treated as milliseconds, shorter ones as seconds. That maps seconds to years up to ~5138 and milliseconds from ~1973 onward, which resolves every realistic modern timestamp unambiguously. You can flip the unit manually for edge cases.'
			},
			{
				q: 'What happens after 2038?',
				a: 'The year-2038 problem affects systems that store unix time in a signed 32-bit integer. JavaScript numbers are 64-bit floats, so this converter handles dates far beyond 2038 — well past the year 275760, the JavaScript Date limit.'
			},
			{
				q: 'Can I convert a date back to a timestamp?',
				a: 'Yes. Paste an ISO 8601 string like 2026-07-20T12:00:00Z, or most conventional date formats, and the unix seconds and milliseconds appear alongside the other representations.'
			},
			{
				q: 'Which timezone is used for the local time row?',
				a: "Your browser's configured timezone, via the Intl API — nothing is looked up remotely. The timezone name is printed next to the value so screenshots stay unambiguous."
			}
		]
	},

	'jwt-decoder': {
		about: [
			'A JSON Web Token is three Base64URL segments — header, payload, signature — joined by dots. This decoder splits a token and renders header and payload as formatted JSON, flags the registered time claims (iat, exp, nbf) as human-readable dates, and tells you at a glance whether the token has expired.',
			'Decoding is not verification: the payload of any JWT can be read by anyone who holds it, because Base64URL is an encoding, not encryption. That is also why pasting a token into a random website is normally a bad idea — this page is the exception, because decoding happens entirely in your browser and the token is never transmitted. Signature verification against a secret or public key is deliberately out of scope for the offline decoder.',
			'A leading "Bearer " prefix is stripped automatically, so you can paste straight from an Authorization header.'
		],
		faqs: [
			{
				q: 'Is it safe to paste a production token here?',
				a: 'The token stays in your browser — this page performs no network requests with your input, which you can confirm in the developer tools network tab. Still, treat live tokens like passwords as a habit: prefer expired or test tokens when sharing screenshots.'
			},
			{
				q: 'Why does my token fail to decode?',
				a: 'Check that it has exactly three dot-separated segments and no line breaks from copy-wrapping. Opaque access tokens (e.g. many GitHub or Google tokens) are not JWTs at all — no amount of decoding will open a random string that never contained JSON.'
			},
			{
				q: 'What do iat, exp and nbf mean?',
				a: 'They are registered claims from RFC 7519, all in unix seconds: iat is when the token was issued, exp is when it stops being valid, and nbf ("not before") is the earliest moment it may be accepted. This tool converts each to a readable date and compares exp against your clock.'
			},
			{
				q: 'Can this tool verify the signature?',
				a: 'No — and a green checkmark from an online tool should not be trusted for security decisions anyway. Verify signatures in your backend with a maintained library (jose, jsonwebtoken, PyJWT) against the issuer\'s actual keys.'
			}
		]
	},

	'regex-tester': {
		about: [
			'Write a pattern, paste sample text, and every match is highlighted as you type — with capture groups, named groups and match positions listed underneath. The tester uses the JavaScript RegExp engine, so behavior matches exactly what Node.js and browsers will do, including lookbehind, named groups and Unicode property escapes.',
			'Flags are toggled per letter (g, i, m, s, u, y, d) and the pattern is compiled on every keystroke; syntax errors surface immediately with the engine\'s own message rather than after you hit a button. Empty-match patterns like a* are handled safely, and runaway inputs are capped at 10,000 matches so a stray .* cannot freeze the tab.',
			'Regex dialects differ between engines — a pattern that works here may need adjustment for PCRE, RE2 or Python\'s re module, mostly around lookbehind support, possessive quantifiers and inline flags.'
		],
		faqs: [
			{
				q: 'Which regex flavor does this tester use?',
				a: "ECMAScript (JavaScript), as implemented by your own browser. It supports lookahead, lookbehind, named capture groups, backreferences and Unicode property escapes like \\p{Letter} (with the u flag). It does not support PCRE-only syntax such as possessive quantifiers or recursion."
			},
			{
				q: 'Why does my pattern match everything / nothing?',
				a: 'The two classic causes: an unescaped metacharacter (. matches any character — escape it as \\. for a literal dot), or a missing g flag mentally — this tester always finds all matches, but your code will only find the first unless g is set.'
			},
			{
				q: 'What are named capture groups?',
				a: 'Syntax (?<name>...) labels a group so you can read matches by name instead of position: match.groups.name in JavaScript. The groups panel below the matches shows both numbered and named captures for each match.'
			},
			{
				q: 'Can a regex from here run unchanged in Python or Go?',
				a: 'Often, but not always. Character classes, quantifiers and anchors are portable; lookbehind, named-group syntax (Python uses (?P<name>...)) and inline flags differ. Go\'s RE2 engine additionally rejects backreferences and lookaround entirely.'
			}
		]
	},

	'diff-checker': {
		about: [
			'Paste an original text on the left and a changed version on the right, and get a unified line-by-line comparison: deletions marked in red, additions in green, context preserved in between, with original line numbers on both sides. It is the fastest way to answer "what actually changed?" between two configs, two API responses, or two versions of a snippet someone pasted in chat.',
			'The comparison uses a longest-common-subsequence algorithm over lines, the same family of algorithm behind git diff, so reordered blocks and small edits produce a readable result rather than marking everything as changed. A summary line totals added and removed lines.',
			'Because both texts stay in the page, diffing confidential material — contracts, credentials in configs, unreleased copy — carries none of the risk of pasting it into a random web service.'
		],
		faqs: [
			{
				q: 'Does the diff work on words or lines?',
				a: 'Lines. Each line is compared as a unit, which matches how developers read diffs of code and config. A changed line therefore shows as one deletion plus one addition; character-level inline highlighting is on the roadmap.'
			},
			{
				q: 'Why does my diff show everything as changed?',
				a: 'Usually invisible differences: one side uses tabs and the other spaces, Windows CRLF line endings versus Unix LF, or trailing whitespace. Normalizing whitespace before comparing (the JSON formatter with sorted keys helps for JSON payloads) makes the real changes visible.'
			},
			{
				q: 'Can I diff two JSON responses meaningfully?',
				a: 'Yes — format both through the JSON formatter with key sorting enabled first, so equivalent documents serialize identically. Then the diff shows genuine value changes instead of key-order noise.'
			},
			{
				q: 'Is there a maximum text size?',
				a: 'The algorithm compares every line of one text against every line of the other, so extremely large files (tens of thousands of lines on both sides) can take a moment. Typical code files and API payloads compare instantly.'
			}
		]
	},

	'url-encode-decode': {
		about: [
			'Characters like spaces, ampersands and non-ASCII letters cannot appear raw in a URL, so they are percent-encoded: a space becomes %20, 你 becomes %E4%BD%A0. This tool encodes text for safe inclusion in URLs and decodes percent-escaped strings back to readable text, including the + convention for spaces used in query strings.',
			'Two encoding modes are offered because JavaScript itself has two: component mode (encodeURIComponent) escapes everything that could delimit a URL, which is what you want for a single query-string value; full-URI mode (encodeURI) preserves structural characters like /, ? and &, for when you are encoding an entire URL that must stay navigable.',
			'Decoding is strict about malformed % sequences — a lone % or %ZZ is reported as an error rather than silently passed through, which is exactly how browsers and servers will treat it.'
		],
		faqs: [
			{
				q: 'When do I use component mode versus full-URI mode?',
				a: "Encoding a value that goes inside a URL (a search query, a redirect target, an email address in a parameter) → component mode, so & and = inside the value don't break the query string. Encoding a complete URL for display or transport → full-URI mode, so the URL structure survives."
			},
			{
				q: 'Why does + sometimes mean a space?',
				a: 'The application/x-www-form-urlencoded format — used by HTML form submissions and query strings — historically encodes spaces as +. In URL paths, + is just a plus. The decoder here treats + as a space, matching query-string semantics; %20 always works everywhere.'
			},
			{
				q: 'Why is my string double-encoded (%2520)?',
				a: '%25 is the encoding of % itself, so %2520 means the text %20 was encoded a second time. It happens when two layers of a system each encode. Run decode twice here to unwrap it, then fix the layer that should not be encoding.'
			},
			{
				q: 'Are Unicode characters handled correctly?',
				a: 'Yes — text is encoded as UTF-8 first and each byte percent-escaped, per the WHATWG URL standard. That is why one CJK character becomes three %XX groups.'
			}
		]
	},

	'url-parser': {
		about: [
			'Paste a URL and see it dissected: protocol, host, port, path, fragment, and every query parameter as a decoded key-value table. It uses the same WHATWG URL parser your browser uses for navigation, so the interpretation you see is the interpretation a browser will actually apply — including edge cases like default ports being dropped and paths being normalized.',
			'The query-parameter table is the part you will use most: long OAuth redirects, analytics-tagged links and API calls become readable at a glance, each value already percent-decoded. Bare domains without a scheme are accepted too; https:// is assumed for parsing.',
			'It pairs naturally with the URL encoder — parse a URL here to find the parameter you need, edit the value, then re-encode it there.'
		],
		faqs: [
			{
				q: 'Why does the parsed URL differ slightly from what I pasted?',
				a: 'The WHATWG parser normalizes: it lowercases the scheme and host, removes default ports (:443 for https), resolves ./ and ../ path segments, and encodes characters that need it. What you see is the canonical form servers and browsers agree on.'
			},
			{
				q: 'Can it handle URLs with duplicate query keys?',
				a: 'Yes — every occurrence is listed as its own row, in order. Duplicate keys are legal and common: many APIs read them as arrays (?tag=a&tag=b).'
			},
			{
				q: 'What is the difference between host and hostname?',
				a: 'hostname is just the domain (example.com); host includes an explicit non-default port (example.com:8080). When the port is the scheme default, both look the same because the port is omitted.'
			},
			{
				q: 'Does the fragment (#...) get sent to the server?',
				a: 'No. Everything after # stays in the browser — servers never see it. That is why single-page apps historically used it for client-side routing, and why analytics parameters placed after # are invisible to the backend.'
			}
		]
	},

	'uuid-generator': {
		about: [
			'Generate universally unique identifiers in four flavors: UUID v4 (fully random, the everyday default), UUID v7 (time-ordered, the modern choice for database keys), ULID (time-ordered with a compact Crockford Base32 spelling), and Nano ID (short, URL-friendly). Generate one or up to a thousand at a time — one per line, ready to paste into a seed script.',
			'Randomness comes from the Web Crypto API (crypto.getRandomValues), the cryptographically secure source, not Math.random. Generation is local, which means the IDs are not known to anyone else, not logged anywhere, and available offline.',
			'If you are choosing an ID format for a new system: v7 and ULID sort by creation time, which keeps B-tree indexes happy and makes IDs roughly chronological in logs; v4 reveals nothing about when it was made, which is occasionally exactly what you want.'
		],
		faqs: [
			{
				q: 'What is the difference between UUID v4 and v7?',
				a: 'v4 is 122 random bits. v7 (RFC 9562) leads with a 48-bit unix-millisecond timestamp followed by random bits, so IDs generated later sort later. For database primary keys v7 typically improves insert locality and index size; v4 remains fine where ordering is irrelevant or timing must not leak.'
			},
			{
				q: 'Can two generated UUIDs collide?',
				a: 'With 122 random bits, the probability is so small it is not worth engineering around: you would need to generate billions of IDs per second for decades to reach even a remote chance. Collisions in practice come from bugs (reusing a seed, copying rows), not from randomness.'
			},
			{
				q: 'Why choose ULID over UUID v7?',
				a: 'They solve the same problem. ULID is 26 characters of case-insensitive Crockford Base32 — shorter and cleaner in URLs and logs — while v7 keeps the standard 36-character UUID shape that every database and library already accepts. Pick whichever your ecosystem handles more natively.'
			},
			{
				q: 'Are these IDs safe to use as secrets or tokens?',
				a: 'The randomness is cryptographically secure, but IDs are usually displayed, logged and indexed — treated as public. For session tokens or API keys, generate a dedicated secret with at least 128 random bits and treat it like a password instead.'
			}
		]
	},

	'hash-generator': {
		about: [
			'Compute MD5, SHA-1, SHA-256, SHA-384 and SHA-512 digests of any text, plus keyed HMAC signatures, directly in the browser. The SHA family and HMAC use the Web Crypto API — the same audited primitives your browser uses for TLS — while MD5 (which Web Crypto deliberately omits) ships as a small local implementation for legacy checksum work.',
			'Hashes update live as you type, and every algorithm is computed at once, so comparing a value against a checksum in whatever algorithm a download page chose requires no configuration. HMAC mode adds a secret key field for verifying webhook signatures — GitHub, Stripe and most webhook providers sign payloads with HMAC-SHA256.',
			'Since input never leaves the page, it is safe to hash things you could not paste into an online service: API payloads, passwords you are checking against a leaked-hash list, internal documents.'
		],
		faqs: [
			{
				q: 'Which hash algorithm should I use?',
				a: 'For anything security-relevant today: SHA-256 or stronger. MD5 and SHA-1 are broken for collision resistance — two different inputs can be crafted with the same digest — so they survive only for non-adversarial checksums and legacy protocol compatibility.'
			},
			{
				q: 'Why is MD5 still offered at all?',
				a: 'Because you still meet it: ETags, cache keys, file manifests, old database columns. Verifying such values requires computing MD5 regardless of its cryptographic status. Just do not design anything new around it.'
			},
			{
				q: 'What is HMAC and how is it different from a plain hash?',
				a: 'HMAC mixes a secret key into the hashing so only key-holders can produce or verify the digest. A plain hash proves integrity ("this data is unchanged"); an HMAC also proves authenticity ("someone with the key produced this"). Webhook signature verification is the everyday use.'
			},
			{
				q: 'Is hashing the same as encrypting a password?',
				a: 'No, and fast hashes like SHA-256 are the wrong tool for storing passwords — attackers can try billions per second. Password storage needs a deliberately slow, salted algorithm: bcrypt, scrypt or Argon2.'
			}
		]
	},

	'color-converter': {
		about: [
			'Enter a color in any common notation — #hex, rgb(), hsl(), or a CSS named color — and get all formats at once: HEX, RGB, HSL and OKLCH, next to a live swatch. Alpha channels are preserved across formats, and output uses modern CSS syntax (space-separated channels) that pastes cleanly into current stylesheets.',
			'OKLCH is included because it is where CSS color is heading: unlike HSL, its lightness axis is perceptually uniform, so two colors with the same L actually look equally bright, and adjusting hue does not accidentally change perceived brightness. Converting an existing palette to OKLCH is the first step to building consistent color scales.',
			'Conversion math runs locally using the published sRGB↔OKLab transforms, and values round-trip: the RGB you get back from an HSL input is exactly what the browser would compute.'
		],
		faqs: [
			{
				q: 'Why do HSL and OKLCH lightness values disagree?',
				a: "HSL lightness is a geometric property of RGB values, not of human vision — hsl(60 100% 50%) yellow looks far brighter than hsl(240 100% 50%) blue despite identical L. OKLCH's L axis is designed to match perception, so equal L means equal apparent brightness. The disagreement is the entire reason OKLCH exists."
			},
			{
				q: 'What does the alpha value mean and where does it go in each format?',
				a: 'Alpha is opacity, 0 (transparent) to 1 (opaque). In 8-digit hex it is the final byte (#RRGGBBAA); in modern functional syntax it follows a slash: rgb(76 141 255 / 0.5). This converter carries alpha through every format automatically.'
			},
			{
				q: 'Can every OKLCH color be shown in sRGB?',
				a: 'No — OKLCH covers wide gamuts, and some chroma/lightness combinations have no sRGB equivalent. Converting from sRGB (as this tool does) always stays representable; going the other way, out-of-gamut colors must be clipped or mapped, which is why a vivid P3 green looks duller on an sRGB screen.'
			},
			{
				q: 'Why space-separated rgb(76 141 255) instead of commas?',
				a: 'CSS Color Module Level 4 standardized space-separated channels with an optional /alpha, and every modern browser supports it. The comma form still works, but the space form is what new specs (and this tool) use.'
			}
		]
	}
};
