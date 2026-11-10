import { error } from '@sveltejs/kit';
import { TOOL_CONTENT, type ToolContent } from '$lib/tools/content';
import type { PageServerLoad } from './$types';

/**
 * Long-form About/FAQ content per locale. Locales without a file fall back
 * to English (the shell marks the section lang="en" in that case). Loaded
 * dynamically so a locale's content is only fetched on its own pages.
 *
 * This is a server load on purpose: pages are prerendered, so the content is
 * in the HTML and each page's own `__data.json`. A universal load would ship
 * the About/FAQ of every tool (~110 KB of English alone) to every tool page.
 */
const CONTENT_L10N: Record<string, () => Promise<{ default: Record<string, ToolContent> }>> = {
	zh: () => import('$lib/tools/content.zh'),
	ja: () => import('$lib/tools/content.ja'),
	ko: () => import('$lib/tools/content.ko'),
	es: () => import('$lib/tools/content.es'),
	fr: () => import('$lib/tools/content.fr'),
	de: () => import('$lib/tools/content.de'),
	pt: () => import('$lib/tools/content.pt'),
	ru: () => import('$lib/tools/content.ru'),
	it: () => import('$lib/tools/content.it'),
	tr: () => import('$lib/tools/content.tr'),
	pl: () => import('$lib/tools/content.pl'),
	vi: () => import('$lib/tools/content.vi'),
	id: () => import('$lib/tools/content.id'),
	nl: () => import('$lib/tools/content.nl'),
	th: () => import('$lib/tools/content.th'),
	uk: () => import('$lib/tools/content.uk'),
	hi: () => import('$lib/tools/content.hi')
};

export const load: PageServerLoad = async ({ params }) => {
	const fallback = TOOL_CONTENT[params.slug];
	if (!fallback) error(404, 'Tool not found');

	const lang = params.lang ?? 'en';
	let content = fallback;
	let contentLocale = 'en';
	const loader = CONTENT_L10N[lang];
	if (loader) {
		const localized = (await loader()).default[params.slug];
		if (localized) {
			content = localized;
			contentLocale = lang;
		}
	}
	return { content, contentLocale };
};
