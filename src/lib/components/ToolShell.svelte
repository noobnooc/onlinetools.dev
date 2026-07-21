<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ToolMeta } from '$lib/tools/registry';
	import { TOOL_BY_SLUG } from '$lib/tools/registry';
	import type { ToolContent } from '$lib/tools/content';
	import { iconFor } from '$lib/tools/icons';
	import { pushRecentTool } from '$lib/state/app.svelte';
	import { t, lt, ltCategory, lp, canonical, locale } from '$lib/i18n';
	import ToolCard from './ToolCard.svelte';
	import PlusCorners from './PlusCorners.svelte';
	import Eyebrow from './Eyebrow.svelte';
	import SeoHead from './SeoHead.svelte';
	import { ChevronDown } from 'lucide-svelte';

	interface Props {
		tool: ToolMeta;
		content: ToolContent;
		children: Snippet;
	}

	let { tool, content, children }: Props = $props();

	$effect(() => {
		pushRecentTool(tool.slug);
	});

	const related = $derived(
		tool.related
			.map((slug) => TOOL_BY_SLUG.get(slug))
			.filter((t): t is ToolMeta => t !== undefined)
	);

	const l10n = $derived(lt(tool));
	const path = $derived(`/t/${tool.slug}`);
	const Icon = $derived(iconFor(tool.slug));

	const jsonLd = $derived(
		JSON.stringify([
			{
				'@context': 'https://schema.org',
				'@type': 'SoftwareApplication',
				name: l10n.name,
				description: l10n.description,
				url: canonical(path),
				inLanguage: locale(),
				applicationCategory: 'DeveloperApplication',
				operatingSystem: 'Any',
				offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
			},
			{
				'@context': 'https://schema.org',
				'@type': 'FAQPage',
				mainEntity: content.faqs.map((f) => ({
					'@type': 'Question',
					name: f.q,
					acceptedAnswer: { '@type': 'Answer', text: f.a }
				}))
			}
		])
	);
</script>

<SeoHead
	{path}
	title={t('toolTitle', { name: l10n.name })}
	description="{l10n.description}. {t('toolMetaSuffix')}"
/>

<svelte:head>
	{@html `<script type="application/ld+json">${jsonLd}</${'script'}>`}
</svelte:head>

<article class="mx-auto max-w-4xl px-6 py-8">
	<nav class="mb-4 flex items-center gap-1.5 font-mono text-[11px] text-dim/80" aria-label="Breadcrumb">
		<a href={lp('/tools')} class="hover:text-fg">{t('breadcrumbTools')}</a>
		<span aria-hidden="true">/</span>
		<span>{ltCategory(tool.category).toLowerCase()}</span>
		<span aria-hidden="true">/</span>
		<span class="text-dim">{tool.slug}</span>
	</nav>
	<header class="mb-6 flex flex-wrap items-start justify-between gap-3">
		<div class="flex items-start gap-3">
			<span
				class="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-line bg-surface text-accent"
				aria-hidden="true"
			>
				<Icon size={18} />
			</span>
			<div>
				<h1 class="text-xl font-semibold tracking-tight">{l10n.name}</h1>
				<p class="mt-1 text-sm text-dim">{l10n.description}</p>
			</div>
		</div>
		<span
			class="flex items-center gap-1.5 rounded-md border border-line bg-surface px-2 py-1 font-mono text-[11px] text-dim"
			title={t('runsLocallyTitle')}
		>
			<span class="inline-block h-1.5 w-1.5 rounded-full bg-ok" aria-hidden="true"></span>
			{t('runsLocally')}
		</span>
	</header>

	<!-- The tool itself sits in a framed panel, lifted off the page background. -->
	<div class="relative mb-12 rounded-(--radius-xl) border border-line bg-surface p-4 shadow-lg shadow-black/[0.03] sm:p-6">
		<PlusCorners />
		{@render children()}
	</div>

	<details class="group mb-8 rounded-(--radius-lg) border border-line bg-surface">
		<summary
			class="flex cursor-pointer items-center justify-between px-4 py-3 text-sm font-medium select-none"
		>
			{t('aboutTool')}
			<ChevronDown size={15} class="text-dim transition-transform duration-180 group-open:rotate-180" />
		</summary>
		<div class="border-t border-line px-4 py-4" lang="en">
			<div class="max-w-prose space-y-3 text-sm leading-relaxed text-dim">
				{#each content.about as paragraph (paragraph)}
					<p>{paragraph}</p>
				{/each}
			</div>
			<h2 class="mt-6 mb-3 text-sm font-medium text-fg">{t('faqHeading')}</h2>
			<dl class="space-y-4">
				{#each content.faqs as faq (faq.q)}
					<div class="max-w-prose">
						<dt class="text-sm font-medium">{faq.q}</dt>
						<dd class="mt-1 text-sm leading-relaxed text-dim">{faq.a}</dd>
					</div>
				{/each}
			</dl>
		</div>
	</details>

	<section aria-labelledby="related-heading">
		<div class="mb-3 flex items-center gap-3">
			<Eyebrow id="related-heading" text={t('relatedTools')} />
			<span class="h-px grow bg-line" aria-hidden="true"></span>
		</div>
		<div class="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
			{#each related as r (r.slug)}
				<ToolCard tool={r} />
			{/each}
		</div>
	</section>
</article>
