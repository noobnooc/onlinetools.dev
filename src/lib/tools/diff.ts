export interface DiffLine {
	type: 'same' | 'add' | 'del';
	text: string;
	/** 1-based line numbers in the left/right inputs (undefined when absent). */
	left?: number;
	right?: number;
}

export interface DiffStats {
	added: number;
	removed: number;
	unchanged: number;
}

/** Line-based diff via LCS (Myers-style DP; fine for typical paste sizes). */
export function diffLines(a: string, b: string): { lines: DiffLine[]; stats: DiffStats } {
	const al = a.split('\n');
	const bl = b.split('\n');
	const n = al.length;
	const m = bl.length;

	// LCS length table (n+1 x m+1), rolling not used so we can backtrack.
	const table: Uint32Array = new Uint32Array((n + 1) * (m + 1));
	const idx = (i: number, j: number) => i * (m + 1) + j;
	for (let i = n - 1; i >= 0; i--) {
		for (let j = m - 1; j >= 0; j--) {
			table[idx(i, j)] =
				al[i] === bl[j]
					? table[idx(i + 1, j + 1)] + 1
					: Math.max(table[idx(i + 1, j)], table[idx(i, j + 1)]);
		}
	}

	const lines: DiffLine[] = [];
	const stats: DiffStats = { added: 0, removed: 0, unchanged: 0 };
	let i = 0;
	let j = 0;
	while (i < n && j < m) {
		if (al[i] === bl[j]) {
			lines.push({ type: 'same', text: al[i], left: i + 1, right: j + 1 });
			stats.unchanged++;
			i++;
			j++;
		} else if (table[idx(i + 1, j)] >= table[idx(i, j + 1)]) {
			lines.push({ type: 'del', text: al[i], left: i + 1 });
			stats.removed++;
			i++;
		} else {
			lines.push({ type: 'add', text: bl[j], right: j + 1 });
			stats.added++;
			j++;
		}
	}
	for (; i < n; i++) {
		lines.push({ type: 'del', text: al[i], left: i + 1 });
		stats.removed++;
	}
	for (; j < m; j++) {
		lines.push({ type: 'add', text: bl[j], right: j + 1 });
		stats.added++;
	}
	return { lines, stats };
}
