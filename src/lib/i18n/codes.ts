/** Locale codes only — no runtime imports, safe for param matchers. */
export const EXTRA_LOCALES = [
	'zh',
	'ja',
	'ko',
	'es',
	'fr',
	'de',
	'pt',
	'ru',
	'it',
	'tr',
	'pl',
	'vi',
	'id',
	'nl',
	'th',
	'uk',
	'hi'
] as const;
export const LOCALES = ['en', ...EXTRA_LOCALES] as const;
export type Locale = (typeof LOCALES)[number];

export function isExtraLocale(value: string): value is Exclude<Locale, 'en'> {
	return (EXTRA_LOCALES as readonly string[]).includes(value);
}

/** Open Graph requires territory-qualified locales (language_TERRITORY). */
export const OG_LOCALES: Record<Locale, string> = {
	en: 'en_US',
	zh: 'zh_CN',
	ja: 'ja_JP',
	ko: 'ko_KR',
	es: 'es_ES',
	fr: 'fr_FR',
	de: 'de_DE',
	pt: 'pt_BR',
	ru: 'ru_RU',
	it: 'it_IT',
	tr: 'tr_TR',
	pl: 'pl_PL',
	vi: 'vi_VN',
	id: 'id_ID',
	nl: 'nl_NL',
	th: 'th_TH',
	uk: 'uk_UA',
	hi: 'hi_IN'
};

/**
 * Endonyms for the language menus. Kept here rather than in the components so
 * a new locale is named once — the switchers iterate LOCALES and would render
 * `undefined` for anything missing.
 */
export const LOCALE_NAMES: Record<Locale, string> = {
	en: 'English',
	zh: '中文',
	ja: '日本語',
	ko: '한국어',
	es: 'Español',
	fr: 'Français',
	de: 'Deutsch',
	pt: 'Português',
	ru: 'Русский',
	it: 'Italiano',
	tr: 'Türkçe',
	pl: 'Polski',
	vi: 'Tiếng Việt',
	id: 'Bahasa Indonesia',
	nl: 'Nederlands',
	th: 'ไทย',
	uk: 'Українська',
	hi: 'हिन्दी'
};

/**
 * Sentence terminators per script. CJK uses a full-width stop with no space,
 * Hindi the danda, Thai separates sentences with a space alone.
 */
const SENTENCE_END: Partial<Record<Locale, { stop: string; gap: string }>> = {
	zh: { stop: '。', gap: '' },
	ja: { stop: '。', gap: '' },
	hi: { stop: '।', gap: ' ' },
	th: { stop: '', gap: ' ' }
};

/**
 * Join a sentence fragment (like a tool tagline, which carries no final
 * punctuation) to the sentence that follows, using the locale's own stop.
 */
export function joinSentences(first: string, next: string, loc: Locale): string {
	const { stop, gap } = SENTENCE_END[loc] ?? { stop: '.', gap: ' ' };
	const head = first.trimEnd();
	const ended = /[.!?。!?।]$/u.test(head);
	return `${head}${ended ? '' : stop}${gap}${next}`;
}
