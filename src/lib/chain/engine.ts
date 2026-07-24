import { PIPE_OP_BY_ID } from './ops';
import { encodeState, decodeState, MAX_SHARED_INPUT } from '$lib/state/urlstate';
import type { Step, Recipe } from './types';

/**
 * Pipeline execution + share-state serialization. A recipe (initial input +
 * ordered steps) runs each step's pure function in turn, feeding every success
 * into the next step. The first failure stops the flow; later steps are
 * reported as skipped. The whole recipe round-trips through the URL fragment
 * (never the server), so a link reproduces the exact pipeline. Importing this
 * module pulls in `ops.ts` (browser-only libraries) — keep it client-side.
 */

export type { Step, Recipe } from './types';

export interface StepResult {
	op: string;
	arg?: string;
	/** ok = ran and produced output; error = failed; skipped = after a failure. */
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
