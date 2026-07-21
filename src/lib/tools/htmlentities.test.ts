import { describe, expect, it } from 'vitest';
import { encodeEntities, decodeEntities } from './htmlentities';

describe('encodeEntities', () => {
	it('escapes the five structural characters', () => {
		expect(encodeEntities('<a href="x">&\'</a>')).toBe(
			'&lt;a href=&quot;x&quot;&gt;&amp;&apos;&lt;/a&gt;'
		);
	});
	it('leaves plain text and non-ASCII untouched by default', () => {
		expect(encodeEntities('café 世界')).toBe('café 世界');
	});
	it('encodes all non-ASCII when asked, preferring named entities', () => {
		expect(encodeEntities('© → 💡', { all: true })).toBe('&copy; &rarr; &#x1F4A1;');
	});
	it('numeric mode uses hex references only', () => {
		expect(encodeEntities('café', { all: true, numeric: true })).toBe('caf&#xE9;');
		expect(encodeEntities('<', { numeric: true })).toBe('&#x3C;');
	});
	it('astral characters get correct code points', () => {
		expect(encodeEntities('🎉', { all: true, numeric: true })).toBe('&#x1F389;');
	});
	it('empty input passes through', () => {
		expect(encodeEntities('')).toBe('');
	});
});

describe('decodeEntities', () => {
	it('decodes named, decimal and hex references', () => {
		const r = decodeEntities('&lt;b&gt; &#169; &#xA9; &rarr; &hellip;');
		expect(r.ok && r.value).toBe('<b> © © → …');
	});
	it('hex references are case-insensitive on the x and digits', () => {
		const r = decodeEntities('&#Xe9; &#xE9;');
		expect(r.ok && r.value).toBe('é é');
	});
	it('decodes astral references', () => {
		const r = decodeEntities('&#x1F389;&#127881;');
		expect(r.ok && r.value).toBe('🎉🎉');
	});
	it('passes unknown named entities through untouched', () => {
		const r = decodeEntities('&notarealentity; &amp;');
		expect(r.ok && r.value).toBe('&notarealentity; &');
	});
	it('leaves out-of-range numeric references untouched', () => {
		const r = decodeEntities('&#x110000;');
		expect(r.ok && r.value).toBe('&#x110000;');
	});
	it('handles bare ampersands and double-encoding', () => {
		const bare = decodeEntities('fish & chips');
		expect(bare.ok && bare.value).toBe('fish & chips');
		const once = decodeEntities('&amp;#39;');
		expect(once.ok && once.value).toBe('&#39;');
		if (once.ok) {
			const twice = decodeEntities(once.value);
			expect(twice.ok && twice.value).toBe("'");
		}
	});
});

describe('round-trips', () => {
	it('encode → decode restores the original for markup', () => {
		const original = '<script>alert("x & y")</script>';
		const dec = decodeEntities(encodeEntities(original));
		expect(dec.ok && dec.value).toBe(original);
	});
	it('all+numeric round-trips unicode text', () => {
		const original = 'Grüße — 東京 🗼';
		const dec = decodeEntities(encodeEntities(original, { all: true, numeric: true }));
		expect(dec.ok && dec.value).toBe(original);
	});
});
