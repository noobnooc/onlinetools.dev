/**
 * Shared data-format taxonomy for content-aware tool recommendations.
 *
 * Detectors classify content into a DataFormat; tools declare which formats
 * they accept (ToolMeta.accepts). Each format also has a fallback chain to
 * progressively more generic formats, so JSON content still matches tools
 * that merely accept plain text — just with a much lower affinity. This one
 * priority chain drives both "Continue with" and Smart Paste ranking.
 */

export type DataFormat =
	| 'json'
	| 'yaml'
	| 'toml'
	| 'csv'
	| 'xml'
	| 'html'
	| 'markdown'
	| 'css'
	| 'js'
	| 'sql'
	| 'jwt'
	| 'base64'
	| 'hex'
	| 'number'
	| 'url'
	| 'url-encoded'
	| 'color'
	| 'timestamp'
	| 'uuid'
	| 'cron'
	| 'useragent'
	| 'image-data-url'
	| 'image'
	| 'text';

/**
 * Fallback chain per format, nearest first. `image` deliberately has no text
 * fallback — binary content must never be routed into text tools.
 */
export const FORMAT_FALLBACKS: Record<DataFormat, DataFormat[]> = {
	json: ['text'],
	yaml: ['text'],
	toml: ['text'],
	csv: ['text'],
	xml: ['text'],
	html: ['xml', 'text'],
	markdown: ['text'],
	css: ['text'],
	js: ['text'],
	sql: ['text'],
	jwt: ['base64', 'text'],
	base64: ['text'],
	hex: ['text'],
	number: ['text'],
	url: ['text'],
	'url-encoded': ['text'],
	color: ['text'],
	timestamp: ['number', 'text'],
	uuid: ['text'],
	cron: ['text'],
	useragent: ['text'],
	'image-data-url': ['base64', 'text'],
	image: [],
	text: []
};

/** Each fallback step keeps this fraction of the previous step's affinity. */
const FALLBACK_DECAY = 0.35;

/**
 * How well a tool that accepts `accepts` (best-first) fits content of the
 * detected format. 1 for a primary exact match, decaying slightly for later
 * accept positions and sharply for each fallback-chain step. 0 = no fit.
 */
export function formatAffinity(detected: DataFormat, accepts: readonly DataFormat[]): number {
	const chain = [detected, ...FORMAT_FALLBACKS[detected]];
	let best = 0;
	for (let depth = 0; depth < chain.length; depth++) {
		const at = accepts.indexOf(chain[depth]);
		if (at === -1) continue;
		best = Math.max(best, Math.pow(FALLBACK_DECAY, depth) * (1 - 0.05 * at));
	}
	return best;
}

/**
 * File-extension → format hints for pasted/dropped files. The extension is a
 * strong signal on its own, merged with content detection of the file text.
 */
export const EXTENSION_FORMATS: Record<string, { format: DataFormat; label: string }> = {
	json: { format: 'json', label: 'JSON' },
	yaml: { format: 'yaml', label: 'YAML' },
	yml: { format: 'yaml', label: 'YAML' },
	toml: { format: 'toml', label: 'TOML' },
	csv: { format: 'csv', label: 'CSV' },
	tsv: { format: 'csv', label: 'TSV' },
	xml: { format: 'xml', label: 'XML' },
	html: { format: 'html', label: 'HTML' },
	htm: { format: 'html', label: 'HTML' },
	md: { format: 'markdown', label: 'Markdown' },
	markdown: { format: 'markdown', label: 'Markdown' },
	css: { format: 'css', label: 'CSS' },
	js: { format: 'js', label: 'JavaScript' },
	mjs: { format: 'js', label: 'JavaScript' },
	cjs: { format: 'js', label: 'JavaScript' },
	sql: { format: 'sql', label: 'SQL' },
	txt: { format: 'text', label: 'Text' },
	log: { format: 'text', label: 'Text' }
};
