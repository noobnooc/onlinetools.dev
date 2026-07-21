import { describe, expect, it } from 'vitest';
import { formatSql, minifySql } from './sqlformat';

const OPTS = { dialect: 'sql', keywordCase: 'upper', indent: 2 } as const;

describe('formatSql', () => {
	it('formats a select with uppercase keywords', () => {
		const r = formatSql('select id, name from users where id = 1', OPTS);
		expect(r.ok).toBe(true);
		if (r.ok) {
			expect(r.value).toContain('SELECT');
			expect(r.value).toContain('FROM');
			expect(r.value.split('\n').length).toBeGreaterThan(1);
		}
	});
	it('respects lowercase keyword option', () => {
		const r = formatSql('SELECT 1', { ...OPTS, keywordCase: 'lower' });
		expect(r.ok && r.value.startsWith('select')).toBe(true);
	});
	it('supports dialects', () => {
		const r = formatSql('select top 5 * from t', { ...OPTS, dialect: 'tsql' });
		expect(r.ok).toBe(true);
	});
	it('errors on empty input', () => {
		expect(formatSql('  ', OPTS).ok).toBe(false);
	});
});

describe('minifySql', () => {
	it('collapses whitespace and strips comments', () => {
		const r = minifySql('SELECT  id , -- note\n  name\nFROM   users  /* block */ WHERE x = 1');
		expect(r).toEqual({ ok: true, value: 'SELECT id,name FROM users WHERE x = 1' });
	});
	it('leaves string literals untouched', () => {
		const r = minifySql("SELECT 'two  spaces' AS s,  'it''s' AS q FROM t");
		expect(r.ok).toBe(true);
		if (r.ok) {
			expect(r.value).toContain("'two  spaces'");
			expect(r.value).toContain("'it''s'");
		}
	});
});
