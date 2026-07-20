import { type ToolResult, ok, err } from './types';

/** Convert a character offset into 1-based line/column. */
export function offsetToLineCol(text: string, offset: number): { line: number; column: number } {
	let line = 1;
	let column = 1;
	for (let i = 0; i < offset && i < text.length; i++) {
		if (text[i] === '\n') {
			line++;
			column = 1;
		} else {
			column++;
		}
	}
	return { line, column };
}

function parseErrorPosition(message: string, input: string): { line: number; column: number } | undefined {
	// V8: "... at position 42 (line 3 column 5)" or "... at position 42"
	const lineCol = message.match(/line (\d+) column (\d+)/);
	if (lineCol) return { line: Number(lineCol[1]), column: Number(lineCol[2]) };
	const pos = message.match(/position (\d+)/);
	if (pos) return offsetToLineCol(input, Number(pos[1]));
	return undefined;
}

export interface JsonFormatOptions {
	indent: 2 | 4 | 'tab' | 'min';
	sortKeys?: boolean;
}

function sortValue(value: unknown): unknown {
	if (Array.isArray(value)) return value.map(sortValue);
	if (value !== null && typeof value === 'object') {
		const out: Record<string, unknown> = {};
		for (const key of Object.keys(value as Record<string, unknown>).sort()) {
			out[key] = sortValue((value as Record<string, unknown>)[key]);
		}
		return out;
	}
	return value;
}

export function formatJson(input: string, options: JsonFormatOptions = { indent: 2 }): ToolResult {
	if (input.trim() === '') return err('Input is empty');
	let parsed: unknown;
	try {
		parsed = JSON.parse(input);
	} catch (e) {
		const message = e instanceof Error ? e.message : String(e);
		const pos = parseErrorPosition(message, input);
		return err(message, pos?.line, pos?.column);
	}
	if (options.sortKeys) parsed = sortValue(parsed);
	const indent = options.indent === 'min' ? undefined : options.indent === 'tab' ? '\t' : options.indent;
	return ok(JSON.stringify(parsed, null, indent));
}

export function validateJson(input: string): ToolResult<true> {
	try {
		JSON.parse(input);
		return ok(true as const);
	} catch (e) {
		const message = e instanceof Error ? e.message : String(e);
		const pos = parseErrorPosition(message, input);
		return err(message, pos?.line, pos?.column);
	}
}
