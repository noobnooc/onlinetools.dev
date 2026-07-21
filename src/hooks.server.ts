import type { Handle } from '@sveltejs/kit';

/**
 * Stamp the real locale onto <html lang> before the page is sent (and at
 * prerender time). app.html carries lang="en"; localized pages replace it.
 */
export const handle: Handle = ({ event, resolve }) =>
	resolve(event, {
		transformPageChunk: ({ html }) => {
			const lang = event.params?.lang;
			return lang ? html.replace('<html lang="en"', `<html lang="${lang}"`) : html;
		}
	});
