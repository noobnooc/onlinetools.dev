<script lang="ts">
	import { openPalette } from '$lib/state/app.svelte';
	import { TOOLS, CATEGORY_LABELS, type ToolCategory } from '$lib/tools/registry';
	import ToolCard from '$lib/components/ToolCard.svelte';
	import { Search } from 'lucide-svelte';

	const categories = [...new Set(TOOLS.map((t) => t.category))] as ToolCategory[];

	const jsonLd = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: 'onlinetools.dev',
		url: 'https://onlinetools.dev/',
		description:
			'Fast, keyboard-first developer tools that run entirely in your browser. Format JSON, decode JWTs and Base64, convert timestamps, test regex — private and offline-capable.'
	});
</script>

<svelte:head>
	<title>onlinetools.dev — Developer tools that run in your browser</title>
	<meta
		name="description"
		content="Fast, keyboard-first developer tools that run entirely in your browser. Format JSON, decode JWTs and Base64, convert timestamps, test regex — no upload, no signup, works offline."
	/>
	<link rel="canonical" href="https://onlinetools.dev/" />
	{@html `<script type="application/ld+json">${jsonLd}</${'script'}>`}
</svelte:head>

<div class="mx-auto max-w-6xl px-4 py-10">
	<!-- The first screen IS the product: search + paste, then the tool grid. -->
	<div class="mx-auto mb-10 max-w-2xl">
		<button
			type="button"
			onclick={() => openPalette()}
			class="flex w-full items-center gap-3 rounded-lg border border-line bg-surface px-4 py-3.5 text-left transition-colors duration-120 hover:border-accent/50"
		>
			<Search size={16} class="shrink-0 text-dim" />
			<span class="grow text-sm text-dim">Search {TOOLS.length} tools, or paste anything…</span>
			<kbd class="rounded border border-line bg-surface-2 px-1.5 py-0.5 font-mono text-[11px] text-dim">⌘K</kbd>
		</button>
		<p class="mt-2.5 text-center font-mono text-xs text-dim/70">
			Paste JSON, a JWT, a timestamp or Base64 anywhere on this page — the right tool is suggested
			automatically. <span class="text-ok">●</span> Everything runs locally.
		</p>
	</div>

	{#each categories as cat (cat)}
		<section class="mb-8" aria-labelledby="cat-{cat}">
			<h2 id="cat-{cat}" class="mb-3 text-xs font-medium tracking-wide text-dim uppercase">
				{CATEGORY_LABELS[cat]}
			</h2>
			<div class="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
				{#each TOOLS.filter((t) => t.category === cat) as tool (tool.slug)}
					<ToolCard {tool} />
				{/each}
			</div>
		</section>
	{/each}
</div>
