// CSV primitives with no dependencies. Smart Paste imports isLikelyCsv on
// every page, so keep this module free of heavy imports.

/**
 * Parse one or more RFC 4180 CSV records (quoted fields, escaped quotes,
 * embedded delimiters/newlines). Used to verify round-trips in tests.
 */
export function parseCsv(text: string, delimiter = ','): string[][] {
	const rows: string[][] = [];
	let row: string[] = [];
	let field = '';
	let inQuotes = false;
	for (let i = 0; i < text.length; i++) {
		const ch = text[i];
		if (inQuotes) {
			if (ch === '"') {
				if (text[i + 1] === '"') {
					field += '"';
					i++;
				} else {
					inQuotes = false;
				}
			} else {
				field += ch;
			}
		} else if (ch === '"') {
			inQuotes = true;
		} else if (ch === delimiter) {
			row.push(field);
			field = '';
		} else if (ch === '\n' || ch === '\r') {
			if (ch === '\r' && text[i + 1] === '\n') i++;
			row.push(field);
			field = '';
			rows.push(row);
			row = [];
		} else {
			field += ch;
		}
	}
	row.push(field);
	rows.push(row);
	return rows;
}

export function detectDelimiter(text: string): ',' | ';' | '\t' | '|' {
	const firstLines = text.split(/\r?\n/, 5).filter((l) => l.trim() !== '');
	const candidates = [',', ';', '\t', '|'] as const;
	let best: (typeof candidates)[number] = ',';
	let bestScore = -1;
	for (const d of candidates) {
		const counts = firstLines.map((l) => parseCsv(l, d)[0].length);
		if (counts.length === 0) continue;
		const consistent = counts.every((c) => c === counts[0]);
		const score = (consistent ? 1000 : 0) + counts[0];
		if (counts[0] > 1 && score > bestScore) {
			bestScore = score;
			best = d;
		}
	}
	return best;
}

export function isLikelyCsv(input: string): boolean {
	const s = input.trim();
	const lines = s.split(/\r?\n/);
	if (lines.length < 2) return false;
	if (/^[[{<]/.test(s)) return false;
	const d = detectDelimiter(s);
	const rows = lines.slice(0, 6).map((l) => parseCsv(l, d)[0].length);
	return rows[0] >= 2 && rows.every((r) => r === rows[0]);
}
