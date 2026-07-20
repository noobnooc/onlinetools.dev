<script lang="ts">
	import { TOOLS, CATEGORY_LABELS, type ToolCategory } from '$lib/tools/registry';
	import ToolCard from '$lib/components/ToolCard.svelte';

	const categories = [...new Set(TOOLS.map((t) => t.category))] as ToolCategory[];
</script>

<svelte:head>
	<title>All developer tools — onlinetools.dev</title>
	<meta
		name="description"
		content="Browse every tool on onlinetools.dev: JSON, Base64, JWT, timestamps, regex, diff, URL, UUID, hashing and color — all running locally in your browser."
	/>
	<link rel="canonical" href="https://onlinetools.dev/tools" />
</svelte:head>

<div class="mx-auto max-w-6xl px-4 py-10">
	<h1 class="mb-1 text-xl font-semibold tracking-tight">All tools</h1>
	<p class="mb-8 text-sm text-dim">
		{TOOLS.length} tools, every one computed in your browser. More arriving steadily — see the
		<a href="/changelog" class="text-accent hover:underline">changelog</a>.
	</p>
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
