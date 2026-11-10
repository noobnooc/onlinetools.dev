import { type ToolResult, ok, err } from './types';

export function encodeUrl(input: string, component = true): ToolResult {
	try {
		return ok(component ? encodeURIComponent(input) : encodeURI(input));
	} catch (e) {
		return err(e instanceof Error ? e.message : 'Encoding failed');
	}
}

export function decodeUrl(input: string): ToolResult {
	try {
		return ok(decodeURIComponent(input.replace(/\+/g, '%20')));
	} catch {
		return err('Not a valid URL-encoded string (malformed % sequence)');
	}
}

export interface ParsedUrl {
	href: string;
	protocol: string;
	host: string;
	hostname: string;
	port: string;
	pathname: string;
	hash: string;
	origin: string;
	params: Array<{ key: string; value: string }>;
}

export function parseUrl(input: string): ToolResult<ParsedUrl> {
	const trimmed = input.trim();
	if (trimmed === '') return err('Input is empty');
	let url: URL;
	try {
		url = new URL(trimmed);
	} catch {
		// Retry with an assumed https scheme for bare domains.
		try {
			url = new URL('https://' + trimmed);
		} catch {
			return err('Not a valid URL');
		}
	}
	const params: Array<{ key: string; value: string }> = [];
	url.searchParams.forEach((value, key) => params.push({ key, value }));
	return ok({
		href: url.href,
		protocol: url.protocol,
		host: url.host,
		hostname: url.hostname,
		port: url.port,
		pathname: url.pathname,
		hash: url.hash,
		origin: url.origin,
		params
	});
}

type QueryValue = string | QueryValue[] | { [key: string]: QueryValue };

/** Split `user[address][city]` into ['user', 'address', 'city']; `tags[]` ends in ''. */
function querySegments(key: string): string[] {
	const m = /^([^[\]]+)((?:\[[^[\]]*\])+)$/.exec(key);
	if (!m) return [key];
	return [m[1], ...[...m[2].matchAll(/\[([^[\]]*)\]/g)].map((x) => x[1])];
}

const isIndex = (s: string) => /^(0|[1-9]\d{0,5})$/.test(s);

/**
 * Parse a query string — a full URL, `?a=1&b=2`, or `a=1&b=2` — into JSON.
 * Decoding follows `URLSearchParams` (`+` is a space). A repeated key becomes
 * an array, and the bracket notation PHP, Rails and `qs` write is expanded:
 * `tags[]=a` appends, `user[name]=Ada` nests, `items[0][id]=1` indexes an
 * array. Values stay strings, because the query string has no types.
 */
export function queryToJson(input: string): ToolResult {
	let q = input.trim();
	if (q === '') return err('Input is empty');
	const hash = q.indexOf('#');
	if (hash >= 0) q = q.slice(0, hash);
	const qm = q.indexOf('?');
	if (qm >= 0) q = q.slice(qm + 1);
	else if (/^[a-z][a-z\d+.-]*:\/\//i.test(q)) return err('This URL has no query string');
	q = q.trim();
	if (q === '') return err('The query string is empty');

	// Null-prototype objects, so a `__proto__[x]` key is plain data.
	const obj = (): Record<string, QueryValue> => Object.create(null);
	const root = obj();
	for (const [key, value] of new URLSearchParams(q)) {
		if (key === '') continue;
		const segs = querySegments(key);
		let node: Record<string, QueryValue> | QueryValue[] = root;
		for (let i = 0; i < segs.length; i++) {
			const seg = segs[i];
			const last = i === segs.length - 1;
			if (Array.isArray(node)) {
				if (seg !== '' && !(isIndex(seg) && Number(seg) <= node.length))
					return err(`"${key}": index [${seg}] skips ahead of the array`);
				const idx: number = seg === '' ? node.length : Number(seg);
				if (last) {
					node[idx] = value;
					break;
				}
				if (node[idx] === undefined) node[idx] = segs[i + 1] === '' || segs[i + 1] === '0' ? [] : obj();
				const next: QueryValue = node[idx];
				if (typeof next === 'string') return err(`"${key}" conflicts with an earlier plain value`);
				node = next;
				continue;
			}
			if (seg === '' && i > 0) return err(`"${key}": empty brackets inside an object`);
			const existing: QueryValue | undefined = Object.hasOwn(node, seg) ? node[seg] : undefined;
			if (last) {
				// Plain repeated keys collect into an array.
				if (existing === undefined) node[seg] = value;
				else if (typeof existing === 'string') node[seg] = [existing, value];
				else if (Array.isArray(existing)) existing.push(value);
				else return err(`"${key}" conflicts with "${seg}[…]"`);
				break;
			}
			if (existing === undefined) {
				const child: QueryValue = segs[i + 1] === '' || segs[i + 1] === '0' ? [] : obj();
				node[seg] = child;
				node = child;
			} else if (typeof existing === 'string') {
				return err(`"${key}" conflicts with an earlier "${seg}=" value`);
			} else {
				node = existing;
			}
		}
	}
	if (Object.keys(root).length === 0) return err('No parameters found');
	return ok(JSON.stringify(root, null, 2));
}

/** Percent-encode one key segment or value the way forms do (space as `+`). */
const formEncode = (s: string) => encodeURIComponent(s).replace(/%20/g, '+');

/**
 * Serialize a JSON object to a query string — the inverse of `queryToJson`.
 * Arrays of scalars repeat the key (`tag=a&tag=b`), objects use brackets
 * (`user[name]=Ada`), arrays of objects get indexes (`items[0][id]=1`).
 * `null` becomes an empty value; brackets are left readable, not `%5B`.
 */
export function jsonToQuery(input: string): ToolResult {
	if (input.trim() === '') return err('Input is empty');
	let data: unknown;
	try {
		data = JSON.parse(input);
	} catch (e) {
		return err(e instanceof Error ? e.message : 'Invalid JSON');
	}
	if (data === null || typeof data !== 'object' || Array.isArray(data))
		return err('Expected a JSON object at the top level, like {"q": "search"}');

	const pairs: string[] = [];
	const scalar = (v: unknown) => (v === null ? '' : String(v));
	const walk = (prefix: string, v: unknown) => {
		if (Array.isArray(v)) {
			const flat = v.every((x) => x === null || typeof x !== 'object');
			v.forEach((x, i) => (flat ? walk(prefix, x) : walk(`${prefix}[${i}]`, x)));
		} else if (v !== null && typeof v === 'object') {
			for (const [k, x] of Object.entries(v)) walk(`${prefix}[${formEncode(k)}]`, x);
		} else {
			pairs.push(`${prefix}=${formEncode(scalar(v))}`);
		}
	};
	for (const [k, v] of Object.entries(data)) walk(formEncode(k), v);
	return ok(pairs.join('&'));
}
