import { error } from '@sveltejs/kit';
import { TOOLS, getTool } from '$lib/tools/registry';
import { TOOL_CONTENT, type ToolContent } from '$lib/tools/content';
import { LOCALES } from '$lib/i18n/codes';
import type { EntryGenerator, PageLoad } from './$types';

/** Every tool page is prerendered in every locale (en has no prefix). */
export const entries: EntryGenerator = () =>
	LOCALES.flatMap((lang) =>
		TOOLS.map((t) => (lang === 'en' ? { slug: t.slug } : { lang, slug: t.slug }))
	);

/**
 * Long-form About/FAQ content per locale. Locales without a file fall back
 * to English (the shell marks the section lang="en" in that case). Loaded
 * dynamically so a locale's content is only fetched on its own pages.
 */
const CONTENT_L10N: Record<string, () => Promise<{ default: Record<string, ToolContent> }>> = {
	zh: () => import('$lib/tools/content.zh')
};

export const load: PageLoad = async ({ params }) => {
	const tool = getTool(params.slug);
	const fallback = TOOL_CONTENT[params.slug];
	if (!tool || !fallback) error(404, 'Tool not found');

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
	return { tool, content, contentLocale };
};
