<script lang="ts">
	import { browser } from '$app/environment';
	import { t, canonical, locale } from '$lib/i18n';
	import { REPO_URL, AUTHOR_NAME, AUTHOR_URL, editUrl } from '$lib/links';
	import SeoHead from '$lib/components/SeoHead.svelte';
	import Eyebrow from '$lib/components/Eyebrow.svelte';
	import { CodeXml, SquarePen, ArrowUpRight } from 'lucide-svelte';

	/** GitHub web-editor deep link to this very file — proof the source is open. */
	const SELF_PATH = 'src/routes/[[lang=lang]]/about/+page.svelte';

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

<div class="mx-auto max-w-3xl px-6 py-10">
	<div class="mb-3"><Eyebrow text={t('aboutEyebrow')} /></div>

	<!-- The manifesto is English-only content; the page chrome around it is
	     localized (eyebrow, the verify widget, the byline labels). -->
	<div lang="en">
		<h1 class="text-2xl font-semibold tracking-tight sm:text-[28px]">
			A calculator shouldn't phone home.
		</h1>

		<p class="mt-4 text-base leading-relaxed text-dim">
			Most “online tool” sites are a wall of ads wrapped around a text box that quietly ships
			whatever you paste to a server you'll never see. I got tired of decoding a JWT on some
			random page and realizing, a second too late, that I'd just handed my token to a stranger.
			onlinetools.dev is my answer: the same tools you reach for every day, except the computer
			doing the work is the one already in front of you.
		</p>

		<div class="mt-10 space-y-9">
			<section>
				<h2 class="text-base font-semibold">Everything runs on your machine</h2>
				<p class="mt-2 text-sm leading-relaxed text-dim">
					Every tool here is plain computation in your browser — no round trip, no server,
					nothing to upload to. Your JSON, your access tokens, that <code
						class="rounded bg-surface-2 px-1 py-0.5 font-mono text-[0.85em] text-fg">.env</code
					> you meant to scrub first: they go from your clipboard to your screen and stop there.
					I built it this way not because it's cheaper to run (it is) but because your data is
					none of my business.
				</p>
			</section>

			<section>
				<h2 class="text-base font-semibold">No ads. No trackers. No account.</h2>
				<p class="mt-2 text-sm leading-relaxed text-dim">
					There's no analytics script counting your keystrokes, no cookie banner (there are no
					cookies to consent to), no “sign in to continue,” no upsell waiting three steps in. I
					genuinely do not know who you are or what you paste, and that's the point — a tool
					should do its job and forget you the moment you close the tab.
				</p>
			</section>

			<section>
				<h2 class="text-base font-semibold">It works when the network doesn't</h2>
				<p class="mt-2 text-sm leading-relaxed text-dim">
					Load a page once and it's yours to keep. The whole site is static and cached by a
					service worker, so on a plane, in a subway, or behind a locked-down corporate proxy,
					the tools keep running. Airplane mode is a perfectly good place to format JSON.
				</p>
			</section>

			<section>
				<h2 class="text-base font-semibold">Fast, and out of your way</h2>
				<p class="mt-2 text-sm leading-relaxed text-dim">
					No splash screen, no “accept our terms,” no modal between you and the work. Press
					<kbd class="rounded border border-line bg-surface-2 px-1 py-0.5 font-mono text-[0.8em]"
						>⌘K</kbd
					> to jump to any tool, paste anything and the right one surfaces itself, and every result
					is one keystroke from your clipboard. Keyboard-first, all the way down.
				</p>
			</section>
		</div>
	</div>

	<!-- Verifiable privacy: the honest centerpiece. Localized chrome, live data. -->
	<section class="mt-12" aria-labelledby="verify-heading">
		<h2 id="verify-heading" class="text-lg font-semibold tracking-tight">
			{t('aboutVerifyHeading')}
		</h2>
		<p class="mt-2 mb-5 text-sm leading-relaxed text-dim" lang="en">
			Privacy claims are cheap — every site says it “values your privacy” on the way to selling
			you. So here is something to check instead of believe. This counter watches your browser's
			own network activity, live:
		</p>

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
		<p class="text-sm text-dim" lang="en">
			If a tool ever sends your data somewhere it shouldn't, that's a bug, not a business model —
			<a
				href="{REPO_URL}/issues"
				target="_blank"
				rel="noopener noreferrer"
				class="text-accent hover:underline">open an issue</a
			> and I'll fix it.
		</p>
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
