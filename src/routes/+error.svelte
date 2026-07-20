<script lang="ts">
	import { page } from '$app/state';
</script>

<svelte:head>
	<title>{page.status} — onlinetools.dev</title>
</svelte:head>

<div class="mx-auto max-w-2xl px-4 py-24 text-center">
	<p class="font-mono text-sm text-dim">{page.status}</p>
	<h1 class="mt-2 text-xl font-semibold tracking-tight">
		{page.status === 404 ? 'No tool lives at this address' : 'Something went wrong'}
	</h1>
	<p class="mt-3 text-sm text-dim">
		Press <kbd class="rounded border border-line bg-surface-2 px-1.5 py-0.5 font-mono text-xs">⌘K</kbd>
		to search every tool, or head back to the
		<a href="/" class="text-accent hover:underline">tool grid</a>.
	</p>
</div>
