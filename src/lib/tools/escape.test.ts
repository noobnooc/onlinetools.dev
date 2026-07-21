import { describe, expect, it } from 'vitest';
import { escapeText, unescapeText } from './escape';

describe('escapeText json/js/java', () => {
	it('escapes control characters and quotes', () => {
		expect(escapeText('a"b\nc\t', 'json')).toEqual({ ok: true, value: 'a\\"b\\nc\\t' });
	});
	it('js dialect also escapes single quotes and backticks', () => {
		expect(escapeText(`it's \`ok\``, 'js')).toEqual({ ok: true, value: "it\\'s \\`ok\\`" });
	});
	it('java dialect escapes non-ASCII as \\u sequences', () => {
		expect(escapeText('é', 'java')).toEqual({ ok: true, value: '\\u00e9' });
		const emoji = escapeText('😀', 'java');
		expect(emoji).toEqual({ ok: true, value: '\\ud83d\\ude00' });
	});
	it('json keeps unicode literal', () => {
		expect(escapeText('世界', 'json')).toEqual({ ok: true, value: '世界' });
	});
});

describe('unescapeText backslash family', () => {
	it('unescapes standard sequences', () => {
		expect(unescapeText('a\\"b\\nc\\t', 'json')).toEqual({ ok: true, value: 'a"b\nc\t' });
	});
	it('handles \\x, \\u and \\u{…}', () => {
		expect(unescapeText('\\x41\\u00e9\\u{1F600}', 'js')).toEqual({ ok: true, value: 'Aé😀' });
	});
	it('round-trips every dialect', () => {
		const samples = ['plain', 'a"b\'c`d', 'line\nbreak\ttab', 'unicode é 世界 😀'];
		for (const dialect of ['json', 'js', 'java'] as const) {
			for (const s of samples) {
				const esc = escapeText(s, dialect);
				expect(esc.ok).toBe(true);
				if (esc.ok) expect(unescapeText(esc.value, dialect)).toEqual({ ok: true, value: s });
			}
		}
	});
	it('reports bad escapes', () => {
		expect(unescapeText('\\q', 'json').ok).toBe(false);
		expect(unescapeText('\\u12', 'json').ok).toBe(false);
		expect(unescapeText('trailing\\', 'json').ok).toBe(false);
	});
});

describe('xml dialect', () => {
	it('escapes the five predefined entities', () => {
		expect(escapeText(`<a href="x">&'</a>`, 'xml')).toEqual({
			ok: true,
			value: '&lt;a href=&quot;x&quot;&gt;&amp;&apos;&lt;/a&gt;'
		});
	});
	it('unescapes named and numeric entities', () => {
		expect(unescapeText('&lt;&#65;&#x42;&gt;', 'xml')).toEqual({ ok: true, value: '<AB>' });
	});
	it('rejects HTML-only entities', () => {
		expect(unescapeText('&nbsp;', 'xml').ok).toBe(false);
	});
});

describe('sql dialect', () => {
	it('doubles single quotes', () => {
		expect(escapeText("O'Brien", 'sql')).toEqual({ ok: true, value: "O''Brien" });
		expect(unescapeText("O''Brien", 'sql')).toEqual({ ok: true, value: "O'Brien" });
	});
});

describe('csv dialect', () => {
	it('quotes only when needed', () => {
		expect(escapeText('plain', 'csv')).toEqual({ ok: true, value: 'plain' });
		expect(escapeText('a,b', 'csv')).toEqual({ ok: true, value: '"a,b"' });
		expect(escapeText('say "hi"', 'csv')).toEqual({ ok: true, value: '"say ""hi"""' });
	});
	it('unescapes quoted fields', () => {
		expect(unescapeText('"say ""hi"""', 'csv')).toEqual({ ok: true, value: 'say "hi"' });
		expect(unescapeText('plain', 'csv')).toEqual({ ok: true, value: 'plain' });
	});
	it('rejects a stray quote inside a quoted field', () => {
		expect(unescapeText('"a"b"', 'csv').ok).toBe(false);
	});
});
