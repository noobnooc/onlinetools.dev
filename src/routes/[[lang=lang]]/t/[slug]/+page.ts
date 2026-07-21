import { error } from '@sveltejs/kit';
import { TOOLS, getTool } from '$lib/tools/registry';
import { TOOL_CONTENT } from '$lib/tools/content';
import { LOCALES } from '$lib/i18n/codes';
import type { EntryGenerator, PageLoad } from './$types';

/** Every tool page is prerendered in every locale (en has no prefix). */
export const entries: EntryGenerator = () =>
	LOCALES.flatMap((lang) =>
		TOOLS.map((t) => (lang === 'en' ? { slug: t.slug } : { lang, slug: t.slug }))
	);

export const load: PageLoad = ({ params }) => {
	const tool = getTool(params.slug);
	const content = TOOL_CONTENT[params.slug];
	if (!tool || !content) error(404, 'Tool not found');
	return { tool, content };
};
