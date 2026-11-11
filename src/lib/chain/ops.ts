import { type ToolResult, ok, err } from '$lib/tools/types';
import { encodeBase64, decodeBase64 } from '$lib/tools/base64';
import { encodeUrl, decodeUrl, queryToJson, jsonToQuery } from '$lib/tools/url';
import { encodeBytes, decodeBytes } from '$lib/tools/hexbin';
import { encodeEntities, decodeEntities } from '$lib/tools/htmlentities';
import { formatJson } from '$lib/tools/json';
import { decodeJwt } from '$lib/tools/jwt';
import { slugify, processLines } from '$lib/tools/text';
import { aggregateCidrs } from '$lib/tools/cidr';
import { PIPE_OP_META, type PipeOpMeta } from './op-meta';

/**
 * Runnable pipeline operations: the SSR-safe metadata in `op-meta.ts` paired
 * with a run function. Each run is a thin, pure wrapper over an already
 * unit-tested tool-logic function, normalized to `string → ToolResult` so steps
 * compose generically.
 *
 * Ops over small, dependency-free tool modules are bundled with the page.
 * Ops that need a heavy library (yaml, ajv, sql-formatter, js-beautify,
 * marked/turndown) are loaded the first time a pipeline uses them, so /chain
 * and its recipe pages don't download every library up front. Call
 * `loadOps()` before `runChain()`; `bundle.test.ts` guards the split.
 */

export type PipeRun = (input: string, arg?: string) => ToolResult;

export type PipeOp = PipeOpMeta;

function jwtPayload(input: string): ToolResult {
	const r = decodeJwt(input);
	return r.ok ? ok(JSON.stringify(r.value.payload, null, 2)) : r;
}

/** Join non-empty lines with a separator; an empty argument means ", ". */
function joinLines(input: string, arg?: string): ToolResult {
	const sep = (arg || ', ').replace(/\\n/g, '\n').replace(/\\t/g, '\t');
	const lines = input
		.split(/\r?\n/)
		.map((l) => l.trim())
		.filter(Boolean);
	return ok(lines.join(sep));
}

/**
 * Aggregate a CIDR list (one per line or comma-separated) into the fewest
 * blocks, minus the comma-separated argument. A pipeline has no place to show
 * per-line warnings, so a bad entry fails the step instead of being skipped.
 */
function cidrAggregate(input: string, arg?: string): ToolResult {
	const r = aggregateCidrs(input, arg ?? '');
	if (!r.ok) return r;
	const bad = r.value.errors[0];
	if (bad) {
		const where = bad.source === 'exclude' ? `Minus "${bad.entry}"` : `Line ${bad.line}`;
		return err(`${where}: ${bad.message}`);
	}
	if (r.value.cidrs.length === 0) return err('Nothing is left after the exclusions');
	return ok(r.value.cidrs.join('\n'));
}

/** Ops bundled with the page: their tool modules have no dependencies. */
const EAGER: Record<string, PipeRun> = {
	'base64-decode': (i) => decodeBase64(i),
	'base64-encode': (i) => encodeBase64(i),
	'url-decode': (i) => decodeUrl(i),
	'url-encode': (i) => encodeUrl(i),
	'query-to-json': (i) => queryToJson(i),
	'json-to-query': (i) => jsonToQuery(i),
	'hex-decode': (i) => decodeBytes(i, 'hex'),
	'hex-encode': (i) => encodeBytes(i, { format: 'hex', separator: ' ', uppercase: false, prefix: false }),
	'html-entities-decode': (i) => decodeEntities(i),
	'html-entities-encode': (i) => ok(encodeEntities(i)),

	'jwt-payload': jwtPayload,
	'json-pretty': (i) => formatJson(i, { indent: 2 }),
	'json-minify': (i) => formatJson(i, { indent: 'min' }),
	'json-sort-keys': (i) => formatJson(i, { indent: 2, sortKeys: true }),

	uppercase: (i) => ok(i.toUpperCase()),
	lowercase: (i) => ok(i.toLowerCase()),
	trim: (i) => ok(i.trim()),
	slugify: (i) => ok(slugify(i)),
	'sort-lines': (i) => ok(processLines(i, { sort: 'asc' }).output),
	'dedupe-lines': (i) => ok(processLines(i, { dedupe: true }).output),
	'join-lines': joinLines,

	'cidr-aggregate': cidrAggregate
};

const dataconvert = () => import('$lib/tools/dataconvert');
const sqlformat = () => import('$lib/tools/sqlformat');
const codeformat = () => import('$lib/tools/codeformat');
const markdown = () => import('$lib/tools/markdown');

/** Ops whose tool module pulls in a heavy library, imported on first use. */
const LAZY: Record<string, () => Promise<PipeRun>> = {
	jsonpath: async () => {
		const { queryJsonPath } = await dataconvert();
		return (input, arg) => {
			const res = queryJsonPath(input, arg?.trim() || '$');
			if (!res.ok) return res;
			if (res.value.length === 0) return err('No matches for that path');
			const values = res.value.map((m) => m.value);
			const out = values.length === 1 ? values[0] : values;
			return ok(typeof out === 'string' ? out : JSON.stringify(out, null, 2));
		};
	},
	'json-to-yaml': async () => {
		const { convertData } = await dataconvert();
		return (i) => convertData(i, 'json', 'yaml');
	},
	'yaml-to-json': async () => {
		const { convertData } = await dataconvert();
		return (i) => convertData(i, 'yaml', 'json');
	},
	'json-to-csv': async () => {
		const { jsonToCsv } = await dataconvert();
		return (i) => {
			const r = jsonToCsv(i);
			return r.ok ? ok(r.value.csv) : r;
		};
	},
	'json-to-ts': async () => {
		const { jsonToTypescript } = await dataconvert();
		return (i) => jsonToTypescript(i);
	},
	'json-schema': async () => {
		const { inferJsonSchema } = await import('$lib/tools/jsonschema');
		return (i) => inferJsonSchema(i);
	},

	'sql-format': async () => {
		const { formatSql } = await sqlformat();
		return (i) => formatSql(i, { dialect: 'sql', keywordCase: 'upper', indent: 2 });
	},
	'sql-minify': async () => {
		const { minifySql } = await sqlformat();
		return (i) => minifySql(i);
	},
	'css-format': async () => {
		const { beautifyCode } = await codeformat();
		return (i) => beautifyCode('css', i);
	},
	'js-format': async () => {
		const { beautifyCode } = await codeformat();
		return (i) => beautifyCode('js', i);
	},
	'html-format': async () => {
		const { beautifyCode } = await codeformat();
		return (i) => beautifyCode('html', i);
	},
	'markdown-to-html': async () => {
		const { markdownToHtml } = await markdown();
		return (i) => markdownToHtml(i);
	},
	'html-to-markdown': async () => {
		const { htmlToMarkdown } = await markdown();
		return (i) => htmlToMarkdown(i);
	}
};

const loaded = new Map<string, PipeRun>(Object.entries(EAGER));
/** Ops whose module failed to load (offline after a deploy, blocked chunk). */
const failed = new Set<string>();

/**
 * The run function for an op: a function once it is available, 'loading'
 * while its module still has to be fetched, 'failed' if fetching it failed,
 * or undefined for an id that isn't an op at all.
 */
export function getRun(id: string): PipeRun | 'loading' | 'failed' | undefined {
	const run = loaded.get(id);
	if (run) return run;
	if (failed.has(id)) return 'failed';
	return id in LAZY ? 'loading' : undefined;
}

/** True when every given op can run right away. */
export function opsReady(ids: Iterable<string>): boolean {
	for (const id of ids) if (getRun(id) === 'loading') return false;
	return true;
}

/**
 * Import the modules the given ops need. Resolves once all of them settled;
 * a failed import marks its op 'failed' instead of rejecting, and a later
 * call retries it.
 */
export async function loadOps(ids: Iterable<string>): Promise<void> {
	const todo = [...new Set(ids)].filter((id) => !loaded.has(id) && id in LAZY);
	await Promise.all(
		todo.map(async (id) => {
			try {
				loaded.set(id, await LAZY[id]());
				failed.delete(id);
			} catch {
				failed.add(id);
			}
		})
	);
}

export const PIPE_OPS: PipeOp[] = PIPE_OP_META;

export const PIPE_OP_BY_ID = new Map(PIPE_OPS.map((o) => [o.id, o]));

export { PIPE_GROUPS, PIPE_GROUP_LABELS } from './op-meta';
