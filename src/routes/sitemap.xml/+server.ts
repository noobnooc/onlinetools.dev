import { TOOLS } from '$lib/tools/registry';
import { CHAIN_PRESETS } from '$lib/chain/presets';
import { LOCALES } from '$lib/i18n/codes';
import { SITE_UPDATED } from '$lib/version';

export const prerender = true;

const BASE = 'https://onlinetools.dev';

/** English lives at the root; other locales are prefixed. */
const loc = (path: string, lang: string) =>
	lang === 'en' ? `${BASE}${path}` : `${BASE}/${lang}${path === '/' ? '' : path}`;

export function GET(): Response {
	const pages = [
		'/',
		'/tools',
		'/changelog',
		'/chain',
		...CHAIN_PRESETS.map((p) => `/chain/${p.slug}`),
		...TOOLS.map((t) => `/t/${t.slug}`)
	];
	const urls = pages.flatMap((page) => {
		const alternates = [
			...LOCALES.map(
				(l) => `\t\t<xhtml:link rel="alternate" hreflang="${l}" href="${loc(page, l)}"/>`
			),
			`\t\t<xhtml:link rel="alternate" hreflang="x-default" href="${loc(page, 'en')}"/>`
		].join('\n');
		return LOCALES.map(
			(lang) =>
				`\t<url>\n\t\t<loc>${loc(page, lang)}</loc>\n\t\t<lastmod>${SITE_UPDATED}</lastmod>\n${alternates}\n\t</url>`
		);
	});
	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`;
	return new Response(body, {
		headers: { 'Content-Type': 'application/xml' }
	});
}
