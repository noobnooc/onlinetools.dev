export const prerender = true;

export function GET(): Response {
	return new Response(
		`User-agent: *
Allow: /

Sitemap: https://onlinetools.dev/sitemap.xml
`,
		{ headers: { 'Content-Type': 'text/plain' } }
	);
}
