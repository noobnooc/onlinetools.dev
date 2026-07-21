<script lang="ts">
	import { TOOLS, TOOL_BY_SLUG, type ToolCategory, type ToolMeta } from '$lib/tools/registry';
	import { favorites } from '$lib/state/favorites.svelte';
	import { t, lt, ltCategory, lp, locale, canonical } from '$lib/i18n';
	import ToolCard from '$lib/components/ToolCard.svelte';
	import Eyebrow from '$lib/components/Eyebrow.svelte';
	import SeoHead from '$lib/components/SeoHead.svelte';

	const categories = [...new Set(TOOLS.map((t) => t.category))] as ToolCategory[];

	const favoriteTools = $derived(
		favorites.slugs
			.map((s) => TOOL_BY_SLUG.get(s))
			.filter((t): t is ToolMeta => t !== undefined)
	);

	const jsonLd = $derived(
		JSON.stringify({
			'@context': 'https://schema.org',
			'@type': 'CollectionPage',
			name: t('toolsTitle'),
			description: t('toolsMetaDescription'),
			url: canonical('/tools'),
			inLanguage: locale(),
			mainEntity: {
				'@type': 'ItemList',
				numberOfItems: TOOLS.length,
				itemListElement: TOOLS.map((tool, i) => ({
					'@type': 'ListItem',
					position: i + 1,
					name: lt(tool).name,
					url: canonical(`/t/${tool.slug}`)
				}))
			}
		})
	);
</script>

<SeoHead path="/tools" title={t('toolsTitle')} description={t('toolsMetaDescription')} />

<svelte:head>
	{@html `<script type="application/ld+json">${jsonLd}</${'script'}>`}
</svelte:head>

<div class="mx-auto max-w-5xl px-6 py-8">
	<h1 class="mb-1 text-xl font-semibold tracking-tight">{t('allTools')}</h1>
	<p class="mb-8 text-sm text-dim">
		{t('toolsBlurb', { n: TOOLS.length })}
		<a href={lp('/changelog')} class="text-accent hover:underline">{t('changelog').toLowerCase()}</a>.
	</p>
	{#if favoriteTools.length > 0}
		<section class="mb-9" aria-labelledby="favorites-heading">
			<div class="mb-3 flex items-center gap-3">
				<Eyebrow id="favorites-heading" text="{t('favorites')} · {favoriteTools.length}" />
				<span class="h-px grow bg-line" aria-hidden="true"></span>
			</div>
			<div class="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
				{#each favoriteTools as tool (tool.slug)}
					<ToolCard {tool} />
				{/each}
			</div>
		</section>
	{/if}
	{#each categories as cat (cat)}
		{@const tools = TOOLS.filter((t) => t.category === cat)}
		<section class="mb-9" aria-labelledby="cat-{cat}">
			<div class="mb-3 flex items-center gap-3">
				<Eyebrow id="cat-{cat}" text="{ltCategory(cat)} · {tools.length}" />
				<span class="h-px grow bg-line" aria-hidden="true"></span>
			</div>
			<div class="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
				{#each tools as tool (tool.slug)}
					<ToolCard {tool} />
				{/each}
			</div>
		</section>
	{/each}
</div>
