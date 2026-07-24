import { error } from '@sveltejs/kit';
import { CHAIN_PRESETS, PRESET_BY_SLUG } from '$lib/chain/presets';
import { LOCALES } from '$lib/i18n/codes';
import type { EntryGenerator, PageLoad } from './$types';

/** Every preset recipe is prerendered in every locale (en has no prefix). */
export const entries: EntryGenerator = () =>
	LOCALES.flatMap((lang) =>
		CHAIN_PRESETS.map((p) => (lang === 'en' ? { recipe: p.slug } : { lang, recipe: p.slug }))
	);

export const load: PageLoad = ({ params }) => {
	const preset = PRESET_BY_SLUG.get(params.recipe);
	if (!preset) error(404, 'Recipe not found');
	return { preset };
};
