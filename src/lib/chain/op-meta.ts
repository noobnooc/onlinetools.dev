/**
 * Pipeline operation metadata — ids, labels, groups and argument specs — with
 * NO imports of the underlying tool libraries. This is the SSR-safe half of the
 * op registry: preset pages, the sitemap and any prerendered surface can read
 * op labels here without pulling in browser-only dependencies. `ops.ts` imports
 * this and attaches the actual run functions.
 */

export type PipeGroup = 'encoding' | 'json' | 'text' | 'code';

export interface PipeArg {
	/** Short technical label, e.g. "path". */
	label: string;
	placeholder: string;
	default?: string;
}

export interface PipeOpMeta {
	id: string;
	label: string;
	group: PipeGroup;
	/** Optional single free-text argument (e.g. a JSONPath). */
	arg?: PipeArg;
}

export const PIPE_OP_META: PipeOpMeta[] = [
	// Encoding
	{ id: 'base64-decode', label: 'Base64 decode', group: 'encoding' },
	{ id: 'base64-encode', label: 'Base64 encode', group: 'encoding' },
	{ id: 'url-decode', label: 'URL decode', group: 'encoding' },
	{ id: 'url-encode', label: 'URL encode', group: 'encoding' },
	{ id: 'hex-decode', label: 'Hex → text', group: 'encoding' },
	{ id: 'hex-encode', label: 'Text → hex', group: 'encoding' },
	{ id: 'html-entities-decode', label: 'HTML entities decode', group: 'encoding' },
	{ id: 'html-entities-encode', label: 'HTML entities encode', group: 'encoding' },

	// JSON & data
	{ id: 'jwt-payload', label: 'JWT → payload', group: 'json' },
	{ id: 'json-pretty', label: 'JSON prettify', group: 'json' },
	{ id: 'json-minify', label: 'JSON minify', group: 'json' },
	{ id: 'json-sort-keys', label: 'JSON sort keys', group: 'json' },
	{
		id: 'jsonpath',
		label: 'JSONPath filter',
		group: 'json',
		arg: { label: 'path', placeholder: '$.user.name', default: '$' }
	},
	{ id: 'json-to-yaml', label: 'JSON → YAML', group: 'json' },
	{ id: 'yaml-to-json', label: 'YAML → JSON', group: 'json' },
	{ id: 'json-to-csv', label: 'JSON → CSV', group: 'json' },
	{ id: 'json-to-ts', label: 'JSON → TypeScript', group: 'json' },
	{ id: 'json-schema', label: 'Infer JSON Schema', group: 'json' },

	// Text
	{ id: 'uppercase', label: 'UPPERCASE', group: 'text' },
	{ id: 'lowercase', label: 'lowercase', group: 'text' },
	{ id: 'trim', label: 'Trim whitespace', group: 'text' },
	{ id: 'slugify', label: 'Slugify', group: 'text' },
	{ id: 'sort-lines', label: 'Sort lines', group: 'text' },
	{ id: 'dedupe-lines', label: 'Dedupe lines', group: 'text' },

	// Code
	{ id: 'sql-format', label: 'SQL format', group: 'code' },
	{ id: 'sql-minify', label: 'SQL minify', group: 'code' },
	{ id: 'css-format', label: 'CSS format', group: 'code' },
	{ id: 'js-format', label: 'JS format', group: 'code' },
	{ id: 'html-format', label: 'HTML format', group: 'code' },
	{ id: 'markdown-to-html', label: 'Markdown → HTML', group: 'code' },
	{ id: 'html-to-markdown', label: 'HTML → Markdown', group: 'code' }
];

export const PIPE_OP_META_BY_ID = new Map(PIPE_OP_META.map((o) => [o.id, o]));

export const PIPE_GROUPS: PipeGroup[] = ['encoding', 'json', 'text', 'code'];

/** English group labels; the page localizes the surrounding chrome, not these. */
export const PIPE_GROUP_LABELS: Record<PipeGroup, string> = {
	encoding: 'Encoding',
	json: 'JSON & Data',
	text: 'Text',
	code: 'Code & Markup'
};

/** Human label for an op id, falling back to the id itself. */
export function opLabel(id: string): string {
	return PIPE_OP_META_BY_ID.get(id)?.label ?? id;
}
