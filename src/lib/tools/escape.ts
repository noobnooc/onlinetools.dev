import { type ToolResult, ok, err } from './types';

export type EscapeDialect = 'json' | 'js' | 'java' | 'xml' | 'sql' | 'csv';

export const DIALECTS: EscapeDialect[] = ['json', 'js', 'java', 'xml', 'sql', 'csv'];

/* ---------- backslash family (json / js / java) ---------- */

const CONTROL_ESCAPES: Record<string, string> = {
	'\b': '\\b',
	'\f': '\\f',
	'\n': '\\n',
	'\r': '\\r',
	'\t': '\\t'
};

function escapeBackslash(text: string, dialect: 'json' | 'js' | 'java'): string {
	let out = '';
	for (const ch of text) {
		if (ch === '\\') out += '\\\\';
		else if (ch === '"') out += '\\"';
		else if (ch in CONTROL_ESCAPES) out += CONTROL_ESCAPES[ch];
		else if (dialect === 'js' && (ch === "'" || ch === '`')) out += '\\' + ch;
		else {
			const cp = ch.codePointAt(0)!;
			if (cp < 0x20) {
				out += '\\u' + cp.toString(16).padStart(4, '0');
			} else if (dialect === 'java' && cp > 0x7e) {
				// Java convention: non-ASCII as \uXXXX (UTF-16 code units).
				for (let i = 0; i < ch.length; i++) {
					out += '\\u' + ch.charCodeAt(i).toString(16).padStart(4, '0');
				}
			} else {
				out += ch;
			}
		}
	}
	return out;
}

function unescapeBackslash(text: string): ToolResult {
	let out = '';
	let i = 0;
	while (i < text.length) {
		const ch = text[i];
		if (ch !== '\\') {
			out += ch;
			i++;
			continue;
		}
		const next = text[i + 1];
		if (next === undefined) return err('Dangling backslash at end of input');
		switch (next) {
			case 'n': out += '\n'; i += 2; break;
			case 'r': out += '\r'; i += 2; break;
			case 't': out += '\t'; i += 2; break;
			case 'b': out += '\b'; i += 2; break;
			case 'f': out += '\f'; i += 2; break;
			case 'v': out += '\v'; i += 2; break;
			case '0': out += '\0'; i += 2; break;
			case '\\': out += '\\'; i += 2; break;
			case '"': out += '"'; i += 2; break;
			case "'": out += "'"; i += 2; break;
			case '`': out += '`'; i += 2; break;
			case '/': out += '/'; i += 2; break;
			case 'x': {
				const hex = text.slice(i + 2, i + 4);
				if (!/^[0-9a-fA-F]{2}$/.test(hex)) return err(`Invalid \\x escape at index ${i}`);
				out += String.fromCharCode(parseInt(hex, 16));
				i += 4;
				break;
			}
			case 'u': {
				if (text[i + 2] === '{') {
					const end = text.indexOf('}', i + 3);
					if (end === -1) return err(`Unterminated \\u{…} escape at index ${i}`);
					const hex = text.slice(i + 3, end);
					if (!/^[0-9a-fA-F]{1,6}$/.test(hex)) return err(`Invalid \\u{…} escape at index ${i}`);
					out += String.fromCodePoint(parseInt(hex, 16));
					i = end + 1;
				} else {
					const hex = text.slice(i + 2, i + 6);
					if (!/^[0-9a-fA-F]{4}$/.test(hex)) return err(`Invalid \\u escape at index ${i}`);
					out += String.fromCharCode(parseInt(hex, 16));
					i += 6;
				}
				break;
			}
			default:
				return err(`Unknown escape sequence \\${next} at index ${i}`);
		}
	}
	return ok(out);
}

/* ---------- xml ---------- */

function escapeXml(text: string): string {
	return text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

const XML_ENTITIES: Record<string, string> = {
	amp: '&',
	lt: '<',
	gt: '>',
	quot: '"',
	apos: "'"
};

function unescapeXml(text: string): ToolResult {
	let bad: string | null = null;
	const out = text.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (m, body: string) => {
		if (body.startsWith('#x') || body.startsWith('#X')) {
			return String.fromCodePoint(parseInt(body.slice(2), 16));
		}
		if (body.startsWith('#')) {
			return String.fromCodePoint(parseInt(body.slice(1), 10));
		}
		if (body in XML_ENTITIES) return XML_ENTITIES[body];
		bad = m;
		return m;
	});
	if (bad) return err(`"${bad}" is not one of XML's five predefined entities`);
	return ok(out);
}

/* ---------- sql ---------- */

function escapeSql(text: string): string {
	return text.replace(/'/g, "''");
}

function unescapeSql(text: string): string {
	return text.replace(/''/g, "'");
}

/* ---------- csv ---------- */

function escapeCsv(text: string): string {
	if (/[",\n\r]/.test(text)) return '"' + text.replace(/"/g, '""') + '"';
	return text;
}

function unescapeCsv(text: string): ToolResult {
	const s = text;
	if (s.startsWith('"') && s.endsWith('"') && s.length >= 2) {
		const body = s.slice(1, -1);
		// A lone " inside must be part of a "" pair.
		if (/(^|[^"])"([^"]|$)/.test(body)) return err('Unescaped double quote inside a quoted field');
		return ok(body.replace(/""/g, '"'));
	}
	return ok(s);
}

/* ---------- public API ---------- */

export function escapeText(text: string, dialect: EscapeDialect): ToolResult {
	if (text === '') return err('Input is empty');
	switch (dialect) {
		case 'json':
			return ok(escapeBackslash(text, 'json'));
		case 'js':
			return ok(escapeBackslash(text, 'js'));
		case 'java':
			return ok(escapeBackslash(text, 'java'));
		case 'xml':
			return ok(escapeXml(text));
		case 'sql':
			return ok(escapeSql(text));
		case 'csv':
			return ok(escapeCsv(text));
	}
}

export function unescapeText(text: string, dialect: EscapeDialect): ToolResult {
	if (text === '') return err('Input is empty');
	switch (dialect) {
		case 'json':
		case 'js':
		case 'java':
			return unescapeBackslash(text);
		case 'xml':
			return unescapeXml(text);
		case 'sql':
			return ok(unescapeSql(text));
		case 'csv':
			return unescapeCsv(text);
	}
}
