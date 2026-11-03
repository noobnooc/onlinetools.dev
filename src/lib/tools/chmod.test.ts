import { describe, expect, it } from 'vitest';
import {
	applySymbolic,
	isLikelyPermissions,
	isRelativeExpr,
	parseBase,
	parsePermissions,
	toChmodSymbolic,
	toOctal,
	toSymbolic,
	warningsFor
} from './chmod';

function parse(input: string, opts = {}) {
	const r = parsePermissions(input, opts);
	if (!r.ok) throw new Error(r.error);
	return r.value;
}

describe('formatting', () => {
	it('renders the common modes', () => {
		expect(toSymbolic(0o755)).toBe('rwxr-xr-x');
		expect(toSymbolic(0o644)).toBe('rw-r--r--');
		expect(toSymbolic(0o600)).toBe('rw-------');
		expect(toSymbolic(0)).toBe('---------');
		expect(toOctal(0o755)).toBe('755');
		expect(toOctal(0o7)).toBe('007');
		expect(toChmodSymbolic(0o750)).toBe('u=rwx,g=rx,o=');
	});

	it('shows special bits with s/S/t/T', () => {
		expect(toSymbolic(0o4755)).toBe('rwsr-xr-x');
		expect(toSymbolic(0o4644)).toBe('rwSr--r--');
		expect(toSymbolic(0o2775)).toBe('rwxrwsr-x');
		expect(toSymbolic(0o1777)).toBe('rwxrwxrwt');
		expect(toSymbolic(0o1776)).toBe('rwxrwxrwT');
		expect(toOctal(0o1777)).toBe('1777');
		expect(toChmodSymbolic(0o6755)).toBe('u=rwxs,g=rxs,o=rx');
	});
});

describe('parsePermissions', () => {
	it('reads octal in its usual spellings', () => {
		for (const s of ['755', '0755', '0o755', ' 755 ']) expect(parse(s).mode).toBe(0o755);
		expect(parse('4755').mode).toBe(0o4755);
		expect(parse('04755').mode).toBe(0o4755);
		expect(parse('7').mode).toBe(0o7);
		expect(parse('0').octal).toBe('000');
	});

	it('rejects non-octal and out-of-range numbers with a reason', () => {
		const r = parsePermissions('789');
		expect(r.ok).toBe(false);
		if (!r.ok) expect(r.error).toMatch(/0–7/);
		const big = parsePermissions('17777');
		expect(big.ok).toBe(false);
		if (!big.ok) expect(big.error).toMatch(/7777/);
	});

	it('reads ls -l strings, with or without the type character', () => {
		expect(parse('rwxr-xr-x').mode).toBe(0o755);
		const d = parse('drwxr-x---');
		expect(d.mode).toBe(0o750);
		expect(d.fileType).toBe('d');
		expect(parse('-rw-r--r--@').mode).toBe(0o644);
		expect(parse('-rw-r--r--+').mode).toBe(0o644);
		expect(parse('drwxrwxrwt').mode).toBe(0o1777);
		expect(parse('-rwsr-xr-x').mode).toBe(0o4755);
		expect(parse('-rwSr--r--').mode).toBe(0o4644);
		expect(parse('-wxr-xr-x').mode).toBe(0o355);
	});

	it('takes the first column of a pasted ls -l line', () => {
		const p = parse('-rwxr-xr-x  1 root wheel  1234 Jan  1 12:00 deploy.sh');
		expect(p.mode).toBe(0o755);
		expect(p.source).toBe('ls');
	});

	it('reads absolute symbolic expressions without a base', () => {
		const p = parse('u=rwx,g=rx,o=rx');
		expect(p.mode).toBe(0o755);
		expect(p.base).toBeNull();
		expect(parse('a=r').mode).toBe(0o444);
		expect(parse('ug=rw,o=').mode).toBe(0o660);
	});

	it('applies relative expressions to the base (644 by default)', () => {
		const p = parse('+x');
		expect(p.mode).toBe(0o755);
		expect(p.base).toBe(0o644);
		expect(parse('go-r').mode).toBe(0o600);
		expect(parse('g+w', { base: 0o755 }).mode).toBe(0o775);
		expect(parse('u=rwx', { base: 0o644 }).mode).toBe(0o744);
	});

	it('strips a chmod command down to its mode and keeps the targets', () => {
		const p = parse('chmod -R 750 /srv/app');
		expect(p.mode).toBe(0o750);
		expect(p.targets).toEqual(['/srv/app']);
		expect(parse('sudo chmod u+x deploy.sh').mode).toBe(0o744);
		expect(parse('chmod -w file', { base: 0o664 }).mode).toBe(0o444);
		expect(parsePermissions('chmod --reference=a b').ok).toBe(false);
		expect(parsePermissions('chmod -R').ok).toBe(false);
	});

	it('reads umask and works out the resulting file and directory modes', () => {
		const p = parse('umask 022');
		expect(p.source).toBe('umask');
		expect(p.umask).toEqual({ file: 0o644, dir: 0o755 });
		expect(parse('umask 077').umask).toEqual({ file: 0o600, dir: 0o700 });
		expect(parsePermissions('umask 999').ok).toBe(false);
	});

	it('explains malformed input instead of guessing', () => {
		expect(parsePermissions('').ok).toBe(false);
		const short = parsePermissions('rwxr-x');
		expect(short.ok).toBe(false);
		if (!short.ok) expect(short.error).toMatch(/9-character/);
		expect(parsePermissions('u+q').ok).toBe(false);
		expect(parsePermissions('读写执行').ok).toBe(false);
		expect(parsePermissions('755 644').ok).toBe(false);
	});
});

describe('applySymbolic', () => {
	it('applies clauses left to right', () => {
		expect(applySymbolic('a=,u+rw,g+r', 0o777)).toEqual({ ok: true, value: 0o640 });
		expect(applySymbolic('u+x,u-x', 0o644)).toEqual({ ok: true, value: 0o644 });
	});

	it('handles X for files and directories', () => {
		expect(applySymbolic('a+X', 0o644)).toEqual({ ok: true, value: 0o644 });
		expect(applySymbolic('a+X', 0o644, true)).toEqual({ ok: true, value: 0o755 });
		expect(applySymbolic('a+X', 0o744)).toEqual({ ok: true, value: 0o755 });
	});

	it('copies one class to another', () => {
		expect(applySymbolic('g=u', 0o740)).toEqual({ ok: true, value: 0o770 });
		expect(applySymbolic('o=g', 0o750)).toEqual({ ok: true, value: 0o755 });
		expect(applySymbolic('g=ux', 0o700).ok).toBe(false);
	});

	it('sets and clears special bits', () => {
		expect(applySymbolic('u+s', 0o755)).toEqual({ ok: true, value: 0o4755 });
		expect(applySymbolic('g+s', 0o775)).toEqual({ ok: true, value: 0o2775 });
		expect(applySymbolic('+t', 0o777)).toEqual({ ok: true, value: 0o1777 });
		expect(applySymbolic('o+t', 0o777)).toEqual({ ok: true, value: 0o1777 });
		expect(applySymbolic('u+t', 0o777)).toEqual({ ok: true, value: 0o777 });
		expect(applySymbolic('u=rwx', 0o4755)).toEqual({ ok: true, value: 0o755 });
		// A directory keeps setgid through `=` unless it is named.
		expect(applySymbolic('g=rx', 0o2775, true)).toEqual({ ok: true, value: 0o2755 });
	});

	it('knows which expressions depend on the starting mode', () => {
		expect(isRelativeExpr('u=rwx,g=rx,o=rx')).toBe(false);
		expect(isRelativeExpr('a=r')).toBe(false);
		expect(isRelativeExpr('u=rwx')).toBe(true);
		expect(isRelativeExpr('+x')).toBe(true);
		expect(isRelativeExpr('a=u')).toBe(true);
		expect(isRelativeExpr('a=rX')).toBe(true);
	});
});

describe('warnings', () => {
	it('flags world-writable, setuid/setgid and odd owner bits', () => {
		expect(warningsFor(0o755)).toEqual([]);
		expect(warningsFor(0o777)).toContain('worldWritable');
		expect(warningsFor(0o4755)).toContain('setuid');
		expect(warningsFor(0o2755)).toContain('setgid');
		expect(warningsFor(0o4644)).toContain('specialNoExec');
		expect(warningsFor(0o477)).toContain('ownerLess');
		expect(warningsFor(0o700)).toEqual([]);
	});
});

describe('helpers', () => {
	it('parses a base in octal or rwx form', () => {
		expect(parseBase('664')).toBe(0o664);
		expect(parseBase('rw-rw-r--')).toBe(0o664);
		expect(parseBase('nope')).toBeNull();
	});

	it('detects ls -l columns and chmod commands for Smart Paste', () => {
		expect(isLikelyPermissions('-rwxr-xr-x')).toBe(true);
		expect(isLikelyPermissions('drwxr-xr-x  5 me staff 160 Oct  2 09:00 src')).toBe(true);
		expect(isLikelyPermissions('chmod 600 ~/.ssh/id_ed25519')).toBe(true);
		expect(isLikelyPermissions('755')).toBe(false);
		expect(isLikelyPermissions('rwxr-xr-x')).toBe(false);
		expect(isLikelyPermissions('chmod is a command')).toBe(false);
		expect(isLikelyPermissions('hello world')).toBe(false);
	});
});
