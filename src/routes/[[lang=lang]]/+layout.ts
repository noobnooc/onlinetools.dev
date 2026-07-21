import type { LayoutLoad } from './$types';
import { loadMessages, type Locale } from '$lib/i18n';

/**
 * Resolves the locale from the URL prefix (absent prefix = English) and
 * ships the message catalog on page.data. Universal load: the catalog is
 * code-split per locale and never serialized into the HTML payload.
 */
export const load: LayoutLoad = async ({ params }) => {
	const locale = (params.lang ?? 'en') as Locale;
	return { locale, messages: await loadMessages(locale) };
};
