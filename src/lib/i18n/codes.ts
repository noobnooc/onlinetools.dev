/** Locale codes only — no runtime imports, safe for param matchers. */
export const EXTRA_LOCALES = ['zh', 'ja', 'ko', 'es', 'fr', 'de', 'pt', 'ru', 'it'] as const;
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
	it: 'it_IT'
};
