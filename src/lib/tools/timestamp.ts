import { type ToolResult, ok, err } from './types';

export interface TimestampInfo {
	/** Milliseconds since epoch. */
	epochMs: number;
	unit: 'seconds' | 'milliseconds' | 'iso' | 'date-string';
	iso: string;
	utc: string;
	unixSeconds: number;
	unixMilliseconds: number;
	relative: string;
}

export function formatRelative(deltaMs: number): string {
	const abs = Math.abs(deltaMs);
	const future = deltaMs > 0;
	const units: Array<[number, string]> = [
		[365 * 24 * 3600_000, 'year'],
		[30 * 24 * 3600_000, 'month'],
		[24 * 3600_000, 'day'],
		[3600_000, 'hour'],
		[60_000, 'minute'],
		[1000, 'second']
	];
	for (const [ms, name] of units) {
		if (abs >= ms) {
			const n = Math.floor(abs / ms);
			const plural = n === 1 ? name : name + 's';
			return future ? `in ${n} ${plural}` : `${n} ${plural} ago`;
		}
	}
	return 'now';
}

/** Parse a unix timestamp (s or ms), ISO 8601, or generic date string. `now` injectable for tests. */
export function parseTimestamp(input: string, now?: number): ToolResult<TimestampInfo> {
	const s = input.trim();
	if (s === '') return err('Input is empty');
	let epochMs: number;
	let unit: TimestampInfo['unit'];

	if (/^-?\d{1,17}$/.test(s)) {
		const n = Number(s);
		// Heuristic: 11+ digit magnitudes are milliseconds (covers 1973..5138 in seconds).
		if (Math.abs(n) >= 1e11) {
			epochMs = n;
			unit = 'milliseconds';
		} else {
			epochMs = n * 1000;
			unit = 'seconds';
		}
	} else {
		const parsed = Date.parse(s);
		if (Number.isNaN(parsed)) return err('Not a recognizable timestamp or date string');
		epochMs = parsed;
		unit = /^\d{4}-\d{2}-\d{2}[T ]/.test(s) || /^\d{4}-\d{2}-\d{2}$/.test(s) ? 'iso' : 'date-string';
	}

	if (!Number.isFinite(epochMs) || Math.abs(epochMs) > 8.64e15) {
		return err('Timestamp is outside the representable date range');
	}
	const date = new Date(epochMs);
	return ok({
		epochMs,
		unit,
		iso: date.toISOString(),
		utc: date.toUTCString(),
		unixSeconds: Math.floor(epochMs / 1000),
		unixMilliseconds: epochMs,
		relative: formatRelative(epochMs - (now ?? Date.now()))
	});
}

export function isLikelyTimestamp(input: string): boolean {
	const s = input.trim();
	if (!/^\d{9,14}$/.test(s)) return false;
	const info = parseTimestamp(s, 0);
	if (!info.ok) return false;
	// Plausible range: 2001..2286 (seconds) — avoids matching arbitrary numbers too eagerly.
	const year = new Date(info.value.epochMs).getUTCFullYear();
	return year >= 2000 && year <= 2200;
}
