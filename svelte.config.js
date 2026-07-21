import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter(),
		prerender: {
			handleHttpError: 'fail',
			// Every page route sits behind the optional [[lang]] param, so
			// seed each locale root; the crawler follows localized links from
			// there (tool pages also declare explicit entries).
			entries: [
				'/',
				'/sitemap.xml',
				'/robots.txt',
				...['zh', 'ja', 'ko', 'es', 'fr', 'de', 'pt', 'ru', 'it'].map((l) => `/${l}`)
			]
		}
	}
};

export default config;
