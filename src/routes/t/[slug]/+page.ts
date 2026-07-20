import { error } from '@sveltejs/kit';
import { TOOLS, getTool } from '$lib/tools/registry';
import { TOOL_CONTENT } from '$lib/tools/content';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => TOOLS.map((t) => ({ slug: t.slug }));

export const load: PageLoad = ({ params }) => {
	const tool = getTool(params.slug);
	const content = TOOL_CONTENT[params.slug];
	if (!tool || !content) error(404, 'Tool not found');
	return { tool, content };
};
