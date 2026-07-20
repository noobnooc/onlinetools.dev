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
