import { describe, it, expect } from 'vitest';
import { runChain, encodeRecipe, decodeRecipe, recipeSize, type Recipe } from './engine';
import { CHAIN_PRESETS } from './presets';
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

describe('presets', () => {
	it('every preset runs cleanly end to end', () => {
		for (const p of CHAIN_PRESETS) {
			const run = runChain(p.recipe.input, p.recipe.steps);
			expect(run.failedAt, `preset "${p.slug}" failed`).toBe(-1);
			expect(run.output.length).toBeGreaterThan(0);
		}
	});
});
