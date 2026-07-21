import { describe, expect, it } from 'vitest';
import { markdownToHtml, htmlToMarkdown, markdownStats, isLikelyMarkdown } from './markdown';

describe('markdownToHtml', () => {
	it('renders headings, emphasis and code', () => {
		const r = markdownToHtml('# Title\n\nSome **bold** and `code`.');
		expect(r.ok).toBe(true);
		if (r.ok) {
			expect(r.value).toContain('<h1>Title</h1>');
			expect(r.value).toContain('<strong>bold</strong>');
			expect(r.value).toContain('<code>code</code>');
		}
	});
	it('renders GFM tables', () => {
		const r = markdownToHtml('| a | b |\n| - | - |\n| 1 | 2 |');
		expect(r.ok).toBe(true);
		if (r.ok) expect(r.value).toContain('<table>');
	});
	it('renders fenced code blocks', () => {
		const r = markdownToHtml('```js\nconst x = 1;\n```');
		expect(r.ok).toBe(true);
		if (r.ok) expect(r.value).toContain('<pre>');
	});
	it('errors on empty input', () => {
		expect(markdownToHtml('  ').ok).toBe(false);
	});
});

describe('htmlToMarkdown', () => {
	it('converts basic structure back to markdown', () => {
		const r = htmlToMarkdown('<h2>Hi</h2><p>Some <em>text</em> and <a href="https://x.dev">link</a>.</p>');
		expect(r.ok).toBe(true);
		if (r.ok) {
			expect(r.value).toContain('## Hi');
			expect(r.value).toContain('*text*');
			expect(r.value).toContain('[link](https://x.dev)');
		}
	});
	it('uses fenced code blocks and dash bullets', () => {
		const r = htmlToMarkdown('<ul><li>one</li><li>two</li></ul><pre><code>x</code></pre>');
		expect(r.ok).toBe(true);
		if (r.ok) {
			expect(r.value).toContain('- one');
			expect(r.value).toContain('```');
		}
	});
	it('converts strikethrough', () => {
		const r = htmlToMarkdown('<p><del>gone</del></p>');
		expect(r.ok && r.value.includes('~~gone~~')).toBe(true);
	});
	it('round-trips a simple document', () => {
		const md = '# Title\n\nA paragraph with **bold**.\n\n- item one\n- item two';
		const html = markdownToHtml(md);
		expect(html.ok).toBe(true);
		if (html.ok) {
			const back = htmlToMarkdown(html.value);
			expect(back.ok).toBe(true);
			if (back.ok) {
				expect(back.value).toContain('# Title');
				expect(back.value).toContain('**bold**');
				expect(back.value).toContain('- item one');
			}
		}
	});
});

describe('markdownStats', () => {
	it('counts words, headings, links and code blocks', () => {
		const s = markdownStats('# H\n\ntwo words [x](https://a.b)\n\n```\ncode\n```');
		expect(s.headings).toBe(1);
		expect(s.links).toBe(1);
		expect(s.codeBlocks).toBe(1);
		expect(s.words).toBeGreaterThan(2);
	});
});

describe('isLikelyMarkdown', () => {
	it('accepts markdown-looking text', () => {
		expect(
			isLikelyMarkdown('# Readme\n\nSome **bold** text with a [link](https://example.com).\n\n- a\n- b')
		).toBe(true);
	});
	it('rejects JSON, XML and short text', () => {
		expect(isLikelyMarkdown('{"a":1}')).toBe(false);
		expect(isLikelyMarkdown('<a>x</a>')).toBe(false);
		expect(isLikelyMarkdown('# hi')).toBe(false);
	});
});
