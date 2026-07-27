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

	'case-converter': {
		about: [
			'Identifiers travel between conventions constantly: the API returns snake_case, your TypeScript wants camelCase, the CSS class needs kebab-case, and the environment variable demands CONSTANT_CASE. This converter takes any mixed input — spaces, underscores, hyphens, existing camelCase — splits it into words intelligently, and re-joins it in nine target styles at once.',
			'The splitter understands the tricky cases: it breaks "getUserByID" into get/user/by/id (keeping the acronym intact until the boundary), treats digits as part of their word, and processes each line independently, so you can paste a whole column of database fields and convert them in one go.',
			'Every style is shown simultaneously with a per-row copy button — no picking a mode first, just paste and grab the one you need.'
		],
		faqs: [
			{
				q: 'How are acronyms like "HTTPResponse" handled?',
				a: 'A run of capitals followed by a lowercase letter is split before the last capital: HTTPResponse → http + response. This matches how most style guides expect acronyms to tokenize, though no splitter can guess intent perfectly — edge cases like "IOError" become io + error.'
			},
			{
				q: 'Can I convert many identifiers at once?',
				a: 'Yes — each line converts independently. Paste a list of column names, one per line, and the output preserves the line structure in the new style.'
			},
			{
				q: 'What is the difference between Title Case and Sentence case here?',
				a: 'Title Case capitalizes every word ("User Account Id"); Sentence case capitalizes only the first ("User account id"). Neither applies the editorial rules about articles and prepositions — for identifiers you almost never want those.'
			},
			{
				q: 'Why does converting back and forth not always restore my original?',
				a: 'Splitting into words discards information — "user_ID_2" and "userId2" tokenize identically. Conversions are deterministic forward, but the original spelling of word boundaries cannot always be reconstructed backward.'
			}
		]
	},

	'word-counter': {
		about: [
			'A live word and character counter with the numbers developers and writers actually need: words, characters with and without spaces, UTF-8 bytes (what your database column or API limit really measures), lines, sentences, paragraphs, and an estimated reading time at a typical 220 words per minute.',
			'Characters are counted as Unicode code points, not UTF-16 units, so emoji and CJK text count the way a human would expect — and the separate byte count makes the difference visible: 日本語 is 3 characters but 9 bytes. That distinction is exactly what bites when a VARCHAR(255) column rejects a 200-"character" string.',
			'Everything updates as you type, with nothing sent anywhere — safe for counting drafts of announcements, contracts, or anything else not ready for the world.'
		],
		faqs: [
			{
				q: 'Why do the character and byte counts differ?',
				a: 'Characters are Unicode code points; bytes are their UTF-8 encoding. ASCII letters are 1 byte each, most European accented letters 2, CJK characters 3, and emoji 4 (or more in sequences). Database limits, HTTP headers and many APIs measure bytes, not characters.'
			},
			{
				q: 'How are words counted for languages without spaces?',
				a: 'Word counting splits on whitespace, which undercounts unsegmented text in Chinese or Japanese. For those languages the character count is the more meaningful metric, which is why both are always shown.'
			},
			{
				q: 'What counts as a sentence?',
				a: 'A run of text ending in ., !, ?, or … followed by whitespace or the end of input. Abbreviations like "e.g." can inflate the count slightly — sentence counting is inherently heuristic.'
			},
			{
				q: 'How accurate is the reading time?',
				a: 'It divides the word count by 220 wpm, a common average for adult silent reading of general prose. Technical material with code reads slower; skimmable listicles read faster. Treat it as an order-of-magnitude estimate.'
			}
		]
	},

	'lorem-ipsum-generator': {
		about: [
			'Placeholder text for layouts, mockups and seed data, generated in your browser: pick words, sentences or paragraphs, set a count, and copy. The output draws from the classic scrambled-Cicero vocabulary, so it looks like natural Latin-ish prose without forming distracting readable sentences.',
			'By default the text opens with the traditional "Lorem ipsum dolor sit amet" — the phrase designers and reviewers instantly recognize as placeholder — and you can switch that off for fully random output when you need multiple distinct blocks.',
			'Sentence lengths and paragraph sizes vary randomly within realistic ranges, so the resulting text has the visual rhythm of real copy — important when you are judging typography or line-wrapping, where uniform sentences look artificial.'
		],
		faqs: [
			{
				q: 'Where does lorem ipsum come from?',
				a: 'It is scrambled fragments of Cicero\'s "De finibus bonorum et malorum" (45 BC), used as filler by typesetters since at least the 1960s and popularized by Letraset sheets and later desktop publishing software.'
			},
			{
				q: 'Why use lorem ipsum instead of real text?',
				a: 'Readable content hijacks attention — reviewers start editing the words instead of judging the layout. Pseudo-Latin has natural letter frequencies and word lengths without being readable, which keeps focus on the design.'
			},
			{
				q: 'Is the generated text always the same?',
				a: 'No — words are drawn randomly each time, so two generations differ. Only the optional classic opening phrase is fixed.'
			},
			{
				q: 'Can I generate a specific word count for a CMS field limit?',
				a: 'Yes — set the unit to words and the count to exactly what you need, up to 1000 at a time. Pair it with the word counter tool to verify against character or byte limits.'
			}
		]
	},

	'slug-generator': {
		about: [
			'Turn any title into a URL-ready slug: lowercase, hyphen-separated, stripped of punctuation, with accents transliterated to plain ASCII — "Crème brûlée à Paris" becomes "creme-brulee-a-paris". Options cover the common variations: underscore separators, preserved casing, and a maximum length that cuts at a word boundary instead of mid-word.',
			'Slugs matter for both humans and search engines: they are readable in the address bar, survive copy-pasting into chat without percent-escaping, and give search results a keyword-bearing URL. The transliteration step is what most homemade slugify functions skip — without it, accented titles either break URLs or vanish entirely.',
			'Each line slugifies independently, so a pasted list of article titles becomes a matching list of slugs in one operation.'
		],
		faqs: [
			{
				q: 'Why hyphens instead of underscores?',
				a: 'Search engines treat hyphens as word separators but historically treated underscores as word joiners, and hyphens are visually clearer in underlined link text. Underscores remain popular for file names and identifiers, so both are offered.'
			},
			{
				q: 'What happens to non-Latin scripts like Chinese or Cyrillic?',
				a: 'Characters with ASCII equivalents (accented Latin, a few special letters like ß → ss) are transliterated; scripts without a simple Latin mapping are removed. For non-Latin content, common practice is either keeping the native script percent-encoded in the URL or writing a manual romanized slug.'
			},
			{
				q: 'Is there an ideal slug length?',
				a: 'Shorter is better for sharing and display, but there is no ranking cliff. The max-length option trims at a word boundary — useful for CMSes that cap slug columns at 50–80 characters.'
			},
			{
				q: 'Should the slug change when the title changes?',
				a: 'Once published, ideally not — the URL is an address others have linked to. Most sites keep the original slug or add a redirect. Generate slugs at creation time and treat renames as a deliberate redirect decision.'
			}
		]
	},

	'sort-lines': {
		about: [
			'A line-processing workbench: paste any list and sort it alphabetically, in reverse, naturally (item2 before item10), by length, or shuffle it — while optionally trimming whitespace, dropping empty lines, and removing duplicates with order preserved. The removed-line count is reported so you can see exactly what deduplication did.',
			'Natural sort is the option you will reach for most: plain alphabetical sorting puts "item10" before "item2" because it compares character by character, while natural sort compares embedded numbers numerically — the order humans expect for filenames, versions and IDs.',
			'Deduplication keeps the first occurrence and preserves the original order of survivors, which matters when the list order is meaningful (imports, config lines, playlists). A case-insensitive mode treats "Apple" and "apple" as the same line.'
		],
		faqs: [
			{
				q: 'What is the difference between alphabetical and natural sort?',
				a: 'Alphabetical compares character codes, so "file10" < "file2" (because "1" < "2" at position 5). Natural sort recognizes digit runs and compares them as numbers, giving file2 < file10. Use natural for anything containing numbers.'
			},
			{
				q: 'Does dedupe keep the first or last occurrence?',
				a: 'The first. Lines are scanned top to bottom and a line is dropped only if an identical one (or case-equal, in case-insensitive mode) appeared earlier — so the surviving order matches the original.'
			},
			{
				q: 'How large a list can this handle?',
				a: 'Hundreds of thousands of lines are fine — operations are simple passes and a sort. Everything stays in browser memory, so the practical limit is your machine, not a server quota.'
			},
			{
				q: 'Can I combine operations?',
				a: 'Yes, and they apply in a sensible order: trim first, then remove empties, then dedupe, then sort — so " apple " and "apple" dedupe together when trim is on, and sorting always sees the cleaned list.'
			}
		]
	},

	'html-entities': {
		about: [
			'Escape text for safe inclusion in HTML — & becomes &amp;, < becomes &lt; — or decode entity-laden text back to readable characters, covering named entities (&rarr;), decimal (&#169;) and hexadecimal (&#xA9;) numeric references.',
			'Encoding offers two levels: the five essential characters that break HTML structure (& < > " \'), which is all you need for correctness, or everything non-ASCII, useful when a toolchain mangles UTF-8 somewhere between you and the page. A numeric-only mode skips named entities for maximum compatibility with strict XML parsers, which only guarantee the five predefined ones.',
			'The decoder is the everyday half: paste a scraped snippet or an API response full of &#x27; and get clean text. Unknown entity names pass through untouched rather than being guessed.'
		],
		faqs: [
			{
				q: 'Which characters must be escaped in HTML?',
				a: 'In text content: & and <. In attribute values: also the quote character delimiting the attribute (" or \'). Escaping > is conventional but not strictly required. Everything else can appear literally in a UTF-8 document.'
			},
			{
				q: 'Is entity-encoding a defense against XSS?',
				a: 'Escaping the five structural characters is the core of HTML-context output encoding, yes — but only for HTML text and attribute contexts. URLs, JavaScript strings and CSS need their own context-specific encodings; entity-escaping alone does not make arbitrary injection safe there.'
			},
			{
				q: 'Named or numeric entities — which should I emit?',
				a: 'Numeric references (&#xE9;) work in every HTML and XML parser. Named entities are more readable but XML only predefines five, so &eacute; breaks a strict XML/XHTML pipeline. When in doubt, numeric.'
			},
			{
				q: 'Why do I see &amp;#39; (double-encoded) in my data?',
				a: 'Two layers each encoded once: the & of the first encoding was itself escaped by a second pass. Decode twice here to recover the text, then find and fix the layer that should not be encoding.'
			}
		]
	},

	'unicode-inspector': {
		about: [
			'Paste any text and see each character dissected: its code point (U+XXXX), UTF-8 bytes, UTF-16 units, JavaScript escape sequence, HTML entity and general category — plus totals for code points, UTF-16 units, UTF-8 bytes and user-perceived characters (grapheme clusters).',
			'This is the tool for "why is this string weird?" moments: invisible characters (zero-width spaces, BOMs, directional marks) show up as visible rows; look-alike characters (Cyrillic а vs Latin a) reveal different code points; and an emoji that "is one character" turns out to be seven code points joined by zero-width joiners.',
			'The four different length totals answer the perennial question of why JavaScript\'s .length, a database byte limit, and what the user sees all disagree about how long a string is.'
		],
		faqs: [
			{
				q: 'Why does "🎉".length === 2 in JavaScript?',
				a: 'JavaScript strings count UTF-16 code units. Characters beyond U+FFFF — including most emoji — need a surrogate pair, two units. The inspector shows both units and the real code point, and the summary counts them separately.'
			},
			{
				q: 'What is a grapheme cluster?',
				a: 'What a reader perceives as one character. é can be two code points (e + combining accent), and family emoji can be seven or more joined by zero-width joiners. The grapheme count uses the browser\'s Intl.Segmenter — the closest thing to "characters as users see them".'
			},
			{
				q: 'How do I find invisible characters in a string?',
				a: 'Paste it here — every code point gets a row, including zero-width spaces (U+200B), no-break spaces (U+00A0), BOMs (U+FEFF) and directional marks, each labeled by category. These are the classic culprits behind "identical" strings that fail equality checks.'
			},
			{
				q: 'What do the UTF-8 byte sequences tell me?',
				a: 'Exactly what will be stored or transmitted: ASCII is one byte, most Latin extensions two, CJK three, emoji four. If a system truncates mid-sequence you get replacement characters (�) — the byte view shows where such cuts would land.'
			}
		]
	},

	'cron-parser': {
		about: [
			'Paste a five-field cron expression and get it explained in plain English, with a field-by-field breakdown and — the part that catches real mistakes — the next five actual run times computed in your local timezone. "0 3 * * 1" reads back as "At 03:00, on Monday", followed by the concrete dates it will fire.',
			'The parser supports the full standard syntax: lists (1,15), ranges (9-17), steps (*/15), month and weekday names (jan, mon), 7 as Sunday, and the @daily/@hourly macro family. It also implements the rule everyone forgets: when both day-of-month and day-of-week are restricted, the job runs when either matches, not both.',
			'Six-field (Quartz, with seconds) expressions are detected and called out explicitly rather than silently misparsed — the most common source of "my cron is wrong" confusion when moving between Java schedulers and Unix crontab.'
		],
		faqs: [
			{
				q: 'What are the five fields, in order?',
				a: 'Minute (0–59), hour (0–23), day of month (1–31), month (1–12), day of week (0–6, Sunday = 0, with 7 also accepted as Sunday). Remembering the order is the eternal struggle — the breakdown panel labels each field of your expression.'
			},
			{
				q: 'Why does "0 0 1 * 1" run more often than I expected?',
				a: 'Because both day-of-month (1st) and day-of-week (Monday) are restricted, cron runs the job when EITHER matches — every 1st of the month AND every Monday. To mean "the 1st only when it is a Monday", you need script-side date checking.'
			},
			{
				q: 'Which timezone do the next-run times use?',
				a: "Your browser's local timezone, shown alongside the results. Real crontabs run in the server's timezone (or the TZ= line in some crons) — always confirm what the target machine uses, especially across DST changes."
			},
			{
				q: 'Does this support seconds or years?',
				a: 'No — those are Quartz (Java) extensions with 6 or 7 fields. Standard Unix cron has exactly five fields and one-minute resolution. Six-field input is detected and reported as Quartz rather than misread.'
			}
		]
	},

	'password-generator': {
		about: [
			'Generate random passwords with chosen length and character sets, in bulk if needed, with an honest entropy calculation — bits of randomness, not a decorative color bar. Randomness comes from crypto.getRandomValues with rejection sampling, so every character is drawn uniformly with no modulo bias.',
			'Each enabled character set is guaranteed at least one representative (a policy many sites enforce), then the rest of the password fills uniformly and the whole thing is shuffled — so the guaranteed characters do not cluster predictably at the start.',
			'An ambiguous-character filter drops the look-alikes (0/O, 1/l/I) for passwords a human might ever read aloud or retype from paper. Since generation is local, the passwords exist only on your machine until you put them somewhere.'
		],
		faqs: [
			{
				q: 'What do the entropy bits mean?',
				a: 'Entropy = length × log2(pool size): the number of equally-likely possibilities an attacker must search. 64-bit entropy withstands casual attack; 80+ bits is strong against offline cracking of fast hashes; 100+ is effectively unguessable. A 16-character password over letters+digits+symbols is ~104 bits.'
			},
			{
				q: 'Is a long lowercase password better than a short complex one?',
				a: 'Often yes — length multiplies entropy while extra sets only widen the base of the logarithm. 20 lowercase letters (~94 bits) beat 10 fully-mixed characters (~65 bits). Complexity rules exist mostly to defeat wordlists, which random generation already defeats.'
			},
			{
				q: 'Is it safe to generate passwords in a browser?',
				a: 'The randomness (crypto.getRandomValues) is the same CSPRNG native password managers use, and this page performs no network requests with your data. The realistic risks are around what happens after generation: clipboard history, screen sharing, and where you store it.'
			},
			{
				q: 'Why exclude ambiguous characters?',
				a: 'For passwords that will be read by humans — printed recovery codes, spoken over the phone, typed from another screen — 0/O and 1/l/I cause real support tickets. For purely pasted passwords, keep them; the entropy loss from excluding is minor either way.'
			}
		]
	},

	'qr-code-generator': {
		about: [
			'Type or paste any text — a URL, WiFi credentials, contact info — and get a QR code instantly, rendered as a crisp vector SVG you can download, or export as PNG for chats and slides. No watermark, no expiring "free tier" redirect, and because generation is local, whatever you encode never touches a server.',
			'That last point matters more than it seems: many free QR services route your URL through their redirect domain (so they can charge later or track scans), meaning the code stops working when the service does. Codes generated here encode your content directly and work forever.',
			'Four error-correction levels trade capacity for robustness — L survives light damage, H survives 30% of the symbol being obscured (useful when a logo will cover the middle or the print will be small and scuffed).'
		],
		faqs: [
			{
				q: 'Which error-correction level should I pick?',
				a: 'M (15%) is the sensible default. Use H (30%) for small printed codes, codes behind glass or glare, or when overlaying a logo. Higher correction makes the code denser, so for very long URLs on screen, L keeps modules larger and easier to scan.'
			},
			{
				q: 'Why is SVG better than PNG for print?',
				a: 'SVG is resolution-independent — the printer rasterizes at its native DPI, keeping module edges perfectly sharp at any size. PNG must be generated at some pixel size and can blur when scaled. Use SVG for print and design tools, PNG for chat and slides.'
			},
			{
				q: 'How much data fits in a QR code?',
				a: 'Up to ~3 KB of bytes in theory (version 40, level L), but codes that large are hard to scan from screens. Under 300 characters scans reliably; for long URLs, shorten them first — with your own domain\'s shortener if permanence matters.'
			},
			{
				q: 'Do these codes expire or track scans?',
				a: 'No. The content is encoded directly into the pattern — nothing routes through this site, so there is nothing to expire, and no one (including us) sees when or where it is scanned. Scan tracking inherently requires a redirect service.'
			}
		]
	},

	'json-to-yaml': {
		about: [
			'Convert between JSON, YAML and TOML in any direction. The source format is auto-detected as you paste — brackets suggest JSON, key: colons suggest YAML, [tables] suggest TOML — with a manual override for ambiguous input. Conversion goes through a real parse, so the output is guaranteed valid, not a line-by-line text transform.',
			'Each format has real strengths: JSON for APIs and machine interchange, YAML for human-edited config (Kubernetes, CI pipelines), TOML for well-typed config files (Cargo, pyproject). Moving data between them by hand invites indentation and quoting mistakes that this conversion eliminates.',
			'The converter is honest about format limits: TOML has no top-level arrays and no null, and converting such documents reports why rather than silently dropping data.'
		],
		faqs: [
			{
				q: 'Will comments survive conversion?',
				a: 'No — JSON has no comment syntax, and conversion goes through the parsed data structure, which does not carry comments. Converting YAML → JSON → YAML loses the comments irreversibly; keep the original file when comments matter.'
			},
			{
				q: 'Why did my YAML "no" become false?',
				a: 'YAML 1.1 treats yes/no/on/off as booleans, and country code NO famously becomes false. The parser here follows YAML 1.2 (only true/false), but files written for older parsers may still surprise. Quote strings that look like booleans, numbers or dates.'
			},
			{
				q: 'Why does my JSON fail to convert to TOML?',
				a: 'TOML requires a table (object) at the top level — arrays or bare scalars cannot be a TOML document — and it has no null. Restructure the data (wrap the array in a key, drop or default the nulls) and it will convert.'
			},
			{
				q: 'Is YAML a superset of JSON?',
				a: 'Practically yes — YAML 1.2 parses virtually all JSON documents, which is why pasting JSON into a YAML config usually works. The reverse is not true: YAML\'s anchors, multi-line scalars and tags have no JSON equivalent and get expanded or stringified on conversion.'
			}
		]
	},

	'json-to-csv': {
		about: [
			'Paste an array of JSON objects and get a spreadsheet-ready CSV: nested objects are flattened into dotted column names (user.address.city), columns are unioned across all rows (missing values become empty cells), and quoting follows RFC 4180 so commas, quotes and line breaks inside values survive Excel and Google Sheets.',
			'This is the fastest path from an API response to a spreadsheet someone can filter and pivot. The column union matters with real-world data where objects are heterogeneous — row 1 may lack fields that row 40 has, and the converter handles that instead of erroring or dropping data.',
			'The converter also runs in reverse: paste a CSV export and get a JSON array of objects keyed by the header row, with delimiter auto-detection (comma, semicolon, tab, pipe) and optional typed values — numbers, booleans and null become real JSON types. Both directions run entirely in your browser, so customer exports never leave your machine.'
		],
		faqs: [
			{
				q: 'How are nested objects represented?',
				a: 'Flattened with dot-joined keys: {"user":{"name":"Ada"}} becomes a user.name column. This keeps every scalar value addressable in one flat header row, which is what spreadsheet tools can actually work with.'
			},
			{
				q: 'What happens to arrays inside a row?',
				a: 'They are embedded as JSON text in a single cell (["a","b"]). Exploding arrays into columns (tags.0, tags.1…) or extra rows changes the shape of your data in opinionated ways — embedding keeps the conversion lossless and predictable.'
			},
			{
				q: 'Why does Excel show my CSV in one column?',
				a: 'Locale settings: in much of Europe, Excel expects semicolon-separated files because comma is the decimal separator. Switch the delimiter option to semicolon, or use Data → From Text/CSV, which lets you specify the separator.'
			},
			{
				q: 'Does the converter handle a single object (not an array)?',
				a: 'Yes — a lone object becomes a one-row CSV. Objects keyed by ID ({"a1":{...},"a2":{...}}) convert as one wide row, though; turn them into an array first if each value should be a row.'
			},
			{
				q: 'How does CSV → JSON handle quoted fields and embedded newlines?',
				a: 'Per RFC 4180: fields wrapped in double quotes may contain the delimiter, doubled quotes ("") for a literal quote, and line breaks. Excel and most databases export exactly this format, so real-world files parse correctly.'
			},
			{
				q: 'Why are my zip codes losing their leading zeros in CSV → JSON?',
				a: 'Typed conversion turns 02134 into the number 2134. Untick "Typed values" and every cell stays a string, exactly as written — the right choice for identifiers, phone numbers and anything with leading zeros.'
			}
		]
	},

	'json-to-typescript': {
		about: [
			'Paste a JSON sample — an API response, a config file — and get a TypeScript interface inferred from it: nested objects become nested types, arrays get element types (with unions for mixed contents), and keys that are not valid identifiers are quoted properly.',
			'Generated types are a starting point, not a contract: inference sees one sample, so a field that happens to be null in your example types as null, and optional fields that were absent are simply unknown to it. The output is deliberately plain — no decorators, no runtime validation — so you can paste it anywhere and refine.',
			'For fields that vary between requests, run a second sample through and merge by hand, or graduate to schema-first tooling (OpenAPI, zod) once the shape stabilizes. For the daily "I just need a type for this response" moment, one paste is enough.'
		],
		faqs: [
			{
				q: 'Why is my nullable field typed as just null?',
				a: 'Inference sees only the sample you pasted. If the field was null there, null is all it can know. Change it to string | null (or whatever the real type is) after generation — or paste a sample where the field is populated.'
			},
			{
				q: 'How are optional fields handled?',
				a: 'They are not detected — a single sample cannot distinguish "always present" from "present this time". Fields absent from the sample are absent from the type. Mark fields optional (name?:) manually where you know the API omits them.'
			},
			{
				q: 'What do mixed-type arrays produce?',
				a: 'A union: [1, "a"] infers (number | string)[]. Empty arrays infer unknown[] since there is no element to inspect — replace with the real element type when you know it.'
			},
			{
				q: 'Should I use inferred types or a schema library like zod?',
				a: 'Inferred interfaces are compile-time only — they do not validate anything at runtime. For internal tools and quick typing they are perfect; for untrusted input at runtime, define a zod/valibot schema and derive the static type from it instead.'
			}
		]
	},

	'jsonpath-tester': {
		about: [
			'Test JSONPath expressions against your own JSON and see every match with both its value and its concrete path. Supports the syntax that covers day-to-day use: dot and bracket notation, array indices (including negative), wildcards, unions ([\'a\',\'b\']) and recursive descent ($..price).',
			'The per-match path output is the quietly useful part: query $..id against a deep document and each result tells you exactly where it lives ($.data.items[3].id), ready to paste into code. It turns "somewhere in this blob" into an exact address.',
			'Filter expressions ([?(@.price < 10)]) are not implemented yet — the tool says so explicitly instead of returning wrong results. For structural extraction, which is most JSONPath use, everything works.'
		],
		faqs: [
			{
				q: 'What is the difference between $.a.b and $..b?',
				a: '$.a.b follows one exact route: key a at the root, then key b inside it. $..b (recursive descent) finds every b anywhere in the document at any depth. Recursive descent is powerful but can surprise — it also matches b keys nested inside things you did not consider.'
			},
			{
				q: 'How do I access keys with spaces or dashes?',
				a: "Bracket notation with quotes: $['my key'] or $.data['content-type']. Dot notation only works for keys that are valid identifier-like names."
			},
			{
				q: 'Do negative array indices work?',
				a: 'Yes — [-1] is the last element, [-2] second-to-last, matching the convention popularized by Python and adopted by RFC 9535. [0] remains the first element.'
			},
			{
				q: 'Is JSONPath standardized?',
				a: 'Since 2024, yes — RFC 9535 defines the syntax and semantics. Implementations written before it differ in edge cases (especially filters and unions), so the same expression may behave differently across libraries; test against the implementation you deploy with.'
			}
		]
	},

	'bcrypt-generator': {
		about: [
			'Hash a password with bcrypt at a chosen cost factor, or verify a plaintext against an existing hash — both entirely in the browser, which is precisely what you want when the thing being tested is a password. A hash inspector also breaks any bcrypt hash into its version, cost and salt.',
			'Bcrypt remains a solid choice for password storage because it is deliberately slow and per-password salted: the cost factor doubles the work with each increment, so cost 12 means 4096 iterations of the underlying cipher setup. The timing readout shows how long your chosen cost takes, making the security/latency tradeoff concrete.',
			'Verification is the more common daily need: confirming that a hash in a database matches a known password without spinning up app code. Paste both, get a yes or no.'
		],
		faqs: [
			{
				q: 'What cost factor should I use in production?',
				a: 'The classic guidance: as high as your login latency budget allows, commonly 10–13 today. Aim for 100–300ms per hash on your production hardware. Browser JavaScript runs slower than native, so the timing shown here is an upper bound for your servers.'
			},
			{
				q: 'Why does the same password give a different hash every time?',
				a: 'A random 16-byte salt is generated per hash and stored inside the hash string itself. That is by design — identical passwords get different hashes, defeating precomputed rainbow tables. Verification reads the salt back out of the hash, which is why comparing works.'
			},
			{
				q: 'What do the parts of a bcrypt hash mean?',
				a: '$2b$12$ + 53 chars: 2b is the algorithm version, 12 the cost (2^12 iterations), the next 22 characters the salt, and the final 31 the digest — all in bcrypt\'s own base64 alphabet. The inspector below the tool splits any hash this way.'
			},
			{
				q: 'Is bcrypt still recommended over Argon2?',
				a: 'Argon2id is the current first choice for new systems (memory-hardness resists GPU cracking). Bcrypt remains acceptable and ubiquitous — the practical advice is: do not migrate working bcrypt storage in panic, but pick Argon2id for greenfield designs. Both are leagues beyond fast hashes like SHA-256.'
			}
		]
	},

	'user-agent-parser': {
		about: [
			'Paste a User-Agent string from a log line, bug report or analytics export and get it decoded: browser and version, rendering engine, operating system, device type and CPU architecture. The parser is ua-parser-js, the same library behind countless analytics pipelines, running locally on your string.',
			'User-Agent strings are archaeological sites — every one still claims to be Mozilla/5.0, Chrome claims Safari, Safari claims KHTML, and the real identity hides in the later tokens. A parser beats squinting: it knows that "CriOS" means Chrome on iOS and that Edge hides behind "Edg/".',
			'Note the direction of travel: browsers are freezing and reducing UA strings (and Chromium ships UA Client Hints instead), so version detail from UA alone is increasingly coarse. For log forensics and bug triage it remains indispensable; for feature decisions, use feature detection.'
		],
		faqs: [
			{
				q: 'Why does every User-Agent start with Mozilla/5.0?',
				a: ' 1990s compatibility theater that never ended: servers sniffed for "Mozilla" to serve modern pages, so every new browser claimed to be it, and each subsequent browser impersonated its predecessors. The prefix is now meaningless tradition.'
			},
			{
				q: 'Can I trust the OS version in a UA string?',
				a: 'Less each year. macOS froze its UA version at 10_15_7, Windows 11 reports as Windows NT 10.0, and reduced-UA browsers coarsen versions deliberately. Treat OS versions from UA as approximate; use UA Client Hints where you control the client.'
			},
			{
				q: 'What does "like Gecko" or "KHTML, like Gecko" mean?',
				a: 'More impersonation layers: WebKit descends from KHTML and wanted pages that special-cased Gecko (Firefox\'s engine) to work, so it appended "like Gecko". Every WebKit/Blink browser carries the phrase to this day.'
			},
			{
				q: 'Should I use UA parsing for feature detection?',
				a: 'No — sniffing breaks the moment a new browser version ships. Detect the feature itself (if ("clipboard" in navigator)). UA parsing is for analytics, log analysis and reproducing user-reported bugs, where knowing the environment is the whole point.'
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
	},

	'image-to-base64': {
		about: [
			'Drop, pick or paste an image and get its Base64 form in every flavor you might need: a ready-to-use data URL, a CSS background-image declaration, a complete <img> tag with intrinsic dimensions, and the raw Base64 payload. The reverse direction works too — paste a data URL or a bare Base64 blob and the image is decoded, previewed and downloadable as a file.',
			'The format is identified from the magic bytes, not the file extension or the declared mime type, so a PNG renamed to .jpg (or a data URL with the wrong label) still converts correctly. The size panel is honest about the cost: Base64 inflates data by about a third, and the exact encoded size is shown next to the original so you can decide whether inlining is worth it.',
			'Unlike most image-to-Base64 sites, nothing is uploaded — the file is read with the browser FileReader API and encoded in the page. That makes it safe for screenshots of internal dashboards, unreleased product shots, or anything else you would rather not hand to a stranger\'s server.'
		],
		faqs: [
			{
				q: 'When should I inline an image as Base64 instead of linking a file?',
				a: 'When the image is small (roughly under 10 KB), rarely changes, and would otherwise cost an extra HTTP request — think icons, logos in emails, or single-file HTML documents. For anything larger, a separate file wins: it caches independently, loads in parallel, and does not bloat your HTML or CSS by 33%.'
			},
			{
				q: 'Why is the Base64 version about a third larger than my file?',
				a: 'Base64 represents every 3 bytes of binary as 4 ASCII characters, a structural +33% overhead (plus up to two padding characters). Gzip or Brotli on your server claws some of it back, but the inflation is inherent to the encoding — it trades size for the ability to embed binary in text.'
			},
			{
				q: 'Can I decode a data URL I found in a stylesheet or HTML?',
				a: 'Yes — switch to Base64 → image and paste the whole thing, data: prefix and all. Percent-encoded SVG data URLs (the kind without ;base64) decode too, and line breaks or whitespace inside the payload are stripped automatically. The result previews in the page and downloads with the correct extension.'
			},
			{
				q: 'Does this work for SVG, GIF and ICO files, or only PNG and JPEG?',
				a: 'Everything the sniffer recognizes converts to Base64: PNG, JPEG, WebP, GIF, SVG, BMP, ICO and AVIF. For SVG specifically, consider that the XML source is often smaller and more readable inlined directly — Base64-encoding SVG mostly makes sense when quoting or escaping becomes a problem.'
			}
		]
	},

	'image-converter': {
		about: [
			'Convert an image between PNG, JPEG and WebP without installing anything or uploading anywhere: drop the file, pick the target, adjust quality with a live slider, and watch the output size update in real time. The Δ tile shows exactly how much smaller (or larger) the converted file is, so choosing a quality setting stops being guesswork.',
			'The three formats have distinct jobs. PNG is lossless with full transparency — right for screenshots, UI assets and anything with sharp edges or text. JPEG compresses photographs aggressively but has no alpha channel and blurs hard edges. WebP typically beats JPEG by 25–35% at comparable quality, supports transparency, and is universally supported in current browsers — for the web it is usually the answer.',
			'Conversion happens on a canvas in your browser: the image is decoded, redrawn and re-encoded by the same codecs your browser uses to display pages. That is what makes the tool private — and also why exact byte counts differ slightly between Chrome, Firefox and Safari, which each ship their own encoders.'
		],
		faqs: [
			{
				q: 'Which quality setting should I use for JPEG and WebP?',
				a: 'Between 75 and 90 covers almost every real use. At 85 most photos are visually indistinguishable from the source at a fraction of the size; below ~70 blocky artifacts creep into gradients and skin tones; above 90 file size climbs steeply for gains you cannot see. Drag the slider and watch the size tile — the sweet spot is usually obvious.'
			},
			{
				q: 'Why did my PNG get larger when converted to JPEG?',
				a: 'JPEG is built for photographic gradients, not flat color. Screenshots, diagrams and UI art compress superbly as PNG (long runs of identical pixels) but force JPEG to store noise around every sharp edge — larger files and visible ringing. Keep graphics as PNG or convert them to lossless-leaning WebP instead.'
			},
			{
				q: 'What happens to transparency when I convert to JPEG?',
				a: 'JPEG has no alpha channel, so transparent regions must be filled with something — this tool flattens them onto white, the convention for web images. If you need transparency to survive, choose PNG or WebP as the target instead.'
			},
			{
				q: 'Why can\'t my browser export AVIF or HEIC here?',
				a: 'The canvas toBlob API only encodes formats the browser ships an encoder for — PNG and JPEG everywhere, WebP in Chromium and Firefox. AVIF encoding is still rare and HEIC is patent-encumbered, so browsers decode but do not produce them. If you pick a format your browser cannot write, the tool says so rather than silently giving you a PNG.'
			}
		]
	},

	'image-resizer': {
		about: [
			'Resize an image to an exact width, an exact height, or a percentage of the original — the other dimension follows automatically so nothing gets stretched. Pick an output format (or keep the source format), set quality for lossy targets, preview the result, and download. Before/after tiles show dimensions and file size at a glance.',
			'Scaling uses the browser\'s high-quality smoothing mode, which applies proper resampling rather than nearest-neighbor decimation — downscaled photos stay crisp instead of shimmering with aliasing. Resizing is also the honest way to shrink file size: halving both dimensions removes three quarters of the pixels, which no quality slider can match.',
			'Files never leave the page: decoding, resampling and re-encoding all run on a local canvas. There is no upload progress bar because there is no upload — a 40-megapixel photo resizes as fast as your machine can redraw it, and works with the network cable unplugged.'
		],
		faqs: [
			{
				q: 'Will resizing down and back up restore my image?',
				a: 'No — downscaling discards pixels permanently. Scaling a 3000px photo to 300px keeps 1% of the data; enlarging it back interpolates the missing 99% as blur. Keep the original file and export resized copies from it, rather than resizing the only copy you have.'
			},
			{
				q: 'Why does my upscaled image look soft?',
				a: 'Enlarging cannot create detail that was never captured — the browser interpolates between existing pixels, which reads as softness beyond about 2×. Genuine upscaling beyond that needs ML-based tools that hallucinate plausible detail; a canvas resampler deliberately does not invent anything.'
			},
			{
				q: 'How do I hit a target file size, like "under 200 KB"?',
				a: 'Work both levers: first resize to the largest dimensions you actually need (a 1200px-wide image is plenty for most web layouts), then choose WebP or JPEG and lower quality until the size tile reads under target. Dimension reduction does most of the work — quality tweaks fine-tune the rest.'
			},
			{
				q: 'Does resizing strip EXIF metadata like GPS location?',
				a: 'Yes. The canvas pipeline re-encodes pure pixels — camera model, timestamps, GPS coordinates and every other EXIF tag are gone from the output. That is usually a privacy win for images headed to the public web; if you need metadata preserved, keep the original alongside.'
			}
		]
	},

	'favicon-generator': {
		about: [
			'Drop one image — ideally a square logo at 512px or larger — and get the complete favicon kit: a favicon.ico packing 16, 32 and 48 px for tabs and bookmarks, PNGs at the standard sizes including the 180px Apple touch icon and the 192/512px PWA icons, a starter site.webmanifest, and the <link> tags to paste into your <head>. One ZIP download contains everything, named exactly as the conventions expect.',
			'The details that favicon tutorials get wrong are handled: the ICO embeds PNG-compressed entries (supported everywhere since Windows Vista, far smaller than legacy BMP icons); the Apple touch icon is flattened onto a background color you pick, because iOS replaces transparency with black; and the PWA icons keep their alpha channel. Non-square sources are center-cropped rather than squashed.',
			'Downscaling a logo to 16px is destructive by nature — fine detail simply cannot survive — so the preview row shows every size at its real dimensions, letting you judge legibility before shipping. Everything renders on a local canvas and the ICO/ZIP containers are assembled byte-by-byte in the page; your logo is never uploaded anywhere.'
		],
		faqs: [
			{
				q: 'Which favicon sizes do I actually need in 2026?',
				a: 'Less than the folklore suggests: a favicon.ico with 16/32/48 for legacy and address-bar use, one 180px apple-touch-icon.png, and 192/512px PNGs referenced from the web app manifest. Modern browsers pick the best match from exactly this set — the 20-file packs some generators emit are cargo cult.'
			},
			{
				q: 'Why is my logo illegible at 16px?',
				a: 'Sixteen pixels is brutally small — wordmarks, thin strokes and fine gradients all dissolve. Strong favicons reduce the brand to one bold glyph or shape with high contrast. If the 16px preview here is mush, crop tighter to the distinctive part of the mark or use a simplified variant for small sizes.'
			},
			{
				q: 'Do I still need a .ico file, or are PNG favicons enough?',
				a: 'Every modern browser accepts PNG favicons, but /favicon.ico is still the path user agents, crawlers and older tooling request blindly. Serving a real ICO there costs a few kilobytes and eliminates a whole class of 404s and fallback quirks — keep it alongside your PNG links.'
			},
			{
				q: 'Why does the Apple touch icon need a background color?',
				a: 'iOS does not render transparency in home-screen icons — whatever alpha your PNG has gets composited onto black. Pre-flattening onto a color you chose keeps the result intentional. Pick the background that matches your icon, and remember iOS rounds the corners itself, so supply a full-bleed square.'
			}
		]
	},

	'sql-formatter': {
		about: [
			'Paste a query fresh out of a log file, an ORM debug dump or a colleague\'s one-liner, and this formatter breaks it into readable clauses with consistent indentation. Six dialects are supported — standard SQL, PostgreSQL, MySQL, SQLite, SQL Server and BigQuery — so dialect-specific syntax like TOP, backtick identifiers or array types formats correctly instead of tripping the parser.',
			'Keyword casing is configurable: UPPERCASE for the classic look, lowercase if your team prefers it, or leave the original untouched. The minify mode does the reverse — it collapses a formatted query to a single line, stripping comments while leaving string literals byte-for-byte intact, which is what you want before pasting SQL into a JSON config or a CLI flag.',
			'Queries often contain table names, customer data in literals, or infrastructure hints. Formatting runs entirely in your browser, so none of that reaches a server.'
		],
		faqs: [
			{
				q: 'Which SQL dialect should I pick?',
				a: 'The one your database speaks — it changes how identifiers, string quoting and dialect keywords are parsed. If you just need generic tidying, standard SQL handles the common core. A parse error on valid-for-your-database syntax is usually a sign to switch dialects.'
			},
			{
				q: 'Does formatting change what the query does?',
				a: 'No. Formatting only moves whitespace and, if enabled, changes keyword casing — identifiers and literals keep their exact bytes. SQL keywords are case-insensitive in every supported dialect, so SELECT and select are the same statement.'
			},
			{
				q: 'Can I format multiple statements at once?',
				a: 'Yes — paste a whole script and each ;-terminated statement is formatted in sequence with a blank line between them.'
			},
			{
				q: 'What exactly does minify remove?',
				a: 'Line comments (--) and block comments (/* */) are dropped, runs of whitespace collapse to single spaces, and spaces around commas and parentheses are removed. Text inside single quotes, double quotes and backticks is never touched, including doubled-quote escapes.'
			}
		]
	},

	'xml-formatter': {
		about: [
			'This tool pretty-prints XML with your choice of indentation, flags well-formedness errors with the exact line and column, and can minify a document to a single line. Comments, CDATA sections and the XML prolog survive formatting — a surprising number of formatters silently eat them.',
			'Validation here means well-formedness: properly nested tags, quoted attributes, legal characters. That catches the overwhelming majority of hand-editing accidents — a missing slash, an unclosed element, a stray ampersand. Schema validation against an XSD is deliberately out of scope; that belongs in your build pipeline with the schema file present.',
			'Config files, SOAP payloads, RSS feeds and Android manifests routinely contain internal hostnames and keys. Everything here parses locally — nothing is transmitted.'
		],
		faqs: [
			{
				q: 'Why does my XML fail with "char … is not expected"?',
				a: 'The usual suspects are a raw & that should be &amp;, an unquoted attribute value, or tags that close in the wrong order. The error message carries the line and column of the first offending character, and the input box marks it.'
			},
			{
				q: 'Does the formatter reorder or normalize my document?',
				a: 'No. Elements, attributes and their order are preserved exactly; only inter-element whitespace changes. Text content that shares a line with markup is trimmed and internal runs of whitespace collapse — if you rely on significant whitespace (xml:space="preserve"), keep those sections minified.'
			},
			{
				q: 'What does minify remove?',
				a: 'Indentation and line breaks between elements, plus comments. CDATA sections, processing instructions and the prolog stay. The result parses identically for any consumer that does not depend on whitespace-only text nodes.'
			},
			{
				q: 'Can it validate against an XSD or DTD?',
				a: 'No — this checks well-formedness only. Schema validation needs the schema file and an XSD engine, which is better done in your toolchain (xmllint --schema, or your language\'s XML library).'
			}
		]
	},

	'xml-to-json': {
		about: [
			'Convert XML to JSON to feed legacy SOAP responses, RSS feeds or Maven POMs into JavaScript, jq or a JSON-native API — or go the other way and produce XML from JSON data. Attributes are kept: they become "@_name" keys, and text content that coexists with attributes lands under "#text", so no information silently disappears.',
			'The two formats disagree on fundamentals, and this converter makes the standard pragmatic choices: repeated sibling elements collapse into a JSON array, numeric-looking values become numbers, and namespaces travel as part of the element name. Round-tripping XML → JSON → XML preserves structure and content for typical documents.',
			'Both directions run locally in your browser. Paste an invoice feed or an API response without it going anywhere.'
		],
		faqs: [
			{
				q: 'Why do some values come back as numbers instead of strings?',
				a: 'The parser recognizes numeric text and converts it, which is what most consumers want. Beware of identifiers with leading zeros (product codes, phone numbers) — if that matters for your data, quote them post-conversion or treat the output as a starting point.'
			},
			{
				q: 'How are repeated elements handled?',
				a: 'Two or more siblings with the same name become a JSON array under that key. A single occurrence stays a plain object — that asymmetry is inherent to the mapping, so code consuming the JSON should tolerate both shapes or normalize first.'
			},
			{
				q: 'What do the @_ and #text keys mean?',
				a: '@_ marks what was an XML attribute, #text carries element text when attributes are also present. Feeding the same convention back into the JSON → XML direction reconstructs the original markup.'
			},
			{
				q: 'Why does JSON → XML reject my top-level array?',
				a: 'An XML document must have exactly one root element, and a bare array has none. Wrap the array in an object — {"items": {"item": [...]}} — and the converter produces a well-formed document.'
			}
		]
	},


	'markdown-to-html': {
		about: [
			'Write or paste Markdown and see both the rendered preview and the generated HTML side by side — headings, GFM tables, task-list-style bullets, fenced code blocks and strikethrough included. The reverse direction converts existing HTML into clean Markdown with ATX headings, dash bullets and fenced code, which is the fastest way to migrate old CMS content into a docs repo.',
			'The preview is sanitized before rendering: scripts, iframes and event-handler attributes are stripped, so a shared link carrying hostile markup cannot execute anything in your browser. The HTML output box always shows the raw conversion for copying into templates or emails.',
			'Conversion and preview run locally. Draft release notes with unannounced feature names stay on your machine.'
		],
		faqs: [
			{
				q: 'Which Markdown flavor is this?',
				a: 'CommonMark plus the GitHub extensions people actually use: tables, strikethrough and autolinked URLs. Soft line breaks stay soft — a single newline does not become <br>, matching GitHub\'s rendering of documents.'
			},
			{
				q: 'Why does the preview differ from the raw HTML output?',
				a: 'The preview passes through a sanitizer that removes script tags, inline event handlers and javascript: URLs before rendering. The output box bypasses sanitization because it is text, not rendered markup — sanitize downstream if you embed user-supplied HTML.'
			},
			{
				q: 'How faithful is HTML → Markdown?',
				a: 'Structural elements — headings, lists, links, emphasis, code, blockquotes, images — convert cleanly. HTML with no Markdown equivalent (nested tables, divs with classes, inline styles) passes through as raw HTML or loses its styling, so a quick read-through afterward is worth it.'
			},
			{
				q: 'Can I use the generated HTML in an email?',
				a: 'Yes — the output is plain semantic HTML with no classes or external stylesheets, which is exactly what email clients tolerate best. Inline any styling you need on top.'
			}
		]
	},

	'html-formatter': {
		about: [
			'Beautify HTML that came out of a bundler, a scraper or a WYSIWYG editor: elements are indented to your chosen width, attributes stay on their line, and pre/textarea contents are left byte-for-byte intact. The minify mode strips comments and collapses the whitespace between tags — typically a 10–25% size cut on handwritten pages.',
			'Minification here is deliberately conservative: inline scripts and styles are protected, conditional comments survive, and single spaces between inline elements are preserved so "click <a>here</a> now" does not fuse into "clickherenow". You get a safe minify, not a maximally aggressive one.',
			'Both operations run locally in your browser — unpublished pages and internal admin markup never leave your machine.'
		],
		faqs: [
			{
				q: 'Will minifying break my inline JavaScript or CSS?',
				a: 'No — <script>, <style>, <pre> and <textarea> blocks are excluded from whitespace collapsing entirely. Only markup between tags is touched. To compress the scripts themselves, run them through the JavaScript minifier separately.'
			},
			{
				q: 'Why is whitespace between tags safe to remove?',
				a: 'Mostly it is: whitespace between block-level elements has no visual effect. Between inline elements it does, which is why the minifier collapses runs to a single space rather than deleting them. Layouts that depend on inline-block whitespace hacks are the rare exception worth eyeballing.'
			},
			{
				q: 'Does the formatter fix invalid HTML?',
				a: 'It formats what you give it without validating against the HTML spec — unclosed tags stay unclosed. Browsers are forgiving of tag soup, so formatting still helps you see the structure well enough to spot the problem.'
			},
			{
				q: 'What indent width should I use?',
				a: '2 spaces is the prevailing convention in web codebases and what most framework style guides default to. Pick 4 if your team standardized on it — the choice is cosmetic.'
			}
		]
	},

	'css-formatter': {
		about: [
			'Expand minified or copy-pasted CSS into one-declaration-per-line rules, or squeeze a stylesheet down for production. The beautifier normalizes indentation and brace placement; the minifier strips comments, collapses whitespace and drops final semicolons while leaving strings, url(...) contents and calc() expressions untouched.',
			'The minifier is transparent about what it does not do: it will not rename selectors, merge duplicate rules or rewrite colors. That makes the output predictable and safe for any stylesheet, including ones with hacks and vendor prefixes — paste, minify, ship.',
			'Like every tool here, processing is local. Unreleased design-system code stays in your browser.'
		],
		faqs: [
			{
				q: 'How much smaller does minified CSS get?',
				a: 'Typically 15–30% for handwritten CSS, mostly from indentation and comments. Gzip on your server removes much of the same redundancy, so the wire-size delta is smaller than the raw byte count suggests — minify anyway, it also cuts parse time.'
			},
			{
				q: 'Is it safe for calc(), custom properties and media queries?',
				a: 'Yes. Spaces inside calc() are significant and are preserved; custom properties and their var() references are plain declarations and survive unchanged; @media and other at-rules keep their structure.'
			},
			{
				q: 'Why did descendant selectors keep their spaces?',
				a: 'Because "nav a" and "nava" select different things — the space is a combinator, not formatting. The minifier only removes whitespace that has no syntactic meaning.'
			},
			{
				q: 'Can it convert between LESS/SCSS and CSS?',
				a: 'No — preprocessor syntax needs compilation, not formatting. Plain SCSS that is also valid CSS will format fine; nested rules and mixins will not.'
			}
		]
	},

	'js-formatter': {
		about: [
			'Beautify JavaScript with consistent indentation and spacing — deminify a vendored bundle to read what it actually does, or clean up code pasted from a console. The minifier is the real thing: Terser parses your code into an AST, drops dead code, shortens local variable names and strips comments, the same engine bundlers use in production.',
			'Because minification is AST-based, it never breaks working code the way regex-based "compressors" can: strings, template literals, regexes and ASI edge cases are handled by an actual parser. Syntax errors are reported with position instead of producing corrupt output.',
			'Terser loads only when you first minify, keeping the page light, and it runs entirely in your browser — proprietary source never leaves your machine.'
		],
		faqs: [
			{
				q: 'How much smaller will my code get?',
				a: 'Handwritten code typically drops 30–60% before gzip: whitespace, comments and long local names carry that much weight. Code that is already bundled shrinks far less — it has been through the same transform once already.'
			},
			{
				q: 'Does minification change behavior?',
				a: 'Compression and mangling preserve semantics: only local names are renamed, and dead-code elimination removes branches that provably cannot run. Code that relies on Function.prototype.name or toString() of its own functions is the classic exception.'
			},
			{
				q: 'Can this un-minify production code from a website?',
				a: 'The formatter restores whitespace and structure, which makes control flow readable — but original variable names and comments are gone forever; you will see a, b, c. For serious debugging, prefer source maps if the site ships them.'
			},
			{
				q: 'Does it support TypeScript or JSX?',
				a: 'No — both need their own parsers. Compile to JavaScript first (tsc, esbuild), then format or minify the output here.'
			}
		]
	},

	'string-escape': {
		about: [
			'Turn a multi-line string with quotes into something you can paste inside a JSON value, a JavaScript literal, a Java string, an XML text node, a SQL literal or a CSV cell — and reverse the process when you find escaped text in a log file and want to read it. Six dialects, both directions.',
			'Each dialect follows its actual specification rather than a lowest common denominator: JSON escapes control characters as \\uXXXX, JavaScript additionally escapes single quotes and backticks, Java encodes non-ASCII as UTF-16 \\u sequences, SQL doubles single quotes, CSV wraps and doubles per RFC 4180, and XML uses its five predefined entities. The unescaper understands \\x, \\u and \\u{…} forms and reports malformed sequences with their position.',
			'Escaped strings are frequently connection strings, tokens and query fragments. This runs locally — paste freely.'
		],
		faqs: [
			{
				q: 'Which dialect do I need for a JSON config file?',
				a: 'JSON. It escapes double quotes, backslashes and control characters exactly as RFC 8259 requires and leaves unicode readable. The output drops into any JSON string value — without the surrounding quotes, which the tool leaves to you.'
			},
			{
				q: 'What is the difference between the JSON and JavaScript dialects?',
				a: "JavaScript additionally escapes single quotes and backticks so the result is safe in any of the three JS quoting styles. JSON only needs double-quote handling. Unescaping accepts both, plus \\x and \\u{…} forms that JSON doesn't define."
			},
			{
				q: 'Does SQL escaping make user input safe to concatenate?',
				a: "It produces a correct SQL string literal (quotes doubled), but escaping-then-concatenating is still the wrong pattern for untrusted input — use parameterized queries. This tool is for fixtures, migrations and debugging, not injection defense."
			},
			{
				q: 'Why does unescaping my string fail?',
				a: 'A backslash followed by something that is not a defined escape (\\q, a truncated \\u12) is malformed, and the error names the offending index. If your text has literal Windows paths, escape it first — C:\\temp is a tab in disguise.'
			}
		]
	},

	'number-base-converter': {
		about: [
			'Type a number in any base and read it in binary, octal, decimal and hex simultaneously — plus any custom base up to 36. Prefixes are understood (0x, 0o, 0b), digit grouping makes long values scannable (1111 1111 · 255 · ff), and a bit-length readout tells you at a glance whether a value fits in 8, 32 or 64 bits.',
			'Arithmetic uses BigInt, so precision is exact at any size: file permissions, ARGB colors, IP addresses, hash prefixes and 64-bit database IDs all convert without the silent rounding that hits ordinary JavaScript numbers above 2⁵³.',
			'Negative numbers keep their sign across all bases. Everything computes locally, instantly, as you type.'
		],
		faqs: [
			{
				q: 'How does auto-detection decide the base?',
				a: 'By prefix: 0x means hex, 0o octal, 0b binary; anything else parses as decimal. Digits like "ff" without a prefix are ambiguous, so select HEX explicitly — the error message will remind you.'
			},
			{
				q: 'Are huge numbers really exact?',
				a: 'Yes — conversion runs on BigInt, which is arbitrary-precision. 18446744073709551615 (2⁶⁴−1) round-trips exactly; a float-based converter would corrupt it to …551616.'
			},
			{
				q: 'How are negative numbers shown in binary?',
				a: "With a minus sign (-1010), not two's complement, since two's complement requires a fixed width. To see a two's-complement pattern, add 2ⁿ to your negative value for the width you care about and convert that."
			},
			{
				q: 'What can base 36 be used for?',
				a: 'Compact IDs: 0-9 plus a-z is the densest alphabet that stays case-insensitive and URL-safe. Many URL shorteners and ticket systems encode numeric IDs this way — paste one and read the underlying number.'
			}
		]
	},

	'text-to-hex': {
		about: [
			'See exactly which bytes your text is made of: this tool encodes text to UTF-8 and shows it as hex, binary or decimal byte values — with your choice of separator, casing and 0x prefixes. The decoder goes the other way and is deliberately tolerant: it accepts continuous runs (48656c6c6f), spaced pairs, colon-separated MAC-style notation and \\x escape sequences.',
			'Because encoding is byte-level UTF-8, multibyte characters are shown as they actually exist in memory and on the wire: é is c3 a9, 世 is e4 b8 96, and emoji take four bytes. That makes this the quickest way to debug encoding mismatches, BOM mysteries and "why is this string longer than it looks" problems.',
			'If decoded bytes are not valid UTF-8, the tool says so instead of printing mojibake — a strong hint you are looking at binary data rather than text.'
		],
		faqs: [
			{
				q: 'Why does one character become several bytes?',
				a: 'UTF-8 is variable-width: ASCII stays one byte, most European letters take two, CJK three, emoji four. What you see here is the exact byte sequence any UTF-8 system — files, HTTP, databases — stores for your text.'
			},
			{
				q: 'What input formats does the decoder accept?',
				a: 'Hex as a continuous run, spaced pairs, with 0x or \\x prefixes, or colon/comma-separated; binary as 8-bit groups with or without spaces; decimal as separated byte values. Mixed separators and stray whitespace are cleaned up automatically.'
			},
			{
				q: 'Why does decoding say the bytes are not valid UTF-8?',
				a: 'The byte sequence violates UTF-8 rules — for example a lone ff, or a continuation byte with no lead byte. The data may be binary, in a legacy encoding like Latin-1, or truncated mid-character.'
			},
			{
				q: 'Is this the same as a hex dump from xxd?',
				a: 'The byte values are identical; xxd adds offsets and an ASCII column. Paste the hex columns of an xxd dump here (without the offset column) and it decodes fine.'
			}
		]
	},

	'json-schema-validator': {
		about: [
			'Two directions of the same discipline: paste sample JSON and get a draft-07 schema inferred from it, or paste data plus a schema and see every violation listed with its JSON path. Validation runs on Ajv — the same engine most Node services use — so what passes here passes in CI.',
			'Inference is production-minded: object keys become typed properties and required entries, arrays merge the shapes of all their members, integers are distinguished from floats, and keys that appear in only some array members are correctly left out of required. The result is a starting point you tighten with formats, ranges and patterns.',
			'API responses and config files are exactly the data you least want on a third-party server. Both inference and validation run entirely in your browser.'
		],
		faqs: [
			{
				q: 'Which JSON Schema draft is supported?',
				a: 'Inference emits draft-07, the most widely supported draft across editors and validators. Validation accepts draft-07 and the earlier drafts Ajv understands in non-strict mode; 2019-09/2020-12 keywords mostly work too since unknown keywords are ignored rather than fatal.'
			},
			{
				q: 'What does the $ in violation paths mean?',
				a: 'It is the root of the document, JSONPath-style: $.age means the top-level age property, $.items.2.name the name of the third array element. An empty path ($) means the violation is about the document root itself — wrong type, or a missing required property.'
			},
			{
				q: 'Why is the inferred schema stricter or looser than I expected?',
				a: 'It describes exactly the sample you gave: fields present everywhere become required, and only observed types are allowed. Feed it a more varied sample (an array of representative objects) for a more general schema, then adjust by hand — inference cannot know intent.'
			},
			{
				q: 'Does validation support format, pattern and other constraint keywords?',
				a: 'Structural keywords (type, required, properties, items, enum, minimum, pattern…) are fully enforced. Format strings like "email" or "date-time" are not asserted — that mirrors the JSON Schema spec, where format is annotation by default, and avoids false confidence.'
			}
		]
	},

	'exif-viewer': {
		about: [
			'Every photo your phone takes carries hidden metadata: camera model, capture time, editing software — and, unless disabled, the GPS coordinates of where you stood. This tool reads that metadata from JPEG, PNG and WebP files and shows it grouped and decoded: exposure values as f/2.8 and 1/250 s, orientation as words, GPS as decimal coordinates with a map link.',
			'The cleaner produces a copy with metadata removed — losslessly. Instead of re-encoding the image (which costs quality), it removes the metadata segments byte-for-byte: EXIF and XMP blocks in JPEG, text and time chunks in PNG, EXIF/XMP chunks in WebP. Pixels, dimensions and quality are untouched; color profiles are kept so the image still renders identically.',
			'This is the one tool category where "runs locally" is the entire point: checking a photo for GPS data by uploading it to a server would defeat the purpose. The file never leaves your browser — verifiable in the network tab.'
		],
		faqs: [
			{
				q: 'Does removing metadata change image quality?',
				a: 'No. The image data stream is copied bit-for-bit; only metadata segments are dropped. The cleaned file is smaller by exactly the metadata size, and pixels are provably identical.'
			},
			{
				q: 'Why does my screenshot show no metadata?',
				a: 'Screenshots and most exported-for-web images never had EXIF — cameras write it, screenshot tools mostly do not. Social media platforms also strip metadata on upload, so a photo downloaded from one is usually already clean.'
			},
			{
				q: 'Is the GPS position exact?',
				a: 'Phone GPS in EXIF is typically accurate to a few meters — enough to identify a building. The tool converts the stored degrees/minutes/seconds to decimal and links to the exact point, so you can see precisely what a recipient of the file could see.'
			},
			{
				q: 'Why does the cleaned file keep an ICC color profile?',
				a: 'The ICC profile tells software how to interpret the colors — stripping it can visibly shift them, and it contains no personal information. The cleaner removes identifying metadata (EXIF, XMP, IPTC, comments, timestamps) and keeps what the image needs to render correctly.'
			}
		]
	}
};
