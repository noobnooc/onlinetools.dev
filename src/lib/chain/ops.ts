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
import { PIPE_OP_META, type PipeOpMeta } from './op-meta';

/**
 * Runnable pipeline operations: the SSR-safe metadata in `op-meta.ts` paired
 * with a run function. Each run is a thin, pure wrapper over an already
 * unit-tested tool-logic function, normalized to `string → ToolResult` so steps
 * compose generically. Importing this module pulls in the underlying tool
 * libraries (some browser-only), so it must stay client-side.
 */

export type PipeRun = (input: string, arg?: string) => ToolResult;

export interface PipeOp extends PipeOpMeta {
	run: PipeRun;
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

/** Run function per op id — kept in lockstep with PIPE_OP_META. */
const RUNS: Record<string, PipeRun> = {
	'base64-decode': (i) => decodeBase64(i),
	'base64-encode': (i) => encodeBase64(i),
	'url-decode': (i) => decodeUrl(i),
	'url-encode': (i) => encodeUrl(i),
	'hex-decode': (i) => decodeBytes(i, 'hex'),
	'hex-encode': (i) => encodeBytes(i, { format: 'hex', separator: ' ', uppercase: false, prefix: false }),
	'html-entities-decode': (i) => decodeEntities(i),
	'html-entities-encode': (i) => ok(encodeEntities(i)),

	'jwt-payload': jwtPayload,
	'json-pretty': (i) => formatJson(i, { indent: 2 }),
	'json-minify': (i) => formatJson(i, { indent: 'min' }),
	'json-sort-keys': (i) => formatJson(i, { indent: 2, sortKeys: true }),
	jsonpath: jsonpathRun,
	'json-to-yaml': (i) => convertData(i, 'json', 'yaml'),
	'yaml-to-json': (i) => convertData(i, 'yaml', 'json'),
	'json-to-csv': (i) => {
		const r = jsonToCsv(i);
		return r.ok ? ok(r.value.csv) : r;
	},
	'json-to-ts': (i) => jsonToTypescript(i),
	'json-schema': (i) => inferJsonSchema(i),

	uppercase: (i) => ok(i.toUpperCase()),
	lowercase: (i) => ok(i.toLowerCase()),
	trim: (i) => ok(i.trim()),
	slugify: (i) => ok(slugify(i)),
	'sort-lines': (i) => ok(processLines(i, { sort: 'asc' }).output),
	'dedupe-lines': (i) => ok(processLines(i, { dedupe: true }).output),

	'sql-format': (i) => formatSql(i, { dialect: 'sql', keywordCase: 'upper', indent: 2 }),
	'sql-minify': (i) => minifySql(i),
	'css-format': (i) => beautifyCode('css', i),
	'js-format': (i) => beautifyCode('js', i),
	'html-format': (i) => beautifyCode('html', i),
	'markdown-to-html': (i) => markdownToHtml(i),
	'html-to-markdown': (i) => htmlToMarkdown(i)
};

export const PIPE_OPS: PipeOp[] = PIPE_OP_META.map((meta) => ({
	...meta,
	run: RUNS[meta.id] ?? (() => err(`No implementation for "${meta.id}"`))
}));

export const PIPE_OP_BY_ID = new Map(PIPE_OPS.map((o) => [o.id, o]));

export { PIPE_GROUPS, PIPE_GROUP_LABELS } from './op-meta';
