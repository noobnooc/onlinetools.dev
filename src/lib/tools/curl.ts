import { type ToolResult, ok, err } from './types';

/**
 * cURL → code. Parses a curl command the way a shell and curl would (bash
 * quoting, or Windows cmd quoting from "Copy as cURL (cmd)") into a request,
 * then prints that request as fetch, axios, Python requests or Go net/http.
 * Pure: nothing here runs the request.
 */

export type CurlTarget = 'fetch' | 'axios' | 'python' | 'go';
export const CURL_TARGETS: CurlTarget[] = ['fetch', 'axios', 'python', 'go'];

export type FormPart =
	| { name: string; value: string }
	| { name: string; file: string; filename?: string; type?: string };

export type CurlBody =
	| { kind: 'text'; text: string }
	| { kind: 'file'; path: string }
	| { kind: 'form'; parts: FormPart[] };

export interface CurlRequest {
	url: string;
	method: string;
	headers: Array<[string, string]>;
	body: CurlBody | null;
	auth: { user: string; password: string } | null;
	insecure: boolean;
	/** Seconds, from -m / --max-time. */
	timeout: number | null;
	proxy: string | null;
}

export type CurlWarningCode =
	| 'unknownOption'
	| 'unsupportedOption'
	| 'noScheme'
	| 'multipleUrls'
	| 'stdin'
	| 'cookieFile'
	| 'headerFile'
	| 'passwordPrompt'
	| 'trailing'
	| 'browserHeaders'
	| 'fetchProxy'
	| 'fetchInsecure';

export interface CurlWarning {
	code: CurlWarningCode;
	detail?: string;
}

export interface CurlConversion {
	request: CurlRequest;
	code: string;
	warnings: CurlWarning[];
	/** True when the command carries credentials (auth, cookies, tokens). */
	hasSecrets: boolean;
}

// ---------------------------------------------------------------------------
// Tokenizing

interface Tokens {
	args: string[];
	/** Something after an unquoted |, ;, & or > was dropped. */
	trailing: boolean;
}

export function isLikelyCurl(input: string): boolean {
	// The first argument must look like an option or a URL, so "curl up" stays prose.
	return /^\s*(?:\$\s+)?curl(?:\.exe)?\s+(?:-|['"^]*(?:[a-z][\w+.-]*:\/\/|[\w-]+(?:\.[\w-]+)+|localhost\b))/i.test(input);
}

/** Windows cmd copies escape with ^ and continue lines with a trailing ^. */
function isCmdStyle(input: string): boolean {
	return /\^"/.test(input) || /\s\^\r?\n/.test(input);
}

function tokenizeCmd(input: string): ToolResult<Tokens> {
	// cmd removes ^ escapes (and ^ + newline) first; what is left is parsed by
	// the C runtime: "…" groups, \" is a literal quote, other backslashes stay.
	let s = '';
	for (let i = 0; i < input.length; i++) {
		const c = input[i];
		if (c === '^') {
			const next = input[i + 1];
			if (next === '\r' && input[i + 2] === '\n') i += 2;
			else if (next === '\n') i++;
			else if (next !== undefined) s += input[++i];
		} else s += c;
	}
	const args: string[] = [];
	let cur = '';
	let has = false;
	let quoted = false;
	for (let i = 0; i < s.length; i++) {
		const c = s[i];
		if (c === '\\') {
			let n = 0;
			while (s[i + n] === '\\') n++;
			if (s[i + n] === '"') {
				cur += '\\'.repeat(Math.floor(n / 2));
				if (n % 2 === 1) cur += '"';
				else quoted = !quoted;
				i += n;
			} else {
				cur += '\\'.repeat(n);
				i += n - 1;
			}
			has = true;
		} else if (c === '"') {
			quoted = !quoted;
			has = true;
		} else if (!quoted && /\s/.test(c)) {
			if (has) args.push(cur);
			cur = '';
			has = false;
		} else {
			cur += c;
			has = true;
		}
	}
	if (quoted) return err('A double quote is never closed');
	if (has) args.push(cur);
	return ok({ args, trailing: false });
}

function lineCol(input: string, index: number): [number, number] {
	const before = input.slice(0, index).split('\n');
	return [before.length, before[before.length - 1].length + 1];
}

const ANSI_C: Record<string, string> = { n: '\n', t: '\t', r: '\r', a: '\x07', b: '\b', e: '\x1b', E: '\x1b', f: '\f', v: '\v', '\\': '\\', "'": "'", '"': '"', '?': '?' };

function tokenizeBash(input: string): ToolResult<Tokens> {
	const args: string[] = [];
	let cur = '';
	let has = false;
	const s = input.replace(/\r\n/g, '\n');
	for (let i = 0; i < s.length; i++) {
		const c = s[i];
		if (c === '\\') {
			const next = s[i + 1];
			if (next === '\n') i++;
			else if (next !== undefined) {
				cur += next;
				has = true;
				i++;
			}
		} else if (c === "'") {
			const end = s.indexOf("'", i + 1);
			if (end < 0) {
				const [line, column] = lineCol(s, i);
				return err('A single quote is never closed', line, column);
			}
			cur += s.slice(i + 1, end);
			has = true;
			i = end;
		} else if (c === '$' && s[i + 1] === "'") {
			// $'…' ANSI-C quoting, which Chrome uses for bodies with control characters.
			let j = i + 2;
			for (; j < s.length && s[j] !== "'"; j++) {
				if (s[j] !== '\\') {
					cur += s[j];
					continue;
				}
				const e = s[++j];
				if (e === undefined) break;
				if (e in ANSI_C) cur += ANSI_C[e];
				else if (e === 'x' || e === 'u' || e === 'U') {
					const max = e === 'x' ? 2 : e === 'u' ? 4 : 8;
					const m = /^[0-9a-fA-F]+/.exec(s.slice(j + 1, j + 1 + max));
					if (m) {
						const cp = parseInt(m[0], 16);
						cur += cp <= 0x10ffff ? String.fromCodePoint(cp) : '';
						j += m[0].length;
					} else cur += '\\' + e;
				} else if (/[0-7]/.test(e)) {
					const m = /^[0-7]{1,3}/.exec(s.slice(j, j + 3)) ?? [e];
					cur += String.fromCharCode(parseInt(m[0], 8) & 0xff);
					j += m[0].length - 1;
				} else cur += '\\' + e;
			}
			if (j >= s.length) {
				const [line, column] = lineCol(s, i);
				return err('A $\'…\' string is never closed', line, column);
			}
			has = true;
			i = j;
		} else if (c === '"') {
			let j = i + 1;
			for (; j < s.length && s[j] !== '"'; j++) {
				if (s[j] === '\\' && j + 1 < s.length) {
					const e = s[j + 1];
					if (e === '\n') j++;
					else if ('"\\$`'.includes(e)) {
						cur += e;
						j++;
					} else cur += '\\';
				} else cur += s[j];
			}
			if (j >= s.length) {
				const [line, column] = lineCol(s, i);
				return err('A double quote is never closed', line, column);
			}
			has = true;
			i = j;
		} else if (c === '#' && !has) {
			// A comment runs to the end of the line.
			const end = s.indexOf('\n', i);
			i = end < 0 ? s.length : end - 1;
		} else if ('|;&<>'.includes(c)) {
			if (has) args.push(cur);
			return ok({ args, trailing: s.slice(i).trim() !== '' });
		} else if (/\s/.test(c)) {
			if (has) args.push(cur);
			cur = '';
			has = false;
		} else {
			cur += c;
			has = true;
		}
	}
	if (has) args.push(cur);
	return ok({ args, trailing: false });
}

export function tokenize(input: string): ToolResult<Tokens> {
	return isCmdStyle(input) ? tokenizeCmd(input) : tokenizeBash(input);
}

// ---------------------------------------------------------------------------
// Options

type Handler = (state: ParseState, value: string) => void;

interface DataPiece {
	value: string;
	/** -d/--data reads @file; --data-raw and --json-free text never do. */
	allowFile: boolean;
	urlencode?: boolean;
}

interface ParseState {
	urls: string[];
	method: string | null;
	headers: Array<[string, string]>;
	removed: Set<string>;
	data: DataPiece[];
	form: FormPart[];
	auth: { user: string; password: string } | null;
	get: boolean;
	head: boolean;
	upload: string | null;
	insecure: boolean;
	timeout: number | null;
	proxy: string | null;
	json: boolean;
	warnings: CurlWarning[];
}

function warn(state: ParseState, code: CurlWarningCode, detail?: string) {
	if (!state.warnings.some((w) => w.code === code && w.detail === detail)) state.warnings.push({ code, detail });
}

function addHeader(state: ParseState, raw: string) {
	if (raw.startsWith('@')) return warn(state, 'headerFile', raw.slice(1));
	const colon = raw.indexOf(':');
	if (colon < 0) {
		// "Name;" sends the header with an empty value.
		if (raw.endsWith(';')) state.headers.push([raw.slice(0, -1).trim(), '']);
		return;
	}
	const name = raw.slice(0, colon).trim();
	const value = raw.slice(colon + 1).trim();
	// "Name:" with nothing after it removes a header curl would add itself.
	if (value === '') state.removed.add(name.toLowerCase());
	else state.headers.push([name, value]);
}

function parseForm(state: ParseState, raw: string, literal: boolean) {
	const eq = raw.indexOf('=');
	if (eq < 0) return warn(state, 'unsupportedOption', `-F ${raw}`);
	const name = raw.slice(0, eq);
	let rest = raw.slice(eq + 1);
	if (literal || !(rest.startsWith('@') || rest.startsWith('<'))) {
		state.form.push({ name, value: rest });
		return;
	}
	const reads = rest[0];
	rest = rest.slice(1);
	const [path, ...attrs] = rest.split(';');
	let filename: string | undefined;
	let type: string | undefined;
	for (const a of attrs) {
		const m = /^\s*(type|filename)=(.*)$/.exec(a);
		if (!m) continue;
		const v = m[2].replace(/^"(.*)"$/, '$1');
		if (m[1] === 'type') type = v;
		else filename = v;
	}
	if (path === '-') warn(state, 'stdin');
	// "<file" sends the file's contents as a plain field, without a filename.
	if (reads === '<') state.form.push({ name, file: path, type, filename: '' });
	else state.form.push({ name, file: path, filename, type });
}

const set = (k: 'get' | 'head' | 'insecure') => (s: ParseState) => {
	s[k] = true;
};

/** Options that take a value. */
const WITH_VALUE: Record<string, Handler> = {
	url: (s, v) => s.urls.push(v),
	request: (s, v) => (s.method = v),
	header: addHeader,
	data: (s, v) => s.data.push({ value: v, allowFile: true }),
	'data-ascii': (s, v) => s.data.push({ value: v, allowFile: true }),
	'data-binary': (s, v) => s.data.push({ value: v, allowFile: true }),
	'data-raw': (s, v) => s.data.push({ value: v, allowFile: false }),
	'data-urlencode': (s, v) => s.data.push({ value: v, allowFile: true, urlencode: true }),
	json: (s, v) => {
		s.data.push({ value: v, allowFile: true });
		s.json = true;
	},
	form: (s, v) => parseForm(s, v, false),
	'form-string': (s, v) => parseForm(s, v, true),
	user: (s, v) => {
		const colon = v.indexOf(':');
		if (colon < 0) warn(s, 'passwordPrompt');
		s.auth = colon < 0 ? { user: v, password: '' } : { user: v.slice(0, colon), password: v.slice(colon + 1) };
	},
	'oauth2-bearer': (s, v) => s.headers.push(['Authorization', `Bearer ${v}`]),
	cookie: (s, v) => {
		if (v.includes('=')) s.headers.push(['Cookie', v]);
		else warn(s, 'cookieFile', v);
	},
	'user-agent': (s, v) => s.headers.push(['User-Agent', v]),
	referer: (s, v) => {
		const r = v.replace(/;?auto$/, '');
		if (r) s.headers.push(['Referer', r]);
	},
	range: (s, v) => s.headers.push(['Range', `bytes=${v}`]),
	'max-time': (s, v) => {
		const n = Number(v);
		if (Number.isFinite(n) && n > 0) s.timeout = n;
	},
	proxy: (s, v) => (s.proxy = v),
	'upload-file': (s, v) => (s.upload = v),
	// Accepted and irrelevant to the request itself.
	output: () => {},
	'write-out': () => {},
	'dump-header': () => {},
	'cookie-jar': () => {},
	'connect-timeout': () => {},
	retry: () => {},
	'retry-delay': () => {},
	'retry-max-time': () => {},
	'max-redirs': () => {},
	'limit-rate': () => {},
	stderr: () => {},
	trace: () => {},
	'trace-ascii': () => {},
	'max-filesize': () => {},
	'keepalive-time': () => {},
	'expect100-timeout': () => {},
	// Change the request in ways the generated code doesn't reproduce.
	cert: (s) => warn(s, 'unsupportedOption', '--cert'),
	key: (s) => warn(s, 'unsupportedOption', '--key'),
	cacert: (s) => warn(s, 'unsupportedOption', '--cacert'),
	capath: (s) => warn(s, 'unsupportedOption', '--capath'),
	'aws-sigv4': (s) => warn(s, 'unsupportedOption', '--aws-sigv4'),
	'unix-socket': (s) => warn(s, 'unsupportedOption', '--unix-socket'),
	'abstract-unix-socket': (s) => warn(s, 'unsupportedOption', '--abstract-unix-socket'),
	resolve: (s) => warn(s, 'unsupportedOption', '--resolve'),
	'connect-to': (s) => warn(s, 'unsupportedOption', '--connect-to'),
	config: (s) => warn(s, 'unsupportedOption', '--config'),
	'proxy-user': (s) => warn(s, 'unsupportedOption', '--proxy-user'),
	interface: (s) => warn(s, 'unsupportedOption', '--interface'),
	'local-port': (s) => warn(s, 'unsupportedOption', '--local-port'),
	ciphers: () => {},
	'tls-max': () => {}
};

/** Options without a value (curl also accepts --no-<name> for most). */
const FLAGS: Record<string, Handler> = {
	get: set('get'),
	head: set('head'),
	insecure: set('insecure'),
	digest: (s) => warn(s, 'unsupportedOption', '--digest'),
	ntlm: (s) => warn(s, 'unsupportedOption', '--ntlm'),
	negotiate: (s) => warn(s, 'unsupportedOption', '--negotiate'),
	netrc: (s) => warn(s, 'unsupportedOption', '--netrc')
};
const IGNORED_FLAGS = new Set([
	'location', 'location-trusted', 'compressed', 'silent', 'show-error', 'verbose', 'include', 'fail',
	'fail-with-body', 'fail-early', 'http1.0', 'http1.1', 'http2', 'http2-prior-knowledge', 'http3', 'http3-only',
	'no-buffer', 'globoff', 'path-as-is', 'progress-bar', 'ipv4', 'ipv6', 'basic', 'anyauth', 'ssl', 'ssl-reqd',
	'tlsv1', 'tlsv1.0', 'tlsv1.1', 'tlsv1.2', 'tlsv1.3', 'raw', 'tcp-nodelay', 'tcp-fastopen', 'no-progress-meter',
	'disable', 'junk-session-cookies', 'parallel', 'remote-time', 'remote-name', 'remote-header-name',
	'remote-name-all', 'create-dirs', 'styled-output', 'keepalive', 'sessionid', 'alpn', 'npn', 'list-only',
	'append', 'use-ascii', 'manual', 'version', 'help', 'proxy-insecure', 'suppress-connect-headers', 'xattr',
	'cert-status', 'false-start', 'buffer', 'progress-meter', 'clobber', 'retry-connrefused', 'retry-all-errors'
]);

const SHORT_VALUE: Record<string, string> = {
	X: 'request', H: 'header', d: 'data', F: 'form', u: 'user', b: 'cookie', A: 'user-agent', e: 'referer',
	m: 'max-time', x: 'proxy', o: 'output', T: 'upload-file', E: 'cert', w: 'write-out', r: 'range',
	c: 'cookie-jar', U: 'proxy-user', D: 'dump-header', K: 'config'
};
const SHORT_FLAG: Record<string, string> = {
	G: 'get', I: 'head', L: 'location', k: 'insecure', s: 'silent', S: 'show-error', v: 'verbose',
	i: 'include', f: 'fail', g: 'globoff', n: 'netrc', N: 'no-buffer', '4': 'ipv4', '6': 'ipv6',
	'#': 'progress-bar', q: 'disable', j: 'junk-session-cookies', Z: 'parallel', l: 'list-only',
	R: 'remote-time', O: 'remote-name', J: 'remote-header-name', '0': 'http1.0', '1': 'tlsv1', '2': 'sslv2',
	'3': 'sslv3', a: 'append', B: 'use-ascii', M: 'manual', V: 'version', p: 'proxytunnel', h: 'help'
};

function runFlag(state: ParseState, name: string) {
	const off = name.startsWith('no-') && (name.slice(3) in FLAGS || IGNORED_FLAGS.has(name.slice(3)));
	const base = off ? name.slice(3) : name;
	if (base in FLAGS) {
		if (!off) FLAGS[base](state, '');
		else if (base === 'insecure' || base === 'get' || base === 'head') state[base] = false;
	} else if (!IGNORED_FLAGS.has(base) && !['sslv2', 'sslv3', 'proxytunnel'].includes(base)) {
		warn(state, 'unknownOption', `--${name}`);
	}
}

/**
 * What curl 8 sends for --data-urlencode: unreserved characters stay, a space
 * becomes +, and every other UTF-8 byte is %xx in lowercase.
 */
function curlEscape(s: string): string {
	let out = '';
	for (const b of new TextEncoder().encode(s)) {
		const c = String.fromCharCode(b);
		out += /[A-Za-z0-9\-._~]/.test(c) ? c : c === ' ' ? '+' : '%' + b.toString(16).padStart(2, '0');
	}
	return out;
}

function dataPiece(state: ParseState, piece: DataPiece): string | { file: string } {
	const v = piece.value;
	if (piece.urlencode) {
		// curl splits at the first '=' or '@', whichever comes first.
		const at = v.search(/[=@]/);
		if (at < 0) return curlEscape(v);
		if (v[at] === '@') {
			warn(state, 'unsupportedOption', `--data-urlencode ${v}`);
			return '';
		}
		const name = v.slice(0, at);
		return (name ? name + '=' : '') + curlEscape(v.slice(at + 1));
	}
	if (piece.allowFile && v.startsWith('@')) {
		if (v === '@-') {
			warn(state, 'stdin');
			return '';
		}
		return { file: v.slice(1) };
	}
	return v;
}

export function parseCurl(input: string): ToolResult<{ request: CurlRequest; warnings: CurlWarning[] }> {
	const trimmed = input.trim().replace(/^\$\s+/, '');
	if (!trimmed) return err('Paste a curl command');
	const tok = tokenize(trimmed);
	if (!tok.ok) return tok;
	const { args, trailing } = tok.value;
	if (!args.length || !/^(?:.*[\\/])?curl(?:\.exe)?$/i.test(args[0])) {
		return err('The command should start with curl', 1, 1);
	}

	const state: ParseState = {
		urls: [], method: null, headers: [], removed: new Set(), data: [], form: [], auth: null, get: false,
		head: false, upload: null, insecure: false, timeout: null, proxy: null, json: false, warnings: []
	};
	if (trailing) warn(state, 'trailing');

	let onlyArgs = false;
	for (let i = 1; i < args.length; i++) {
		const a = args[i];
		if (onlyArgs || !a.startsWith('-') || a === '-') {
			state.urls.push(a);
			continue;
		}
		if (a === '--') {
			onlyArgs = true;
			continue;
		}
		if (a.startsWith('--')) {
			const name = a.slice(2);
			if (name in WITH_VALUE) {
				if (i + 1 >= args.length) return err(`${a} needs a value`);
				WITH_VALUE[name](state, args[++i]);
			} else runFlag(state, name);
			continue;
		}
		// A cluster of short options: -sSL, -XPOST, -H'Accept: */*'.
		for (let j = 1; j < a.length; j++) {
			const c = a[j];
			if (c in SHORT_VALUE) {
				let value = a.slice(j + 1);
				if (!value) {
					if (i + 1 >= args.length) return err(`-${c} needs a value`);
					value = args[++i];
				}
				WITH_VALUE[SHORT_VALUE[c]](state, value);
				break;
			}
			if (c in SHORT_FLAG) runFlag(state, SHORT_FLAG[c]);
			else warn(state, 'unknownOption', `-${c}`);
		}
	}

	if (!state.urls.length) return err('No URL found in the command');
	if (state.urls.length > 1) warn(state, 'multipleUrls', String(state.urls.length));
	let url = state.urls[0];
	if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(url)) {
		warn(state, 'noScheme');
		url = 'http://' + url;
	}

	if (state.json) {
		if (!state.headers.some(([n]) => n.toLowerCase() === 'content-type')) state.headers.push(['Content-Type', 'application/json']);
		if (!state.headers.some(([n]) => n.toLowerCase() === 'accept')) state.headers.push(['Accept', 'application/json']);
	}

	let body: CurlBody | null = null;
	const pieces = state.data.map((p) => dataPiece(state, p));
	if (state.form.length) {
		body = { kind: 'form', parts: state.form };
		// The library writes the boundary; a hand-set multipart type would lack it.
		state.headers = state.headers.filter(([n, v]) => !(n.toLowerCase() === 'content-type' && /^multipart\/form-data\s*$/i.test(v)));
	} else if (pieces.length === 1 && typeof pieces[0] === 'object') {
		body = { kind: 'file', path: pieces[0].file };
	} else if (pieces.length) {
		const text = pieces
			.map((p) => {
				if (typeof p === 'string') return p;
				warn(state, 'unsupportedOption', `-d @${p.file}`);
				return '';
			})
			.join('&');
		if (state.get) {
			url += (url.includes('?') ? '&' : '?') + text;
		} else body = { kind: 'text', text };
	} else if (state.upload) {
		if (state.upload === '-' || state.upload === '.') warn(state, 'stdin');
		else body = { kind: 'file', path: state.upload };
	}

	if (body && body.kind !== 'form' && !state.upload && !state.removed.has('content-type') &&
		!state.headers.some(([n]) => n.toLowerCase() === 'content-type')) {
		state.headers.push(['Content-Type', 'application/x-www-form-urlencoded']);
	}

	const method =
		state.method?.toUpperCase() ??
		(state.head ? 'HEAD' : state.upload ? 'PUT' : state.get ? 'GET' : body ? 'POST' : 'GET');

	return ok({
		request: {
			url,
			method,
			headers: state.headers,
			body,
			auth: state.auth,
			insecure: state.insecure,
			timeout: state.timeout,
			proxy: state.proxy
		},
		warnings: state.warnings
	});
}

// ---------------------------------------------------------------------------
// Code generation

/** Headers that may repeat in curl but are one key in a JS/Python object. */
function mergedHeaders(headers: Array<[string, string]>): Array<[string, string]> {
	const out: Array<[string, string]> = [];
	for (const [n, v] of headers) {
		const prev = out.find(([p]) => p.toLowerCase() === n.toLowerCase());
		if (prev) prev[1] += (n.toLowerCase() === 'cookie' ? '; ' : ', ') + v;
		else out.push([n, v]);
	}
	return out;
}

function headerValue(req: CurlRequest, name: string): string | undefined {
	return req.headers.find(([n]) => n.toLowerCase() === name)?.[1];
}

/** The parsed JSON body, when the request declares JSON and the text is valid. */
function jsonBody(req: CurlRequest): { value: unknown } | null {
	if (req.body?.kind !== 'text' || !/json/i.test(headerValue(req, 'content-type') ?? '')) return null;
	try {
		const value: unknown = JSON.parse(req.body.text);
		// As an object literal, "__proto__" would set the prototype instead of a key.
		if (/"__proto__"\s*:/.test(req.body.text)) return null;
		return { value };
	} catch {
		return null;
	}
}

function esc(s: string, quote: string): string {
	let out = '';
	for (const ch of s) {
		const c = ch.codePointAt(0) ?? 0;
		if (ch === '\\') out += '\\\\';
		else if (ch === quote) out += '\\' + quote;
		else if (ch === '\n') out += '\\n';
		else if (ch === '\r') out += '\\r';
		else if (ch === '\t') out += '\\t';
		else if (c < 0x20 || c === 0x7f || c === 0x2028 || c === 0x2029) {
			out += c <= 0xff ? '\\x' + c.toString(16).padStart(2, '0') : '\\u' + c.toString(16).padStart(4, '0');
		} else out += ch;
	}
	return quote + out + quote;
}

const js = (s: string) => esc(s, "'");
const py = (s: string) => esc(s, "'");
const go = (s: string) => esc(s, '"');

function indentRest(text: string, pad: string): string {
	return text.replace(/\n/g, '\n' + pad);
}

function basicAuth(user: string, password: string): string {
	let bin = '';
	for (const b of new TextEncoder().encode(`${user}:${password}`)) bin += String.fromCharCode(b);
	return 'Basic ' + btoa(bin);
}

const FORBIDDEN_IN_BROWSER = ['cookie', 'host', 'origin', 'referer', 'user-agent', 'content-length', 'connection', 'accept-encoding'];

function fetchCode(req: CurlRequest, warnings: CurlWarning[]): string {
	const imports: string[] = [];
	const pre: string[] = [];
	const opts: string[] = [];
	if (req.method !== 'GET') opts.push(`method: ${js(req.method)}`);
	const headers = mergedHeaders(req.headers);
	if (req.auth && !headers.some(([n]) => n.toLowerCase() === 'authorization')) {
		headers.push(['Authorization', basicAuth(req.auth.user, req.auth.password)]);
	}
	if (headers.length) {
		opts.push(`headers: {\n${headers.map(([n, v]) => `    ${js(n)}: ${js(v)}`).join(',\n')}\n  }`);
	}
	const body = req.body;
	if (body?.kind === 'text') {
		const j = jsonBody(req);
		opts.push(j ? `body: JSON.stringify(${indentRest(JSON.stringify(j.value, null, 2), '  ')})` : `body: ${js(body.text)}`);
	} else if (body?.kind === 'file') {
		imports.push("import { readFile } from 'node:fs/promises';");
		opts.push(`body: await readFile(${js(body.path)})`);
	} else if (body?.kind === 'form') {
		pre.push('const form = new FormData();');
		for (const p of body.parts) {
			if ('value' in p) pre.push(`form.append(${js(p.name)}, ${js(p.value)});`);
			else {
				if (!imports.some((i) => i.includes('openAsBlob'))) imports.push("import { openAsBlob } from 'node:fs';");
				const blob = p.type ? `await openAsBlob(${js(p.file)}, { type: ${js(p.type)} })` : `await openAsBlob(${js(p.file)})`;
				const name = p.filename ?? p.file.split(/[\\/]/).pop() ?? p.file;
				pre.push(name ? `form.append(${js(p.name)}, ${blob}, ${js(name)});` : `form.append(${js(p.name)}, await (${blob}).text());`);
			}
		}
		opts.push('body: form');
	}
	if (req.timeout) opts.push(`signal: AbortSignal.timeout(${Math.round(req.timeout * 1000)})`);
	if (req.proxy) warnings.push({ code: 'fetchProxy' });
	if (req.insecure) warnings.push({ code: 'fetchInsecure' });
	const forbidden = headers.map(([n]) => n).filter((n) => FORBIDDEN_IN_BROWSER.includes(n.toLowerCase()));
	if (forbidden.length) warnings.push({ code: 'browserHeaders', detail: forbidden.join(', ') });

	const call = opts.length ? `await fetch(${js(req.url)}, {\n  ${opts.join(',\n  ')}\n})` : `await fetch(${js(req.url)})`;
	const lines = [
		...imports,
		...(imports.length ? [''] : []),
		...pre,
		...(pre.length ? [''] : []),
		`const response = ${call};`,
		'',
		req.method === 'HEAD' ? 'console.log(response.status, [...response.headers]);' : 'console.log(response.status, await response.text());'
	];
	return lines.join('\n');
}

function proxyParts(proxy: string): { protocol: string; host: string; port: number } {
	try {
		const u = new URL(/:\/\//.test(proxy) ? proxy : 'http://' + proxy);
		const protocol = u.protocol.replace(':', '');
		return { protocol, host: u.hostname, port: Number(u.port) || (protocol === 'https' ? 443 : 1080) };
	} catch {
		return { protocol: 'http', host: proxy, port: 1080 };
	}
}

function axiosCode(req: CurlRequest): string {
	const imports = ["import axios from 'axios';"];
	const pre: string[] = [];
	const opts: string[] = [`method: ${js(req.method.toLowerCase())}`, `url: ${js(req.url)}`];
	const headers = mergedHeaders(req.headers);
	// axios labels a Buffer body as a urlencoded form unless told otherwise; curl -T sends no type.
	if (req.body?.kind === 'file' && !headerValue(req, 'content-type')) headers.push(['Content-Type', 'application/octet-stream']);
	if (headers.length) opts.push(`headers: {\n${headers.map(([n, v]) => `    ${js(n)}: ${js(v)}`).join(',\n')}\n  }`);
	const body = req.body;
	if (body?.kind === 'text') {
		const j = jsonBody(req);
		opts.push(j ? `data: ${indentRest(JSON.stringify(j.value, null, 2), '  ')}` : `data: ${js(body.text)}`);
	} else if (body?.kind === 'file') {
		imports.push("import { readFile } from 'node:fs/promises';");
		opts.push(`data: await readFile(${js(body.path)})`);
	} else if (body?.kind === 'form') {
		pre.push('const form = new FormData();');
		for (const p of body.parts) {
			if ('value' in p) pre.push(`form.append(${js(p.name)}, ${js(p.value)});`);
			else {
				if (!imports.some((i) => i.includes('openAsBlob'))) imports.push("import { openAsBlob } from 'node:fs';");
				const blob = p.type ? `await openAsBlob(${js(p.file)}, { type: ${js(p.type)} })` : `await openAsBlob(${js(p.file)})`;
				const name = p.filename ?? p.file.split(/[\\/]/).pop() ?? p.file;
				pre.push(name ? `form.append(${js(p.name)}, ${blob}, ${js(name)});` : `form.append(${js(p.name)}, await (${blob}).text());`);
			}
		}
		opts.push('data: form');
	}
	if (req.auth) opts.push(`auth: {\n    username: ${js(req.auth.user)},\n    password: ${js(req.auth.password)}\n  }`);
	if (req.timeout) opts.push(`timeout: ${Math.round(req.timeout * 1000)}`);
	if (req.proxy) {
		const p = proxyParts(req.proxy);
		opts.push(`proxy: {\n    protocol: ${js(p.protocol)},\n    host: ${js(p.host)},\n    port: ${p.port}\n  }`);
	}
	if (req.insecure) {
		imports.push("import https from 'node:https';");
		opts.push('httpsAgent: new https.Agent({ rejectUnauthorized: false })');
	}
	// Like curl, report HTTP errors as responses instead of throwing.
	opts.push('validateStatus: () => true');
	return [
		...imports,
		'',
		...pre,
		...(pre.length ? [''] : []),
		`const response = await axios({\n  ${opts.join(',\n  ')}\n});`,
		'',
		req.method === 'HEAD' ? 'console.log(response.status, response.headers);' : 'console.log(response.status, response.data);'
	].join('\n');
}

function pyLiteral(v: unknown, depth = 0): string {
	const pad = '    '.repeat(depth + 1);
	const end = '    '.repeat(depth);
	if (v === null) return 'None';
	if (v === true) return 'True';
	if (v === false) return 'False';
	if (typeof v === 'number') return Number.isFinite(v) ? String(v) : 'None';
	if (typeof v === 'string') return py(v);
	if (Array.isArray(v)) {
		if (!v.length) return '[]';
		return `[\n${v.map((x) => pad + pyLiteral(x, depth + 1)).join(',\n')},\n${end}]`;
	}
	if (typeof v === 'object') {
		const entries = Object.entries(v as Record<string, unknown>);
		if (!entries.length) return '{}';
		return `{\n${entries.map(([k, x]) => `${pad}${py(k)}: ${pyLiteral(x, depth + 1)}`).join(',\n')},\n${end}}`;
	}
	return 'None';
}

/** A urlencoded body as a dict, when it splits cleanly and every key is unique. */
function formPairs(text: string): Array<[string, string]> | null {
	if (!text) return null;
	const pairs: Array<[string, string]> = [];
	for (const part of text.split('&')) {
		const m = /^([^=]+)=(.*)$/.exec(part);
		if (!m) return null;
		try {
			const k = decodeURIComponent(m[1].replace(/\+/g, ' '));
			const v = decodeURIComponent(m[2].replace(/\+/g, ' '));
			if (pairs.some(([p]) => p === k)) return null;
			pairs.push([k, v]);
		} catch {
			return null;
		}
	}
	return pairs;
}

const PY_METHODS = new Set(['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS']);

function pythonCode(req: CurlRequest): string {
	const blocks: string[] = [];
	const kwargs: string[] = [];
	let headers = mergedHeaders(req.headers);
	const body = req.body;
	const j = jsonBody(req);
	const isForm = /^application\/x-www-form-urlencoded/i.test(headerValue(req, 'content-type') ?? '');
	const pairs = body?.kind === 'text' && isForm && !j ? formPairs(body.text) : null;
	// requests sets these Content-Types itself for json= and dict data=.
	if ((j && /^application\/json\s*$/i.test(headerValue(req, 'content-type') ?? '')) || pairs) {
		headers = headers.filter(([n]) => n.toLowerCase() !== 'content-type');
	}
	if (headers.length) {
		blocks.push(`headers = {\n${headers.map(([n, v]) => `    ${py(n)}: ${py(v)},`).join('\n')}\n}`);
		kwargs.push('headers=headers');
	}
	if (j) {
		blocks.push(`json_data = ${pyLiteral(j.value)}`);
		kwargs.push('json=json_data');
	} else if (pairs) {
		blocks.push(`data = {\n${pairs.map(([k, v]) => `    ${py(k)}: ${py(v)},`).join('\n')}\n}`);
		kwargs.push('data=data');
	} else if (body?.kind === 'text') {
		blocks.push(`data = ${py(body.text)}`);
		kwargs.push('data=data');
	} else if (body?.kind === 'file') {
		kwargs.push(`data=open(${py(body.path)}, 'rb')`);
	} else if (body?.kind === 'form') {
		// A (None, value) tuple keeps text fields in the multipart body, in order.
		const items = body.parts.map((p) => {
			if ('value' in p) return `    (${py(p.name)}, (None, ${py(p.value)})),`;
			const name = p.filename ?? p.file.split(/[\\/]/).pop() ?? p.file;
			const open = `open(${py(p.file)}, 'rb')`;
			if (!name) return `    (${py(p.name)}, (None, ${open})),`;
			return `    (${py(p.name)}, (${py(name)}, ${open}${p.type ? `, ${py(p.type)}` : ''})),`;
		});
		blocks.push(`files = [\n${items.join('\n')}\n]`);
		kwargs.push('files=files');
	}
	if (req.auth) kwargs.push(`auth=(${py(req.auth.user)}, ${py(req.auth.password)})`);
	if (req.proxy) {
		const p = /:\/\//.test(req.proxy) ? req.proxy : 'http://' + req.proxy;
		blocks.push(`proxies = {\n    'http': ${py(p)},\n    'https': ${py(p)},\n}`);
		kwargs.push('proxies=proxies');
	}
	if (req.insecure) kwargs.push('verify=False');
	if (req.timeout) kwargs.push(`timeout=${req.timeout}`);

	const fn = PY_METHODS.has(req.method) ? `requests.${req.method.toLowerCase()}` : 'requests.request';
	const callArgs = [...(PY_METHODS.has(req.method) ? [] : [py(req.method)]), py(req.url), ...kwargs];
	const oneLine = `${fn}(${callArgs.join(', ')})`;
	const callLine = oneLine.length > 100 ? `${fn}(\n${callArgs.map((a) => `    ${a},`).join('\n')}\n)` : oneLine;
	return [
		'import requests',
		'',
		...blocks.flatMap((b) => [b, '']),
		`response = ${callLine}`,
		'',
		req.method === 'HEAD' ? 'print(response.status_code, response.headers)' : 'print(response.status_code, response.text)'
	].join('\n');
}

function goCode(req: CurlRequest): string {
	const imports = new Set(['fmt', 'io', 'net/http']);
	const lines: string[] = [];
	const check = ['\tif err != nil {', '\t\tpanic(err)', '\t}'];
	let bodyExpr = 'nil';
	const body = req.body;
	let formType = false;
	if (body?.kind === 'text') {
		imports.add('strings');
		const raw = body.text.includes('\n') && !/[`\r]/.test(body.text) ? '`' + body.text + '`' : go(body.text);
		lines.push(`\tbody := strings.NewReader(${raw})`);
		bodyExpr = 'body';
	} else if (body?.kind === 'file') {
		imports.add('os');
		lines.push(`\tbody, err := os.Open(${go(body.path)})`, ...check, '\tdefer body.Close()');
		bodyExpr = 'body';
	} else if (body?.kind === 'form') {
		imports.add('bytes');
		imports.add('mime/multipart');
		lines.push('\tvar body bytes.Buffer', '\tw := multipart.NewWriter(&body)');
		let i = 0;
		for (const p of body.parts) {
			if ('value' in p) {
				lines.push(`\tif err := w.WriteField(${go(p.name)}, ${go(p.value)}); err != nil {`, '\t\tpanic(err)', '\t}');
				continue;
			}
			imports.add('os');
			const f = `f${i}`;
			const part = `part${i++}`;
			const name = p.filename ?? p.file.split(/[\\/]/).pop() ?? p.file;
			lines.push(`\t${f}, err := os.Open(${go(p.file)})`, ...check, `\tdefer ${f}.Close()`);
			if (p.type || !name) {
				imports.add('net/textproto');
				const disp = name ? `form-data; name="${p.name}"; filename="${name}"` : `form-data; name="${p.name}"`;
				lines.push(`\th${i - 1} := make(textproto.MIMEHeader)`, `\th${i - 1}.Set("Content-Disposition", ${go(disp)})`);
				if (p.type) lines.push(`\th${i - 1}.Set("Content-Type", ${go(p.type)})`);
				lines.push(`\t${part}, err := w.CreatePart(h${i - 1})`);
			} else {
				lines.push(`\t${part}, err := w.CreateFormFile(${go(p.name)}, ${go(name)})`);
			}
			lines.push(...check, `\tif _, err := io.Copy(${part}, ${f}); err != nil {`, '\t\tpanic(err)', '\t}');
		}
		lines.push('\tif err := w.Close(); err != nil {', '\t\tpanic(err)', '\t}');
		bodyExpr = '&body';
		formType = true;
	}
	if (lines.length) lines.push('');
	lines.push(`\treq, err := http.NewRequest(${go(req.method)}, ${go(req.url)}, ${bodyExpr})`, ...check);
	for (const [n, v] of req.headers) {
		if (n.toLowerCase() === 'host') lines.push(`\treq.Host = ${go(v)}`);
		else lines.push(`\treq.Header.Add(${go(n)}, ${go(v)})`);
	}
	if (formType) lines.push('\treq.Header.Set("Content-Type", w.FormDataContentType())');
	if (req.auth) lines.push(`\treq.SetBasicAuth(${go(req.auth.user)}, ${go(req.auth.password)})`);
	lines.push('');

	const client: string[] = [];
	const transport: string[] = [];
	if (req.timeout) {
		imports.add('time');
		client.push(`\t\tTimeout: ${Math.round(req.timeout * 1000)} * time.Millisecond,`);
	}
	if (req.proxy) {
		imports.add('net/url');
		const p = /:\/\//.test(req.proxy) ? req.proxy : 'http://' + req.proxy;
		lines.push(`\tproxyURL, err := url.Parse(${go(p)})`, ...check);
		transport.push('\t\t\tProxy: http.ProxyURL(proxyURL),');
	}
	if (req.insecure) {
		imports.add('crypto/tls');
		transport.push('\t\t\tTLSClientConfig: &tls.Config{InsecureSkipVerify: true},');
	}
	if (transport.length) client.push('\t\tTransport: &http.Transport{', ...transport, '\t\t},');
	if (client.length) lines.push('\tclient := &http.Client{', ...client, '\t}');
	lines.push(`\tresp, err := ${client.length ? 'client' : 'http.DefaultClient'}.Do(req)`, ...check, '\tdefer resp.Body.Close()', '');
	lines.push('\tout, err := io.ReadAll(resp.Body)', ...check, '\tfmt.Println(resp.Status)', '\tfmt.Println(string(out))');

	const sorted = [...imports].sort();
	return ['package main', '', 'import (', ...sorted.map((i) => `\t"${i}"`), ')', '', 'func main() {', ...lines, '}'].join('\n');
}

const SECRET_HEADERS = /^(authorization|cookie|proxy-authorization|x-api-key|api-key|x-auth-token|x-csrf-token|x-xsrf-token)$/i;

export function convertCurl(input: string, target: CurlTarget): ToolResult<CurlConversion> {
	const parsed = parseCurl(input);
	if (!parsed.ok) return parsed;
	const { request } = parsed.value;
	const warnings = [...parsed.value.warnings];
	const code =
		target === 'fetch'
			? fetchCode(request, warnings)
			: target === 'axios'
				? axiosCode(request)
				: target === 'python'
					? pythonCode(request)
					: goCode(request);
	const hasSecrets =
		request.auth !== null ||
		request.headers.some(([n]) => SECRET_HEADERS.test(n) || /token|secret|key/i.test(n)) ||
		/[?&](?:access_token|token|api_key|apikey|key|sig|signature)=/i.test(request.url);
	return ok({ request, code, warnings, hasSecrets });
}
