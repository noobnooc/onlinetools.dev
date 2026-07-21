<script lang="ts">
	import { alternates, BASE, canonical, locale } from '$lib/i18n';

	/**
	 * Localized SEO head: canonical for the current locale, hreflang
	 * alternates for every locale (+ x-default → English), OG tags.
	 * `path` is always the locale-less (English) path of the page.
	 */
	interface Props {
		path: string;
		title: string;
		description: string;
	}

	let { path, title, description }: Props = $props();
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonical(path)} />
	{#each alternates(path) as alt (alt.hreflang)}
		<link rel="alternate" hreflang={alt.hreflang} href={alt.href} />
	{/each}
	<meta property="og:site_name" content="onlinetools.dev" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonical(path)} />
	<meta property="og:type" content="website" />
	<meta property="og:locale" content={locale()} />
	<meta property="og:image" content="{BASE}/og.png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content="onlinetools.dev — developer tools that run in your browser" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content="{BASE}/og.png" />
</svelte:head>
