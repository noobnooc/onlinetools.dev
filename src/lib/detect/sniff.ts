// Cheap format sniffers for Smart Paste. Detectors run on every page, so this
// module must not import a tool's heavy dependencies (yaml, marked, turndown,
// the full fast-xml-parser): those belong to the tool pages that use them.
// fast-xml-parser is side-effect free, so importing only its validator keeps
// the parser and builder out of the shared bundle.
import { XMLValidator } from 'fast-xml-parser';

/** Detector for Smart Paste: does this look like an XML document? */
export function isLikelyXml(input: string): boolean {
	const s = input.trim();
	if (!s.startsWith('<') || !s.endsWith('>')) return false;
	if (/^<!doctype\s+html/i.test(s) || /^<html[\s>]/i.test(s)) return false;
	if (!/^<\?xml|^<[A-Za-z_][\w.-]*[\s>/]/.test(s)) return false;
	return XMLValidator.validate(s, { allowBooleanAttributes: true }) === true;
}

/** Detector for Smart Paste: markdown-looking text (headings, fences, links, lists). */
export function isLikelyMarkdown(input: string): boolean {
	const s = input.trim();
	if (s.length < 40) return false;
	if (s.startsWith('<') || /^[[{"]/.test(s)) return false;
	let signals = 0;
	if (/^#{1,6}\s+\S/m.test(s)) signals++;
	if (/^```/m.test(s)) signals++;
	if (/\[[^\]]+\]\([^)]+\)/.test(s)) signals++;
	if (/^(\s*[-*+]\s+\S.*\n){2,}/m.test(s)) signals++;
	if (/^>\s+\S/m.test(s)) signals++;
	if (/\*\*[^*\n]+\*\*/.test(s)) signals++;
	return signals >= 2;
}
