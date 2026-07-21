import { type ToolResult, ok, err } from './types';
import bcrypt from 'bcryptjs';

export interface BcryptHashResult {
	hash: string;
	rounds: number;
	ms: number;
}

export async function bcryptHash(password: string, rounds: number): Promise<ToolResult<BcryptHashResult>> {
	if (password === '') return err('Password is empty');
	if (rounds < 4 || rounds > 15) return err('Cost factor must be between 4 and 15 (browser-side)');
	const start = performance.now();
	try {
		const hash = await bcrypt.hash(password, rounds);
		return ok({ hash, rounds, ms: Math.round(performance.now() - start) });
	} catch (e) {
		return err(e instanceof Error ? e.message : 'Hashing failed');
	}
}

export async function bcryptVerify(password: string, hash: string): Promise<ToolResult<boolean>> {
	if (password === '' || hash.trim() === '') return err('Both password and hash are required');
	const h = hash.trim();
	if (!/^\$2[abxy]?\$\d{2}\$[./A-Za-z0-9]{53}$/.test(h)) {
		return err('Not a valid bcrypt hash (expected $2b$rounds$salt+digest, 60 chars)');
	}
	try {
		return ok(await bcrypt.compare(password, h));
	} catch (e) {
		return err(e instanceof Error ? e.message : 'Verification failed');
	}
}

export function bcryptInfo(hash: string): ToolResult<{ version: string; rounds: number; salt: string }> {
	const m = hash.trim().match(/^\$(2[abxy]?)\$(\d{2})\$([./A-Za-z0-9]{22})([./A-Za-z0-9]{31})$/);
	if (!m) return err('Not a valid bcrypt hash');
	return ok({ version: m[1], rounds: Number(m[2]), salt: m[3] });
}
