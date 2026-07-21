import { type ToolResult, ok, err } from './types';
import { js_beautify, css_beautify, html_beautify } from 'js-beautify';

export type CodeLang = 'html' | 'css' | 'js';

export function beautifyCode(lang: CodeLang, input: string, indent = 2): ToolResult {
	if (input.trim() === '') return err('Input is empty');
	try {
		switch (lang) {
			case 'js':
				return ok(js_beautify(input, { indent_size: indent, preserve_newlines: true, max_preserve_newlines: 2 }));
			case 'css':
				return ok(css_beautify(input, { indent_size: indent }));
			case 'html':
				return ok(
					html_beautify(input, {
						indent_size: indent,
						wrap_line_length: 0,
						preserve_newlines: true,
						max_preserve_newlines: 1
					})
				);
		}
	} catch (e) {
		return err(e instanceof Error ? e.message.split('\n')[0] : 'Could not format this code');
	}
}

/**
 * Conservative CSS minifier: strips comments and collapses whitespace while
 * leaving strings and url(...) untouched.
 */
export function minifyCss(input: string): ToolResult {
	if (input.trim() === '') return err('Input is empty');
	let out = '';
	let i = 0;
	const n = input.length;
	while (i < n) {
		const ch = input[i];
		if (ch === '/' && input[i + 1] === '*') {
			const end = input.indexOf('*/', i + 2);
			i = end === -1 ? n : end + 2;
			continue;
		}
		if (ch === '"' || ch === "'") {
			let j = i + 1;
			while (j < n && input[j] !== ch) {
				if (input[j] === '\\') j++;
				j++;
			}
			out += input.slice(i, Math.min(j + 1, n));
			i = j + 1;
			continue;
		}
		if (/\s/.test(ch)) {
			let j = i;
			while (j < n && /\s/.test(input[j])) j++;
			const prev = out[out.length - 1] ?? '';
			const next = input[j] ?? '';
			// Whitespace is significant only between identifier-ish characters.
			if (prev !== '' && next !== '' && !/[{};:,>~+(]/.test(prev) && !/[{};:,>~+)]/.test(next)) {
				out += ' ';
			}
			i = j;
			continue;
		}
		out += ch;
		i++;
	}
	// Drop last semicolons before closing braces.
	return ok(out.replace(/;}/g, '}').trim());
}

/**
 * Conservative HTML minifier: removes comments (not conditional ones) and
 * collapses inter-tag whitespace, leaving pre/textarea/script/style intact.
 */
export function minifyHtml(input: string): ToolResult {
	if (input.trim() === '') return err('Input is empty');
	const protectedBlocks: string[] = [];
	let s = input.replace(/<(pre|textarea|script|style)\b[\s\S]*?<\/\1>/gi, (m) => {
		protectedBlocks.push(m);
		return `\u0000${protectedBlocks.length - 1}\u0000`;
	});
	s = s.replace(/<!--(?!\[if)[\s\S]*?-->/g, '');
	s = s.replace(/>\s+</g, '> <');
	s = s.replace(/\s{2,}/g, ' ');
	// Whitespace-only gaps between structural tags can go entirely.
	s = s.replace(/>\s</g, '><');
	s = s.trim();
	s = s.replace(/\u0000(\d+)\u0000/g, (_, idx) => protectedBlocks[Number(idx)]);
	return ok(s);
}

/** JS minification via terser — loaded lazily so the tool page stays light until used. */
export async function minifyJs(input: string): Promise<ToolResult> {
	if (input.trim() === '') return err('Input is empty');
	try {
		const { minify } = await import('terser');
		const res = await minify(input, {
			compress: true,
			mangle: true,
			format: { comments: false }
		});
		if (res.code === undefined) return err('Terser produced no output');
		return ok(res.code);
	} catch (e) {
		const msg = e instanceof Error ? e.message.split('\n')[0] : 'Could not minify this JavaScript';
		return err(msg);
	}
}
