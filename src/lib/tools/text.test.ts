import { describe, expect, it } from 'vitest';
import {
	convertCase,
	tokenize,
	textStats,
	loremIpsum,
	slugify,
	processLines,
	CASE_STYLES,
	type RandomInt
} from './text';

const fixedRand: RandomInt = () => 0;

describe('tokenize', () => {
	it('splits camelCase and PascalCase', () => {
		expect(tokenize('getUserByID')).toEqual(['get', 'user', 'by', 'id']);
		expect(tokenize('XMLHttpRequest')).toEqual(['xml', 'http', 'request']);
	});
	it('splits on underscores, hyphens and spaces', () => {
		expect(tokenize('HTTP_response-code value')).toEqual(['http', 'response', 'code', 'value']);
	});
	it('keeps digits attached to their word', () => {
		expect(tokenize('user2Id')).toEqual(['user2', 'id']);
		expect(tokenize('sha256sum')).toEqual(['sha256sum']);
	});
	it('handles empty and symbol-only input', () => {
		expect(tokenize('')).toEqual([]);
		expect(tokenize('!!! ---')).toEqual([]);
	});
});

describe('convertCase', () => {
	it('converts to every advertised style', () => {
		const input = 'user account id';
		const expected: Record<string, string> = {
			camel: 'userAccountId',
			pascal: 'UserAccountId',
			snake: 'user_account_id',
			kebab: 'user-account-id',
			constant: 'USER_ACCOUNT_ID',
			title: 'User Account Id',
			sentence: 'User account id',
			lower: 'user account id',
			upper: 'USER ACCOUNT ID'
		};
		for (const style of CASE_STYLES) {
			expect(convertCase(input, style.id)).toBe(expected[style.id]);
		}
	});
	it('is style-idempotent (converting twice equals once)', () => {
		for (const style of CASE_STYLES) {
			const once = convertCase('getUserByID', style.id);
			expect(convertCase(once, style.id)).toBe(once);
		}
	});
	it('converts each line of batch input independently', () => {
		expect(convertCase('first line\nsecondLine\n\nthird_one', 'kebab')).toBe(
			'first-line\nsecond-line\n\nthird-one'
		);
	});
	it('single word round trip', () => {
		expect(convertCase('hello', 'pascal')).toBe('Hello');
		expect(convertCase('HELLO', 'camel')).toBe('hello');
	});
});

describe('textStats', () => {
	it('counts words, sentences, paragraphs and lines', () => {
		const s = textStats('Hello world. This is a test!\n\nSecond paragraph here.');
		expect(s.words).toBe(9);
		expect(s.sentences).toBe(3);
		expect(s.paragraphs).toBe(2);
		expect(s.lines).toBe(3);
	});
	it('counts unicode by code points, bytes separately', () => {
		const s = textStats('日本語');
		expect(s.characters).toBe(3);
		expect(s.charactersNoSpaces).toBe(3);
		expect(s.bytes).toBe(9);
	});
	it('emoji count as one code point but four bytes', () => {
		const s = textStats('🎉');
		expect(s.characters).toBe(1);
		expect(s.bytes).toBe(4);
	});
	it('empty input is all zeros', () => {
		const s = textStats('');
		expect(s).toMatchObject({ words: 0, lines: 0, sentences: 0, paragraphs: 0, bytes: 0, readingMinutes: 0 });
	});
	it('whitespace-only input has lines but no words', () => {
		const s = textStats('   \n  ');
		expect(s.words).toBe(0);
		expect(s.lines).toBe(2);
		expect(s.paragraphs).toBe(0);
	});
	it('reading time is at least 1 minute for any text', () => {
		expect(textStats('word').readingMinutes).toBe(1);
		expect(textStats(Array(700).fill('word').join(' ')).readingMinutes).toBe(3);
	});
});

describe('loremIpsum', () => {
	it('generates exact word counts', () => {
		const r = loremIpsum({ unit: 'words', count: 10, startClassic: false }, fixedRand);
		expect(r.ok && (r.value as string).split(' ')).toHaveLength(10);
		const one = loremIpsum({ unit: 'words', count: 1, startClassic: false }, fixedRand);
		expect(one.ok && (one.value as string).split(' ')).toHaveLength(1);
	});
	it('classic start begins with the canonical phrase', () => {
		for (const unit of ['words', 'sentences', 'paragraphs'] as const) {
			const r = loremIpsum({ unit, count: 2 }, fixedRand);
			expect(r.ok && (r.value as string).toLowerCase().startsWith('lorem ipsum dolor sit amet')).toBe(true);
		}
	});
	it('sentences end with periods and start capitalized', () => {
		const r = loremIpsum({ unit: 'sentences', count: 3, startClassic: false }, fixedRand);
		expect(r.ok).toBe(true);
		if (r.ok) {
			for (const s of r.value.split('. ')) {
				expect(s.charAt(0)).toBe(s.charAt(0).toUpperCase());
			}
		}
	});
	it('paragraphs are separated by blank lines', () => {
		const r = loremIpsum({ unit: 'paragraphs', count: 3, startClassic: false }, fixedRand);
		expect(r.ok && (r.value as string).split('\n\n')).toHaveLength(3);
	});
	it('rejects counts outside 1..1000', () => {
		expect(loremIpsum({ unit: 'words', count: 0 }).ok).toBe(false);
		expect(loremIpsum({ unit: 'words', count: 1001 }).ok).toBe(false);
	});
});

describe('slugify', () => {
	it('slugs punctuation-heavy titles', () => {
		expect(slugify("Hello, World! It's 2026")).toBe('hello-world-its-2026');
		expect(slugify('a — b … c')).toBe('a-b-c');
	});
	it('transliterates diacritics and special latin letters', () => {
		expect(slugify('Crème brûlée à Paris')).toBe('creme-brulee-a-paris');
		expect(slugify('Straße')).toBe('strasse');
		expect(slugify('Åse Ørn')).toBe('ase-orn');
	});
	it('removes scripts without latin mapping', () => {
		expect(slugify('中文 title here')).toBe('title-here');
	});
	it('supports underscore separators and preserved case', () => {
		expect(slugify('A B C', { separator: '_' })).toBe('A_B_C'.toLowerCase());
		expect(slugify('Hello World', { lowercase: false })).toBe('Hello-World');
	});
	it('cuts at a word boundary under maxLength', () => {
		expect(slugify('one two three four', { maxLength: 11 })).toBe('one-two');
		expect(slugify('word', { maxLength: 10 })).toBe('word');
	});
	it('collapses separator runs and trims edges', () => {
		expect(slugify('--a---b--')).toBe('a-b');
		expect(slugify('!!!')).toBe('');
	});
});

describe('processLines', () => {
	it('dedupes preserving first occurrence order', () => {
		const r = processLines('b\na\nb\nc\na', { dedupe: true });
		expect(r.output).toBe('b\na\nc');
		expect(r).toMatchObject({ inputLines: 5, outputLines: 3, removed: 2 });
	});
	it('case-insensitive dedupe keeps the first spelling', () => {
		const r = processLines('Apple\napple\nAPPLE', { dedupe: true, caseInsensitiveDedupe: true });
		expect(r.output).toBe('Apple');
	});
	it('sorts ascending, descending and naturally', () => {
		expect(processLines('b\nc\na', { sort: 'asc' }).output).toBe('a\nb\nc');
		expect(processLines('b\nc\na', { sort: 'desc' }).output).toBe('c\nb\na');
		expect(processLines('item10\nitem2\nitem1', { sort: 'natural' }).output).toBe('item1\nitem2\nitem10');
		expect(processLines('item10\nitem2', { sort: 'asc' }).output).toBe('item10\nitem2'); // plain sort is char-wise
	});
	it('sorts by length', () => {
		expect(processLines('ccc\na\nbb', { sort: 'length' }).output).toBe('a\nbb\nccc');
	});
	it('shuffle with injected randomness is deterministic', () => {
		const r1 = processLines('a\nb\nc', { sort: 'shuffle' }, fixedRand);
		const r2 = processLines('a\nb\nc', { sort: 'shuffle' }, fixedRand);
		expect(r1.output).toBe(r2.output);
		expect(r1.output.split('\n').sort()).toEqual(['a', 'b', 'c']);
	});
	it('trims then removes empties then dedupes, in that order', () => {
		const r = processLines('  a  \n\n b \na', { trim: true, removeEmpty: true, dedupe: true });
		expect(r.output).toBe('a\nb');
	});
	it('empty input reports zero lines', () => {
		const r = processLines('', {});
		expect(r).toMatchObject({ inputLines: 0, outputLines: 0, removed: 0 });
	});
});
