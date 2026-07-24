<script lang="ts">
	import { browser } from '$app/environment';
	import { t, canonical, locale } from '$lib/i18n';
	import { REPO_URL, AUTHOR_NAME, AUTHOR_URL, editUrl } from '$lib/links';
	import SeoHead from '$lib/components/SeoHead.svelte';
	import Eyebrow from '$lib/components/Eyebrow.svelte';
	import { CodeXml, SquarePen, ArrowUpRight } from 'lucide-svelte';

	/** GitHub web-editor deep link to this very file — proof the source is open. */
	const SELF_PATH = 'src/routes/[[lang=lang]]/about/+page.svelte';

	// Inline bits of markup interpolated into localized sentences (kept out of
	// the translations so the classes live in one place). These are authored
	// strings, never user input, so {@html} is safe.
	const env =
		'<code class="rounded bg-surface-2 px-1 py-0.5 font-mono text-[0.85em] text-fg">.env</code>';
	const kbd =
		'<kbd class="rounded border border-line bg-surface-2 px-1 py-0.5 font-mono text-[0.8em]">⌘K</kbd>';
	const issue = $derived(
		`<a href="${REPO_URL}/issues" target="_blank" rel="noopener noreferrer" class="text-accent hover:underline">${t('aboutBugLink')}</a>`
	);

	const jsonLd = $derived(
		JSON.stringify({
			'@context': 'https://schema.org',
			'@type': 'AboutPage',
			name: t('aboutTitle'),
			description: t('aboutMetaDescription'),
			url: canonical('/about'),
			inLanguage: locale(),
			isPartOf: { '@type': 'WebSite', name: 'onlinetools.dev', url: canonical('/') },
			author: { '@type': 'Person', name: AUTHOR_NAME, url: AUTHOR_URL },
			publisher: { '@type': 'Person', name: AUTHOR_NAME, url: AUTHOR_URL }
		})
	);
</script>

<SeoHead path="/about" title={t('aboutTitle')} description={t('aboutMetaDescription')} />

<svelte:head>
	{@html `<script type="application/ld+json">${jsonLd}</${'script'}>`}
</svelte:head>

<div class="mx-auto max-w-3xl px-6 py-10" lang={locale()}>
	<div class="mb-3"><Eyebrow text={t('aboutEyebrow')} /></div>

	<h1 class="text-2xl font-semibold tracking-tight sm:text-[28px]">{t('aboutH1')}</h1>
	<p class="mt-4 text-base leading-relaxed text-dim">{t('aboutLead')}</p>

	<div class="mt-10 space-y-9">
		<section>
			<h2 class="text-base font-semibold">{t('aboutS1Head')}</h2>
			<p class="mt-2 text-sm leading-relaxed text-dim">{@html t('aboutS1Body', { env })}</p>
		</section>

		<section>
			<h2 class="text-base font-semibold">{t('aboutS2Head')}</h2>
			<p class="mt-2 text-sm leading-relaxed text-dim">{t('aboutS2Body')}</p>
		</section>

		<section>
			<h2 class="text-base font-semibold">{t('aboutS3Head')}</h2>
			<p class="mt-2 text-sm leading-relaxed text-dim">{t('aboutS3Body')}</p>
		</section>

		<section>
			<h2 class="text-base font-semibold">{t('aboutS4Head')}</h2>
			<p class="mt-2 text-sm leading-relaxed text-dim">{@html t('aboutS4Body', { kbd })}</p>
		</section>
	</div>

	<!-- Verifiable privacy: the honest centerpiece. Localized chrome, live data. -->
	<section class="mt-12" aria-labelledby="verify-heading">
		<h2 id="verify-heading" class="text-lg font-semibold tracking-tight">
			{t('aboutVerifyHeading')}
		</h2>
		<p class="mt-2 mb-5 text-sm leading-relaxed text-dim">{t('aboutVerifyIntro')}</p>

		{#if browser}
			{#await import('$lib/components/VerifyPrivacy.svelte') then m}
				{@const Verify = m.default}
				<Verify />
			{/await}
		{:else}
			<div class="h-52 rounded-(--radius-xl) border border-line bg-surface" aria-hidden="true"></div>
		{/if}

		<p class="mt-4 text-sm leading-relaxed text-dim">{t('aboutDevtools')}</p>
	</section>

	<!-- Author warmth + open source. -->
	<footer class="mt-12 border-t border-line pt-6">
		<p class="text-sm text-dim">{@html t('aboutBugLine', { issue })}</p>
		<div class="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
			<span class="text-dim">
				{t('aboutBuiltBy')}
				<a
					href={AUTHOR_URL}
					target="_blank"
					rel="noopener noreferrer"
					class="font-medium text-fg hover:text-accent">{AUTHOR_NAME}</a
				>
			</span>
			<a
				href={REPO_URL}
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex items-center gap-1.5 text-dim transition-colors duration-120 hover:text-fg"
			>
				<CodeXml size={14} />
				{t('aboutViewSource')}
				<ArrowUpRight size={12} class="text-dim/60" />
			</a>
			<a
				href={editUrl(SELF_PATH)}
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex items-center gap-1.5 text-dim transition-colors duration-120 hover:text-fg"
			>
				<SquarePen size={14} />
				{t('aboutEditPage')}
			</a>
		</div>
	</footer>
</div>
