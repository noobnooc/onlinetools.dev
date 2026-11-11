import { getRun } from './ops';
import { encodeState, decodeState, MAX_SHARED_INPUT } from '$lib/state/urlstate';
import type { Step, Recipe } from './types';

/**
 * Pipeline execution + share-state serialization. A recipe (initial input +
 * ordered steps) runs each step's pure function in turn, feeding every success
 * into the next step. The first failure stops the flow; later steps are
 * reported as skipped. The whole recipe round-trips through the URL fragment
 * (never the server), so a link reproduces the exact pipeline. Steps whose
 * library hasn't loaded yet come back 'pending': call `loadOps()` from
 * `ops.ts` for the recipe's step ids, then run again.
 */

export type { Step, Recipe } from './types';

export interface StepResult {
	op: string;
	arg?: string;
	/**
	 * ok = ran and produced output; error = failed; skipped = after a failure;
	 * pending = this step (or an earlier one) is still loading its library.
	 */
	status: 'ok' | 'error' | 'skipped' | 'pending';
	value?: string;
	error?: string;
}

export interface ChainRun {
	steps: StepResult[];
	/** Output after the last successful step (the initial input if none ran). */
	output: string;
	/** Index of the first failing step, or -1 if every step succeeded. */
	failedAt: number;
	/** True while a step is waiting for its library; `output` isn't final yet. */
	pending: boolean;
}

export function runChain(input: string, steps: Step[]): ChainRun {
	const results: StepResult[] = [];
	let current = input;
	let failedAt = -1;
	let pending = false;

	steps.forEach((step, i) => {
		if (failedAt !== -1) {
			results.push({ op: step.op, arg: step.arg, status: 'skipped' });
			return;
		}
		if (pending) {
			results.push({ op: step.op, arg: step.arg, status: 'pending' });
			return;
		}
		const run = getRun(step.op);
		if (run === 'loading') {
			results.push({ op: step.op, arg: step.arg, status: 'pending' });
			pending = true;
			return;
		}
		if (run === undefined || run === 'failed') {
			const error =
				run === 'failed'
					? 'This step could not be loaded. Check your connection and reload the page.'
					: 'Unknown step';
			results.push({ op: step.op, arg: step.arg, status: 'error', error });
			failedAt = i;
			return;
		}
		let value: string;
		let error: string | null = null;
		try {
			const r = run(current, step.arg);
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

	return { steps: results, output: current, failedAt, pending };
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
