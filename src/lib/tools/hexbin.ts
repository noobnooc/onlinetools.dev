import { type ToolResult, ok, err } from './types';

export type ByteFormat = 'hex' | 'binary' | 'decimal';

export interface EncodeOptions {
	format: ByteFormat;
	/** Separator between bytes: '' | ' ' | ':' | ', '. */
	separator: string;
	uppercase: boolean;
	/** Prefix each byte with 0x (hex only). */
	prefix: boolean;
}

export function textToBytes(text: string): Uint8Array {
	return new TextEncoder().encode(text);
}

/** Encode UTF-8 bytes of `text` as hex / binary / decimal byte strings. */
export function encodeBytes(text: string, opts: EncodeOptions): ToolResult {
	if (text === '') return err('Input is empty');
	const bytes = textToBytes(text);
	const parts: string[] = [];
	for (const b of bytes) {
		let s: string;
		switch (opts.format) {
			case 'hex':
				s = b.toString(16).padStart(2, '0');
				if (opts.uppercase) s = s.toUpperCase();
				if (opts.prefix) s = '0x' + s;
				break;
			case 'binary':
				s = b.toString(2).padStart(8, '0');
				break;
			case 'decimal':
				s = String(b);
				break;
		}
		parts.push(s);
	}
	// Unseparated decimal bytes cannot be decoded back; force a space.
	const sep = opts.format === 'decimal' && opts.separator === '' ? ' ' : opts.separator;
	return ok(parts.join(sep));
}

/**
 * Decode hex / binary / decimal byte notation back to text. Forgiving:
 * strips 0x/0b prefixes, whitespace, colons, commas and \x escapes.
 */
export function decodeBytes(input: string, format: ByteFormat): ToolResult {
	const cleaned = input
		.trim()
		.replace(/\\x/gi, ' ')
		.replace(/0[xb]/gi, ' ')
		.replace(/[,:;]/g, ' ');
	if (cleaned.trim() === '') return err('Input is empty');

	let bytes: number[];
	if (format === 'decimal' || /[\s]/.test(cleaned.trim())) {
		// Tokenized path: whitespace-separated groups.
		const tokens = cleaned.trim().split(/\s+/);
		bytes = [];
		for (const t of tokens) {
			const radix = format === 'hex' ? 16 : format === 'binary' ? 2 : 10;
			if (format === 'hex' && !/^[0-9a-f]+$/i.test(t)) return err(`"${t}" is not valid hex`);
			if (format === 'binary' && !/^[01]+$/.test(t)) return err(`"${t}" is not valid binary`);
			if (format === 'decimal' && !/^\d+$/.test(t)) return err(`"${t}" is not a decimal byte`);
			if (format === 'hex' && t.length > 2 && t.length % 2 === 0) {
				// A run like "48656c6c6f" inside spaced input.
				for (let i = 0; i < t.length; i += 2) bytes.push(parseInt(t.slice(i, i + 2), 16));
				continue;
			}
			if (format === 'binary' && t.length > 8 && t.length % 8 === 0) {
				for (let i = 0; i < t.length; i += 8) bytes.push(parseInt(t.slice(i, i + 8), 2));
				continue;
			}
			const v = parseInt(t, radix);
			if (Number.isNaN(v) || v > 255) return err(`"${t}" is out of byte range (0–255)`);
			bytes.push(v);
		}
	} else {
		// One continuous run.
		const s = cleaned.replace(/\s+/g, '');
		const unit = format === 'hex' ? 2 : 8;
		const re = format === 'hex' ? /^[0-9a-f]+$/i : /^[01]+$/;
		if (!re.test(s)) return err(`Input contains characters that are not valid ${format}`);
		if (s.length % unit !== 0) {
			return err(`Length ${s.length} is not a multiple of ${unit} — a byte is ${unit} ${format} digits`);
		}
		bytes = [];
		for (let i = 0; i < s.length; i += unit) {
			bytes.push(parseInt(s.slice(i, i + unit), format === 'hex' ? 16 : 2));
		}
	}

	try {
		return ok(new TextDecoder('utf-8', { fatal: true }).decode(new Uint8Array(bytes)));
	} catch {
		return err('Decoded bytes are not valid UTF-8 text — the data may be binary');
	}
}

/** True for strings that look like a hex byte dump (≥ 8 bytes). */
export function isLikelyHexDump(input: string): boolean {
	const s = input.trim();
	if (/^(0x)?[0-9a-fA-F]{16,}$/.test(s.replace(/\s+/g, '')) && s.replace(/^0x/, '').replace(/\s+/g, '').length % 2 === 0) {
		// Avoid stealing plain decimal numbers and UUID-less hashes handled elsewhere.
		return /[a-fA-F]/.test(s) && !/^[0-9a-fA-F]{32}$|^[0-9a-fA-F]{40}$|^[0-9a-fA-F]{64}$/.test(s.replace(/\s+/g, ''));
	}
	return /^([0-9a-fA-F]{2}[\s:]+){7,}[0-9a-fA-F]{2}$/.test(s);
}
