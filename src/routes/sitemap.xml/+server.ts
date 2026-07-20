import { TOOLS } from '$lib/tools/registry';

export const prerender = true;

const BASE = 'https://onlinetools.dev';

export function GET(): Response {
	const urls = ['/', '/tools', '/changelog', ...TOOLS.map((t) => `/t/${t.slug}`)];
	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `\t<url><loc>${BASE}${u}</loc></url>`).join('\n')}
</urlset>
`;
	return new Response(body, {
		headers: { 'Content-Type': 'application/xml' }
	});
}
