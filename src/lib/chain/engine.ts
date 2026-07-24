import { PIPE_OP_BY_ID } from './ops';
import { encodeState, decodeState, MAX_SHARED_INPUT } from '$lib/state/urlstate';

/**
 * Pipeline execution + share-state serialization. A recipe (initial input +
 * ordered steps) runs each step's pure function in turn, feeding every
 * success into the next step. The first failure stops the flow; later steps
 * are reported as skipped. The whole recipe round-trips through the URL
 * fragment (never the server), so a link reproduces the exact pipeline.
 */

export interface Step {
	op: string;
	arg?: string;
}

export interface Recipe {
	input: string;
	steps: Step[];
}

export interface StepResult {
	op: string;
	arg?: string;
	/** true = ran and produced output; false = failed; null = skipped. */
	status: 'ok' | 'error' | 'skipped';
	value?: string;
	error?: string;
}

export interface ChainRun {
	steps: StepResult[];
	/** Output after the last successful step (the initial input if none ran). */
	output: string;
	/** Index of the first failing step, or -1 if every step succeeded. */
	failedAt: number;
}

export function runChain(input: string, steps: Step[]): ChainRun {
	const results: StepResult[] = [];
	let current = input;
	let failedAt = -1;

	steps.forEach((step, i) => {
		if (failedAt !== -1) {
			results.push({ op: step.op, arg: step.arg, status: 'skipped' });
			return;
		}
		const op = PIPE_OP_BY_ID.get(step.op);
		if (!op) {
			results.push({ op: step.op, arg: step.arg, status: 'error', error: 'Unknown step' });
			failedAt = i;
			return;
		}
		let value: string;
		let error: string | null = null;
		try {
			const r = op.run(current, step.arg);
			if (r.ok) value = r.value;
			else {
				error = r.error;
				value = '';
			}
		} catch (e) {
			error = e instanceof Error ? e.message : 'Step failed';
			value = '';
		}
		if (error !== null) {
			results.push({ op: step.op, arg: step.arg, status: 'error', error });
			failedAt = i;
		} else {
			results.push({ op: step.op, arg: step.arg, status: 'ok', value });
			current = value;
		}
	});

	return { steps: results, output: current, failedAt };
}

/* ---------- share state ---------- */

/** Total serialized size, used to refuse oversized share links. */
export function recipeSize(recipe: Recipe): number {
	return recipe.input.length + JSON.stringify(recipe.steps).length;
}

/** Encode a recipe into a `#s=…` fragment, or null if it is too large to share. */
export function encodeRecipe(recipe: Recipe): string | null {
	if (recipeSize(recipe) > MAX_SHARED_INPUT) return null;
	return '#s=' + encodeState({ input: recipe.input, ops: JSON.stringify(recipe.steps) });
}

/** Parse a location hash back into a recipe, tolerating malformed data. */
export function decodeRecipe(hash: string): Recipe | null {
	const state = decodeState(hash);
	if (!state) return null;
	let steps: Step[] = [];
	try {
		const parsed: unknown = JSON.parse(state.ops ?? '[]');
		if (Array.isArray(parsed)) {
			steps = parsed
				.filter((s): s is Record<string, unknown> => !!s && typeof s === 'object')
				.filter((s) => typeof s.op === 'string')
				.map((s) => ({ op: s.op as string, arg: typeof s.arg === 'string' ? s.arg : undefined }));
		}
	} catch {
		// Malformed step list — treat as no steps rather than throwing.
	}
	return { input: state.input ?? '', steps };
}

/* ---------- presets ---------- */

/**
 * Curated starter recipes. Each is a one-click demo of a real workflow and a
 * seed for a future dedicated, indexable preset page (the SEO angle: these
 * target workflow-intent queries the single-tool pages cannot).
 */
export interface Preset {
	id: string;
	/** English title; localized presentation can come later. */
	title: string;
	recipe: Recipe;
}

const SAMPLE_JWT =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFkYSBMb3ZlbGFjZSIsImlhdCI6MTUxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

export const PRESETS: Preset[] = [
	{
		id: 'jwt-payload',
		title: 'Decode a JWT and read its payload',
		recipe: { input: SAMPLE_JWT, steps: [{ op: 'jwt-payload' }] }
	},
	{
		id: 'jwt-claim',
		title: 'Extract one claim from a JWT',
		recipe: { input: SAMPLE_JWT, steps: [{ op: 'jwt-payload' }, { op: 'jsonpath', arg: '$.name' }] }
	},
	{
		id: 'base64-json',
		title: 'Base64-decode, then prettify JSON',
		recipe: {
			input: 'eyJ1c2VyIjp7Im5hbWUiOiJBZGEiLCJyb2xlcyI6WyJhZG1pbiIsImRldiJdfX0=',
			steps: [{ op: 'base64-decode' }, { op: 'json-pretty' }]
		}
	},
	{
		id: 'json-to-yaml',
		title: 'Convert JSON to YAML',
		recipe: {
			input: '{"name":"Ada","roles":["admin","dev"],"active":true}',
			steps: [{ op: 'json-to-yaml' }]
		}
	},
	{
		id: 'json-to-csv',
		title: 'Flatten a JSON array into CSV',
		recipe: {
			input: '[{"id":1,"name":"Ada"},{"id":2,"name":"Alan"}]',
			steps: [{ op: 'json-to-csv' }]
		}
	}
];
