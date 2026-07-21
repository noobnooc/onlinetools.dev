import { validateJson } from '$lib/tools/json';
import { isLikelyJwt } from '$lib/tools/jwt';
import { isLikelyBase64Text } from '$lib/tools/base64';
import { isLikelyTimestamp } from '$lib/tools/timestamp';
import { isUuid } from '$lib/tools/uuid';
import { isLikelyColor } from '$lib/tools/color';
import { isLikelyImageDataUrl } from '$lib/tools/image';
import { isLikelyXml } from '$lib/tools/xml';
import { isLikelyCsv } from '$lib/tools/dataconvert';
import { isLikelyMarkdown } from '$lib/tools/markdown';
import { isLikelyHexDump } from '$lib/tools/hexbin';

export interface Detection {
	/** Detector id, e.g. "jwt". */
	type: string;
	/** Human label shown in the suggestion panel, e.g. "JWT". */
	label: string;
	/** 0..1 — suggestions are ordered by confidence. */
	confidence: number;
	/** Target tool slug. */
	tool: string;
	/** Suggested actions, first is the default on Enter. */
	actions: Array<{ label: string; tool: string }>;
}

export interface Detector {
	id: string;
	detect(input: string): Detection | null;
}

/**
 * Extensible detector registry (Smart Paste v1).
 * Each detector inspects the pasted text and returns a confidence-scored
 * suggestion. Order does not matter — results are sorted by confidence.
 */
export const DETECTORS: Detector[] = [
	{
		id: 'jwt',
		detect(input) {
			if (!isLikelyJwt(input)) return null;
			return {
				type: 'jwt',
				label: 'JWT',
				confidence: 0.98,
				tool: 'jwt-decoder',
				actions: [{ label: 'Decode', tool: 'jwt-decoder' }]
			};
		}
	},
	{
		id: 'json',
		detect(input) {
			const s = input.trim();
			if (s.length < 2) return null;
			const looksStructural = /^[[{]/.test(s);
			if (!looksStructural) return null;
			if (!validateJson(s).ok) return null;
			return {
				type: 'json',
				label: 'JSON',
				confidence: 0.95,
				tool: 'json-formatter',
				actions: [
					{ label: 'Format', tool: 'json-formatter' },
					{ label: 'Diff against another', tool: 'diff-checker' }
				]
			};
		}
	},
	{
		id: 'timestamp',
		detect(input) {
			if (!isLikelyTimestamp(input)) return null;
			return {
				type: 'timestamp',
				label: 'Unix timestamp',
				confidence: 0.9,
				tool: 'timestamp-converter',
				actions: [{ label: 'Convert to date', tool: 'timestamp-converter' }]
			};
		}
	},
	{
		id: 'uuid',
		detect(input) {
			if (!isUuid(input)) return null;
			return {
				type: 'uuid',
				label: 'UUID',
				confidence: 0.92,
				tool: 'uuid-generator',
				actions: [{ label: 'Inspect / generate more', tool: 'uuid-generator' }]
			};
		}
	},
	{
		id: 'color',
		detect(input) {
			if (!isLikelyColor(input)) return null;
			return {
				type: 'color',
				label: 'Color',
				confidence: 0.85,
				tool: 'color-converter',
				actions: [{ label: 'Convert formats', tool: 'color-converter' }]
			};
		}
	},
	{
		id: 'url',
		detect(input) {
			const s = input.trim();
			if (!/^https?:\/\/\S+$/i.test(s)) return null;
			const hasQuery = s.includes('?');
			return {
				type: 'url',
				label: 'URL',
				confidence: hasQuery ? 0.85 : 0.7,
				tool: 'url-parser',
				actions: [
					{ label: 'Parse', tool: 'url-parser' },
					{ label: 'Encode / decode', tool: 'url-encode-decode' }
				]
			};
		}
	},
	{
		id: 'url-encoded',
		detect(input) {
			const s = input.trim();
			if (!/%[0-9a-fA-F]{2}/.test(s) || /\n/.test(s)) return null;
			return {
				type: 'url-encoded',
				label: 'URL-encoded text',
				confidence: 0.75,
				tool: 'url-encode-decode',
				actions: [{ label: 'Decode', tool: 'url-encode-decode' }]
			};
		}
	},
	{
		id: 'image-data-url',
		detect(input) {
			if (!isLikelyImageDataUrl(input)) return null;
			return {
				type: 'image-data-url',
				label: 'Image data URL',
				confidence: 0.97,
				tool: 'image-to-base64',
				actions: [{ label: 'Preview / download', tool: 'image-to-base64' }]
			};
		}
	},
	{
		id: 'xml',
		detect(input) {
			if (!isLikelyXml(input)) return null;
			return {
				type: 'xml',
				label: 'XML',
				confidence: 0.93,
				tool: 'xml-formatter',
				actions: [
					{ label: 'Format', tool: 'xml-formatter' },
					{ label: 'Convert to JSON', tool: 'xml-to-json' }
				]
			};
		}
	},
	{
		id: 'csv',
		detect(input) {
			if (!isLikelyCsv(input)) return null;
			return {
				type: 'csv',
				label: 'CSV',
				confidence: 0.7,
				tool: 'csv-to-json',
				actions: [{ label: 'Convert to JSON', tool: 'csv-to-json' }]
			};
		}
	},
	{
		id: 'markdown',
		detect(input) {
			if (!isLikelyMarkdown(input)) return null;
			return {
				type: 'markdown',
				label: 'Markdown',
				confidence: 0.72,
				tool: 'markdown-to-html',
				actions: [{ label: 'Preview / convert', tool: 'markdown-to-html' }]
			};
		}
	},
	{
		id: 'hexdump',
		detect(input) {
			if (!isLikelyHexDump(input)) return null;
			return {
				type: 'hexdump',
				label: 'Hex bytes',
				confidence: 0.68,
				tool: 'text-to-hex',
				actions: [{ label: 'Decode to text', tool: 'text-to-hex' }]
			};
		}
	},
	{
		id: 'base64',
		detect(input) {
			if (!isLikelyBase64Text(input)) return null;
			return {
				type: 'base64',
				label: 'Base64',
				confidence: 0.65,
				tool: 'base64-decode',
				actions: [{ label: 'Decode', tool: 'base64-decode' }]
			};
		}
	}
];

/** Run all detectors, sorted by confidence descending. */
export function detect(input: string): Detection[] {
	if (input.trim() === '' || input.length > 500_000) return [];
	const out: Detection[] = [];
	for (const d of DETECTORS) {
		try {
			const r = d.detect(input);
			if (r) out.push(r);
		} catch {
			// A broken detector must never break paste handling.
		}
	}
	return out.sort((a, b) => b.confidence - a.confidence);
}
