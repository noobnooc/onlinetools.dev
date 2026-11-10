import { type ToolResult, ok, err } from './types';
import { marked } from 'marked';
import TurndownService from 'turndown';

export { isLikelyMarkdown } from '$lib/detect/sniff';

export interface MdStats {
	words: number;
	headings: number;
	links: number;
	codeBlocks: number;
}

/** GitHub-flavored-ish Markdown → HTML. Output is NOT sanitized — sanitize before rendering. */
export function markdownToHtml(input: string): ToolResult {
	if (input.trim() === '') return err('Input is empty');
	try {
		const html = marked.parse(input, { async: false, gfm: true, breaks: false }) as string;
		return ok(html.trimEnd());
	} catch (e) {
		return err(e instanceof Error ? e.message.split('\n')[0] : 'Could not render this Markdown');
	}
}

let turndown: TurndownService | null = null;

export function htmlToMarkdown(input: string): ToolResult {
	if (input.trim() === '') return err('Input is empty');
	try {
		if (!turndown) {
			turndown = new TurndownService({
				headingStyle: 'atx',
				codeBlockStyle: 'fenced',
				bulletListMarker: '-',
				emDelimiter: '*'
			});
			// GFM-style strikethrough.
			turndown.addRule('strikethrough', {
				filter: ['del', 's'],
				replacement: (content) => `~~${content}~~`
			});
		}
		const md = turndown.turndown(input);
		// Turndown pads list markers to column width ("-   item"); normalize
		// to a single space, leaving fenced code blocks untouched.
		const normalized = md
			.split(/(```[\s\S]*?```)/)
			.map((part, i) => (i % 2 === 1 ? part : part.replace(/^(\s*)([-*+]|\d+\.)\s+/gm, '$1$2 ')))
			.join('');
		return ok(normalized);
	} catch (e) {
		return err(e instanceof Error ? e.message.split('\n')[0] : 'Could not convert this HTML');
	}
}

export function markdownStats(input: string): MdStats {
	const withoutCode = input.replace(/```[\s\S]*?```/g, ' ');
	return {
		words: (withoutCode.match(/\S+/g) ?? []).length,
		headings: (input.match(/^#{1,6}\s/gm) ?? []).length,
		links: (input.match(/\[[^\]]*\]\([^)]*\)/g) ?? []).length,
		codeBlocks: (input.match(/```/g) ?? []).length >> 1
	};
}
