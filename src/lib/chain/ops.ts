import { type ToolResult, ok, err } from '$lib/tools/types';
import { encodeBase64, decodeBase64 } from '$lib/tools/base64';
import { encodeUrl, decodeUrl } from '$lib/tools/url';
import { encodeBytes, decodeBytes } from '$lib/tools/hexbin';
import { encodeEntities, decodeEntities } from '$lib/tools/htmlentities';
import { formatJson } from '$lib/tools/json';
import { decodeJwt } from '$lib/tools/jwt';
import { convertData, jsonToCsv, jsonToTypescript, queryJsonPath } from '$lib/tools/dataconvert';
import { inferJsonSchema } from '$lib/tools/jsonschema';
import { slugify, processLines } from '$lib/tools/text';
import { formatSql, minifySql } from '$lib/tools/sqlformat';
import { beautifyCode } from '$lib/tools/codeformat';
import { markdownToHtml, htmlToMarkdown } from '$lib/tools/markdown';

/**
 * Pipeline operations. Each op is a thin, pure wrapper over an already
 * unit-tested tool-logic function, normalized to a single `string → ToolResult`
 * shape so steps can be composed generically. Labels stay in English (technical
 * tokens developers recognize); the page chrome around them is localized.
 */

export type PipeGroup = 'encoding' | 'json' | 'text' | 'code';

export interface PipeArg {
	/** Short technical label, e.g. "path". */
	label: string;
	placeholder: string;
	default?: string;
}

export interface PipeOp {
	id: string;
	label: string;
	group: PipeGroup;
	/** Optional single free-text argument (e.g. a JSONPath). */
	arg?: PipeArg;
	run(input: string, arg?: string): ToolResult;
}

function jsonpathRun(input: string, arg?: string): ToolResult {
	const res = queryJsonPath(input, arg?.trim() || '$');
	if (!res.ok) return res;
	if (res.value.length === 0) return err('No matches for that path');
	const values = res.value.map((m) => m.value);
	const out = values.length === 1 ? values[0] : values;
	return ok(typeof out === 'string' ? out : JSON.stringify(out, null, 2));
}

function jwtPayload(input: string): ToolResult {
	const r = decodeJwt(input);
	return r.ok ? ok(JSON.stringify(r.value.payload, null, 2)) : r;
}

export const PIPE_OPS: PipeOp[] = [
	// Encoding
	{ id: 'base64-decode', label: 'Base64 decode', group: 'encoding', run: (i) => decodeBase64(i) },
	{ id: 'base64-encode', label: 'Base64 encode', group: 'encoding', run: (i) => encodeBase64(i) },
	{ id: 'url-decode', label: 'URL decode', group: 'encoding', run: (i) => decodeUrl(i) },
	{ id: 'url-encode', label: 'URL encode', group: 'encoding', run: (i) => encodeUrl(i) },
	{ id: 'hex-decode', label: 'Hex → text', group: 'encoding', run: (i) => decodeBytes(i, 'hex') },
	{
		id: 'hex-encode',
		label: 'Text → hex',
		group: 'encoding',
		run: (i) => encodeBytes(i, { format: 'hex', separator: ' ', uppercase: false, prefix: false })
	},
	{
		id: 'html-entities-decode',
		label: 'HTML entities decode',
		group: 'encoding',
		run: (i) => decodeEntities(i)
	},
	{
		id: 'html-entities-encode',
		label: 'HTML entities encode',
		group: 'encoding',
		run: (i) => ok(encodeEntities(i))
	},

	// JSON & data
	{
		id: 'jwt-payload',
		label: 'JWT → payload',
		group: 'json',
		run: jwtPayload
	},
	{ id: 'json-pretty', label: 'JSON prettify', group: 'json', run: (i) => formatJson(i, { indent: 2 }) },
	{ id: 'json-minify', label: 'JSON minify', group: 'json', run: (i) => formatJson(i, { indent: 'min' }) },
	{
		id: 'json-sort-keys',
		label: 'JSON sort keys',
		group: 'json',
		run: (i) => formatJson(i, { indent: 2, sortKeys: true })
	},
	{
		id: 'jsonpath',
		label: 'JSONPath filter',
		group: 'json',
		arg: { label: 'path', placeholder: '$.user.name', default: '$' },
		run: jsonpathRun
	},
	{ id: 'json-to-yaml', label: 'JSON → YAML', group: 'json', run: (i) => convertData(i, 'json', 'yaml') },
	{ id: 'yaml-to-json', label: 'YAML → JSON', group: 'json', run: (i) => convertData(i, 'yaml', 'json') },
	{
		id: 'json-to-csv',
		label: 'JSON → CSV',
		group: 'json',
		run: (i) => {
			const r = jsonToCsv(i);
			return r.ok ? ok(r.value.csv) : r;
		}
	},
	{ id: 'json-to-ts', label: 'JSON → TypeScript', group: 'json', run: (i) => jsonToTypescript(i) },
	{ id: 'json-schema', label: 'Infer JSON Schema', group: 'json', run: (i) => inferJsonSchema(i) },

	// Text
	{ id: 'uppercase', label: 'UPPERCASE', group: 'text', run: (i) => ok(i.toUpperCase()) },
	{ id: 'lowercase', label: 'lowercase', group: 'text', run: (i) => ok(i.toLowerCase()) },
	{ id: 'trim', label: 'Trim whitespace', group: 'text', run: (i) => ok(i.trim()) },
	{ id: 'slugify', label: 'Slugify', group: 'text', run: (i) => ok(slugify(i)) },
	{
		id: 'sort-lines',
		label: 'Sort lines',
		group: 'text',
		run: (i) => ok(processLines(i, { sort: 'asc' }).output)
	},
	{
		id: 'dedupe-lines',
		label: 'Dedupe lines',
		group: 'text',
		run: (i) => ok(processLines(i, { dedupe: true }).output)
	},

	// Code
	{
		id: 'sql-format',
		label: 'SQL format',
		group: 'code',
		run: (i) => formatSql(i, { dialect: 'sql', keywordCase: 'upper', indent: 2 })
	},
	{ id: 'sql-minify', label: 'SQL minify', group: 'code', run: (i) => minifySql(i) },
	{ id: 'css-format', label: 'CSS format', group: 'code', run: (i) => beautifyCode('css', i) },
	{ id: 'js-format', label: 'JS format', group: 'code', run: (i) => beautifyCode('js', i) },
	{ id: 'html-format', label: 'HTML format', group: 'code', run: (i) => beautifyCode('html', i) },
	{ id: 'markdown-to-html', label: 'Markdown → HTML', group: 'code', run: (i) => markdownToHtml(i) },
	{ id: 'html-to-markdown', label: 'HTML → Markdown', group: 'code', run: (i) => htmlToMarkdown(i) }
];

export const PIPE_OP_BY_ID = new Map(PIPE_OPS.map((o) => [o.id, o]));

export const PIPE_GROUPS: PipeGroup[] = ['encoding', 'json', 'text', 'code'];

/** English group labels; the page localizes the surrounding chrome, not these. */
export const PIPE_GROUP_LABELS: Record<PipeGroup, string> = {
	encoding: 'Encoding',
	json: 'JSON & Data',
	text: 'Text',
	code: 'Code & Markup'
};
