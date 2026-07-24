<script lang="ts">
	import { browser } from '$app/environment';
	import { t, canonical, locale } from '$lib/i18n';
	import SeoHead from '$lib/components/SeoHead.svelte';
	import Eyebrow from '$lib/components/Eyebrow.svelte';

	/**
	 * Prerender-safe shell: the SEO head and header render server-side, while
	 * the interactive workbench (whose op registry imports browser-only tool
	 * libraries) is loaded client-side only — mirroring how tool pages defer
	 * their components.
	 */
	const jsonLd = $derived(
		JSON.stringify({
			'@context': 'https://schema.org',
			'@type': 'WebApplication',
			name: t('chainHeading') + ' — onlinetools.dev',
			description: t('chainMetaDescription'),
			url: canonical('/chain'),
			inLanguage: locale(),
			applicationCategory: 'DeveloperApplication',
			operatingSystem: 'Any',
			isAccessibleForFree: true,
			offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
		})
	);
</script>

<SeoHead path="/chain" title={t('chainTitle')} description={t('chainMetaDescription')} />

<svelte:head>
	{@html `<script type="application/ld+json">${jsonLd}</${'script'}>`}
</svelte:head>

<div class="mx-auto max-w-3xl px-6 py-8">
	<!-- Header (static, server-rendered) -->
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<div class="mb-2"><Eyebrow text={t('chainEyebrow')} /></div>
			<h1 class="text-xl font-semibold tracking-tight sm:text-2xl">{t('chainHeading')}</h1>
			<p class="mt-1 max-w-xl text-sm text-dim">{t('chainSub')}</p>
		</div>
		<span
			class="inline-flex items-center gap-1.5 rounded-md border border-line px-2 py-1 font-mono text-[11px] text-ok"
			title={t('runsLocallyTitle')}
		>
			<span class="inline-block h-1.5 w-1.5 rounded-full bg-ok"></span>
			{t('runsLocally')}
		</span>
	</div>

	{#if browser}
		{#await import('$lib/components/ChainWorkbench.svelte') then m}
			{@const Workbench = m.default}
			<Workbench />
		{/await}
	{/if}
</div>
