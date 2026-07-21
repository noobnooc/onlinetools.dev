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

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** RFC 2822 date string in UTC, e.g. "Mon, 20 Jul 2026 12:00:00 +0000". */
export function toRfc2822(epochMs: number): string {
	const d = new Date(epochMs);
	const pad = (n: number) => String(n).padStart(2, '0');
	return `${DAYS[d.getUTCDay()]}, ${pad(d.getUTCDate())} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())} +0000`;
}

export interface ZoneView {
	zone: string;
	label: string;
	formatted: string;
	/** UTC offset like "UTC+8" at that instant. */
	offset: string;
}

export const DEFAULT_ZONES: Array<{ zone: string; label: string }> = [
	{ zone: 'America/Los_Angeles', label: 'Los Angeles' },
	{ zone: 'America/New_York', label: 'New York' },
	{ zone: 'Europe/London', label: 'London' },
	{ zone: 'Europe/Berlin', label: 'Berlin' },
	{ zone: 'Asia/Shanghai', label: 'Shanghai' },
	{ zone: 'Asia/Tokyo', label: 'Tokyo' },
	{ zone: 'Australia/Sydney', label: 'Sydney' }
];

/** The same instant rendered in several IANA timezones. */
export function zoneViews(epochMs: number, zones = DEFAULT_ZONES): ZoneView[] {
	const out: ZoneView[] = [];
	for (const { zone, label } of zones) {
		try {
			const fmt = new Intl.DateTimeFormat('en-CA', {
				timeZone: zone,
				year: 'numeric', month: '2-digit', day: '2-digit',
				hour: '2-digit', minute: '2-digit', second: '2-digit',
				hour12: false, timeZoneName: 'shortOffset'
			});
			const parts = fmt.formatToParts(epochMs);
			const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
			const offsetRaw = get('timeZoneName'); // "GMT+8", "GMT-04:00", "GMT"
			const offset = offsetRaw.replace(/^GMT/, 'UTC') || 'UTC';
			out.push({
				zone,
				label,
				formatted: `${get('year')}-${get('month')}-${get('day')} ${get('hour')}:${get('minute')}:${get('second')}`,
				offset: offset === 'UTC' ? 'UTC+0' : offset
			});
		} catch {
			// Unknown zone in this runtime — skip it.
		}
	}
	return out;
}

export interface DateDiff {
	ms: number;
	/** Total elapsed units (not calendar decomposition). */
	totalSeconds: number;
	totalMinutes: number;
	totalHours: number;
	totalDays: number;
	/** d/h/m/s breakdown of the absolute difference. */
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
	negative: boolean;
}

/** Difference b − a. */
export function dateDiff(aMs: number, bMs: number): DateDiff {
	const ms = bMs - aMs;
	const abs = Math.abs(ms);
	const totalSeconds = abs / 1000;
	return {
		ms,
		totalSeconds: Math.floor(totalSeconds),
		totalMinutes: Math.floor(totalSeconds / 60),
		totalHours: Math.floor(totalSeconds / 3600),
		totalDays: Math.floor(totalSeconds / 86400),
		days: Math.floor(abs / 86400_000),
		hours: Math.floor((abs % 86400_000) / 3600_000),
		minutes: Math.floor((abs % 3600_000) / 60_000),
		seconds: Math.floor((abs % 60_000) / 1000),
		negative: ms < 0
	};
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
