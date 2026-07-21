import { type ToolResult, ok, err } from './types';

export interface CronField {
	name: string;
	raw: string;
	/** Expanded set of allowed values. */
	values: number[];
	min: number;
	max: number;
	/** True when the field is a plain "*". */
	any: boolean;
}

export interface ParsedCron {
	fields: [CronField, CronField, CronField, CronField, CronField];
	description: string;
}

const FIELD_DEFS = [
	{ name: 'minute', min: 0, max: 59 },
	{ name: 'hour', min: 0, max: 23 },
	{ name: 'day of month', min: 1, max: 31 },
	{ name: 'month', min: 1, max: 12 },
	{ name: 'day of week', min: 0, max: 6 }
] as const;

const MONTH_NAMES: Record<string, number> = {
	jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
	jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12
};
const DOW_NAMES: Record<string, number> = {
	sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6
};

const MACROS: Record<string, string> = {
	'@yearly': '0 0 1 1 *',
	'@annually': '0 0 1 1 *',
	'@monthly': '0 0 1 * *',
	'@weekly': '0 0 * * 0',
	'@daily': '0 0 * * *',
	'@midnight': '0 0 * * *',
	'@hourly': '0 * * * *'
};

function resolveName(token: string, fieldIndex: number): string {
	const lower = token.toLowerCase();
	if (fieldIndex === 3 && lower in MONTH_NAMES) return String(MONTH_NAMES[lower]);
	if (fieldIndex === 4 && lower in DOW_NAMES) return String(DOW_NAMES[lower]);
	return token;
}

function parseField(raw: string, fieldIndex: number): CronField | string {
	const def = FIELD_DEFS[fieldIndex];
	const values = new Set<number>();
	const any = raw === '*';

	for (const part of raw.split(',')) {
		const stepMatch = part.match(/^(.+)\/(\d+)$/);
		const base = stepMatch ? stepMatch[1] : part;
		const step = stepMatch ? Number(stepMatch[2]) : 1;
		if (step < 1) return `step must be ≥ 1 in "${part}"`;

		let lo: number;
		let hi: number;
		if (base === '*') {
			lo = def.min;
			hi = def.max;
		} else {
			const rangeMatch = base.match(/^([A-Za-z0-9]+)-([A-Za-z0-9]+)$/);
			if (rangeMatch) {
				lo = Number(resolveName(rangeMatch[1], fieldIndex));
				hi = Number(resolveName(rangeMatch[2], fieldIndex));
			} else {
				lo = hi = Number(resolveName(base, fieldIndex));
				if (stepMatch) hi = def.max; // "5/15" means "starting at 5, every 15"
			}
			if (Number.isNaN(lo) || Number.isNaN(hi)) return `"${part}" is not a valid ${def.name} value`;
		}
		// Cron allows 7 as Sunday.
		if (fieldIndex === 4) {
			if (lo === 7) lo = 0;
			if (hi === 7) hi = lo === 0 ? 0 : 6;
		}
		if (lo < def.min || hi > def.max || lo > hi) {
			return `"${part}" is out of range for ${def.name} (${def.min}–${def.max})`;
		}
		for (let v = lo; v <= hi; v += step) values.add(v);
	}
	if (values.size === 0) return `no values selected for ${def.name}`;
	return {
		name: def.name,
		raw,
		values: [...values].sort((a, b) => a - b),
		min: def.min,
		max: def.max,
		any
	};
}

const DOW_LABELS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTH_LABELS = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function listJoin(items: string[]): string {
	if (items.length === 1) return items[0];
	if (items.length === 2) return `${items[0]} and ${items[1]}`;
	return items.slice(0, -1).join(', ') + ' and ' + items[items.length - 1];
}

function describe(fields: ParsedCron['fields']): string {
	const [min, hour, dom, month, dow] = fields;
	const pad = (n: number) => String(n).padStart(2, '0');

	let time: string;
	if (!min.any && !hour.any && min.values.length === 1 && hour.values.length === 1) {
		time = `at ${pad(hour.values[0])}:${pad(min.values[0])}`;
	} else if (min.any && hour.any) {
		time = 'every minute';
	} else if (!min.any && hour.any && min.values.length === 1) {
		time = min.values[0] === 0 ? 'every hour, on the hour' : `at minute ${min.values[0]} of every hour`;
	} else if (min.raw.startsWith('*/')) {
		time = `every ${min.raw.slice(2)} minutes` + (hour.any ? '' : ` during hour ${hour.raw}`);
	} else {
		time = `at minute ${min.raw} past hour ${hour.raw}`;
	}

	const parts: string[] = [time];
	if (!dom.any && !dow.any) {
		parts.push(`on day ${dom.raw} of the month or on ${listJoin(dow.values.map((v) => DOW_LABELS[v]))}`);
	} else if (!dom.any) {
		parts.push(`on day ${dom.raw} of the month`);
	} else if (!dow.any) {
		parts.push(`on ${listJoin(dow.values.map((v) => DOW_LABELS[v]))}`);
	}
	if (!month.any) {
		parts.push(`in ${listJoin(month.values.map((v) => MONTH_LABELS[v]))}`);
	}
	const s = parts.join(', ');
	return s.charAt(0).toUpperCase() + s.slice(1);
}

export function parseCron(expression: string): ToolResult<ParsedCron> {
	let expr = expression.trim().toLowerCase();
	if (expr === '') return err('Expression is empty');
	if (expr in MACROS) expr = MACROS[expr];
	else if (expr.startsWith('@')) return err(`Unknown macro "${expr}"`);

	const rawFields = expr.split(/\s+/);
	if (rawFields.length === 6) {
		return err('6 fields found — this looks like a seconds-based (Quartz) expression; this tool parses standard 5-field cron');
	}
	if (rawFields.length !== 5) {
		return err(`A cron expression has 5 fields (minute hour day-of-month month day-of-week); found ${rawFields.length}`);
	}
	const fields: CronField[] = [];
	for (let i = 0; i < 5; i++) {
		const f = parseField(rawFields[i], i);
		if (typeof f === 'string') return err(f);
		fields.push(f);
	}
	const tuple = fields as ParsedCron['fields'];
	return ok({ fields: tuple, description: describe(tuple) });
}

/**
 * Next N run times after `from` (ms epoch), evaluated in local time.
 * Standard cron semantics: when both day-of-month and day-of-week are
 * restricted, a date matches if EITHER matches.
 */
export function nextRuns(cron: ParsedCron, from: number, count = 5): number[] {
	const [minF, hourF, domF, monthF, dowF] = cron.fields;
	const minutes = new Set(minF.values);
	const hours = new Set(hourF.values);
	const doms = new Set(domF.values);
	const months = new Set(monthF.values);
	const dows = new Set(dowF.values);

	const out: number[] = [];
	const d = new Date(from);
	d.setSeconds(0, 0);
	d.setMinutes(d.getMinutes() + 1);

	// Bounded scan: 5 years of minutes max, advancing by day when possible.
	const limit = new Date(from);
	limit.setFullYear(limit.getFullYear() + 5);

	while (out.length < count && d < limit) {
		if (!months.has(d.getMonth() + 1)) {
			d.setMonth(d.getMonth() + 1, 1);
			d.setHours(0, 0, 0, 0);
			continue;
		}
		const dayOk =
			domF.any && dowF.any
				? true
				: !domF.any && !dowF.any
					? doms.has(d.getDate()) || dows.has(d.getDay())
					: !domF.any
						? doms.has(d.getDate())
						: dows.has(d.getDay());
		if (!dayOk) {
			d.setDate(d.getDate() + 1);
			d.setHours(0, 0, 0, 0);
			continue;
		}
		if (!hours.has(d.getHours())) {
			d.setHours(d.getHours() + 1, 0, 0, 0);
			continue;
		}
		if (!minutes.has(d.getMinutes())) {
			d.setMinutes(d.getMinutes() + 1, 0, 0);
			continue;
		}
		out.push(d.getTime());
		d.setMinutes(d.getMinutes() + 1);
	}
	return out;
}
