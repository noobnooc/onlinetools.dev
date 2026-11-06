import { describe, it, expect } from 'vitest';
import { runChain, encodeRecipe, decodeRecipe, recipeSize, type Recipe } from './engine';
import { CHAIN_PRESETS } from './presets';
import { TOOL_BY_SLUG } from '$lib/tools/registry';
import { MAX_SHARED_INPUT, encodeState } from '$lib/state/urlstate';

describe('runChain', () => {
	it('feeds each step output into the next', () => {
		// base64 of {"user":{"name":"Ada","roles":["admin","dev"]}}
		const b64 = 'eyJ1c2VyIjp7Im5hbWUiOiJBZGEiLCJyb2xlcyI6WyJhZG1pbiIsImRldiJdfX0=';
		const run = runChain(b64, [{ op: 'base64-decode' }, { op: 'json-pretty' }]);
		expect(run.failedAt).toBe(-1);
		expect(run.steps.every((s) => s.status === 'ok')).toBe(true);
		expect(run.output).toContain('"user"');
		expect(run.output).toContain('\n'); // prettified
	});

	it('decodes a JWT to its payload', () => {
		const p = CHAIN_PRESETS.find((x) => x.slug === 'decode-jwt-payload')!;
		const run = runChain(p.recipe.input, p.recipe.steps);
		expect(run.failedAt).toBe(-1);
		expect(JSON.parse(run.output).name).toBe('Ada Lovelace');
	});

	it('extracts a claim with a JSONPath argument', () => {
		const p = CHAIN_PRESETS.find((x) => x.slug === 'extract-jwt-claim')!;
		const run = runChain(p.recipe.input, p.recipe.steps);
		expect(run.failedAt).toBe(-1);
		expect(run.output).toBe('Ada Lovelace');
	});

	it('stops at the first failure and skips later steps', () => {
		const run = runChain('not json', [{ op: 'json-pretty' }, { op: 'uppercase' }]);
		expect(run.failedAt).toBe(0);
		expect(run.steps[0].status).toBe('error');
		expect(run.steps[1].status).toBe('skipped');
	});

	it('reports an unknown op as an error', () => {
		const run = runChain('x', [{ op: 'does-not-exist' }]);
		expect(run.failedAt).toBe(0);
		expect(run.steps[0].status).toBe('error');
	});

	it('returns the input unchanged when there are no steps', () => {
		const run = runChain('hello', []);
		expect(run.output).toBe('hello');
		expect(run.failedAt).toBe(-1);
	});
});

describe('recipe share state', () => {
	it('round-trips input and steps through the fragment', () => {
		const recipe: Recipe = {
			input: 'eyJhIjoxfQ==',
			steps: [{ op: 'base64-decode' }, { op: 'jsonpath', arg: '$.a' }]
		};
		const frag = encodeRecipe(recipe);
		expect(frag).not.toBeNull();
		const decoded = decodeRecipe(frag as string);
		expect(decoded).toEqual(recipe);
	});

	it('refuses to encode an oversized recipe', () => {
		const recipe: Recipe = { input: 'x'.repeat(MAX_SHARED_INPUT + 1), steps: [] };
		expect(recipeSize(recipe)).toBeGreaterThan(MAX_SHARED_INPUT);
		expect(encodeRecipe(recipe)).toBeNull();
	});

	it('tolerates a malformed hash', () => {
		expect(decodeRecipe('#s=not-valid-base64!!')).toBeNull();
	});

	it('drops malformed steps but keeps the input', () => {
		const frag = '#s=' + encodeState({ input: 'hi', ops: '[{"nope":1},{"op":"trim"}]' });
		const decoded = decodeRecipe(frag);
		expect(decoded?.input).toBe('hi');
		expect(decoded?.steps).toEqual([{ op: 'trim', arg: undefined }]);
	});
});

describe('network and line ops', () => {
	it('merges a CIDR list into the fewest blocks', () => {
		const run = runChain('10.0.0.0/24\n10.0.1.0/24, 10.0.0.5', [{ op: 'cidr-aggregate' }]);
		expect(run.failedAt).toBe(-1);
		expect(run.output).toBe('10.0.0.0/23');
	});

	it('subtracts the comma-separated argument', () => {
		const run = runChain('0.0.0.0/0', [{ op: 'cidr-aggregate', arg: '128.0.0.0/1' }]);
		expect(run.output).toBe('0.0.0.0/1');
	});

	it('fails the step on a bad entry instead of skipping it', () => {
		const run = runChain('10.0.0.0/8\n10.0.0.300', [{ op: 'cidr-aggregate' }]);
		expect(run.failedAt).toBe(0);
		expect(run.steps[0].error).toMatch(/^Line 2:/);
		const ex = runChain('10.0.0.0/8', [{ op: 'cidr-aggregate', arg: 'nope' }]);
		expect(ex.steps[0].error).toMatch(/^Minus "nope":/);
	});

	it('reports when the exclusions remove everything', () => {
		const run = runChain('10.0.0.0/8', [{ op: 'cidr-aggregate', arg: '0.0.0.0/0' }]);
		expect(run.failedAt).toBe(0);
	});

	it('joins non-empty lines, ", " by default, with \\n and \\t escapes', () => {
		expect(runChain(' a \n\nb\n', [{ op: 'join-lines' }]).output).toBe('a, b');
		expect(runChain('a\nb', [{ op: 'join-lines', arg: ' | ' }]).output).toBe('a | b');
		expect(runChain('a\nb', [{ op: 'join-lines', arg: '\\t' }]).output).toBe('a\tb');
	});

	it('builds a WireGuard AllowedIPs line without private ranges', () => {
		const p = CHAIN_PRESETS.find((x) => x.slug === 'wireguard-allowedips-exclude-lan')!;
		const run = runChain(p.recipe.input, p.recipe.steps);
		expect(run.failedAt).toBe(-1);
		const blocks = run.output.split(', ');
		expect(run.output).not.toContain('\n');
		expect(blocks).toContain('11.0.0.0/8');
		expect(blocks).toContain('192.0.0.0/9');
		expect(blocks.some((b) => b.startsWith('10.') || b.startsWith('192.168.'))).toBe(false);
		expect(blocks).toContain('::/1');
	});

	it('dedupes and sorts lines', () => {
		const p = CHAIN_PRESETS.find((x) => x.slug === 'remove-duplicate-lines-and-sort')!;
		expect(runChain(p.recipe.input, p.recipe.steps).output).toBe(
			'alpha.example.com\nbeta.example.com\ngamma.example.com'
		);
	});
});

describe('presets', () => {
	it('every preset links only to tools that exist', () => {
		for (const p of CHAIN_PRESETS) {
			expect(p.tools.length, p.slug).toBeGreaterThan(0);
			for (const slug of p.tools) expect(TOOL_BY_SLUG.has(slug), `${p.slug} → ${slug}`).toBe(true);
		}
	});

	it('every preset runs cleanly end to end', () => {
		for (const p of CHAIN_PRESETS) {
			const run = runChain(p.recipe.input, p.recipe.steps);
			expect(run.failedAt, `preset "${p.slug}" failed`).toBe(-1);
			expect(run.output.length).toBeGreaterThan(0);
		}
	});
});
