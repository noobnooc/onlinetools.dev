import { type ToolResult, ok, err } from './types';
import { UAParser } from 'ua-parser-js';

export interface ParsedUa {
	browser: { name: string; version: string };
	engine: { name: string; version: string };
	os: { name: string; version: string };
	device: { type: string; vendor: string; model: string };
	cpu: { architecture: string };
}

const dash = (v: string | undefined) => (v && v !== '' ? v : '—');

export function parseUserAgent(input: string): ToolResult<ParsedUa> {
	const ua = input.trim();
	if (ua === '') return err('Input is empty');
	if (ua.length > 2000) return err('That does not look like a User-Agent string (too long)');
	const r = UAParser(ua);
	const empty = !r.browser.name && !r.os.name && !r.engine.name && !r.device.type;
	if (empty) return err('No browser, OS or device could be recognized in this string');
	return ok({
		browser: { name: dash(r.browser.name), version: dash(r.browser.version) },
		engine: { name: dash(r.engine.name), version: dash(r.engine.version) },
		os: { name: dash(r.os.name), version: dash(r.os.version) },
		device: {
			type: dash(r.device.type ?? 'desktop'),
			vendor: dash(r.device.vendor),
			model: dash(r.device.model)
		},
		cpu: { architecture: dash(r.cpu.architecture) }
	});
}
