import { type ToolResult, ok, err } from './types';

/**
 * Unix file permissions: octal ↔ symbolic ↔ `ls -l`, plus chmod's symbolic
 * expressions (u+x, go-w, a=r, g=u) applied to a starting mode, and umask.
 *
 * A mode here is the 12 permission bits only (0–0o7777): setuid, setgid,
 * sticky, then rwx for user, group and other. The file type that `ls -l`
 * prints in front is carried separately.
 */

export const SETUID = 0o4000;
export const SETGID = 0o2000;
export const STICKY = 0o1000;

export type PermClass = 'u' | 'g' | 'o';
export const CLASSES: readonly PermClass[] = ['u', 'g', 'o'];
const SHIFT: Record<PermClass, number> = { u: 6, g: 3, o: 0 };

/** The bit for read/write/execute of one class, e.g. bit('g', 'w') = 0o020. */
export function bit(cls: PermClass, perm: 'r' | 'w' | 'x'): number {
	return (perm === 'r' ? 4 : perm === 'w' ? 2 : 1) << SHIFT[cls];
}

export type PermWarning = 'worldWritable' | 'setuid' | 'setgid' | 'specialNoExec' | 'ownerLess';

export interface PermInfo {
	mode: number;
	/** How the input was read. */
	source: 'octal' | 'ls' | 'symbolic' | 'umask';
	/** File-type character from an `ls -l` string (`-`, `d`, `l`…), if one was given. */
	fileType: string | null;
	/** Shortest octal: 3 digits, or 4 when a special bit is set. */
	octal: string;
	/** rwxr-xr-x, with s/S/t/T in the execute positions. */
	symbolic: string;
	/** chmod's absolute symbolic form, e.g. u=rwx,g=rx,o=rx. */
	chmodSymbolic: string;
	/** Set when the input was relative (u+x, go-w): the mode it was applied to. */
	base: number | null;
	/** For `umask 022`: the modes new files and directories get. */
	umask: { file: number; dir: number } | null;
	/** Files named after the mode in a pasted `chmod` command. */
	targets: string[];
	warnings: PermWarning[];
}

export interface ParseOptions {
	/** Mode a relative expression (u+x, -w) is applied to. Default 0o644. */
	base?: number;
	/** Whether the target is a directory — decides what `X` does. */
	directory?: boolean;
}

export function toOctal(mode: number): string {
	const s = (mode & 0o7777).toString(8);
	return mode & 0o7000 ? s.padStart(4, '0') : s.padStart(3, '0');
}

export function toSymbolic(mode: number): string {
	let out = '';
	for (const c of CLASSES) {
		const v = (mode >> SHIFT[c]) & 7;
		out += v & 4 ? 'r' : '-';
		out += v & 2 ? 'w' : '-';
		const x = (v & 1) !== 0;
		const special = c === 'u' ? mode & SETUID : c === 'g' ? mode & SETGID : mode & STICKY;
		const ch = c === 'o' ? 't' : 's';
		out += special ? (x ? ch : ch.toUpperCase()) : x ? 'x' : '-';
	}
	return out;
}

export function toChmodSymbolic(mode: number): string {
	return CLASSES.map((c) => {
		const v = (mode >> SHIFT[c]) & 7;
		let p = (v & 4 ? 'r' : '') + (v & 2 ? 'w' : '') + (v & 1 ? 'x' : '');
		if (c === 'u' && mode & SETUID) p += 's';
		if (c === 'g' && mode & SETGID) p += 's';
		if (c === 'o' && mode & STICKY) p += 't';
		return `${c}=${p}`;
	}).join(',');
}

export function warningsFor(mode: number): PermWarning[] {
	const w: PermWarning[] = [];
	if (mode & 0o002) w.push('worldWritable');
	if (mode & SETUID) w.push('setuid');
	if (mode & SETGID) w.push('setgid');
	if ((mode & SETUID && !(mode & 0o100)) || (mode & SETGID && !(mode & 0o010)) || (mode & STICKY && !(mode & 0o001)))
		w.push('specialNoExec');
	const u = (mode >> 6) & 7;
	const g = (mode >> 3) & 7;
	const o = mode & 7;
	// Owner lacks a bit that group or other has — legal, but almost always a typo (e.g. 477).
	if (((g | o) & ~u & 7) !== 0) w.push('ownerLess');
	return w;
}

const OCTAL_RE = /^(?:0o)?([0-7]{1,5})$/i;
const LS_RE = /^([-dlcbpsDn?])?([r-][w-][xsS-][r-][w-][xsS-][r-][w-][xtT-])([.@+])?$/;
const CLAUSE_RE = /^[ugoa]*(?:[-+=][rwxXstugo]*)+$/;

/** True for something that looks like a chmod symbolic expression. */
export function isSymbolicExpr(s: string): boolean {
	return s !== '' && s.split(',').every((c) => CLAUSE_RE.test(c));
}

function parseOctal(s: string): number | null {
	const m = OCTAL_RE.exec(s);
	if (!m) return null;
	const n = parseInt(m[1], 8);
	return n <= 0o7777 ? n : null;
}

/** Parse rwxr-xr-x (optionally with a type char and a trailing ACL/xattr marker). */
export function parseLs(s: string): { mode: number; fileType: string | null } | null {
	const m = LS_RE.exec(s);
	if (!m) return null;
	const p = m[2];
	let mode = 0;
	CLASSES.forEach((c, i) => {
		const [r, w, x] = p.slice(i * 3, i * 3 + 3);
		if (r === 'r') mode |= bit(c, 'r');
		if (w === 'w') mode |= bit(c, 'w');
		if (x === 'x' || x === 's' || x === 't') mode |= bit(c, 'x');
		if (x === 's' || x === 'S') mode |= c === 'u' ? SETUID : SETGID;
		if (x === 't' || x === 'T') mode |= STICKY;
	});
	return { mode, fileType: m[1] ?? null };
}

/**
 * Apply a chmod symbolic expression to `base`, following GNU chmod: clauses
 * are comma-separated and applied left to right; a clause without u/g/o/a
 * acts as `a` (real chmod would also mask with the umask); `X` adds execute
 * only for directories or when some execute bit is already set; `u=g`-style
 * copies take the source class's bits as they were before that operation.
 */
export function applySymbolic(expr: string, base: number, directory = false): ToolResult<number> {
	let mode = base & 0o7777;
	const clauses = expr.split(',');
	for (const clause of clauses) {
		if (!CLAUSE_RE.test(clause)) {
			return err(`"${clause || expr}" is not a valid chmod expression — try u+x, go-w or a=r`);
		}
		const whoPart = /^[ugoa]*/.exec(clause)![0];
		const explicit = whoPart !== '';
		const who = new Set<PermClass>(
			!explicit || whoPart.includes('a') ? CLASSES : ([...whoPart] as PermClass[])
		);
		const ops = clause.slice(whoPart.length).match(/[-+=][rwxXstugo]*/g) ?? [];
		for (const op of ops) {
			const kind = op[0];
			const perms = op.slice(1);
			if (/[ugo]/.test(perms) && /[rwxXst]/.test(perms)) {
				return err(`"${op}" mixes a class copy (u, g, o) with permission letters — use one or the other`);
			}
			let rwx = 0; // bits as a 0–7 triple, applied to every class in `who`
			let special = 0;
			if (/^[ugo]+$/.test(perms)) {
				for (const src of perms as Iterable<PermClass>) rwx |= (mode >> SHIFT[src]) & 7;
			} else {
				for (const p of perms) {
					if (p === 'r') rwx |= 4;
					else if (p === 'w') rwx |= 2;
					else if (p === 'x') rwx |= 1;
					else if (p === 'X') {
						if (directory || mode & 0o111) rwx |= 1;
					} else if (p === 's') {
						if (who.has('u')) special |= SETUID;
						if (who.has('g')) special |= SETGID;
					} else if (p === 't') {
						if (!explicit || who.has('o')) special |= STICKY;
					}
				}
			}
			let bits = special;
			for (const c of who) bits |= rwx << SHIFT[c];
			if (kind === '+') mode |= bits;
			else if (kind === '-') mode &= ~bits;
			else {
				let clear = 0;
				for (const c of who) clear |= 7 << SHIFT[c];
				// GNU keeps a directory's setuid/setgid unless they are named explicitly.
				if (!directory && who.has('u')) clear |= SETUID;
				if (!directory && who.has('g')) clear |= SETGID;
				if (who.has('o')) clear |= STICKY;
				mode = (mode & ~clear) | bits;
			}
		}
	}
	return ok(mode & 0o7777);
}

/** True if the expression's result depends on the starting mode. */
export function isRelativeExpr(expr: string): boolean {
	const covered = new Set<string>();
	for (const clause of expr.split(',')) {
		const whoPart = /^[ugoa]*/.exec(clause)![0];
		const rest = clause.slice(whoPart.length);
		if (/[-+]|[=][^,]*[ugoX]|=.*=/.test(rest)) return true;
		const who = whoPart === '' || whoPart.includes('a') ? 'ugo' : whoPart;
		for (const c of who) covered.add(c);
	}
	return covered.size < 3;
}

const CHMOD_FLAGS = /^(?:-[RvcfhHLP]+|--(?:recursive|verbose|changes|silent|quiet|preserve-root|no-preserve-root|dereference|no-dereference))$/;

function info(mode: number, source: PermInfo['source'], extra: Partial<PermInfo> = {}): PermInfo {
	return {
		mode,
		source,
		fileType: null,
		octal: toOctal(mode),
		symbolic: toSymbolic(mode),
		chmodSymbolic: toChmodSymbolic(mode),
		base: null,
		umask: null,
		targets: [],
		warnings: warningsFor(mode),
		...extra
	};
}

/**
 * Read a permission in any common form: 755, 0755, 4755, rwxr-xr-x,
 * -rwxr-xr-x (or a whole `ls -l` line), u=rwx,g=rx,o=rx, a relative
 * expression like g+w, `chmod -R 750 dir`, or `umask 027`.
 */
export function parsePermissions(input: string, opts: ParseOptions = {}): ToolResult<PermInfo> {
	const s = input.trim();
	if (s === '') return err('Enter a mode such as 755, rwxr-xr-x or u+x');
	const base = (opts.base ?? 0o644) & 0o7777;
	const directory = opts.directory ?? false;

	const umask = /^umask\s+(\S+)$/.exec(s);
	if (umask) {
		const m = parseOctal(umask[1]);
		if (m === null || m > 0o777) return err(`"${umask[1]}" is not an octal umask — try 022 or 077`);
		return ok(info(m, 'umask', { umask: { file: 0o666 & ~m, dir: 0o777 & ~m }, warnings: [] }));
	}

	let token = s;
	let targets: string[] = [];
	const tokens = s.split(/\s+/);
	if (tokens[0] === 'chmod' || (tokens[0] === 'sudo' && tokens[1] === 'chmod')) {
		const rest = tokens.slice(tokens[0] === 'sudo' ? 2 : 1);
		let i = 0;
		while (i < rest.length && CHMOD_FLAGS.test(rest[i]) && !isSymbolicExpr(rest[i])) i++;
		if (rest[i]?.startsWith('--reference')) {
			return err('--reference copies the mode of another file, which only your shell can read');
		}
		if (i >= rest.length) return err('The chmod command has no mode — e.g. chmod 755 script.sh');
		token = rest[i];
		targets = rest.slice(i + 1);
	} else if (tokens.length > 1) {
		// A whole `ls -l` line: the permission string is the first column.
		const ls = parseLs(tokens[0]);
		if (ls && ls.fileType !== null) return ok(info(ls.mode, 'ls', { fileType: ls.fileType }));
		return err('Enter one mode — 755, rwxr-xr-x or u+x — or paste a whole chmod command');
	}

	const octal = parseOctal(token);
	if (octal !== null) return ok(info(octal, 'octal', { targets }));
	if (OCTAL_RE.test(token.replace(/^0o/i, '')) || /^\d+$/.test(token)) {
		return /[89]/.test(token)
			? err(`"${token}" is not octal — each digit must be 0–7`)
			: err(`"${token}" is out of range — a mode is at most 7777`);
	}

	const ls = parseLs(token);
	if (ls) return ok(info(ls.mode, 'ls', { fileType: ls.fileType, targets }));

	if (isSymbolicExpr(token)) {
		const relative = isRelativeExpr(token);
		const r = applySymbolic(token, relative ? base : 0, directory);
		if (!r.ok) return r;
		return ok(info(r.value, 'symbolic', { base: relative ? base : null, targets }));
	}

	if (/^[-dlcbps]?[rwxsStT-]{1,12}$/.test(token)) {
		return err(`"${token}" is not a 9-character permission string like rwxr-xr-x`);
	}
	return err(`Couldn't read "${token}" — enter 755, rwxr-xr-x, u=rwx,g=rx,o=rx or u+x`);
}

/** Read a starting mode for relative expressions: octal or rwx form. */
export function parseBase(s: string): number | null {
	const t = s.trim();
	const o = parseOctal(t);
	if (o !== null) return o;
	return parseLs(t)?.mode ?? null;
}

/** Smart Paste: an `ls -l` permission column or a chmod command. */
export function isLikelyPermissions(input: string): boolean {
	const s = input.trim();
	if (s.includes('\n') || s.length > 200) return false;
	if (/^(?:sudo\s+)?chmod\s+/.test(s)) return parsePermissions(s).ok;
	const first = s.split(/\s+/)[0];
	const ls = parseLs(first);
	return ls !== null && ls.fileType !== null && first.length >= 10;
}
