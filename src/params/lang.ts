import type { ParamMatcher } from '@sveltejs/kit';
import { isExtraLocale } from '$lib/i18n/codes';

/**
 * Matches only the non-English locale prefixes. English lives at the URL
 * root, so /en/* intentionally 404s (no duplicate content), and ordinary
 * first segments like /tools or /t never get captured as a language.
 */
export const match: ParamMatcher = (param) => isExtraLocale(param);
