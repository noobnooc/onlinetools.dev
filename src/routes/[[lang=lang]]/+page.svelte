<script lang="ts">
	import PasteHero from '$lib/components/PasteHero.svelte';
	import { favorites } from '$lib/state/favorites.svelte';
	import { TOOLS, TOOL_BY_SLUG, type ToolCategory, type ToolMeta } from '$lib/tools/registry';
	import { iconFor } from '$lib/tools/icons';
	import { t, lt, ltCategory, lp, locale, canonical } from '$lib/i18n';
	import ToolCard from '$lib/components/ToolCard.svelte';
	import Kbd from '$lib/components/Kbd.svelte';
	import Eyebrow from '$lib/components/Eyebrow.svelte';
	import PlusCorners from '$lib/components/PlusCorners.svelte';
	import SeoHead from '$lib/components/SeoHead.svelte';
	import { ClipboardPaste, WifiOff, ArrowRight } from 'lucide-svelte';

	const categories = [...new Set(TOOLS.map((t) => t.category))] as ToolCategory[];

	const featuredSmall = ['timestamp-converter', 'diff-checker', 'regex-tester', 'jwt-decoder']
		.map((s) => TOOL_BY_SLUG.get(s)!)
		.filter(Boolean);

	const jsonTool = TOOL_BY_SLUG.get('json-formatter')!;

	const favoriteTools = $derived(
		favorites.slugs
			.map((s) => TOOL_BY_SLUG.get(s))
			.filter((t): t is ToolMeta => t !== undefined)
	);

	const jsonLd = $derived(
		JSON.stringify({
			'@context': 'https://schema.org',
			'@type': 'WebSite',
			name: 'onlinetools.dev',
			alternateName: 'onlinetools',
			url: canonical('/'),
			inLanguage: locale(),
			description: t('homeMetaDescription')
		})
	);
</script>

<SeoHead path="/" title={t('homeTitle')} description={t('homeMetaDescription')} />

<svelte:head>
	{@html `<script type="application/ld+json">${jsonLd}</${'script'}>`}
</svelte:head>

<div class="relative">
	<!-- Blueprint dot grid under a faint ambient light, app-workspace backdrop. -->
	<div
		class="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 opacity-50"
		style="background-image: radial-gradient(color-mix(in srgb, var(--border) 85%, transparent) 1px, transparent 1px); background-size: 24px 24px; mask-image: linear-gradient(to bottom, black 15%, transparent 90%); -webkit-mask-image: linear-gradient(to bottom, black 15%, transparent 90%)"
		aria-hidden="true"
	></div>
	<div
		class="pointer-events-none absolute inset-x-0 top-0 -z-10 h-64 opacity-60"
		style="background: radial-gradient(50% 100% at 35% 0%, color-mix(in srgb, var(--accent) 6%, transparent), transparent 70%)"
		aria-hidden="true"
	></div>

	<div class="mx-auto max-w-5xl px-6 py-8">
		<!-- Workspace header: left-aligned, functional. -->
		<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
			<div>
				<div class="mb-2"><Eyebrow text={t('homeEyebrow', { n: TOOLS.length })} /></div>
				<h1 class="text-xl font-semibold tracking-tight sm:text-2xl">
					{t('pasteHeroHeading')}
				</h1>
				<p class="mt-1 text-sm text-dim">{t('homeSub')}</p>
			</div>
			<div class="flex flex-wrap items-center gap-x-4 gap-y-1.5 pb-1 font-mono text-[11px] text-dim/80">
				<span class="flex items-center gap-1.5"><ClipboardPaste size={12} /> {t('pasteToDetect')}</span>
				<span class="flex items-center gap-1.5"><WifiOff size={12} /> {t('worksOffline')}</span>
				<span class="flex items-center gap-1.5"><Kbd keys="?" /> {t('shortcuts')}</span>
			</div>
		</div>

		<div class="mb-10">
			<PasteHero />
		</div>

		<!-- Favorites: local-only, rendered when the visitor has starred tools. -->
		{#if favoriteTools.length > 0}
			<section class="mb-12" aria-labelledby="favorites-heading">
				<div class="mb-4 flex items-center gap-3">
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

		<!-- Featured bento: two large cards with live-looking vignettes, four compact. -->
		<section class="relative mb-12" aria-labelledby="featured-heading">
			<div class="mb-4 flex items-baseline justify-between">
				<Eyebrow id="featured-heading" text={t('startHere')} />
				<a href={lp('/tools')} class="flex items-center gap-1 text-xs text-dim transition-colors duration-120 hover:text-accent">
					{t('allTools')} <ArrowRight size={12} />
				</a>
			</div>
			<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
				<!-- Large: JSON formatter with a mini tree vignette -->
				<a
					href={lp('/t/json-formatter')}
					class="group relative rounded-(--radius-lg) border border-line bg-surface p-5 transition-all duration-120 hover:-translate-y-px hover:border-accent/50 hover:shadow-md hover:shadow-black/5 sm:col-span-2"
				>
					<PlusCorners />
					<div class="mb-4 flex items-center justify-between">
						<span class="text-sm font-medium">{lt(jsonTool).name}</span>
						<ArrowRight size={14} class="-translate-x-1 text-accent opacity-0 transition-all duration-120 group-hover:translate-x-0 group-hover:opacity-100" />
					</div>
					<div class="pointer-events-none rounded-md border border-line bg-surface-2/60 px-3 py-2.5 font-mono text-[11px] leading-5" aria-hidden="true">
						<div><span class="text-dim">{'{'}</span></div>
						<div>&nbsp;&nbsp;<span class="text-accent">"user"</span><span class="text-dim">:</span> <span class="text-dim">{'{'}</span></div>
						<div>&nbsp;&nbsp;&nbsp;&nbsp;<span class="text-accent">"name"</span><span class="text-dim">:</span> <span class="text-ok">"Ada"</span><span class="text-dim">,</span></div>
						<div>&nbsp;&nbsp;&nbsp;&nbsp;<span class="text-accent">"roles"</span><span class="text-dim">:</span> [<span class="text-ok">"admin"</span>, <span class="text-ok">"dev"</span>]</div>
						<div>&nbsp;&nbsp;<span class="text-dim">{'}'}&nbsp;&nbsp;</span><span class="rounded-sm border border-line bg-surface px-1 py-px text-[10px] text-ok">valid · 1.2 KB</span></div>
					</div>
					<p class="mt-3 text-xs text-dim">{lt(jsonTool).description}</p>
				</a>

				<!-- Compact featured with tiny vignettes -->
				{#each featuredSmall as tool (tool.slug)}
					{@const Icon = iconFor(tool.slug)}
					<a
						href={lp(`/t/${tool.slug}`)}
						class="group relative rounded-(--radius-lg) border border-line bg-surface p-4 transition-all duration-120 hover:-translate-y-px hover:border-accent/50 hover:shadow-md hover:shadow-black/5"
					>
						<div class="mb-3 flex items-center justify-between">
							<span class="flex h-7 w-7 items-center justify-center rounded-md border border-line bg-surface-2 text-dim transition-colors duration-120 group-hover:border-accent/40 group-hover:text-accent">
								<Icon size={14} />
							</span>
							<ArrowRight size={13} class="-translate-x-1 text-accent opacity-0 transition-all duration-120 group-hover:translate-x-0 group-hover:opacity-100" />
						</div>
						<span class="block text-sm font-medium">{lt(tool).name}</span>
						<span class="mt-1 block h-8 overflow-hidden" aria-hidden="true">
							{#if tool.slug === 'timestamp-converter'}
								<span class="flex flex-col gap-1 pt-1">
									{#each [55, 30, 78] as pct, i (i)}
										<span class="relative block h-1 w-full rounded-full bg-surface-2">
											<span class="absolute top-1/2 h-2 w-[3px] -translate-y-1/2 rounded-full bg-accent" style="left: {pct}%"></span>
										</span>
									{/each}
								</span>
							{:else if tool.slug === 'diff-checker'}
								<span class="block font-mono text-[10px] leading-4">
									<span class="block text-err">− "version": "1.2.0"</span>
									<span class="block text-ok">+ "version": "1.3.0"</span>
								</span>
							{:else if tool.slug === 'regex-tester'}
								<span class="block pt-1 font-mono text-[10px] leading-4 text-dim">
									released <mark class="rounded-sm bg-accent/20 px-0.5 text-fg">2026-07-20</mark> at noon
								</span>
							{:else}
								<span class="block truncate pt-1.5 font-mono text-[10px]">
									<span class="text-accent">eyJhbGc…</span><span class="text-dim">.</span><span class="text-fg">eyJzdWI…</span><span class="text-dim">.</span><span class="text-dim/50">4Adcj3…</span>
								</span>
							{/if}
						</span>
					</a>
				{/each}
			</div>
		</section>

		<!-- Keyboard band -->
		<section class="relative mb-12 rounded-(--radius-lg) border border-line bg-surface px-6 py-5" aria-label={t('shortcutsTitle')}>
			<PlusCorners />
			<div class="flex flex-wrap items-center justify-between gap-x-8 gap-y-3">
				<div>
					<span class="block text-sm font-medium">{t('keyboardFirst')}</span>
					<span class="mt-0.5 block text-xs text-dim">{t('keyboardFirstDesc')}</span>
				</div>
				<div class="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px] text-dim">
					<span class="flex items-center gap-1.5"><Kbd keys="⌘K" /> {t('kbdAnyTool')}</span>
					<span class="flex items-center gap-1.5"><Kbd keys="⌘⇧C" /> {t('kbdCopyResult')}</span>
					<span class="flex items-center gap-1.5"><Kbd keys="↵" /> {t('kbdConfirm')}</span>
					<span class="flex items-center gap-1.5"><Kbd keys="?" /> {t('kbdAllShortcuts')}</span>
				</div>
			</div>
		</section>

		<!-- Full catalog by category -->
		{#each categories as cat (cat)}
			{@const tools = TOOLS.filter((t) => t.category === cat)}
			<section class="mb-10" aria-labelledby="cat-{cat}">
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
</div>
