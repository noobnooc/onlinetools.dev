<script lang="ts">
	import { openPalette } from '$lib/state/app.svelte';
	import { TOOLS, CATEGORY_LABELS, type ToolCategory } from '$lib/tools/registry';
	import { CATEGORY_ICONS } from '$lib/tools/icons';
	import ToolCard from '$lib/components/ToolCard.svelte';
	import { Search, ClipboardPaste, WifiOff, Keyboard } from 'lucide-svelte';

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

<!-- Single, barely-there ambient light behind the first screen. -->
<div class="relative">
	<div
		class="pointer-events-none absolute inset-x-0 top-0 -z-10 h-80 opacity-60"
		style="background: radial-gradient(60% 100% at 50% 0%, color-mix(in srgb, var(--accent) 7%, transparent), transparent 70%)"
		aria-hidden="true"
	></div>

	<div class="mx-auto max-w-6xl px-4 py-10">
		<!-- The first screen IS the product: search + paste, then the tool grid. -->
		<div class="mx-auto mb-4 max-w-2xl">
			<button
				type="button"
				onclick={() => openPalette()}
				class="flex w-full items-center gap-3 rounded-lg border border-line bg-surface px-4 py-3.5 text-left shadow-lg shadow-black/5 transition-colors duration-120 hover:border-accent/50"
			>
				<Search size={16} class="shrink-0 text-dim" />
				<span class="grow text-sm text-dim">Search {TOOLS.length} tools, or paste anything…</span>
				<kbd class="rounded border border-line bg-surface-2 px-1.5 py-0.5 font-mono text-[11px] text-dim">⌘K</kbd>
			</button>
		</div>

		<div class="mx-auto mb-12 flex max-w-2xl flex-wrap items-center justify-center gap-x-5 gap-y-1.5 font-mono text-[11px] text-dim/80">
			<span class="flex items-center gap-1.5">
				<span class="inline-block h-1.5 w-1.5 rounded-full bg-ok" aria-hidden="true"></span>
				Everything runs locally
			</span>
			<span class="flex items-center gap-1.5"><ClipboardPaste size={12} /> Paste anywhere to auto-detect</span>
			<span class="flex items-center gap-1.5"><WifiOff size={12} /> Works offline</span>
			<span class="flex items-center gap-1.5"><Keyboard size={12} /> <kbd class="font-mono">?</kbd> for shortcuts</span>
		</div>

		{#each categories as cat (cat)}
			{@const CatIcon = CATEGORY_ICONS[cat]}
			{@const tools = TOOLS.filter((t) => t.category === cat)}
			<section class="mb-9" aria-labelledby="cat-{cat}">
				<h2 id="cat-{cat}" class="mb-3 flex items-center gap-2 text-xs font-medium tracking-wide text-dim uppercase">
					<CatIcon size={13} aria-hidden="true" />
					{CATEGORY_LABELS[cat]}
					<span class="text-dim/50">{tools.length}</span>
					<span class="ml-2 h-px grow bg-line" aria-hidden="true"></span>
				</h2>
				<div class="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
					{#each tools as tool (tool.slug)}
						<ToolCard {tool} />
					{/each}
				</div>
			</section>
		{/each}
	</div>
</div>
