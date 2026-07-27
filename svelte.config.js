import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter(),
		// A share link (`#s=…`) carries attacker-controlled content that some
		// tools render, so the pages themselves are locked down: no third-party
		// anything, and `form-action: none` means a hostile shared payload has
		// nowhere to POST to. Hash mode fingerprints the inline theme/hydration
		// scripts so `unsafe-inline` is never needed for script-src.
		// `frame-ancestors` is header-only and lives in `_headers` at the repo
		// root, where adapter-cloudflare expects it.
		csp: {
			mode: 'hash',
			directives: {
				'default-src': ['self'],
				'script-src': ['self'],
				'style-src': ['self', 'unsafe-inline'],
				'style-src-attr': ['unsafe-inline'],
				'img-src': ['self', 'data:', 'blob:'],
				'font-src': ['self'],
				'connect-src': ['self'],
				'worker-src': ['self'],
				'manifest-src': ['self'],
				'form-action': ['none'],
				'frame-src': ['none'],
				'object-src': ['none'],
				'base-uri': ['self']
			}
		},
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
