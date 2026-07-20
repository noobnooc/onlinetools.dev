export type ToolResult<T = string> =
	| { ok: true; value: T }
	| { ok: false; error: string; line?: number; column?: number };

export function ok<T>(value: T): ToolResult<T> {
	return { ok: true, value };
}

export function err<T = string>(error: string, line?: number, column?: number): ToolResult<T> {
	return { ok: false, error, line, column };
}
