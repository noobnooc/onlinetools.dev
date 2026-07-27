import { TOOLS } from '$lib/tools/registry';
import { CHAIN_PRESETS } from '$lib/chain/presets';
import { LOCALES } from '$lib/i18n/codes';
import { SITE_UPDATED } from '$lib/version';

export const prerender = true;

const BASE = 'https://onlinetools.dev';

/** English lives at the root; other locales are prefixed. */
const loc = (path: string, lang: string) =>
	lang === 'en' ? `${BASE}${path}` : `${BASE}/${lang}${path === '/' ? '' : path}`;

const entry = (href: string, alternates = '') =>
	`\t<url>\n\t\t<loc>${href}</loc>\n\t\t<lastmod>${SITE_UPDATED}</lastmod>\n${alternates}\t</url>`;

export function GET(): Response {
	/** Pages that exist in every locale, each advertising the full hreflang set. */
	const pages = [
		'/',
		'/tools',
		'/about',
		'/changelog',
		'/chain',
		...TOOLS.map((t) => `/t/${t.slug}`)
	];
	const urls = pages.flatMap((page) => {
		const alternates =
			[
				...LOCALES.map(
					(l) => `\t\t<xhtml:link rel="alternate" hreflang="${l}" href="${loc(page, l)}"/>`
				),
				`\t\t<xhtml:link rel="alternate" hreflang="x-default" href="${loc(page, 'en')}"/>`
			].join('\n') + '\n';
		return LOCALES.map((lang) => entry(loc(page, lang), alternates));
	});

	// Chain presets carry English-only copy (see presets.ts), so only the English
	// URL is submitted — the localized prefixes would be duplicates, not
	// translations, and they canonicalize back to these.
	urls.push(...CHAIN_PRESETS.map((p) => entry(loc(`/chain/${p.slug}`, 'en'))));
	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`;
	return new Response(body, {
		headers: { 'Content-Type': 'application/xml' }
	});
}
