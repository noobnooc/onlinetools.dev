import { readFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

// Smart Paste runs on every page, so everything detectors.ts imports ends up
// in the shared bundle. Walk its import graph and make sure no tool's heavy
// dependency sneaks back in (on 2026-11-09 this was ~70 KB gzip on every page).
const HEAVY = ['yaml', 'smol-toml', 'marked', 'turndown', 'dompurify', 'sql-formatter', 'js-beautify', 'ajv'];

const ROOT = resolve(__dirname, '../..');

function resolveImport(from: string, spec: string): string | null {
	let base: string;
	if (spec.startsWith('$lib/')) base = resolve(ROOT, 'lib', spec.slice(5));
	else if (spec.startsWith('.')) base = resolve(dirname(from), spec);
	else return null;
	for (const candidate of [base, `${base}.ts`, `${base}/index.ts`]) {
		if (candidate.endsWith('.ts') && existsSync(candidate)) return candidate;
	}
	return null;
}

function walk(entry: string) {
	const seen = new Set<string>();
	const packages: { file: string; line: string; spec: string }[] = [];
	const queue = [entry];
	while (queue.length) {
		const file = queue.pop()!;
		if (seen.has(file)) continue;
		seen.add(file);
		const src = readFileSync(file, 'utf8');
		for (const m of src.matchAll(/^(?:import|export)\s+(?!type\b)[^'"]*?from\s+'([^']+)';?$/gm)) {
			const local = resolveImport(file, m[1]);
			if (local) queue.push(local);
			else packages.push({ file: file.slice(ROOT.length + 1), line: m[0], spec: m[1] });
		}
	}
	return { files: [...seen], packages };
}

describe('Smart Paste bundle', () => {
	const { files, packages } = walk(resolve(ROOT, 'lib/detect/detectors.ts'));

	it('walks the detector import graph', () => {
		expect(files.some((f) => f.endsWith('lib/tools/csv.ts'))).toBe(true);
		expect(files.some((f) => f.endsWith('lib/detect/sniff.ts'))).toBe(true);
	});

	it('pulls in no heavy tool dependency', () => {
		const heavy = packages.filter((p) => HEAVY.includes(p.spec));
		expect(heavy).toEqual([]);
	});

	it('only takes the validator from fast-xml-parser', () => {
		for (const p of packages.filter((p) => p.spec === 'fast-xml-parser')) {
			expect(p.line).toMatch(/^import \{ XMLValidator \} from/);
		}
	});
});

// /chain and its recipe pages bundle `chain/ops.ts`; ops that need a heavy
// library must import it dynamically (on first use), not statically.
describe('Pipeline bundle', () => {
	const { files, packages } = walk(resolve(ROOT, 'lib/chain/engine.ts'));

	it('walks the op registry', () => {
		expect(files.some((f) => f.endsWith('lib/chain/ops.ts'))).toBe(true);
		expect(files.some((f) => f.endsWith('lib/tools/base64.ts'))).toBe(true);
	});

	it('pulls in no heavy tool dependency', () => {
		expect(packages.filter((p) => HEAVY.includes(p.spec))).toEqual([]);
		expect(files.filter((f) => /lib\/tools\/(dataconvert|jsonschema|sqlformat|codeformat|markdown)\.ts$/.test(f))).toEqual([]);
	});
});
