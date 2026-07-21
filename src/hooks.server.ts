import type { Handle } from '@sveltejs/kit';

/**
 * Canonical-host redirect (www → apex, permanent) and stamping the real
 * locale onto <html lang> before the page is sent (and at prerender time).
 * app.html carries lang="en"; localized pages replace it.
 */
export const handle: Handle = ({ event, resolve }) => {
	const url = event.url;
	if (url.hostname === 'www.onlinetools.dev') {
		return new Response(null, {
			status: 301,
			headers: { location: `https://onlinetools.dev${url.pathname}${url.search}` }
		});
	}
	return resolve(event, {
		transformPageChunk: ({ html }) => {
			const lang = event.params?.lang;
			return lang ? html.replace('<html lang="en"', `<html lang="${lang}"`) : html;
		}
	});
};
