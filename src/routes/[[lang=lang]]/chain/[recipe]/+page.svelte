<script lang="ts">
	import { browser } from '$app/environment';
	import { t, lp, canonical, locale } from '$lib/i18n';
	import SeoHead from '$lib/components/SeoHead.svelte';
	import Eyebrow from '$lib/components/Eyebrow.svelte';
	import { opLabel } from '$lib/chain/op-meta';
	import { CHAIN_PRESETS } from '$lib/chain/presets';
	import { ChevronRight, ArrowRight } from 'lucide-svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const preset = $derived(data.preset);
	const path = $derived(`/chain/${preset.slug}`);
	const title = $derived(`${preset.heading} — free & private | onlinetools.dev`);
	const others = $derived(CHAIN_PRESETS.filter((p) => p.slug !== preset.slug));

	const jsonLd = $derived(
		JSON.stringify([
			{
				'@context': 'https://schema.org',
				'@type': 'WebApplication',
				name: preset.heading,
				description: preset.description,
				url: canonical(path),
				inLanguage: locale(),
				applicationCategory: 'DeveloperApplication',
				operatingSystem: 'Any',
				isAccessibleForFree: true,
				offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
			},
			{
				'@context': 'https://schema.org',
				'@type': 'BreadcrumbList',
				itemListElement: [
					{ '@type': 'ListItem', position: 1, name: 'onlinetools.dev', item: canonical('/') },
					{ '@type': 'ListItem', position: 2, name: t('chainHeading'), item: canonical('/chain') },
					{ '@type': 'ListItem', position: 3, name: preset.heading, item: canonical(path) }
				]
			}
		])
	);
</script>

<!-- Preset copy (heading/description/intro) is English-only; see presets.ts. -->
<SeoHead {path} {title} description={preset.description} untranslated />

<svelte:head>
	{@html `<script type="application/ld+json">${jsonLd}</${'script'}>`}
</svelte:head>

<div class="mx-auto max-w-3xl px-6 py-8">
	<!-- Breadcrumb -->
	<nav class="mb-4 flex items-center gap-1 font-mono text-[11px] text-dim" aria-label="Breadcrumb">
		<a href={lp('/chain')} class="transition-colors duration-120 hover:text-accent"
			>{t('chainHeading')}</a
		>
		<ChevronRight size={12} class="text-dim/50" />
		<span class="truncate text-fg">{preset.title}</span>
	</nav>

	<!-- Header (static, server-rendered for SEO) -->
	<div class="mb-4 flex flex-wrap items-start justify-between gap-4">
		<div>
			<div class="mb-2"><Eyebrow text={t('chainEyebrow')} /></div>
			<h1 class="text-xl font-semibold tracking-tight sm:text-2xl">{preset.heading}</h1>
		</div>
		<span
			class="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-line px-2 py-1 font-mono text-[11px] text-ok"
			title={t('runsLocallyTitle')}
		>
			<span class="inline-block h-1.5 w-1.5 rounded-full bg-ok"></span>
			{t('runsLocally')}
		</span>
	</div>
	<p class="mb-5 max-w-2xl text-sm leading-6 text-dim">{preset.intro}</p>

	<!-- Static recipe description (crawlable) -->
	<div class="mb-6 flex flex-wrap items-center gap-x-2 gap-y-1.5 font-mono text-[11px]">
		<span class="text-dim/70">{t('chainSteps')}:</span>
		{#each preset.recipe.steps as step, i (i)}
			{#if i > 0}<ChevronRight size={11} class="text-dim/40" />{/if}
			<span class="rounded-md border border-line bg-surface px-1.5 py-0.5 text-dim">
				{opLabel(step.op)}{#if step.arg}<span class="text-accent"> {step.arg}</span>{/if}
			</span>
		{/each}
	</div>

	<!-- Interactive workbench, prefilled; client-side only -->
	{#if browser}
		{#await import('$lib/components/ChainWorkbench.svelte') then m}
			{@const Workbench = m.default}
			<Workbench initial={preset.recipe} />
		{/await}
	{/if}

	<!-- More recipes: internal links between preset pages -->
	<section class="mt-12" aria-labelledby="more-recipes">
		<div class="mb-3 flex items-center gap-3">
			<Eyebrow id="more-recipes" text={t('chainMoreRecipes')} />
			<span class="h-px grow bg-line" aria-hidden="true"></span>
		</div>
		<ul class="grid grid-cols-1 gap-2 sm:grid-cols-2">
			{#each others as p (p.slug)}
				<li>
					<a
						href={lp(`/chain/${p.slug}`)}
						class="group flex items-center justify-between gap-2 rounded-md border border-line bg-surface px-3 py-2 text-sm text-dim transition-colors duration-120 hover:border-accent/50 hover:text-fg"
					>
						<span class="truncate">{p.title}</span>
						<ArrowRight
							size={13}
							class="shrink-0 text-dim/50 transition-colors duration-120 group-hover:text-accent"
						/>
					</a>
				</li>
			{/each}
		</ul>
	</section>
</div>
