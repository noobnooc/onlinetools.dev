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
import type { DataFormat } from './formats';

export interface Detection {
	/** Detector id, e.g. "jwt". */
	type: string;
	/** Data format this content was classified as — drives tool ranking. */
	format: DataFormat;
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

function isLikelyHtml(s: string): number {
	if (/^<!doctype\s+html/i.test(s) || /^<html[\s>]/i.test(s)) return 0.96;
	if (!s.startsWith('<')) return 0;
	// Fragments with unmistakably-HTML tags outrank the XML detector (0.93):
	// such content is valid XML too, but HTML is the better classification.
	if (/<(div|span|p|a|ul|ol|li|body|head|section|article|nav|main|h[1-6])[\s>]/i.test(s))
		return 0.94;
	return 0;
}

function isLikelyYaml(s: string): boolean {
	if (/^[[{<"]/.test(s)) return false;
	const lines = s.split(/\r?\n/);
	if (lines.length < 2) return false;
	const keyLines = lines.filter((l) => /^\s*(- )?[\w.-]+:(\s+\S|\s*$)/.test(l)).length;
	const listLines = lines.filter((l) => /^\s*- \S/.test(l)).length;
	return keyLines >= 2 || (keyLines >= 1 && listLines >= 1) || /^---\s*$/m.test(s);
}

function isLikelyCron(s: string): boolean {
	if (/\n/.test(s)) return false;
	const fields = s.split(/\s+/);
	if (fields.length !== 5) return false;
	if (!fields.every((f) => /^[\dA-Za-z*,/-]+$/.test(f))) return false;
	// "1 2 3 4 5" alone is too ambiguous — require at least one cron-ish token.
	return /[*/,-]/.test(s);
}

function isLikelySql(s: string): boolean {
	return s.length > 12 && /^(select|with|insert|update|delete|create|alter|drop)\b/i.test(s);
}

/**
 * Extensible detector registry (Smart Paste v2).
 * Each detector inspects the pasted text and returns a confidence-scored
 * classification. Order does not matter — results are sorted by confidence.
 */
export const DETECTORS: Detector[] = [
	{
		id: 'jwt',
		detect(input) {
			if (!isLikelyJwt(input)) return null;
			return {
				type: 'jwt',
				format: 'jwt',
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
				format: 'json',
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
				format: 'timestamp',
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
				format: 'uuid',
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
				format: 'color',
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
				format: 'url',
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
				format: 'url-encoded',
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
				format: 'image-data-url',
				label: 'Image data URL',
				confidence: 0.97,
				tool: 'image-to-base64',
				actions: [{ label: 'Preview / download', tool: 'image-to-base64' }]
			};
		}
	},
	{
		id: 'html',
		detect(input) {
			const confidence = isLikelyHtml(input.trim());
			if (confidence === 0) return null;
			return {
				type: 'html',
				format: 'html',
				label: 'HTML',
				confidence,
				tool: 'html-formatter',
				actions: [
					{ label: 'Format', tool: 'html-formatter' },
					{ label: 'Convert to Markdown', tool: 'markdown-to-html' }
				]
			};
		}
	},
	{
		id: 'xml',
		detect(input) {
			if (!isLikelyXml(input)) return null;
			return {
				type: 'xml',
				format: 'xml',
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
				format: 'csv',
				label: 'CSV',
				confidence: 0.7,
				tool: 'json-to-csv',
				actions: [{ label: 'Convert to JSON', tool: 'json-to-csv' }]
			};
		}
	},
	{
		id: 'markdown',
		detect(input) {
			if (!isLikelyMarkdown(input)) return null;
			return {
				type: 'markdown',
				format: 'markdown',
				label: 'Markdown',
				confidence: 0.72,
				tool: 'markdown-to-html',
				actions: [{ label: 'Preview / convert', tool: 'markdown-to-html' }]
			};
		}
	},
	{
		id: 'yaml',
		detect(input) {
			const s = input.trim();
			if (!isLikelyYaml(s) || isLikelyCsv(s) || isLikelyMarkdown(s)) return null;
			return {
				type: 'yaml',
				format: 'yaml',
				label: 'YAML',
				confidence: 0.6,
				tool: 'json-to-yaml',
				actions: [{ label: 'Convert to JSON', tool: 'json-to-yaml' }]
			};
		}
	},
	{
		id: 'sql',
		detect(input) {
			if (!isLikelySql(input.trim())) return null;
			return {
				type: 'sql',
				format: 'sql',
				label: 'SQL',
				confidence: 0.85,
				tool: 'sql-formatter',
				actions: [{ label: 'Format', tool: 'sql-formatter' }]
			};
		}
	},
	{
		id: 'cron',
		detect(input) {
			if (!isLikelyCron(input.trim())) return null;
			return {
				type: 'cron',
				format: 'cron',
				label: 'Cron expression',
				confidence: 0.88,
				tool: 'cron-parser',
				actions: [{ label: 'Explain schedule', tool: 'cron-parser' }]
			};
		}
	},
	{
		id: 'useragent',
		detect(input) {
			if (!/^Mozilla\/\d/.test(input.trim())) return null;
			return {
				type: 'useragent',
				format: 'useragent',
				label: 'User-Agent',
				confidence: 0.92,
				tool: 'user-agent-parser',
				actions: [{ label: 'Parse', tool: 'user-agent-parser' }]
			};
		}
	},
	{
		id: 'hexdump',
		detect(input) {
			if (!isLikelyHexDump(input)) return null;
			return {
				type: 'hexdump',
				format: 'hex',
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
				format: 'base64',
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

/** A detection built from an out-of-band signal (file extension, MIME type). */
export function syntheticDetection(
	format: DataFormat,
	label: string,
	confidence: number
): Detection {
	return { type: format, format, label, confidence, tool: '', actions: [] };
}
