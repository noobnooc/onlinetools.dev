import { describe, it, expect } from 'vitest';
import { getRun, loadOps, opsReady } from './ops';
import { runChain } from './engine';
import { PIPE_OP_META } from './op-meta';

// This file runs in its own module context, so the lazy ops start unloaded.
describe('lazy pipeline ops', () => {
	it('runs dependency-free ops right away', () => {
		expect(typeof getRun('base64-decode')).toBe('function');
		expect(runChain('aGk=', [{ op: 'base64-decode' }, { op: 'uppercase' }])).toMatchObject({
			output: 'HI',
			pending: false,
			failedAt: -1
		});
	});

	it('marks a step pending until its library loads, then runs it', async () => {
		const steps = [{ op: 'url-decode' }, { op: 'yaml-to-json' }, { op: 'json-minify' }];
		expect(opsReady(steps.map((s) => s.op))).toBe(false);

		const before = runChain('a%3A%201', steps);
		expect(before.pending).toBe(true);
		expect(before.steps.map((s) => s.status)).toEqual(['ok', 'pending', 'pending']);
		expect(before.failedAt).toBe(-1);

		await loadOps(steps.map((s) => s.op));
		expect(opsReady(steps.map((s) => s.op))).toBe(true);
		const after = runChain('a%3A%201', steps);
		expect(after.pending).toBe(false);
		expect(after.output).toBe('{"a":1}');
	});

	it('still reports unknown steps as errors, not pending', () => {
		const run = runChain('x', [{ op: 'nope' }, { op: 'sql-format' }]);
		expect(run.steps[0]).toMatchObject({ status: 'error', error: 'Unknown step' });
		expect(run.steps[1].status).toBe('skipped');
		expect(run.pending).toBe(false);
	});

	it('has an implementation for every op in the metadata', async () => {
		await loadOps(PIPE_OP_META.map((o) => o.id));
		for (const { id } of PIPE_OP_META) expect(typeof getRun(id), id).toBe('function');
	});
});
