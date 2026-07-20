import { type ToolResult, ok, err } from './types';

export interface RegexMatch {
	index: number;
	end: number;
	text: string;
	groups: Array<{ name: string | null; value: string | undefined }>;
}

export interface RegexTestResult {
	matches: RegexMatch[];
	count: number;
}

const VALID_FLAGS = /^[dgimsuvy]*$/;

export function testRegex(pattern: string, flags: string, input: string): ToolResult<RegexTestResult> {
	if (pattern === '') return err('Pattern is empty');
	if (!VALID_FLAGS.test(flags) || new Set(flags).size !== flags.length) {
		return err(`Invalid flags: "${flags}"`);
	}
	let re: RegExp;
	try {
		re = new RegExp(pattern, flags.includes('g') ? flags : flags + 'g');
	} catch (e) {
		return err(e instanceof Error ? e.message.replace(/^Invalid regular expression: /, '') : 'Invalid regular expression');
	}

	const matches: RegexMatch[] = [];
	let match: RegExpExecArray | null;
	let guard = 0;
	while ((match = re.exec(input)) !== null) {
		if (++guard > 10000) break;
		const groups: RegexMatch['groups'] = [];
		for (let g = 1; g < match.length; g++) {
			groups.push({ name: null, value: match[g] });
		}
		if (match.groups) {
			for (const [name, value] of Object.entries(match.groups)) {
				groups.push({ name, value });
			}
		}
		matches.push({ index: match.index, end: match.index + match[0].length, text: match[0], groups });
		if (match[0] === '') re.lastIndex++; // avoid infinite loop on empty matches
	}
	return ok({ matches, count: matches.length });
}

export function replaceRegex(
	pattern: string,
	flags: string,
	input: string,
	replacement: string
): ToolResult {
	if (pattern === '') return err('Pattern is empty');
	try {
		const re = new RegExp(pattern, flags.includes('g') ? flags : flags + 'g');
		return ok(input.replace(re, replacement));
	} catch (e) {
		return err(e instanceof Error ? e.message : 'Invalid regular expression');
	}
}
