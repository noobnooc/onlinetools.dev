import { describe, expect, it } from 'vitest';
import { detect, syntheticDetection } from './detectors';
import { rankTools, PASTE_MIN } from './recommend';
import { TOOL_BY_SLUG } from '$lib/tools/registry';

const JSON_SAMPLE = '{"users": [{"id": 1, "name": "Ada"}]}';

function slugsOf(ranked: ReturnType<typeof rankTools>) {
	return ranked.map((r) => r.slug);
}

describe('unified tool ranking', () => {
	it('ranks JSON-accepting tools above text tools above generators', () => {
		const ranked = rankTools(detect(JSON_SAMPLE));
		const slugs = slugsOf(ranked);
		const jsonTool = slugs.indexOf('json-to-yaml');
		const textTool = slugs.indexOf('word-counter');
		const generator = slugs.indexOf('lorem-ipsum-generator');
		expect(jsonTool).toBeGreaterThanOrEqual(0);
		expect(jsonTool).toBeLessThan(textTool);
		expect(textTool).toBeLessThan(generator);
	});

	it('marks format-specific matches as suggested, text fallback not', () => {
		const bySlug = new Map(rankTools(detect(JSON_SAMPLE)).map((r) => [r.slug, r]));
		expect(bySlug.get('json-formatter')?.suggested).toBe(true);
		expect(bySlug.get('json-to-typescript')?.suggested).toBe(true);
		expect(bySlug.get('word-counter')?.suggested).toBe(false);
		expect(bySlug.get('password-generator')?.score).toBe(0);
	});

	it('always includes every tool, so the chain menu stays complete', () => {
		expect(rankTools(detect(JSON_SAMPLE))).toHaveLength(
			rankTools(detect('#4c8dff')).length
		);
	});

	it('excludes the current tool', () => {
		const slugs = slugsOf(rankTools(detect(JSON_SAMPLE), { exclude: 'json-formatter' }));
		expect(slugs).not.toContain('json-formatter');
	});

	it('surfaces curated action labels from detectors', () => {
		const jwt =
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
			'eyJzdWIiOiIxMjMiLCJuYW1lIjoiQWRhIiwiaWF0IjoxNTE2MjM5MDIyfQ.abc123';
		const top = rankTools(detect(jwt))[0];
		expect(top.slug).toBe('jwt-decoder');
		expect(top.action).toBe('Decode');
	});

	it('ranks only image tools for image content', () => {
		const ranked = rankTools([syntheticDetection('image', 'Image', 1)], {
			baselineText: false
		});
		const relevant = ranked.filter((r) => r.score >= PASTE_MIN);
		expect(relevant.length).toBeGreaterThanOrEqual(4);
		for (const r of relevant) {
			expect(TOOL_BY_SLUG.get(r.slug)?.accepts).toContain('image');
		}
		// No text tool must receive any score for binary content.
		expect(ranked.find((r) => r.slug === 'word-counter')?.score).toBe(0);
	});

	it('a markdown file-extension hint beats the text baseline', () => {
		const ranked = rankTools([syntheticDetection('markdown', 'Markdown', 0.9)]);
		expect(ranked[0].slug).toBe('markdown-to-html');
		expect(ranked[0].suggested).toBe(true);
	});

	it('gives image-only tools and pure generators zero score for text content', () => {
		// Callers (Continue-with) drop score-0 tools — content they can't consume.
		const bySlug = new Map(rankTools(detect(JSON_SAMPLE)).map((r) => [r.slug, r]));
		for (const slug of [
			'image-converter',
			'image-resizer',
			'favicon-generator',
			'exif-viewer',
			'lorem-ipsum-generator',
			'password-generator'
		]) {
			expect(bySlug.get(slug)?.score, slug).toBe(0);
		}
		// …while a generic-text consumer like the QR generator keeps a positive score.
		expect(bySlug.get('qr-code-generator')!.score).toBeGreaterThan(0);
	});

	it('URL output suggests the QR code generator via accepts', () => {
		const bySlug = new Map(rankTools(detect('https://example.dev/?q=1')).map((r) => [r.slug, r]));
		expect(bySlug.get('qr-code-generator')?.suggested).toBe(true);
	});
});
