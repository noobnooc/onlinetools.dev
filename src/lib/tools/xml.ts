import { type ToolResult, ok, err } from './types';
import { XMLParser, XMLBuilder, XMLValidator } from 'fast-xml-parser';

export function validateXml(input: string): ToolResult<true> {
	if (input.trim() === '') return err('Input is empty');
	const res = XMLValidator.validate(input, { allowBooleanAttributes: true });
	if (res === true) return ok(true);
	return err(res.err.msg, res.err.line, res.err.col);
}

type XmlToken =
	| { kind: 'decl' | 'comment' | 'cdata' | 'doctype'; text: string }
	| { kind: 'open'; text: string; selfClosing: boolean }
	| { kind: 'close'; text: string }
	| { kind: 'text'; text: string };

function tokenizeXml(input: string): XmlToken[] {
	const tokens: XmlToken[] = [];
	let i = 0;
	const n = input.length;
	while (i < n) {
		if (input[i] === '<') {
			if (input.startsWith('<!--', i)) {
				const end = input.indexOf('-->', i);
				const stop = end === -1 ? n : end + 3;
				tokens.push({ kind: 'comment', text: input.slice(i, stop) });
				i = stop;
			} else if (input.startsWith('<![CDATA[', i)) {
				const end = input.indexOf(']]>', i);
				const stop = end === -1 ? n : end + 3;
				tokens.push({ kind: 'cdata', text: input.slice(i, stop) });
				i = stop;
			} else if (input.startsWith('<!', i)) {
				const end = input.indexOf('>', i);
				const stop = end === -1 ? n : end + 1;
				tokens.push({ kind: 'doctype', text: input.slice(i, stop) });
				i = stop;
			} else if (input.startsWith('<?', i)) {
				const end = input.indexOf('?>', i);
				const stop = end === -1 ? n : end + 2;
				tokens.push({ kind: 'decl', text: input.slice(i, stop) });
				i = stop;
			} else {
				// Find the closing > while respecting quoted attribute values.
				let j = i + 1;
				let quote: string | null = null;
				while (j < n) {
					const c = input[j];
					if (quote) {
						if (c === quote) quote = null;
					} else if (c === '"' || c === "'") {
						quote = c;
					} else if (c === '>') {
						break;
					}
					j++;
				}
				const stop = j >= n ? n : j + 1;
				const text = input.slice(i, stop);
				if (text.startsWith('</')) tokens.push({ kind: 'close', text });
				else tokens.push({ kind: 'open', text, selfClosing: /\/>$/.test(text) });
				i = stop;
			}
		} else {
			const next = input.indexOf('<', i);
			const stop = next === -1 ? n : next;
			tokens.push({ kind: 'text', text: input.slice(i, stop) });
			i = stop;
		}
	}
	return tokens;
}

/** Pretty-print XML, preserving comments, CDATA and the prolog. */
export function formatXml(input: string, indent = 2): ToolResult {
	const valid = validateXml(input);
	if (!valid.ok) return valid as ToolResult;
	const tokens = tokenizeXml(input);
	const pad = (d: number) => ' '.repeat(Math.max(0, d) * indent);
	const lines: string[] = [];
	let depth = 0;
	for (let t = 0; t < tokens.length; t++) {
		const tok = tokens[t];
		if (tok.kind === 'text') {
			const trimmed = tok.text.trim();
			if (trimmed === '') continue;
			// Inline a pure-text element: <a>text</a> on one line.
			const prev = tokens[t - 1];
			const next = tokens[t + 1];
			if (
				prev?.kind === 'open' &&
				!prev.selfClosing &&
				next?.kind === 'close' &&
				lines.length > 0
			) {
				lines[lines.length - 1] += trimmed + next.text;
				depth--;
				t++; // consume the close tag
				continue;
			}
			lines.push(pad(depth) + trimmed.replace(/\s+/g, ' '));
		} else if (tok.kind === 'close') {
			depth--;
			lines.push(pad(depth) + tok.text.trim());
		} else if (tok.kind === 'open') {
			lines.push(pad(depth) + tok.text.replace(/\s+/g, ' ').trim());
			if (!tok.selfClosing) depth++;
		} else {
			lines.push(pad(depth) + tok.text.trim());
		}
	}
	return ok(lines.join('\n'));
}

/** Remove inter-element whitespace and comments. */
export function minifyXml(input: string): ToolResult {
	const valid = validateXml(input);
	if (!valid.ok) return valid as ToolResult;
	const tokens = tokenizeXml(input);
	let out = '';
	for (const tok of tokens) {
		if (tok.kind === 'comment') continue;
		if (tok.kind === 'text') {
			const trimmed = tok.text.trim();
			if (trimmed === '') continue;
			out += trimmed.replace(/\s+/g, ' ');
		} else if (tok.kind === 'open') {
			out += tok.text.replace(/\s+/g, ' ').replace(/\s*\/>$/, '/>').replace(/\s*>$/, '>');
		} else {
			out += tok.text.trim();
		}
	}
	return ok(out);
}

/* ---------- XML ↔ JSON ---------- */

const ATTR_PREFIX = '@_';

export function xmlToJson(input: string, indent = 2): ToolResult {
	const valid = validateXml(input);
	if (!valid.ok) return valid as ToolResult;
	try {
		const parser = new XMLParser({
			ignoreAttributes: false,
			attributeNamePrefix: ATTR_PREFIX,
			textNodeName: '#text',
			parseTagValue: true,
			parseAttributeValue: true,
			trimValues: true,
			cdataPropName: '#cdata'
		});
		const obj = parser.parse(input);
		return ok(JSON.stringify(obj, null, indent));
	} catch (e) {
		return err(e instanceof Error ? e.message.split('\n')[0] : 'Could not convert this XML');
	}
}

export function jsonToXml(input: string, indent = 2): ToolResult {
	let parsed: unknown;
	try {
		parsed = JSON.parse(input);
	} catch (e) {
		return err(e instanceof Error ? e.message : 'Invalid JSON');
	}
	if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
		return err('JSON → XML needs a top-level object whose keys become elements');
	}
	try {
		const builder = new XMLBuilder({
			ignoreAttributes: false,
			attributeNamePrefix: ATTR_PREFIX,
			textNodeName: '#text',
			cdataPropName: '#cdata',
			format: true,
			indentBy: ' '.repeat(indent),
			suppressEmptyNode: true
		});
		const xml = String(builder.build(parsed)).trimEnd();
		if (xml.trim() === '') return err('Nothing to convert — the object is empty');
		return ok(xml);
	} catch (e) {
		return err(e instanceof Error ? e.message.split('\n')[0] : 'Could not build XML from this JSON');
	}
}

/** Detector for Smart Paste: does this look like an XML document? */
export function isLikelyXml(input: string): boolean {
	const s = input.trim();
	if (!s.startsWith('<') || !s.endsWith('>')) return false;
	if (/^<!doctype\s+html/i.test(s) || /^<html[\s>]/i.test(s)) return false;
	if (!/^<\?xml|^<[A-Za-z_][\w.-]*[\s>/]/.test(s)) return false;
	return XMLValidator.validate(s, { allowBooleanAttributes: true }) === true;
}
