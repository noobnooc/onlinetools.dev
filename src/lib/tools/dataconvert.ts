import { type ToolResult, ok, err } from './types';
import YAML from 'yaml';
import { parse as parseToml, stringify as stringifyToml } from 'smol-toml';

export type DataFormat = 'json' | 'yaml' | 'toml';

export function detectFormat(input: string): DataFormat | null {
	const s = input.trim();
	if (s === '') return null;
	if (/^[[{"]/.test(s)) {
		try {
			JSON.parse(s);
			return 'json';
		} catch {
			// fall through
		}
	}
	// TOML: starts with [table] or key = value
	if (/^\s*(\[[^\]]+\]|[A-Za-z0-9_-]+\s*=)/m.test(s) && !/^\s*[A-Za-z0-9_-]+\s*:/m.test(s)) {
		try {
			parseToml(s);
			return 'toml';
		} catch {
			// fall through
		}
	}
	try {
		const v = YAML.parse(s);
		if (v !== null && typeof v === 'object') return 'yaml';
	} catch {
		// fall through
	}
	return null;
}

export function parseData(input: string, format: DataFormat): ToolResult<unknown> {
	try {
		switch (format) {
			case 'json':
				return ok(JSON.parse(input));
			case 'yaml':
				return ok(YAML.parse(input));
			case 'toml':
				return ok(parseToml(input));
		}
	} catch (e) {
		const msg = e instanceof Error ? e.message : String(e);
		return err(msg.split('\n')[0]);
	}
}

export function stringifyData(value: unknown, format: DataFormat): ToolResult {
	try {
		switch (format) {
			case 'json':
				return ok(JSON.stringify(value, null, 2));
			case 'yaml':
				return ok(YAML.stringify(value).trimEnd());
			case 'toml': {
				if (value === null || typeof value !== 'object' || Array.isArray(value)) {
					return err('TOML requires a top-level table (an object), not an array or scalar');
				}
				return ok(stringifyToml(value as Record<string, unknown>).trimEnd());
			}
		}
	} catch (e) {
		return err(e instanceof Error ? e.message.split('\n')[0] : 'Serialization failed');
	}
}

export function convertData(input: string, from: DataFormat, to: DataFormat): ToolResult {
	const parsed = parseData(input, from);
	if (!parsed.ok) return parsed;
	return stringifyData(parsed.value, to);
}

/* ---------- JSON → CSV ---------- */

function flatten(obj: unknown, prefix = '', out: Record<string, unknown> = {}): Record<string, unknown> {
	if (obj !== null && typeof obj === 'object' && !Array.isArray(obj)) {
		for (const [k, v] of Object.entries(obj)) {
			const key = prefix === '' ? k : `${prefix}.${k}`;
			if (v !== null && typeof v === 'object' && !Array.isArray(v)) flatten(v, key, out);
			else out[key] = v;
		}
	} else {
		out[prefix || 'value'] = obj;
	}
	return out;
}

/** Raw cell text for a flattened value (before any CSV escaping). */
function cellText(v: unknown): string {
	if (v === null || v === undefined) return '';
	return Array.isArray(v) ? JSON.stringify(v) : String(v);
}

function csvEscape(s: string, delimiter: string): string {
	if (s.includes('"') || s.includes(delimiter) || s.includes('\n') || s.includes('\r')) {
		return '"' + s.replace(/"/g, '""') + '"';
	}
	return s;
}

export interface CsvResult {
	csv: string;
	rows: number;
	columns: string[];
	/** Unescaped cell values, header row first — use this for table rendering. */
	grid: string[][];
}

export function jsonToCsv(input: string, delimiter = ','): ToolResult<CsvResult> {
	let parsed: unknown;
	try {
		parsed = JSON.parse(input);
	} catch (e) {
		return err(e instanceof Error ? e.message : 'Invalid JSON');
	}
	const array = Array.isArray(parsed) ? parsed : [parsed];
	if (array.length === 0) return err('The array is empty — nothing to convert');
	const flatRows = array.map((row) => flatten(row));
	const columns: string[] = [];
	for (const row of flatRows) {
		for (const key of Object.keys(row)) {
			if (!columns.includes(key)) columns.push(key);
		}
	}
	const grid: string[][] = [
		columns,
		...flatRows.map((row) => columns.map((c) => cellText(row[c])))
	];
	const lines = grid.map((cells) => cells.map((c) => csvEscape(c, delimiter)).join(delimiter));
	return ok({ csv: lines.join('\n'), rows: array.length, columns, grid });
}

/**
 * Parse one or more RFC 4180 CSV records (quoted fields, escaped quotes,
 * embedded delimiters/newlines). Used to verify round-trips in tests.
 */
export function parseCsv(text: string, delimiter = ','): string[][] {
	const rows: string[][] = [];
	let row: string[] = [];
	let field = '';
	let inQuotes = false;
	for (let i = 0; i < text.length; i++) {
		const ch = text[i];
		if (inQuotes) {
			if (ch === '"') {
				if (text[i + 1] === '"') {
					field += '"';
					i++;
				} else {
					inQuotes = false;
				}
			} else {
				field += ch;
			}
		} else if (ch === '"') {
			inQuotes = true;
		} else if (ch === delimiter) {
			row.push(field);
			field = '';
		} else if (ch === '\n' || ch === '\r') {
			if (ch === '\r' && text[i + 1] === '\n') i++;
			row.push(field);
			field = '';
			rows.push(row);
			row = [];
		} else {
			field += ch;
		}
	}
	row.push(field);
	rows.push(row);
	return rows;
}

/* ---------- CSV → JSON ---------- */

export interface CsvToJsonOptions {
	delimiter: ',' | ';' | '\t' | '|' | 'auto';
	/** First row is a header row (columns become object keys). */
	header: boolean;
	/** Convert numeric / boolean / null-looking cells to typed values. */
	typed: boolean;
}

export function detectDelimiter(text: string): ',' | ';' | '\t' | '|' {
	const firstLines = text.split(/\r?\n/, 5).filter((l) => l.trim() !== '');
	const candidates = [',', ';', '\t', '|'] as const;
	let best: (typeof candidates)[number] = ',';
	let bestScore = -1;
	for (const d of candidates) {
		const counts = firstLines.map((l) => parseCsv(l, d)[0].length);
		if (counts.length === 0) continue;
		const consistent = counts.every((c) => c === counts[0]);
		const score = (consistent ? 1000 : 0) + counts[0];
		if (counts[0] > 1 && score > bestScore) {
			bestScore = score;
			best = d;
		}
	}
	return best;
}

function typedCell(s: string): unknown {
	if (s === '') return '';
	if (s === 'null') return null;
	if (s === 'true') return true;
	if (s === 'false') return false;
	if (/^-?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/.test(s) && s.length < 16) {
		const n = Number(s);
		if (Number.isFinite(n) && String(n) === s) return n;
	}
	return s;
}

export interface CsvToJsonResult {
	json: string;
	rows: number;
	columns: string[];
	delimiter: string;
}

export function csvToJson(input: string, opts: CsvToJsonOptions): ToolResult<CsvToJsonResult> {
	const text = input.replace(/^\uFEFF/, '');
	if (text.trim() === '') return err('Input is empty');
	const delimiter = opts.delimiter === 'auto' ? detectDelimiter(text) : opts.delimiter;
	const rows = parseCsv(text, delimiter).filter(
		(r, i, all) => !(i === all.length - 1 && r.length === 1 && r[0] === '')
	);
	if (rows.length === 0) return err('No rows found');
	const width = Math.max(...rows.map((r) => r.length));
	if (opts.header && rows.length === 1) return err('Only a header row — no data rows to convert');

	let value: unknown;
	let columns: string[];
	if (opts.header) {
		const header = rows[0];
		columns = header.map((h, i) => (h.trim() === '' ? `column_${i + 1}` : h.trim()));
		// Duplicate headers get numeric suffixes so no data is silently lost.
		const seen = new Map<string, number>();
		columns = columns.map((c) => {
			const n = seen.get(c) ?? 0;
			seen.set(c, n + 1);
			return n === 0 ? c : `${c}_${n + 1}`;
		});
		value = rows.slice(1).map((r) => {
			const obj: Record<string, unknown> = {};
			columns.forEach((c, i) => {
				const cell = r[i] ?? '';
				obj[c] = opts.typed ? typedCell(cell) : cell;
			});
			return obj;
		});
	} else {
		columns = Array.from({ length: width }, (_, i) => `column_${i + 1}`);
		value = rows.map((r) => (opts.typed ? r.map(typedCell) : r));
	}
	return ok({
		json: JSON.stringify(value, null, 2),
		rows: opts.header ? rows.length - 1 : rows.length,
		columns,
		delimiter: delimiter === '\t' ? 'tab' : delimiter
	});
}

/** Detector for Smart Paste: multi-line, consistent columns, at least 2×2. */
export function isLikelyCsv(input: string): boolean {
	const s = input.trim();
	const lines = s.split(/\r?\n/);
	if (lines.length < 2) return false;
	if (/^[[{<]/.test(s)) return false;
	const d = detectDelimiter(s);
	const rows = lines.slice(0, 6).map((l) => parseCsv(l, d)[0].length);
	return rows[0] >= 2 && rows.every((r) => r === rows[0]);
}

/* ---------- JSON → TypeScript ---------- */

function tsTypeOf(value: unknown, indent: string, root: boolean): string {
	if (value === null) return 'null';
	switch (typeof value) {
		case 'string':
			return 'string';
		case 'number':
			return 'number';
		case 'boolean':
			return 'boolean';
	}
	if (Array.isArray(value)) {
		if (value.length === 0) return 'unknown[]';
		const memberTypes = [...new Set(value.map((v) => tsTypeOf(v, indent, false)))];
		const t = memberTypes.length === 1 ? memberTypes[0] : `(${memberTypes.join(' | ')})`;
		return `${t}[]`;
	}
	const entries = Object.entries(value as Record<string, unknown>);
	if (entries.length === 0) return 'Record<string, never>';
	const inner = indent + '  ';
	const lines = entries.map(([k, v]) => {
		const key = /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(k) ? k : JSON.stringify(k);
		return `${inner}${key}: ${tsTypeOf(v, inner, false)};`;
	});
	return `{\n${lines.join('\n')}\n${indent}}`;
}

export function jsonToTypescript(input: string, rootName = 'Root'): ToolResult {
	let parsed: unknown;
	try {
		parsed = JSON.parse(input);
	} catch (e) {
		return err(e instanceof Error ? e.message : 'Invalid JSON');
	}
	const name = /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(rootName) ? rootName : 'Root';
	const type = tsTypeOf(parsed, '', true);
	if (type.startsWith('{')) return ok(`export interface ${name} ${type}`);
	return ok(`export type ${name} = ${type};`);
}

/* ---------- JSONPath (practical subset) ---------- */

interface PathMatch {
	path: string;
	value: unknown;
}

/**
 * Supports: $, .key, ["key"], [0], [*], .*, .. (recursive descent), [a,b] unions.
 * Filters ([?(...)]) are intentionally out of scope.
 */
export function queryJsonPath(json: string, path: string): ToolResult<PathMatch[]> {
	let root: unknown;
	try {
		root = JSON.parse(json);
	} catch (e) {
		return err('Input JSON: ' + (e instanceof Error ? e.message : 'invalid'));
	}
	const p = path.trim();
	if (p === '') return err('Path is empty');
	if (!p.startsWith('$')) return err('A JSONPath starts with $');
	if (p.includes('?(')) return err('Filter expressions [?(...)] are not supported yet');

	// Tokenize the path.
	const tokens: Array<string | number | { wildcard: true } | { recursive: true } | { union: (string | number)[] }> = [];
	let rest = p.slice(1);
	while (rest.length > 0) {
		let m: RegExpMatchArray | null;
		if ((m = rest.match(/^\.\.(\*|[A-Za-z_$][A-Za-z0-9_$-]*)?/))) {
			tokens.push({ recursive: true });
			if (m[1] === '*') tokens.push({ wildcard: true });
			else if (m[1]) tokens.push(m[1]);
			rest = rest.slice(m[0].length);
		} else if ((m = rest.match(/^\.\*/))) {
			tokens.push({ wildcard: true });
			rest = rest.slice(2);
		} else if ((m = rest.match(/^\.([A-Za-z_$][A-Za-z0-9_$-]*)/))) {
			tokens.push(m[1]);
			rest = rest.slice(m[0].length);
		} else if ((m = rest.match(/^\[\*\]/))) {
			tokens.push({ wildcard: true });
			rest = rest.slice(m[0].length);
		} else if ((m = rest.match(/^\[(-?\d+(?:\s*,\s*-?\d+)*)\]/))) {
			const nums = m[1].split(',').map((s) => Number(s.trim()));
			if (nums.length === 1) tokens.push(nums[0]);
			else tokens.push({ union: nums });
			rest = rest.slice(m[0].length);
		} else if ((m = rest.match(/^\[(['"])((?:(?!\1).)*)\1(?:\s*,\s*(['"])((?:(?!\3).)*)\3)*\]/))) {
			// Single or multi quoted keys.
			const inner = m[0].slice(1, -1);
			const keys = [...inner.matchAll(/(['"])((?:(?!\1).)*)\1/g)].map((k) => k[2]);
			if (keys.length === 1) tokens.push(keys[0]);
			else tokens.push({ union: keys });
			rest = rest.slice(m[0].length);
		} else {
			return err(`Cannot parse path near "${rest.slice(0, 12)}"`);
		}
	}

	const results: PathMatch[] = [];
	const LIMIT = 5000;

	function childKeys(node: unknown): (string | number)[] {
		if (Array.isArray(node)) return node.map((_, i) => i);
		if (node !== null && typeof node === 'object') return Object.keys(node);
		return [];
	}

	function getChild(node: unknown, key: string | number): { exists: boolean; value?: unknown } {
		if (Array.isArray(node)) {
			const i = typeof key === 'number' ? (key < 0 ? node.length + key : key) : Number(key);
			if (Number.isInteger(i) && i >= 0 && i < node.length) return { exists: true, value: node[i] };
			return { exists: false };
		}
		if (node !== null && typeof node === 'object') {
			const k = String(key);
			if (k in (node as Record<string, unknown>)) {
				return { exists: true, value: (node as Record<string, unknown>)[k] };
			}
		}
		return { exists: false };
	}

	function walk(node: unknown, nodePath: string, ti: number) {
		if (results.length >= LIMIT) return;
		if (ti >= tokens.length) {
			results.push({ path: nodePath, value: node });
			return;
		}
		const token = tokens[ti];
		if (typeof token === 'object' && 'recursive' in token) {
			// Recursive descent: apply the remaining tokens at this node and every descendant.
			walk(node, nodePath, ti + 1);
			for (const key of childKeys(node)) {
				const child = getChild(node, key);
				if (child.exists) {
					walk(child.value, appendPath(nodePath, key), ti);
				}
			}
			return;
		}
		if (typeof token === 'object' && 'wildcard' in token) {
			for (const key of childKeys(node)) {
				const child = getChild(node, key);
				if (child.exists) walk(child.value, appendPath(nodePath, key), ti + 1);
			}
			return;
		}
		if (typeof token === 'object' && 'union' in token) {
			for (const key of token.union) {
				const child = getChild(node, key);
				if (child.exists) walk(child.value, appendPath(nodePath, key), ti + 1);
			}
			return;
		}
		const child = getChild(node, token);
		if (child.exists) walk(child.value, appendPath(nodePath, token), ti + 1);
	}

	function appendPath(base: string, key: string | number): string {
		if (typeof key === 'number') return `${base}[${key}]`;
		return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(key) ? `${base}.${key}` : `${base}[${JSON.stringify(key)}]`;
	}

	walk(root, '$', 0);
	return ok(results);
}
