import { type ToolResult, ok, err } from './types';
import { format, type SqlLanguage } from 'sql-formatter';

export type SqlDialect = 'sql' | 'postgresql' | 'mysql' | 'sqlite' | 'tsql' | 'bigquery';

export const SQL_DIALECTS: { value: SqlDialect; label: string }[] = [
	{ value: 'sql', label: 'Standard' },
	{ value: 'postgresql', label: 'PostgreSQL' },
	{ value: 'mysql', label: 'MySQL' },
	{ value: 'sqlite', label: 'SQLite' },
	{ value: 'tsql', label: 'SQL Server' },
	{ value: 'bigquery', label: 'BigQuery' }
];

export interface SqlFormatOptions {
	dialect: SqlDialect;
	keywordCase: 'upper' | 'lower' | 'preserve';
	indent: number;
}

export function formatSql(input: string, opts: SqlFormatOptions): ToolResult {
	if (input.trim() === '') return err('Input is empty');
	try {
		const out = format(input, {
			language: opts.dialect as SqlLanguage,
			keywordCase: opts.keywordCase,
			tabWidth: opts.indent,
			linesBetweenQueries: 1
		});
		return ok(out.trimEnd());
	} catch (e) {
		const msg = e instanceof Error ? e.message.split('\n')[0] : 'Could not format this SQL';
		return err(msg);
	}
}

/**
 * Whitespace-collapse minifier. String literals, quoted identifiers and
 * comments are respected; comments are dropped.
 */
export function minifySql(input: string): ToolResult {
	if (input.trim() === '') return err('Input is empty');
	let out = '';
	let i = 0;
	const n = input.length;
	let pendingSpace = false;
	const emit = (s: string) => {
		if (pendingSpace && out !== '' && !/[(,]$/.test(out) && !/^[),;]/.test(s)) out += ' ';
		pendingSpace = false;
		out += s;
	};
	while (i < n) {
		const ch = input[i];
		if (/\s/.test(ch)) {
			pendingSpace = true;
			i++;
			continue;
		}
		if (ch === '-' && input[i + 1] === '-') {
			while (i < n && input[i] !== '\n') i++;
			pendingSpace = true;
			continue;
		}
		if (ch === '/' && input[i + 1] === '*') {
			const end = input.indexOf('*/', i + 2);
			i = end === -1 ? n : end + 2;
			pendingSpace = true;
			continue;
		}
		if (ch === "'" || ch === '"' || ch === '`') {
			const quote = ch;
			let j = i + 1;
			let lit = quote;
			while (j < n) {
				lit += input[j];
				if (input[j] === quote) {
					if (input[j + 1] === quote) {
						lit += quote;
						j += 2;
						continue;
					}
					j++;
					break;
				}
				j++;
			}
			emit(lit);
			i = j;
			continue;
		}
		// A run of regular characters up to the next boundary.
		let j = i;
		while (j < n && !/[\s'"`]/.test(input[j]) && !(input[j] === '-' && input[j + 1] === '-') && !(input[j] === '/' && input[j + 1] === '*')) j++;
		emit(input.slice(i, j));
		i = j;
	}
	return ok(out.trim());
}
