<script lang="ts">
	import { alternates, BASE, canonical, locale } from '$lib/i18n';
	import { LOCALES, OG_LOCALES } from '$lib/i18n/codes';

	/**
	 * Localized SEO head: canonical for the current locale, hreflang
	 * alternates for every locale (+ x-default → English), OG tags.
	 * `path` is always the locale-less (English) path of the page.
	 *
	 * `untranslated` marks a page whose main content is still English under a
	 * non-English prefix. Google treats that as a duplicate rather than a
	 * localized version, so those URLs point their canonical at the English
	 * original and drop out of the hreflang set instead of competing with it.
	 */
	interface Props {
		path: string;
		title: string;
		description: string;
		untranslated?: boolean;
	}

	let { path, title, description, untranslated = false }: Props = $props();

	const isDuplicate = $derived(untranslated && locale() !== 'en');
	const canonicalHref = $derived(isDuplicate ? BASE + path : canonical(path));

	const ogImageAlt = 'onlinetools.dev — developer tools that run in your browser';
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonicalHref} />
	{#if isDuplicate}
		<meta name="robots" content="noindex,follow" />
	{:else}
		{#each alternates(path) as alt (alt.hreflang)}
			<link rel="alternate" hreflang={alt.hreflang} href={alt.href} />
		{/each}
	{/if}
	<meta property="og:site_name" content="onlinetools.dev" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonicalHref} />
	<meta property="og:type" content="website" />
	<meta property="og:locale" content={OG_LOCALES[locale()]} />
	{#each LOCALES.filter((l) => l !== locale()) as l (l)}
		<meta property="og:locale:alternate" content={OG_LOCALES[l]} />
	{/each}
	<meta property="og:image" content="{BASE}/og.png" />
	<meta property="og:image:type" content="image/png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content={ogImageAlt} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content="{BASE}/og.png" />
	<meta name="twitter:image:alt" content={ogImageAlt} />
</svelte:head>
