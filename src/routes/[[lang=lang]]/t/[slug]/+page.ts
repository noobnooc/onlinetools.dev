import { error } from '@sveltejs/kit';
import { TOOLS, getTool } from '$lib/tools/registry';
import { LOCALES } from '$lib/i18n/codes';
import type { EntryGenerator, PageLoad } from './$types';

/** Every tool page is prerendered in every locale (en has no prefix). */
export const entries: EntryGenerator = () =>
	LOCALES.flatMap((lang) =>
		TOOLS.map((t) => (lang === 'en' ? { slug: t.slug } : { lang, slug: t.slug }))
	);

/**
 * The tool's metadata comes from the registry, which every page bundles
 * anyway, so it stays out of `__data.json`. About/FAQ comes from the server
 * load in +page.server.ts.
 */
export const load: PageLoad = ({ params, data }) => {
	const tool = getTool(params.slug);
	if (!tool) error(404, 'Tool not found');
	return { ...data, tool };
};
