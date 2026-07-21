import { describe, expect, it } from 'vitest';
import { diffLines } from './diff';

describe('diffLines', () => {
	it('marks a single changed line as del + add', () => {
		const { lines, stats } = diffLines('a\nb\nc', 'a\nx\nc');
		expect(stats).toEqual({ added: 1, removed: 1, unchanged: 2 });
		expect(lines.map((l) => l.type)).toEqual(['same', 'del', 'add', 'same']);
	});
	it('handles pure insertion and pure deletion', () => {
		expect(diffLines('a\nc', 'a\nb\nc').stats).toEqual({ added: 1, removed: 0, unchanged: 2 });
		expect(diffLines('a\nb\nc', 'a\nc').stats).toEqual({ added: 0, removed: 1, unchanged: 2 });
	});
	it('identical inputs produce zero changes', () => {
		const { stats } = diffLines('x\ny\nz', 'x\ny\nz');
		expect(stats).toEqual({ added: 0, removed: 0, unchanged: 3 });
	});
	it('completely different inputs replace everything', () => {
		const { stats } = diffLines('a\nb', 'x\ny');
		expect(stats.unchanged).toBe(0);
		expect(stats.added).toBe(2);
		expect(stats.removed).toBe(2);
	});
	it('tracks original line numbers on both sides', () => {
		const { lines } = diffLines('a\nb\nc', 'b\nc\nd');
		const del = lines.find((l) => l.type === 'del');
		expect(del).toMatchObject({ text: 'a', left: 1 });
		expect(del?.right).toBeUndefined();
		const add = lines.find((l) => l.type === 'add');
		expect(add).toMatchObject({ text: 'd', right: 3 });
		expect(add?.left).toBeUndefined();
		const firstSame = lines.find((l) => l.type === 'same');
		expect(firstSame).toMatchObject({ text: 'b', left: 2, right: 1 });
	});
	it('empty-vs-content diffs count every line', () => {
		const { stats } = diffLines('', 'a\nb');
		// '' splits into one empty line, which pairs with nothing on the right.
		expect(stats.added).toBeGreaterThanOrEqual(2);
	});
	it('two empty inputs are a single unchanged empty line', () => {
		const { stats } = diffLines('', '');
		expect(stats).toEqual({ added: 0, removed: 0, unchanged: 1 });
	});
	it('finds the longest common subsequence around a moved block', () => {
		const { stats } = diffLines('h\na\nb\nc\nt', 'h\nc\na\nb\nt');
		// LCS keeps h, a, b, t (or h, c, t) — at least 4 lines survive.
		expect(stats.unchanged).toBeGreaterThanOrEqual(4);
	});
	it('treats whitespace differences as real changes', () => {
		const { stats } = diffLines('a', 'a ');
		expect(stats.unchanged).toBe(0);
	});
	it('handles moderately large inputs quickly', () => {
		const left = Array.from({ length: 500 }, (_, i) => `line ${i}`).join('\n');
		const right = Array.from({ length: 500 }, (_, i) => (i === 250 ? 'CHANGED' : `line ${i}`)).join('\n');
		const start = performance.now();
		const { stats } = diffLines(left, right);
		expect(performance.now() - start).toBeLessThan(2000);
		expect(stats).toEqual({ added: 1, removed: 1, unchanged: 499 });
	});
});
