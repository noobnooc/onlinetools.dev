<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import CommandPalette from '$lib/components/CommandPalette.svelte';
	import SmartPaste from '$lib/components/SmartPaste.svelte';
	import ShortcutHelp from '$lib/components/ShortcutHelp.svelte';
	import GlobalShortcuts from '$lib/components/GlobalShortcuts.svelte';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<GlobalShortcuts />
<Header />

<main class="min-h-[calc(100vh-8rem)]">
	{@render children()}
</main>

<footer class="border-t border-line">
	<div class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-5 text-xs text-dim">
		<p>
			Every tool runs in your browser — nothing you paste is uploaded.
			<span class="text-dim/60">Works offline once loaded.</span>
		</p>
		<nav class="flex gap-4" aria-label="Footer">
			<a href="/tools" class="hover:text-fg">All tools</a>
			<a href="/changelog" class="hover:text-fg">Changelog</a>
		</nav>
	</div>
</footer>

<CommandPalette />
<SmartPaste />
<ShortcutHelp />
