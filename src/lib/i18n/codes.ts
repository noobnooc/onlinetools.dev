/** Locale codes only — no runtime imports, safe for param matchers. */
export const EXTRA_LOCALES = ['zh', 'ja', 'ko', 'es', 'fr', 'de', 'pt', 'ru', 'it'] as const;
export const LOCALES = ['en', ...EXTRA_LOCALES] as const;
export type Locale = (typeof LOCALES)[number];

export function isExtraLocale(value: string): value is Exclude<Locale, 'en'> {
	return (EXTRA_LOCALES as readonly string[]).includes(value);
}
